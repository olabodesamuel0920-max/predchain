'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * User-facing action to start a purchase.
 * Uses the standard user client.
 */
export async function initializePayment(tierId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // 1. Get Tier Info
  const { data: tier, error: tierError } = await supabase
    .from('account_tiers')
    .select('*')
    .eq('id', tierId)
    .single();

  if (tierError || !tier) throw new Error('Tier not found');

  // 2. Initialize Paystack Transaction
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: user.email,
      amount: tier.price_ngn * 100, // Paystack uses Kobo
      callback_url: `${APP_URL}/api/payments/verify`,
      metadata: {
        userId: user.id,
        tierId: tier.id,
        type: 'tier_purchase',
      },
    }),
  });

  const data = await response.json();
  if (!data.status) throw new Error(data.message || 'Payment initialization failed');

  return { authorization_url: data.data.authorization_url, reference: data.data.reference };
}

/**
 * User-facing action to top up wallet.
 */
export async function initializeWalletFunding(amountNgn: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');
  if (amountNgn < 1000) throw new Error('Minimum top-up is ₦1,000');

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: user.email,
      amount: amountNgn * 100,
      callback_url: `${APP_URL}/api/payments/verify`,
      metadata: {
        userId: user.id,
        amount: amountNgn,
        type: 'wallet_funding',
      },
    }),
  });

  const data = await response.json();
  if (!data.status) throw new Error(data.message || 'Funding initialization failed');

  return { authorization_url: data.data.authorization_url, reference: data.data.reference };
}

/**
 * System-facing action to verify payment and process rewards.
 * Uses the high-privilege Admin Client to manage financial logic and referral bonuses.
 */
export async function verifyPayment(reference: string) {
  const adminClient = await createAdminClient();
  
  // 1. Check for idempotency FIRST
  const { data: existingPurchase } = await adminClient
    .from('account_purchases')
    .select('id')
    .eq('payment_reference', reference)
    .maybeSingle();

  if (existingPurchase) {
    return { success: true, message: 'Payment already processed' };
  }

  // 2. Verify with Paystack
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  });

  const data = await response.json();
  if (!data.status || data.data.status !== 'success') {
    return { success: false, message: 'Payment verification failed at provider' };
  }

  const { userId, tierId, type, amount } = data.data.metadata;
  const paystackAmount = data.data.amount / 100;

  // 3. Handle Wallet Funding
  if (type === 'wallet_funding') {
    let { data: wallet } = await adminClient
      .from('wallets')
      .select('id, balance_ngn')
      .eq('user_id', userId)
      .maybeSingle();

    if (!wallet) {
      const { data: newWallet, error: createError } = await adminClient
        .from('wallets')
        .insert({ user_id: userId, balance_ngn: 0 })
        .select('id, balance_ngn')
        .single();
        
      if (createError) throw new Error('Failed to synchronize wallet state.');
      wallet = newWallet;
    }

    await adminClient.from('wallets').update({ 
      balance_ngn: wallet.balance_ngn + paystackAmount 
    }).eq('id', wallet.id);

    await adminClient.from('wallet_transactions').insert({
      wallet_id: wallet.id,
      amount: paystackAmount,
      type: 'deposit',
      reference: `topup_${reference}`
    });

    revalidatePath('/dashboard');
    return { success: true, message: 'Wallet funded successfully' };
  }

  // 4. SECURE PRICE MATCHING (Tier Purchase Flow)
  const { data: tier } = await adminClient
    .from('account_tiers')
    .select('price_ngn')
    .eq('id', tierId)
    .single();

  if (!tier || paystackAmount < tier.price_ngn) {
    console.error('Payment mismatch:', { expected: tier?.price_ngn, received: paystackAmount });
    return { success: false, message: `Payment validation failed. Incorrect amount or tier.` };
  }

  // 4. Create Purchase Record
  const { error: purchaseError } = await adminClient
    .from('account_purchases')
    .insert({
      user_id: userId,
      tier_id: tierId,
      amount_paid: paystackAmount,
      payment_reference: reference,
      provider_reference: data.data.reference,
      status: 'completed',
      verified_at: new Date().toISOString(),
    });

  if (purchaseError) {
    if (purchaseError.code === '23505') return { success: true, message: 'Handled race condition' };
    throw purchaseError;
  }

  // 5. Auto-Enroll in Current Active Round
  const { data: activeRound } = await adminClient
    .from('challenge_rounds')
    .select('id')
    .eq('status', 'active')
    .maybeSingle();

  if (activeRound) {
    await adminClient.from('challenge_entries').insert({
      user_id: userId,
      round_id: activeRound.id,
      tier_id: tierId,
      streak_count: 0
    });
  }

  // 6. Handle Referral Rewards
  const { data: userData } = await adminClient.auth.admin.getUserById(userId);
  const referredByCode = userData.user?.user_metadata?.referred_by_code;

  if (referredByCode) {
    const { data: referrer } = await adminClient
      .from('profiles')
      .select('id')
      .eq('username', referredByCode.toLowerCase())
      .single();

    if (referrer) {
      // 7. Atomic Referral Payout via RPC
      const { error: rpcError } = await adminClient.rpc('process_referral_reward_atomic', {
        p_referrer_id: referrer.id,
        p_referred_user_id: userId,
        p_referral_code: referredByCode,
        p_reward_amount: 1000 // Standard referral bonus
      });

      if (rpcError) {
        console.error('Failed to process referral atomically:', rpcError);
      }
    }
  }

  revalidatePath('/dashboard');
  revalidatePath('/referral');
  return { success: true };
}
