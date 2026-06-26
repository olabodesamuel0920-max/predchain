-- 0003_payout_and_security.sql
-- Evolution of PredChain schema to production-ready status

-- 1. PIVOT PREDICTIONS TO OUTCOME-BASED (1X2)
ALTER TABLE public.predictions 
DROP COLUMN IF EXISTS predicted_home_score,
DROP COLUMN IF EXISTS predicted_away_score;

ALTER TABLE public.predictions 
ADD COLUMN prediction TEXT NOT NULL CHECK (prediction IN ('1', 'X', '2'));

-- 2. ENHANCE PAYMENT TRACKING
ALTER TABLE public.account_purchases 
ADD COLUMN IF NOT EXISTS provider_reference TEXT,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
ALTER COLUMN status SET DEFAULT 'pending';

-- 3. ENHANCE WALLET & PAYOUTS
ALTER TABLE public.wallets 
ADD COLUMN IF NOT EXISTS payout_account_info JSONB;

ALTER TABLE public.payout_requests
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE;

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
CREATE POLICY "Anyone can view active tiers" ON public.account_tiers FOR SELECT USING (is_active = true);

-- Account Purchases (User View Own)
ALTER TABLE public.account_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own purchases" ON public.account_purchases FOR SELECT USING (auth.uid() = user_id);

-- Challenge Rounds (Public View)
ALTER TABLE public.challenge_rounds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view challenge rounds" ON public.challenge_rounds FOR SELECT USING (true);

-- Challenge Matches (Public View)
ALTER TABLE public.challenge_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view challenge matches" ON public.challenge_matches FOR SELECT USING (true);

-- Challenge Entries (User View Own)
ALTER TABLE public.challenge_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own entries" ON public.challenge_entries FOR SELECT USING (auth.uid() = user_id);

-- Predictions (Already handled in 0000, adding INSERT/UPDATE)
CREATE POLICY "Users can insert their own predictions" ON public.predictions FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.challenge_entries e 
    WHERE e.id = entry_id AND e.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update their own unconfirmed predictions" ON public.predictions FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.challenge_entries e 
    WHERE e.id = predictions.entry_id AND e.user_id = auth.uid()
  )
) WITH CHECK (NOT is_locked);

-- Wallet Transactions (User View Own)
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions" ON public.wallet_transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.wallets w WHERE w.id = wallet_id AND w.user_id = auth.uid())
);

-- Payout Requests (User View Own, User Insert)
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view/insert their own payout requests" ON public.payout_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create payout requests" ON public.payout_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Referrals (User View Own/Referrer)
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own referral activity" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);

-- Support Tickets (User View/Insert Own)
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own support tickets" ON public.support_tickets FOR ALL USING (auth.uid() = user_id);

-- Winners (Public View)
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view winners" ON public.winners FOR SELECT USING (true);

-- 6. ADMIN OVERRIDE POLICIES
-- NOTE: In a real Supabase environment, you might use service_role for admin tasks, 
-- but for the Admin Console UI to work, we need specific policies for the 'admin' role.

CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- (Repeat for other tables where Admin needs direct UI access)
CREATE POLICY "Admins have full access to matches" ON public.challenge_matches FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

CREATE POLICY "Admins have full access to rounds" ON public.challenge_rounds FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

CREATE POLICY "Admins have full access to purchases" ON public.account_purchases FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

CREATE POLICY "Admins have full access to winners" ON public.winners FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

CREATE POLICY "Admins have full access toPayouts" ON public.payout_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
