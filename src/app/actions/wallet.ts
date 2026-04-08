'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface BankDetails {
  bank: string;
  account: string;
  name: string;
}

/**
 * Standard user request for a payout.
 * Uses atomic RPC to ensure balance consistency.
 */
export async function requestPayout(amountNgn: number, bankDetails: BankDetails) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // Hardened validation for minimum withdrawal
  if (amountNgn < 5000) {
    throw new Error('Minimum withdrawal threshold is ₦5,000.');
  }

  // 1. Create Payout Request Atomically via RPC
  const { error: rpcError } = await supabase.rpc('create_payout_request_atomic', {
    p_user_id: user.id,
    p_amount: Math.floor(amountNgn),
    p_bank_info: bankDetails
  });

  if (rpcError) throw new Error(rpcError.message);

  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * Admin action to approve a payout.
 * Uses the high-privilege Admin Client to execute the atomic settlement.
 */
export async function approvePayout(requestId: string, adminNotes: string) {
  const userClient = await createClient();
  const adminClient = await createAdminClient();
  
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Verify Admin Role via user client (context context)
  const { data: profile } = await userClient.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error('Forbidden: Admin access only.');

  // Resolve Payout Request Atomically via RPC using Admin Client to bypass RLS
  const { error: rpcError } = await adminClient.rpc('resolve_payout_request_atomic', {
    p_request_id: requestId,
    p_admin_id: user.id,
    p_new_status: 'completed',
    p_admin_notes: adminNotes
  });

  if (rpcError) throw new Error(rpcError.message);

  revalidatePath('/admin');
  return { success: true };
}

/**
 * Admin action to reject a payout (and trigger an atomic refund).
 * Uses the high-privilege Admin Client.
 */
export async function rejectPayout(requestId: string, reason: string) {
  const userClient = await createClient();
  const adminClient = await createAdminClient();
  
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Verify Admin Role via user client
  const { data: profile } = await userClient.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error('Forbidden: Admin access only.');

  // Resolve Payout Request Atomically via RPC using Admin Client
  const { error: rpcError } = await adminClient.rpc('resolve_payout_request_atomic', {
    p_request_id: requestId,
    p_admin_id: user.id,
    p_new_status: 'rejected',
    p_admin_notes: reason
  });

  if (rpcError) throw new Error(rpcError.message);

  revalidatePath('/admin');
  revalidatePath('/dashboard');
  return { success: true };
}
/**
 * User-facing action to buy a tier using wallet balance.
 * Uses the atomic RPC created in migration 0006.
 */
export async function purchaseTierWithWallet(tierId: string) {
  const userClient = await createClient();
  const adminClient = await createAdminClient();
  const { data: { user } } = await userClient.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // 1. Generate unique reference
  const reference = `wallet_pur_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  // 2. Execute Atomic Purchase RPC
  const { error: rpcError } = await adminClient.rpc('purchase_tier_with_wallet_atomic', {
    p_user_id: user.id,
    p_tier_id: tierId,
    p_payment_reference: reference
  });

  if (rpcError) throw new Error(rpcError.message);

    // 5. Handle Referral Rewards
    const { data: userData } = await adminClient.auth.admin.getUserById(user.id);
    const referredByCode = userData.user?.user_metadata?.referred_by_code;

    if (referredByCode) {
      const { data: referrer } = await adminClient
        .from('profiles')
        .select('id')
        .eq('username', referredByCode.toLowerCase())
        .single();

      if (referrer) {
        await adminClient.rpc('process_referral_reward_atomic', {
          p_referrer_id: referrer.id,
          p_referred_user_id: user.id,
          p_referral_code: referredByCode,
          p_reward_amount: 1000
        });
      }
    }

    revalidatePath('/dashboard');
    revalidatePath('/accounts');
    return { success: true, reference };
}
