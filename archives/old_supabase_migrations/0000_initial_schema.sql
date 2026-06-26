-- 0000_initial_schema.sql
-- Create 16 tables for PredChain core functionality

-- 1. PROFILES (Extends auth.users)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  username text UNIQUE,
  phone text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamp with time zone DEFAULT now()
);

-- 2. ACCOUNT TIERS
CREATE TABLE public.account_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL, -- Starter, Standard, Premium
  price_ngn integer NOT NULL,
  perks jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. ACCOUNT PURCHASES
CREATE TABLE public.account_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier_id uuid REFERENCES public.account_tiers(id),
  amount_paid integer NOT NULL,
  payment_reference text UNIQUE NOT NULL,
  status text DEFAULT 'completed',
  created_at timestamp with time zone DEFAULT now()
);

-- 4. CHALLENGE ROUNDS
CREATE TABLE public.challenge_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_number integer UNIQUE NOT NULL,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  status text DEFAULT 'upcoming', -- upcoming, active, completed
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
  status text DEFAULT 'scheduled', -- scheduled, in_play, finished
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

-- 7. PREDICTIONS
CREATE TABLE public.predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid REFERENCES public.challenge_entries(id) ON DELETE CASCADE,
  match_id uuid REFERENCES public.challenge_matches(id),
  predicted_home_score integer NOT NULL,
  predicted_away_score integer NOT NULL,
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
  created_at timestamp with time zone DEFAULT now()
);

-- 9. WALLET TRANSACTIONS
CREATE TABLE public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid REFERENCES public.wallets(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  type text NOT NULL, -- deposit, withdrawal, reward
  reference text,
  created_at timestamp with time zone DEFAULT now()
);

-- 10. PAYOUT REQUESTS
CREATE TABLE public.payout_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  bank_account_info jsonb NOT NULL,
  status text DEFAULT 'pending', -- pending, approved, rejected
  created_at timestamp with time zone DEFAULT now()
);

-- 11. REFERRALS
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_user_id uuid REFERENCES public.profiles(id),
  referral_code text NOT NULL,
  status text DEFAULT 'joined', -- joined, qualified
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
  status text DEFAULT 'open', -- open, in_progress, closed
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

-- Set standard RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own predictions" ON public.predictions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.challenge_entries e 
    WHERE e.id = predictions.entry_id AND e.user_id = auth.uid()
  )
);
