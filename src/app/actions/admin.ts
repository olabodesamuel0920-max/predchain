'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { 
  AdminSearchProfile, 
  Profile, 
  SupportTicket, 
  AdminLedgerEntry,
  UserStatus,
  FullUserDetails,
  SupportTicketWithProfile,
  AdminLedgerEntryWithProfile,
  AccountPurchase,
  AccountTier,
  ChallengeEntry,
  ChallengeRound,
  Referral,
  PlatformSettings
} from '@/types';

/**
 * Verify if the current user is an admin.
 * Use this inside every admin-only server action.
 * Standard client is used here to check the authenticated user's profile.
 */
export async function verifyAdmin() {
  const supabase = await createClient();
  const adminClient = await createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // Use Admin Client to bypass RLS recursion when verifying admin role
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // PRODUCTION SAFETY GATING:
  const hasAdminRole = profile?.role === 'admin';

  if (hasAdminRole) {
    return user;
  }

  throw new Error('Forbidden: Admin access only.');
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. USER MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

export async function searchUsers(query: string): Promise<AdminSearchProfile[]> {
  await verifyAdmin();
  const supabase = await createAdminClient();

  let q = supabase.from('profiles').select('*, wallets(balance_ngn)');

  if (query) {
    q = q.or(`username.ilike.%${query}%,full_name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%,id.eq.${query}`);
  }

  const { data, error } = await q.limit(50);
  if (error) throw error;
  return data as AdminSearchProfile[];
}

export async function getUserDetails(userId: string): Promise<FullUserDetails> {
  await verifyAdmin();
  const supabase = await createAdminClient();

  const [profile, wallet, purchases, entries, referrals] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('wallets').select('*').eq('user_id', userId).single(),
    supabase.from('account_purchases').select('*, account_tiers(*)').eq('user_id', userId),
    supabase.from('challenge_entries').select('*, challenge_rounds(*), account_tiers(*)').eq('user_id', userId),
    supabase.from('referrals').select('*, profiles!referrals_referred_user_id_fkey(username)').eq('referrer_id', userId)
  ]);

  return {
    profile: profile.data,
    wallet: wallet.data,
    purchases: (purchases.data || []) as (AccountPurchase & { account_tiers: AccountTier | null })[], 
    entries: (entries.data || []) as (ChallengeEntry & { challenge_rounds: ChallengeRound | null, account_tiers: AccountTier | null })[],
    referrals: (referrals.data || []) as (Referral & { profiles: { username: string } | null })[]
  };
}

export async function updateUserStatus(userId: string, updates: { 
  status?: UserStatus; 
  is_verified?: boolean; 
  is_suspended?: boolean; 
  is_demo?: boolean;
  admin_notes?: string;
  phone_verified?: boolean;
}) {
  const admin = await verifyAdmin();
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;

  // Audit log
  await supabase.from('admin_audit_logs').insert({
    admin_id: admin.id,
    action: 'update_user_status',
    target_user_id: userId,
    details: updates
  });

  revalidatePath('/admin');
  return { success: true };
}

export async function createDemoUser(data: { 
  email: string; 
  username: string; 
  password?: string;
  balance: number;
  tierId?: string;
}) {
  const admin = await verifyAdmin();
  const supabase = await createAdminClient();

  // 1. Create User via Admin Auth
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: data.email,
    password: data.password || 'DemoPassword123!', // Custom or standard demo password
    email_confirm: true,
    user_metadata: { 
      full_name: `Demo: ${data.username}`,
      username: data.username,
      is_demo: true 
    }
  });

  if (authError) throw authError;

  // 2. Profile record is likely created via trigger, but we update it to ensure demo status
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ 
      is_demo: true, 
      status: 'demo',
      is_verified: true 
    })
    .eq('id', authUser.user.id);

  if (profileError) throw profileError;

  // 3. Fund Wallet
  const { data: wallet } = await supabase.from('wallets').select('id').eq('user_id', authUser.user.id).single();
  if (wallet) {
    await supabase.from('wallets').update({ balance_ngn: data.balance }).eq('id', wallet.id);
    await supabase.from('wallet_transactions').insert({
      wallet_id: wallet.id,
      amount: data.balance,
      type: 'reward',
      reference: 'demo_initial_funding'
    });
  }

  // 4. Enroll in Active Round if tier provided
  if (data.tierId) {
    const { data: activeRound } = await supabase.from('challenge_rounds').select('id').eq('status', 'active').maybeSingle();
    if (activeRound) {
      await supabase.from('challenge_entries').insert({
        user_id: authUser.user.id,
        round_id: activeRound.id,
        tier_id: data.tierId,
        streak_count: 0
      });
    }
  }

  // Audit
  await supabase.from('admin_audit_logs').insert({
    admin_id: admin.id,
    action: 'create_demo_user',
    target_user_id: authUser.user.id,
    details: data
  });

  revalidatePath('/admin');
  return { success: true, userId: authUser.user.id };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. FINANCIAL & LEDGER
// ─────────────────────────────────────────────────────────────────────────────

export async function adjustUserWallet(userId: string, amount: number, reason: string) {
  const admin = await verifyAdmin();
  const supabase = await createAdminClient();

  const { error } = await supabase.rpc('adjust_user_wallet_admin', {
    p_admin_id: admin.id,
    p_user_id: userId,
    p_amount: amount,
    p_reason: reason
  });

  if (error) throw error;

  revalidatePath('/admin');
  return { success: true };
}

export async function getAdminLedger(limit = 50): Promise<AdminLedgerEntryWithProfile[]> {
  await verifyAdmin();
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('admin_ledger')
    .select('*, profiles!admin_ledger_user_id_fkey(username)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as AdminLedgerEntryWithProfile[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SUPPORT MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

export async function getSupportTickets(filters: { status?: string } = {}): Promise<SupportTicketWithProfile[]> {
  await verifyAdmin();
  const supabase = await createAdminClient();

  let q = supabase.from('support_tickets').select('*, profiles(username)');

  if (filters.status && filters.status !== 'all') {
    q = q.eq('status', filters.status);
  }

  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) throw error;
  return data as SupportTicketWithProfile[];
}

export async function updateTicketStatus(ticketId: string, status: string, internalNotes?: string) {
  const admin = await verifyAdmin();
  const supabase = await createAdminClient();

  const updates: Partial<SupportTicket> & { updated_at?: string } = { status: status as any, updated_at: new Date().toISOString() };
  if (internalNotes !== undefined) updates.internal_notes = internalNotes;

  const { error } = await supabase
    .from('support_tickets')
    .update(updates)
    .eq('id', ticketId);

  if (error) throw error;

  revalidatePath('/admin');
  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PLATFORM CONTROLS
// ─────────────────────────────────────────────────────────────────────────────

export async function updatePlatformSettings<K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) {
  const admin = await verifyAdmin();
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from('platform_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) throw error;

  // Audit log
  await supabase.from('admin_audit_logs').insert({
    admin_id: admin.id,
    action: 'update_platform_settings',
    details: { key, value }
  });

  revalidatePath('/admin');
  return { success: true };
}

export async function getAllPlatformSettings(): Promise<Partial<PlatformSettings>> {
  await verifyAdmin();
  const supabase = await createAdminClient();

  const { data, error } = await supabase.from('platform_settings').select('*');
  if (error) throw error;
  
  return data.reduce((acc: Partial<PlatformSettings>, curr) => {
    acc[curr.key as keyof PlatformSettings] = curr.value as any;
    return acc;
  }, {});
}

export async function getPlatformMetrics() {
  await verifyAdmin();
  const supabase = await createAdminClient();

  // Active Challengers (Real users only)
  const { count: realUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_demo', false);

  // Revenue
  const { data: revenueData } = await supabase
    .from('account_purchases')
    .select('amount_paid');
  const revenue = revenueData?.reduce((sum, p) => sum + p.amount_paid, 0) || 0;

  // Payouts
  const { data: payoutData } = await supabase
    .from('payout_requests')
    .select('amount')
    .eq('status', 'completed');
  const payouts = payoutData?.reduce((sum, p) => sum + p.amount, 0) || 0;

  // Support health
  const { count: openTickets } = await supabase
    .from('support_tickets')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'open');

  return {
    realUsers: realUsers || 0,
    revenue,
    payouts,
    openTickets: openTickets || 0
  };
}

export async function revalidatePlatform() {
  await verifyAdmin();
  revalidatePath('/admin', 'layout');
  revalidatePath('/dashboard', 'layout');
  revalidatePath('/', 'layout');
  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PREDICTIONS & PLAYS
// ─────────────────────────────────────────────────────────────────────────────

export async function getPredictionsOverview(filters: { round_id?: string; limit?: number } = {}) {
  await verifyAdmin();
  const supabase = await createAdminClient();

  let q = supabase
    .from('challenge_entries')
    .select(`
      id,
      user_id,
      round_id,
      tier_id,
      streak_count,
      is_winner,
      created_at,
      profiles(username, email),
      challenge_rounds(round_number),
      account_tiers(name),
      predictions(
        id,
        match_id,
        prediction,
        is_correct,
        is_locked,
        challenge_matches(home_team, away_team, kickoff_time, status, home_score, away_score)
      )
    `);

  if (filters.round_id && filters.round_id !== 'all') {
    q = q.eq('round_id', filters.round_id);
  }

  const { data, error } = await q
    .order('created_at', { ascending: false })
    .limit(filters.limit || 100);

  if (error) throw error;
  return data;
}

export async function undoMatchSettlement(matchId: string) {
  const admin = await verifyAdmin();
  const adminClient = await createAdminClient();

  // 1. Reset match status
  const { error: matchError } = await adminClient
    .from('challenge_matches')
    .update({ status: 'live', home_score: 0, away_score: 0 })
    .eq('id', matchId);

  if (matchError) throw matchError;

  // 2. Unlock all predictions for this match so they can be re-settled
  const { error: predError } = await adminClient
    .from('predictions')
    .update({ is_locked: false, is_correct: null })
    .eq('match_id', matchId);

  if (predError) throw predError;

  // Audit
  await adminClient.from('admin_audit_logs').insert({
    admin_id: admin.id,
    action: 'undo_match_settlement',
    target_user_id: null,
    details: { matchId }
  });

  revalidatePath('/admin');
  return { success: true };
}

/**
 * HYBRID ENGINE: Force update a match score and re-run settlement logic only for this match.
 * Unlike undoMatchSettlement, this works even on 'finished' matches to "fix" a desired score.
 */
export async function overrideMatchScore(matchId: string, homeScore: number, awayScore: number) {
  const admin = await verifyAdmin();
  const adminClient = await createAdminClient();

  // 1. Update the match score and status
  const { error: matchError } = await adminClient
    .from('challenge_matches')
    .update({ 
      home_score: homeScore, 
      away_score: awayScore, 
      status: 'finished' 
    })
    .eq('id', matchId);

  if (matchError) throw matchError;

  // 2. We don't automatically re-payout (that's dangerous), but we update prediction 'is_correct' flags
  const { data: predictions } = await adminClient
    .from('predictions')
    .select('id, entry_id, prediction')
    .eq('match_id', matchId);

  if (predictions) {
    const outcome = homeScore > awayScore ? '1' : homeScore < awayScore ? '2' : 'X';
    
    for (const pred of predictions) {
      await adminClient
        .from('predictions')
        .update({ 
          is_correct: pred.prediction === outcome,
          is_locked: true 
        })
        .eq('id', pred.id);
    }
  }

  // 3. Audit
  await adminClient.from('admin_audit_logs').insert({
    admin_id: admin.id,
    action: 'override_match_score',
    details: { matchId, homeScore, awayScore }
  });

  revalidatePath('/admin');
  return { success: true };
}

/**
 * Admin action to approve KYC verification for a user.
 */
export async function approveKyc(userId: string, notes: string) {
  const admin = await verifyAdmin();
  const adminClient = await createAdminClient();

  const { error } = await adminClient
    .from('profiles')
    .update({
      identity_status: 'verified',
      identity_notes: notes
    })
    .eq('id', userId);

  if (error) throw error;

  // Log audit
  await adminClient.from('admin_audit_logs').insert({
    admin_id: admin.id,
    action: 'approve_kyc',
    target_user_id: userId,
    details: { notes }
  });

  // Evaluate referral bonus in case referee is now verified
  await adminClient.rpc('evaluate_referral_bonus', { p_referred_user_id: userId });

  revalidatePath('/admin');
  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * Admin action to reject KYC verification for a user.
 */
export async function rejectKyc(userId: string, notes: string) {
  const admin = await verifyAdmin();
  const adminClient = await createAdminClient();

  const { error } = await adminClient
    .from('profiles')
    .update({
      identity_status: 'rejected',
      identity_notes: notes
    })
    .eq('id', userId);

  if (error) throw error;

  await adminClient.from('admin_audit_logs').insert({
    admin_id: admin.id,
    action: 'reject_kyc',
    target_user_id: userId,
    details: { notes }
  });

  revalidatePath('/admin');
  return { success: true };
}

/**
 * Admin action to clear bank duplication review flags.
 */
export async function clearBankFlag(userId: string) {
  const admin = await verifyAdmin();
  const adminClient = await createAdminClient();

  const { error } = await adminClient
    .from('profiles')
    .update({
      bank_account_flagged: false,
      bank_account_flagged_reason: null,
      status: 'active'
    })
    .eq('id', userId);

  if (error) throw error;

  await adminClient.from('admin_audit_logs').insert({
    admin_id: admin.id,
    action: 'clear_bank_flag',
    target_user_id: userId
  });

  revalidatePath('/admin');
  return { success: true };
}

/**
 * Admin action to approve a winner from the manual review queue.
 */
export async function approveWinner(winnerId: string) {
  const admin = await verifyAdmin();
  const adminClient = await createAdminClient();

  const { error } = await adminClient.rpc('approve_winner_atomic', {
    p_winner_id: winnerId,
    p_admin_id: admin.id
  });

  if (error) throw error;

  revalidatePath('/admin');
  revalidatePath('/winners');
  return { success: true };
}

/**
 * Fetch all flagged profiles and overlaps for the Fraud Dashboard.
 */
export async function getFraudReport() {
  await verifyAdmin();
  const adminClient = await createAdminClient();

  // Fetch profiles that are flagged, high risk, under review, or suspended
  const { data: profiles, error } = await adminClient
    .from('profiles')
    .select('*')
    .or('risk_score.gte.30,bank_account_flagged.eq.true,status.eq.under_review,status.eq.suspended')
    .order('risk_score', { ascending: false });

  if (error) throw error;

  const reports = [];

  for (const profile of profiles || []) {
    // Find overlapping profiles sharing same IP, Device Fingerprint, Phone, or Bank Account
    const overlapConditions = [];
    if (profile.last_device_fingerprint && profile.last_device_fingerprint !== 'unknown') {
      overlapConditions.push(`last_device_fingerprint.eq.${profile.last_device_fingerprint}`);
    }
    if (profile.last_ip_address) {
      overlapConditions.push(`last_ip_address.eq.${profile.last_ip_address}`);
    }
    if (profile.bank_account_number) {
      overlapConditions.push(`bank_account_number.eq.${profile.bank_account_number}`);
    }
    if (profile.normalized_phone) {
      overlapConditions.push(`normalized_phone.eq.${profile.normalized_phone}`);
    }

    let linkedAccounts: any[] = [];
    if (overlapConditions.length > 0) {
      const { data: overlaps } = await adminClient
        .from('profiles')
        .select('id, username, full_name, risk_score, status, phone, bank_account_number, last_device_fingerprint, last_ip_address')
        .or(overlapConditions.join(','))
        .neq('id', profile.id);
      linkedAccounts = overlaps || [];
    }

    // Determine flag reasons
    const reasons: string[] = [];
    
    // Check if phone matches other accounts
    const phoneOverlap = linkedAccounts.some(acc => acc.phone === profile.phone && profile.phone);
    if (phoneOverlap) reasons.push('same phone attempt');

    // Check if device matches other accounts
    const deviceOverlap = linkedAccounts.some(acc => acc.last_device_fingerprint === profile.last_device_fingerprint && profile.last_device_fingerprint && profile.last_device_fingerprint !== 'unknown');
    if (deviceOverlap) reasons.push('same device');

    // Check if IP matches other accounts
    const ipOverlap = linkedAccounts.some(acc => acc.last_ip_address === profile.last_ip_address && profile.last_ip_address);
    if (ipOverlap) reasons.push('same IP');

    // Check if bank account matches other accounts
    const bankOverlap = linkedAccounts.some(acc => acc.bank_account_number === profile.bank_account_number && profile.bank_account_number);
    if (profile.bank_account_flagged || bankOverlap) reasons.push('same bank account');

    // Check referral chain overlap
    const { data: userReferrals } = await adminClient
      .from('referrals')
      .select('referrer_id, referred_user_id')
      .or(`referrer_id.eq.${profile.id},referred_user_id.eq.${profile.id}`);

    let hasReferralOverlap = false;
    if (userReferrals && userReferrals.length > 0) {
      for (const ref of userReferrals) {
        const otherId = ref.referrer_id === profile.id ? ref.referred_user_id : ref.referrer_id;
        const otherProfile = linkedAccounts.find(acc => acc.id === otherId);
        if (otherProfile) {
          hasReferralOverlap = true;
          break;
        }
      }
    }
    if (hasReferralOverlap) reasons.push('referral chain overlap');

    // Check for suspicious prediction/payment/withdrawal pattern
    const { data: withdrawals } = await adminClient
      .from('payout_requests')
      .select('status')
      .eq('user_id', profile.id);
    const rejectedCount = withdrawals?.filter((w: any) => w.status === 'rejected').length || 0;
    
    if (profile.risk_score >= 70 || rejectedCount >= 2 || profile.status === 'under_review' || profile.status === 'suspended') {
      reasons.push('suspicious prediction/payment/withdrawal pattern');
    }

    reports.push({
      profile,
      reasons: reasons.length > 0 ? reasons : ['medium risk score overlap'],
      linkedAccounts
    });
  }

  return reports;
}

/**
 * Fetch all round winners from review queue.
 */
export async function getWinnerReviewQueue() {
  await verifyAdmin();
  const adminClient = await createAdminClient();

  const { data, error } = await adminClient
    .from('winners')
    .select('*, profile:profiles(*), round:challenge_rounds(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

