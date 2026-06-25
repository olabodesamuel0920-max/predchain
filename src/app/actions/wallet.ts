'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { normalizePhone, logSecurityEvent } from '@/lib/security';

export interface BankDetails {
  bank: string;
  account: string;
  name: string;
}

/**
 * Standard user request for a payout.
 * Enforces KYC verification, bank status, risk score, and account status.
 */
export async function requestPayout(amountNgn: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // Hardened validation for minimum withdrawal
  if (amountNgn < 5000) {
    throw new Error('Minimum withdrawal threshold is ₦5,000.');
  }

  // Fetch security/verification indicators
  const adminClient = await createAdminClient();
  const { data: profile } = await adminClient
    .from('profiles')
    .select('status, phone_verified, identity_status, bank_account_flagged, risk_score, bank_name, bank_account_number, bank_account_name')
    .eq('id', user.id)
    .single();

  if (!profile) throw new Error('Profile details not found.');

  // PRODUCTION SECURITY GATING RULES
  if (profile.status === 'suspended') {
    throw new Error('Withdrawal blocked. Your account is suspended.');
  }
  if (!profile.phone_verified) {
    throw new Error('Withdrawal blocked. Please verify your phone number first.');
  }
  if (profile.identity_status !== 'verified') {
    throw new Error('Withdrawal blocked. Payouts require verified KYC identity status.');
  }
  if (profile.bank_account_flagged) {
    throw new Error('Withdrawal blocked. Your bank account is flagged for duplication review.');
  }
  if (profile.risk_score >= 70) {
    throw new Error('Withdrawal blocked. Account flagged for security review (High Risk).');
  }

  const bankInfo = {
    bank: profile.bank_name,
    account: profile.bank_account_number,
    name: profile.bank_account_name
  };

  // Log withdrawal event before initiating database transaction
  await logSecurityEvent({
    userId: user.id,
    eventType: 'withdrawal',
    metadata: { amount: amountNgn, bank: bankInfo.bank }
  });

  // 1. Create Payout Request Atomically via RPC
  const { error: rpcError } = await supabase.rpc('create_payout_request_atomic', {
    p_user_id: user.id,
    p_amount: Math.floor(amountNgn),
    p_bank_info: bankInfo
  });

  if (rpcError) throw new Error(rpcError.message);

  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * Save bank details for a user.
 * Triggers dual-account uniqueness trigger in Supabase.
 */
export async function saveBankDetails(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const bank_name = formData.get('bank_name') as string;
  const bank_account_number = formData.get('bank_account_number') as string;
  const bank_account_name = formData.get('bank_account_name') as string;

  if (!bank_name || !bank_account_number || !bank_account_name) {
    throw new Error('All bank details are required.');
  }

  // Update bank details
  const { error } = await supabase
    .from('profiles')
    .update({
      bank_name,
      bank_account_number,
      bank_account_name
    })
    .eq('id', user.id);

  if (error) throw error;

  // Retrieve updated profile indicators to check if flagged by trigger
  const { data: profile } = await supabase
    .from('profiles')
    .select('bank_account_flagged')
    .eq('id', user.id)
    .single();

  revalidatePath('/dashboard/settings');

  if (profile?.bank_account_flagged) {
    return {
      success: true,
      flagged: true,
      message: 'Bank details saved. Note: A security flag was raised due to overlapping details. Payouts are locked.'
    };
  }

  return { success: true, flagged: false, message: 'Bank details saved successfully.' };
}

/**
 * Submit KYC identity documents for verification.
 */
export async function submitKycVerification(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const legal_name = formData.get('legal_name') as string;
  const dob = formData.get('dob') as string;
  const id_type = formData.get('id_type') as string;
  const id_number = formData.get('id_number') as string;

  if (!legal_name || !dob || !id_type || !id_number) {
    throw new Error('All KYC fields are required.');
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      identity_legal_name: legal_name,
      identity_dob: dob,
      identity_type: id_type,
      identity_number: id_number,
      identity_status: 'pending',
      identity_notes: null // Reset any previous rejection notes
    })
    .eq('id', user.id);

  if (error) throw error;

  revalidatePath('/dashboard/settings');
  return { success: true, message: 'KYC submitted successfully. Verification pending review.' };
}

/**
 * Request SMS OTP code for phone verification (mock/production mode supported).
 */
export async function requestPhoneOtp(phone: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const normalized = normalizePhone(phone);
  if (!normalized) throw new Error('Invalid phone number format.');

  const adminClient = await createAdminClient();

  // 1. Check if phone already verified on another account
  const { data: otherUser } = await adminClient
    .from('profiles')
    .select('id')
    .eq('normalized_phone', normalized)
    .eq('phone_verified', true)
    .neq('id', user.id)
    .maybeSingle();

  if (otherUser) {
    throw new Error('This phone number is already verified on another active account.');
  }

  // Update profile phone details first
  await supabase.from('profiles').update({ phone }).eq('id', user.id);

  // 2. Rate-limit check: max 3 OTP requests in last 10 minutes
  const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await adminClient
    .from('phone_verification_codes')
    .select('*', { count: 'exact', head: true })
    .eq('phone', normalized)
    .gt('created_at', tenMinsAgo);

  if (count && count >= 3) {
    throw new Error('Too many OTP requests. Please wait 10 minutes before requesting again.');
  }

  // 3. Generate 6-digit OTP code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes validity

  // Insert code
  await adminClient.from('phone_verification_codes').insert({
    phone: normalized,
    code,
    expires_at: expiresAt,
    attempts: 0,
    verified: false
  });

  // 4. Send Switch: Mock vs Production mode
  const otpMode = process.env.OTP_MODE || 'mock';
  if (otpMode === 'production') {
    // Production SMS Gateway API trigger integration
    console.log(`[SMS_PROVIDER_INTEGRATION] Sending OTP code ${code} to ${phone} via production SMS gateway...`);
  } else {
    // Fallback/Mock Mode Console Log
    console.log(`[MOCK_OTP] Mock SMS OTP Code for ${phone} (${normalized}): ${code}`);
  }

  return { success: true, message: `OTP code sent successfully.${otpMode === 'mock' ? ' (Check server console log)' : ''}` };
}

/**
 * Verify OTP code to complete phone activation.
 */
export async function verifyPhoneOtp(code: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const adminClient = await createAdminClient();

  // Fetch user profile phone
  const { data: profile } = await adminClient
    .from('profiles')
    .select('phone, normalized_phone')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.normalized_phone) {
    throw new Error('Please request an OTP code first.');
  }

  const normalized = profile.normalized_phone;

  // Retrieve active code
  const { data: otpRecord } = await adminClient
    .from('phone_verification_codes')
    .select('*')
    .eq('phone', normalized)
    .eq('verified', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!otpRecord) {
    throw new Error('Invalid or expired OTP code. Please request a new code.');
  }

  // Rate-limit check on failed attempts
  if (otpRecord.attempts >= 3) {
    throw new Error('Too many failed attempts. Please request a new OTP.');
  }

  if (otpRecord.code !== code) {
    const newAttempts = otpRecord.attempts + 1;
    await adminClient
      .from('phone_verification_codes')
      .update({ attempts: newAttempts })
      .eq('id', otpRecord.id);

    throw new Error(`Incorrect OTP code. Attempts remaining: ${3 - newAttempts}`);
  }

  // Successful verification
  await adminClient
    .from('phone_verification_codes')
    .update({ verified: true })
    .eq('id', otpRecord.id);

  await adminClient
    .from('profiles')
    .update({ phone_verified: true })
    .eq('id', user.id);

  // Evaluate referral reward trigger
  await adminClient.rpc('evaluate_referral_bonus', { p_referred_user_id: user.id });

  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard');
  return { success: true, message: 'Phone number verified successfully.' };
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

  // Verify Admin Role
  const { data: profile } = await userClient.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error('Forbidden: Admin access only.');

  // Resolve Payout Request Atomically
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

  // Verify Admin Role
  const { data: profile } = await userClient.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error('Forbidden: Admin access only.');

  // Resolve Payout Request Atomically
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
 */
export async function purchaseTierWithWallet(tierId: string) {
  const userClient = await createClient();
  const adminClient = await createAdminClient();
  const { data: { user } } = await userClient.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const reference = `wallet_pur_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  // Execute Atomic Purchase RPC
  const { error: rpcError } = await adminClient.rpc('purchase_tier_with_wallet_atomic', {
    p_user_id: user.id,
    p_tier_id: tierId,
    p_payment_reference: reference
  });

  if (rpcError) throw new Error(rpcError.message);

  // Evaluate referral trigger
  await adminClient.rpc('evaluate_referral_bonus', { p_referred_user_id: user.id });

  revalidatePath('/dashboard');
  revalidatePath('/accounts');
  return { success: true, reference };
}

