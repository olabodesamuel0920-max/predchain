-- PREDCHAIN MASTER RECOVERY SCRIPT (DROP & REBUILD)
-- -----------------------------------------------------------------------------
-- This script will NUCLEAR RESET your database. Use only for recovery.
-- -----------------------------------------------------------------------------

-- 1. DROP EVERYTHING (Reverse Order)
DROP TABLE IF EXISTS public.admin_ledger CASCADE;
DROP TABLE IF EXISTS public.admin_audit_logs CASCADE;
DROP TABLE IF EXISTS public.support_tickets CASCADE;
DROP TABLE IF EXISTS public.winners CASCADE;
DROP TABLE IF EXISTS public.referral_rewards CASCADE;
DROP TABLE IF EXISTS public.referrals CASCADE;
DROP TABLE IF EXISTS public.payout_requests CASCADE;
DROP TABLE IF EXISTS public.wallet_transactions CASCADE;
DROP TABLE IF EXISTS public.wallets CASCADE;
DROP TABLE IF EXISTS public.predictions CASCADE;
DROP TABLE IF EXISTS public.challenge_entries CASCADE;
DROP TABLE IF EXISTS public.challenge_matches CASCADE;
DROP TABLE IF EXISTS public.challenge_rounds CASCADE;
DROP TABLE IF EXISTS public.account_purchases CASCADE;
DROP TABLE IF EXISTS public.account_tiers CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.platform_settings CASCADE;
DROP TABLE IF EXISTS public.leaderboard_snapshots CASCADE;

-- 2. DROP FUNCTIONS & TRIGGERS
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_payout_request_atomic(uuid, integer, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.resolve_payout_request_atomic(uuid, uuid, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.settle_round_winner_atomic(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.adjust_user_wallet_admin(uuid, uuid, integer, text) CASCADE;
DROP FUNCTION IF EXISTS public.purchase_tier_with_wallet_atomic(uuid, uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.process_referral_reward_atomic(uuid, uuid, text, integer) CASCADE;

-- -----------------------------------------------------------------------------
-- 3. RE-CREATE EVERYTHING (Fresh Build)
-- -----------------------------------------------------------------------------

-- 1. PROFILES (Extends auth.users)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  username text UNIQUE,
  phone text UNIQUE,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_demo boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  is_suspended boolean DEFAULT false,
  status text DEFAULT 'active',
  admin_notes text,
  phone_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. ACCOUNT TIERS
CREATE TABLE public.account_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  price_ngn integer NOT NULL,
  perks jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. ACCOUNT PURCHASES (Updated Status Default)
CREATE TABLE public.account_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier_id uuid REFERENCES public.account_tiers(id),
  amount_paid integer NOT NULL,
  payment_reference text UNIQUE NOT NULL,
  provider_reference text,
  status text DEFAULT 'pending',
  verified_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. CHALLENGE ROUNDS
CREATE TABLE public.challenge_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_number integer UNIQUE NOT NULL,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  status text DEFAULT 'upcoming',
  created_at timestamp with time zone DEFAULT now()
);

-- 5. CHALLENGE MATCHES
CREATE TABLE public.challenge_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id uuid REFERENCES public.challenge_rounds(id) ON DELETE CASCADE,
  home_team text NOT NULL,
  away_team text NOT NULL,
  kickoff_time timestamp with time zone NOT NULL,
  home_score integer,
  away_score integer,
  status text DEFAULT 'scheduled',
  created_at timestamp with time zone DEFAULT now()
);

-- 6. CHALLENGE ENTRIES
CREATE TABLE public.challenge_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  round_id uuid REFERENCES public.challenge_rounds(id),
  tier_id uuid REFERENCES public.account_tiers(id),
  streak_count integer DEFAULT 0,
  is_winner boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- 7. PREDICTIONS (Outcome Based)
CREATE TABLE public.predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid REFERENCES public.challenge_entries(id) ON DELETE CASCADE,
  match_id uuid REFERENCES public.challenge_matches(id),
  prediction text NOT NULL CHECK (prediction IN ('1', 'X', '2')),
  is_locked boolean DEFAULT false,
  is_correct boolean,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(entry_id, match_id)
);

-- 8. WALLETS
CREATE TABLE public.wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  balance_ngn integer DEFAULT 0,
  payout_account_info jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- 9. WALLET TRANSACTIONS
CREATE TABLE public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid REFERENCES public.wallets(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  type text NOT NULL,
  reference text,
  created_at timestamp with time zone DEFAULT now()
);

-- 10. PAYOUT REQUESTS
CREATE TABLE public.payout_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  bank_account_info jsonb NOT NULL,
  admin_notes text,
  status text DEFAULT 'pending',
  is_flagged boolean DEFAULT false,
  flagging_reason text,
  processed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- 11. REFERRALS
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_user_id uuid REFERENCES public.profiles(id),
  referral_code text NOT NULL,
  status text DEFAULT 'joined',
  is_flagged boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- 12. REFERRAL REWARDS
CREATE TABLE public.referral_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id uuid REFERENCES public.referrals(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  is_paid boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- 13. WINNERS
CREATE TABLE public.winners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  round_id uuid REFERENCES public.challenge_rounds(id),
  payout_amount integer NOT NULL,
  verified boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- 14. SUPPORT TICKETS
CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject text NOT NULL,
  message text NOT NULL,
  internal_notes text,
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  category text DEFAULT 'general',
  status text DEFAULT 'open',
  created_at timestamp with time zone DEFAULT now()
);

-- 15. ADMIN AUDIT LOGS
CREATE TABLE public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES public.profiles(id),
  action text NOT NULL,
  target_user_id uuid REFERENCES public.profiles(id),
  details jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- 16. LEADERBOARD SNAPSHOTS
CREATE TABLE public.leaderboard_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id uuid REFERENCES public.challenge_rounds(id),
  user_id uuid REFERENCES public.profiles(id),
  rank integer NOT NULL,
  total_points integer NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 17. PLATFORM SETTINGS
CREATE TABLE public.platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 18. ADMIN LEDGER
CREATE TABLE public.admin_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.profiles(id),
  user_id UUID REFERENCES public.profiles(id),
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set standard RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own wallet" ON public.wallets;
CREATE POLICY "Users can view their own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own predictions" ON public.predictions;
CREATE POLICY "Users can view their own predictions" ON public.predictions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.challenge_entries e 
    WHERE e.id = predictions.entry_id AND e.user_id = auth.uid()
  )
);

-- 0001_auth_trigger.sql
-- Create a trigger to automatically create a public profile and initialize a wallet for new auth.users

-- 1. Function to handle profile and wallet creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into profiles
  -- metadata "full_name", "username", and "phone" are expected from the signup form's user_metadata
  INSERT INTO public.profiles (id, full_name, username, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'username', new.email),
    new.raw_user_meta_data->>'phone'
  );
  
  -- Initialize a wallet for the new user
  INSERT INTO public.wallets (user_id, balance_ngn)
  VALUES (new.id, 0);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 0002_seed_data.sql
-- Populate core data for PredChain

-- 1. ACCOUNT TIERS (Hardcoded UUIDs for Stability)
INSERT INTO public.account_tiers (id, name, price_ngn, perks) VALUES
('e52109e4-23ea-4034-934c-6f8e77a1a311', 'Starter', 5000, '{"reward": "₦50k", "predictions_per_round": 3, "referral_bonus": 1000}'::jsonb),
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Standard', 10000, '{"reward": "₦100k", "predictions_per_round": 3, "referral_bonus": 1000, "priority": true}'::jsonb),
('550e8400-e29b-41d4-a716-446655440000', 'Premium', 20000, '{"reward": "₦250k", "predictions_per_round": 3, "referral_bonus": 1000, "priority": true, "elite_badge": true}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 0003_payout_and_security.sql
-- Evolution of PredChain schema to production-ready status

-- (Columns already included in the CREATE TABLE section above)

-- 4. ADDITIONAL INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_predictions_entry_id ON public.predictions(entry_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match_id ON public.predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_challenge_entries_user_id ON public.challenge_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_entries_round_id ON public.challenge_entries(round_id);
CREATE INDEX IF NOT EXISTS idx_challenge_matches_round_id ON public.challenge_matches(round_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON public.wallet_transactions(wallet_id);

-- 5. COMPLETE RLS POLICIES FOR ALL TABLES

-- Account Tiers (Public View, Admin Update)
ALTER TABLE public.account_tiers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view active tiers" ON public.account_tiers;
CREATE POLICY "Anyone can view active tiers" ON public.account_tiers FOR SELECT USING (is_active = true);

-- Account Purchases (User View Own)
ALTER TABLE public.account_purchases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.account_purchases;
CREATE POLICY "Users can view their own purchases" ON public.account_purchases FOR SELECT USING (auth.uid() = user_id);

-- Challenge Rounds (Public View)
ALTER TABLE public.challenge_rounds ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view challenge rounds" ON public.challenge_rounds;
CREATE POLICY "Anyone can view challenge rounds" ON public.challenge_rounds FOR SELECT USING (true);

-- Challenge Matches (Public View)
ALTER TABLE public.challenge_matches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view challenge matches" ON public.challenge_matches;
CREATE POLICY "Anyone can view challenge matches" ON public.challenge_matches FOR SELECT USING (true);

-- Challenge Entries (User View Own)
ALTER TABLE public.challenge_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own entries" ON public.challenge_entries;
CREATE POLICY "Users can view their own entries" ON public.challenge_entries FOR SELECT USING (auth.uid() = user_id);

-- Predictions (Already handled in 0000, adding INSERT/UPDATE)
DROP POLICY IF EXISTS "Users can insert their own predictions" ON public.predictions;
CREATE POLICY "Users can insert their own predictions" ON public.predictions FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.challenge_entries e 
    WHERE e.id = entry_id AND e.user_id = auth.uid()
  )
);
DROP POLICY IF EXISTS "Users can update their own unconfirmed predictions" ON public.predictions;
CREATE POLICY "Users can update their own unconfirmed predictions" ON public.predictions FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.challenge_entries e 
    WHERE e.id = predictions.entry_id AND e.user_id = auth.uid()
  )
) WITH CHECK (NOT is_locked);

-- Wallet Transactions (User View Own)
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.wallet_transactions;
CREATE POLICY "Users can view their own transactions" ON public.wallet_transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.wallets w WHERE w.id = wallet_id AND w.user_id = auth.uid())
);

-- Payout Requests (User View Own, User Insert)
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view/insert their own payout requests" ON public.payout_requests;
CREATE POLICY "Users can view/insert their own payout requests" ON public.payout_requests FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create payout requests" ON public.payout_requests;
CREATE POLICY "Users can create payout requests" ON public.payout_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Referrals (User View Own/Referrer)
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own referral activity" ON public.referrals;
CREATE POLICY "Users can view their own referral activity" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);

-- Support Tickets (User View/Insert Own)
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own support tickets" ON public.support_tickets;
CREATE POLICY "Users can manage their own support tickets" ON public.support_tickets FOR ALL USING (auth.uid() = user_id);

-- Winners (Public View)
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view winners" ON public.winners;
CREATE POLICY "Anyone can view winners" ON public.winners FOR SELECT USING (true);

-- 6. ADMIN OVERRIDE POLICIES
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "Admins have full access to matches" ON public.challenge_matches;
CREATE POLICY "Admins have full access to matches" ON public.challenge_matches FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "Admins have full access to rounds" ON public.challenge_rounds;
CREATE POLICY "Admins have full access to rounds" ON public.challenge_rounds FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "Admins have full access to purchases" ON public.account_purchases;
CREATE POLICY "Admins have full access to purchases" ON public.account_purchases FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "Admins have full access to winners" ON public.winners;
CREATE POLICY "Admins have full access to winners" ON public.winners FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "Admins have full access toPayouts" ON public.payout_requests;
CREATE POLICY "Admins have full access toPayouts" ON public.payout_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- 0004_atomic_operations.sql
-- Atomic RPCs to prevent data drift in wallet and winner flows

-- 1. Atomic Payout Request
CREATE OR REPLACE FUNCTION public.create_payout_request_atomic(
  p_user_id UUID,
  p_amount INTEGER,
  p_bank_info JSONB
) RETURNS VOID AS $$
DECLARE
  v_wallet_id UUID;
  v_current_balance INTEGER;
BEGIN
  -- 1. Get Wallet and lock row for update
  SELECT id, balance_ngn INTO v_wallet_id, v_current_balance
  FROM public.wallets
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found for user %', p_user_id;
  END IF;

  -- 2. Check Balance
  IF v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance: % < %', v_current_balance, p_amount;
  END IF;

  -- 3. Create Payout Request
  INSERT INTO public.payout_requests (user_id, amount, bank_account_info, status)
  VALUES (p_user_id, p_amount, p_bank_info, 'pending');

  -- 4. Deduct from Wallet
  UPDATE public.wallets
  SET balance_ngn = balance_ngn - p_amount
  WHERE id = v_wallet_id;

  -- 5. Record Transaction
  INSERT INTO public.wallet_transactions (wallet_id, amount, type, reference)
  VALUES (v_wallet_id, -p_amount, 'withdrawal', 'payout_request_' || now());

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Atomic Payout Resolution (Approval/Rejection)
CREATE OR REPLACE FUNCTION public.resolve_payout_request_atomic(
  p_request_id UUID,
  p_admin_id UUID,
  p_new_status TEXT, -- 'completed' or 'rejected'
  p_admin_notes TEXT
) RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_amount INTEGER;
  v_current_status TEXT;
  v_wallet_id UUID;
BEGIN
  -- 1. Get and lock request
  SELECT user_id, amount, status INTO v_user_id, v_amount, v_current_status
  FROM public.payout_requests
  WHERE id = p_request_id
  FOR UPDATE;

  IF v_current_status IS NULL THEN
    RAISE EXCEPTION 'Payout request % not found', p_request_id;
  END IF;

  IF v_current_status != 'pending' THEN
    RAISE EXCEPTION 'Request is already %', v_current_status;
  END IF;

  -- 2. Handle Rejection (Refund)
  IF p_new_status = 'rejected' THEN
    SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = v_user_id FOR UPDATE;
    
    UPDATE public.wallets
    SET balance_ngn = balance_ngn + v_amount
    WHERE id = v_wallet_id;

    INSERT INTO public.wallet_transactions (wallet_id, amount, type, reference)
    VALUES (v_wallet_id, v_amount, 'refund', 'payout_rejected_' || p_request_id);
  END IF;

  -- 3. Update Request Status
  UPDATE public.payout_requests
  SET status = p_new_status,
      admin_notes = p_admin_notes,
      processed_at = now()
  WHERE id = p_request_id;

  -- 4. Log Admin Action
  INSERT INTO public.admin_audit_logs (admin_id, action, target_user_id, details)
  VALUES (p_admin_id, 'payout_' || p_new_status, v_user_id, jsonb_build_object('request_id', p_request_id, 'amount', v_amount));

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Atomic Winner Settlement
CREATE OR REPLACE FUNCTION public.settle_round_winner_atomic(
  p_entry_id UUID,
  p_admin_id UUID
) RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_round_id UUID;
  v_tier_id UUID;
  v_reward_amount INTEGER;
  v_wallet_id UUID;
  v_is_winner BOOLEAN;
BEGIN
  -- 1. Get Entry Info and lock
  SELECT user_id, round_id, tier_id, is_winner 
  INTO v_user_id, v_round_id, v_tier_id, v_is_winner
  FROM public.challenge_entries
  WHERE id = p_entry_id
  FOR UPDATE;

  IF v_is_winner THEN
    RETURN; -- Already processed
  END IF;

  -- 2. Get Reward Amount (10X Tier Price)
  SELECT price_ngn * 10 INTO v_reward_amount
  FROM public.account_tiers
  WHERE id = v_tier_id;

  -- 3. Mark Entry as Winner
  UPDATE public.challenge_entries
  SET is_winner = true
  WHERE id = p_entry_id;

  -- 4. Create Winner Record
  INSERT INTO public.winners (user_id, round_id, payout_amount)
  VALUES (v_user_id, v_round_id, v_reward_amount);

  -- 5. Credit Wallet
  SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = v_user_id FOR UPDATE;
  
  UPDATE public.wallets
  SET balance_ngn = balance_ngn + v_reward_amount
  WHERE id = v_wallet_id;

  -- 6. Record Transaction
  INSERT INTO public.wallet_transactions (wallet_id, amount, type, reference)
  VALUES (v_wallet_id, v_reward_amount, 'reward', 'round_win_' || v_round_id);

  -- 7. Audit Log
  IF p_admin_id IS NOT NULL THEN
    INSERT INTO public.admin_audit_logs (admin_id, action, target_user_id, details)
    VALUES (p_admin_id, 'settle_winner', v_user_id, jsonb_build_object('entry_id', p_entry_id, 'amount', v_reward_amount));

    -- 8. Financial Ledger
    INSERT INTO public.admin_ledger (admin_id, user_id, amount, type, reason)
    VALUES (p_admin_id, v_user_id, v_reward_amount, 'debit', 'Challenge Round Reward: ' || v_round_id);
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 0005_premium_admin_features.sql
-- Advanced Admin Dashboard and Trust Hardening

-- (Columns already included in the CREATE TABLE section above)

-- 2. CREATE PLATFORM SETTINGS (Already handled in CREATE section above)

-- Seed Initial Settings
INSERT INTO public.platform_settings (key, value, description) VALUES
('maintenance_mode', 'false', 'Enable or disable platform maintenance mode.'),
('tier_pricing', '{"starter": 5000, "standard": 10000, "premium": 25000}', 'Pricing for account tiers in NGN.'),
('referral_bonus', '1000', 'Bonus amount for successful referrals in NGN.'),
('payout_limits', '{"min": 5000, "max": 500000}', 'Minimum and maximum payout limits.'),
('announcement_banner', '{"text": "Welcome to PredChain! Round 43 is now live.", "active": true}', 'Homepage announcement banner content.'),
('trust_stats_mode', '"real"', 'Display mode for homepage stats: "real" or "launch".')
ON CONFLICT (key) DO NOTHING;

-- 3. ENHANCE SUPPORT TICKETS
ALTER TABLE public.support_tickets
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';

-- 4. FINANCIAL INTEGRITY (Ledger Entry)
CREATE TABLE IF NOT EXISTS public.admin_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.profiles(id),
  user_id UUID REFERENCES public.profiles(id),
  amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- credit, debit, refund
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. FRAUD/RISK REVIEW QUEUE (Skip - included in CREATE)

-- 6. RPC: ATOMIC ADMIN WALLET ADJUSTMENT
CREATE OR REPLACE FUNCTION public.adjust_user_wallet_admin(
  p_admin_id UUID,
  p_user_id UUID,
  p_amount INTEGER, -- positive for credit, negative for debit
  p_reason TEXT
) RETURNS VOID AS $$
DECLARE
  v_wallet_id UUID;
BEGIN
  -- 1. Verify Admin Role
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND role = 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required.';
  END IF;

  -- 2. Get and lock wallet
  SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = p_user_id FOR UPDATE;
  
  IF v_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found for user %', p_user_id;
  END IF;

  -- 3. Update Wallet Balance
  UPDATE public.wallets
  SET balance_ngn = balance_ngn + p_amount
  WHERE id = v_wallet_id;

  -- 4. Record Ledger Entry
  INSERT INTO public.admin_ledger (admin_id, user_id, amount, type, reason)
  VALUES (p_admin_id, p_user_id, p_amount, CASE WHEN p_amount >= 0 THEN 'credit' ELSE 'debit' END, p_reason);

  -- 5. Record Transaction
  INSERT INTO public.wallet_transactions (wallet_id, amount, type, reference)
  VALUES (v_wallet_id, p_amount, 'admin_adjustment', 'adj_' || now());

  -- 6. Audit Log
  INSERT INTO public.admin_audit_logs (admin_id, action, target_user_id, details)
  VALUES (p_admin_id, 'wallet_adjustment', p_user_id, jsonb_build_object('amount', p_amount, 'reason', p_reason));

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 0006_wallet_purchases.sql
-- Atomic RPCs to support wallet-funded tier purchases

CREATE OR REPLACE FUNCTION public.purchase_tier_with_wallet_atomic(
  p_user_id UUID,
  p_tier_id UUID,
  p_payment_reference TEXT
) RETURNS VOID AS $$
DECLARE
  v_wallet_id UUID;
  v_balance INTEGER;
  v_tier_price INTEGER;
  v_active_round_id UUID;
BEGIN
  -- 1. Lock wallet row
  SELECT id, balance_ngn INTO v_wallet_id, v_balance
  FROM public.wallets
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found for user %', p_user_id;
  END IF;

  -- 2. Get Tier Pricing
  SELECT price_ngn INTO v_tier_price
  FROM public.account_tiers
  WHERE id = p_tier_id;

  IF v_tier_price IS NULL THEN
    RAISE EXCEPTION 'Tier % not found', p_tier_id;
  END IF;

  -- 3. Verify Balance
  IF v_balance < v_tier_price THEN
    RAISE EXCEPTION 'Insufficient balance: % < %', v_balance, v_tier_price;
  END IF;

  -- 4. Deduct from Wallet
  UPDATE public.wallets
  SET balance_ngn = balance_ngn - v_tier_price
  WHERE id = v_wallet_id;

  -- 5. Record Transaction
  INSERT INTO public.wallet_transactions (wallet_id, amount, type, reference)
  VALUES (v_wallet_id, -v_tier_price, 'purchase', p_payment_reference);

  -- 6. Create Purchase Record
  INSERT INTO public.account_purchases (
    user_id, tier_id, amount_paid, payment_reference, provider_reference, status, verified_at
  ) VALUES (
    p_user_id, p_tier_id, v_tier_price, p_payment_reference, 'wallet', 'completed', now()
  );

  -- 7. Auto-Enroll in Active Round (Prevent Duplicates)
  SELECT id INTO v_active_round_id
  FROM public.challenge_rounds
  WHERE status = 'active'
  LIMIT 1;

  IF v_active_round_id IS NOT NULL THEN
    INSERT INTO public.challenge_entries (user_id, round_id, tier_id, streak_count)
    SELECT p_user_id, v_active_round_id, p_tier_id, 0
    WHERE NOT EXISTS (
      SELECT 1 FROM public.challenge_entries 
      WHERE user_id = p_user_id AND round_id = v_active_round_id
    );
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 0007_referral_atomicity.sql
-- Atomic RPC for referral rewards

CREATE OR REPLACE FUNCTION public.process_referral_reward_atomic(
  p_referrer_id UUID,
  p_referred_user_id UUID,
  p_referral_code TEXT,
  p_reward_amount INTEGER
) RETURNS VOID AS $$
DECLARE
  v_wallet_id UUID;
  v_referral_id UUID;
BEGIN
  -- 1. Idempotency Check
  SELECT id INTO v_referral_id 
  FROM public.referrals 
  WHERE referrer_id = p_referrer_id AND referred_user_id = p_referred_user_id;

  IF v_referral_id IS NOT NULL THEN
    RETURN;
  END IF;

  -- 2. Create Referral Record
  INSERT INTO public.referrals (referrer_id, referred_user_id, referral_code, status)
  VALUES (p_referrer_id, p_referred_user_id, p_referral_code, 'qualified')
  RETURNING id INTO v_referral_id;

  -- 3. Create Reward Record
  INSERT INTO public.referral_rewards (referral_id, amount, is_paid)
  VALUES (v_referral_id, p_reward_amount, true);

  -- 4. Credit Referrer Wallet
  SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = p_referrer_id FOR UPDATE;

  IF v_wallet_id IS NOT NULL THEN
    UPDATE public.wallets
    SET balance_ngn = balance_ngn + p_reward_amount
    WHERE id = v_wallet_id;

    INSERT INTO public.wallet_transactions (wallet_id, amount, type, reference)
    VALUES (v_wallet_id, p_reward_amount, 'reward', 'referral_bonus_' || p_referred_user_id);
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
