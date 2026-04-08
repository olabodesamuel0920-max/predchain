-- 0009_fix_rls_vulnerabilities.sql
-- Enable Row-Level Security for remaining tables to resolve the Supabase security alert.
-- These tables were previously public, exposing them to unauthorized access.

-- 1. REFERRAL REWARDS
-- Secure rewards so users can see their own, and admins see all.
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view rewards for their referrals" ON public.referral_rewards FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.referrals r
    WHERE r.id = referral_id AND (r.referrer_id = auth.uid() OR r.referred_user_id = auth.uid())
  )
);

CREATE POLICY "Admins have full access to referral_rewards" ON public.referral_rewards FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- 2. ADMIN AUDIT LOGS
-- Only admins should be able to view or modify audit logs.
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins only access to audit logs" ON public.admin_audit_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- 3. LEADERBOARD SNAPSHOTS
-- Transparent info for all users, but only admins can manage the data.
ALTER TABLE public.leaderboard_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view leaderboard snapshots" ON public.leaderboard_snapshots FOR SELECT USING (true);

CREATE POLICY "Admins only access to leaderboard snapshots" ON public.leaderboard_snapshots FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- 4. PLATFORM SETTINGS
-- Readable by all for UI configuration, but modifiable only by admins.
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view platform settings" ON public.platform_settings FOR SELECT USING (true);

CREATE POLICY "Admins only access to platform settings" ON public.platform_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- 5. ADMIN LEDGER
-- Highly sensitive financial records. Only admins can access.
ALTER TABLE public.admin_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins only access to admin ledger" ON public.admin_ledger FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
