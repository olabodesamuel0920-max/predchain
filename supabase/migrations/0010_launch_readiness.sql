-- 0010_launch_readiness.sql
-- PredChain Production Launch Readiness & Security Schema

BEGIN;

-- 1. PHONE NORMALIZATION FUNCTION
CREATE OR REPLACE FUNCTION public.normalize_phone(p_phone TEXT)
RETURNS TEXT AS $$
DECLARE
  v_digits TEXT;
BEGIN
  IF p_phone IS NULL OR p_phone = '' THEN
    RETURN NULL;
  END IF;
  
  -- Strip non-digits
  v_digits := regexp_replace(p_phone, '\D', '', 'g');
  
  -- Nigerian normalization rules
  -- If starts with 0 and has 11 digits, replace leading 0 with 234
  IF v_digits LIKE '0%' AND length(v_digits) = 11 THEN
    v_digits := '234' || substring(v_digits from 2);
  -- If starts with 8/7/9 and has 10 digits, prepend 234
  ELSIF length(v_digits) = 10 AND (v_digits LIKE '8%' OR v_digits LIKE '7%' OR v_digits LIKE '9%') THEN
    v_digits := '234' || v_digits;
  END IF;
  
  RETURN v_digits;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. ALTER PROFILES TABLE WITH INTEGRITY COLUMNS
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS normalized_phone TEXT,
ADD COLUMN IF NOT EXISTS identity_status TEXT DEFAULT 'unverified' CHECK (identity_status IN ('unverified', 'pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS identity_legal_name TEXT,
ADD COLUMN IF NOT EXISTS identity_dob DATE,
ADD COLUMN IF NOT EXISTS identity_type TEXT,
ADD COLUMN IF NOT EXISTS identity_number TEXT,
ADD COLUMN IF NOT EXISTS identity_notes TEXT,
ADD COLUMN IF NOT EXISTS bank_name TEXT,
ADD COLUMN IF NOT EXISTS bank_account_number TEXT,
ADD COLUMN IF NOT EXISTS bank_account_name TEXT,
ADD COLUMN IF NOT EXISTS bank_account_flagged BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS bank_account_flagged_reason TEXT,
ADD COLUMN IF NOT EXISTS last_device_fingerprint TEXT,
ADD COLUMN IF NOT EXISTS last_ip_address TEXT,
ADD COLUMN IF NOT EXISTS risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100);

-- Trigger to automatically normalize phone numbers on update/insert
CREATE OR REPLACE FUNCTION public.trg_normalize_phone_func()
RETURNS TRIGGER AS $$
BEGIN
  NEW.normalized_phone := public.normalize_phone(NEW.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_normalize_phone_before ON public.profiles;
CREATE TRIGGER trg_normalize_phone_before
BEFORE INSERT OR UPDATE OF phone ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.trg_normalize_phone_func();

-- Unique partial index on normalized phone numbers to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_normalized_phone_unique 
ON public.profiles(normalized_phone) 
WHERE (normalized_phone IS NOT NULL AND normalized_phone <> '');

-- 3. SECURITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('signup', 'login', 'payment', 'prediction', 'withdrawal')),
  ip_address TEXT,
  user_agent TEXT,
  timezone TEXT,
  device_fingerprint TEXT,
  device_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and secure security_logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins have full access to security_logs" ON public.security_logs;
CREATE POLICY "Admins have full access to security_logs" 
ON public.security_logs FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "Users can insert security_logs for themselves" ON public.security_logs;
CREATE POLICY "Users can insert security_logs for themselves" 
ON public.security_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 4. PHONE VERIFICATION CODES TABLE (OTP)
CREATE TABLE IF NOT EXISTS public.phone_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attempts INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.phone_verification_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert phone_verification_codes" ON public.phone_verification_codes;
CREATE POLICY "Anyone can insert phone_verification_codes" 
ON public.phone_verification_codes FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to phone_verification_codes" ON public.phone_verification_codes;
CREATE POLICY "Admins have full access to phone_verification_codes" 
ON public.phone_verification_codes FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- 5. BANK ACCOUNT UNIQUENESS TRIGGER
CREATE OR REPLACE FUNCTION public.check_bank_account_uniqueness()
RETURNS TRIGGER AS $$
DECLARE
  v_other_user_id UUID;
BEGIN
  IF NEW.bank_account_number IS NOT NULL AND NEW.bank_account_number <> '' AND 
     (OLD.bank_account_number IS NULL OR NEW.bank_account_number <> OLD.bank_account_number) THEN
     
     -- Find other user with this bank account number
     SELECT id INTO v_other_user_id
     FROM public.profiles
     WHERE bank_account_number = NEW.bank_account_number AND id <> NEW.id
     LIMIT 1;
     
     IF v_other_user_id IS NOT NULL THEN
       -- Flag current user
       NEW.bank_account_flagged := TRUE;
       NEW.bank_account_flagged_reason := 'Duplicate bank account number shared with user: ' || v_other_user_id;
       NEW.status := 'under_review';
       
       -- Flag the other user
       UPDATE public.profiles
       SET bank_account_flagged = TRUE,
           bank_account_flagged_reason = 'Duplicate bank account number shared with user: ' || NEW.id,
           status = 'under_review'
       WHERE id = v_other_user_id;
     END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_check_bank_account_uniqueness ON public.profiles;
CREATE TRIGGER trg_check_bank_account_uniqueness
BEFORE UPDATE OF bank_account_number ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.check_bank_account_uniqueness();

-- 6. RISK SCORING ENGINE
CREATE OR REPLACE FUNCTION public.calculate_risk_score(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_risk_score INTEGER := 0;
  v_phone TEXT;
  v_normalized_phone TEXT;
  v_bank_acc TEXT;
  v_ref_id UUID;
  v_share_phone_count INTEGER := 0;
  v_share_bank_count INTEGER := 0;
  v_share_device_count INTEGER := 0;
  v_share_ip_count INTEGER := 0;
  v_referral_self_abuse BOOLEAN := FALSE;
  v_fingerprint TEXT;
  v_ip TEXT;
BEGIN
  SELECT phone, normalized_phone, bank_account_number, last_device_fingerprint, last_ip_address
  INTO v_phone, v_normalized_phone, v_bank_acc, v_fingerprint, v_ip
  FROM public.profiles
  WHERE id = p_user_id;

  SELECT referrer_id INTO v_ref_id
  FROM public.referrals
  WHERE referred_user_id = p_user_id;

  -- A. Same normalized phone check (Hard Block Indicator)
  IF v_normalized_phone IS NOT NULL AND v_normalized_phone <> '' THEN
    SELECT count(*) INTO v_share_phone_count
    FROM public.profiles
    WHERE normalized_phone = v_normalized_phone AND id <> p_user_id;
    
    IF v_share_phone_count > 0 THEN
      v_risk_score := v_risk_score + 100;
    END IF;
  END IF;

  -- B. Same bank account check (Hard Review)
  IF v_bank_acc IS NOT NULL AND v_bank_acc <> '' THEN
    SELECT count(*) INTO v_share_bank_count
    FROM public.profiles
    WHERE bank_account_number = v_bank_acc AND id <> p_user_id;
    
    IF v_share_bank_count > 0 THEN
      v_risk_score := v_risk_score + 80;
    END IF;
  END IF;

  -- C. Same device multiple accounts (Medium/High Risk)
  IF v_fingerprint IS NOT NULL AND v_fingerprint <> '' THEN
    SELECT count(DISTINCT id) INTO v_share_device_count
    FROM public.profiles
    WHERE last_device_fingerprint = v_fingerprint AND id <> p_user_id;
    
    IF v_share_device_count = 1 THEN
      v_risk_score := v_risk_score + 50;
    ELSIF v_share_device_count >= 2 THEN
      v_risk_score := v_risk_score + 85;
    END IF;
  END IF;

  -- D. Same IP (Low/Medium Risk)
  IF v_ip IS NOT NULL AND v_ip <> '' THEN
    SELECT count(DISTINCT id) INTO v_share_ip_count
    FROM public.profiles
    WHERE last_ip_address = v_ip AND id <> p_user_id;
    
    IF v_share_ip_count >= 1 THEN
      v_risk_score := v_risk_score + 25;
    END IF;
  END IF;

  -- E. Referral self-abuse pattern (High Risk)
  IF v_ref_id IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 
      FROM public.profiles p1
      JOIN public.profiles p2 ON p2.id = v_ref_id
      WHERE p1.id = p_user_id AND (
        (p1.last_device_fingerprint = p2.last_device_fingerprint AND p1.last_device_fingerprint IS NOT NULL AND p1.last_device_fingerprint <> '') OR
        (p1.last_ip_address = p2.last_ip_address AND p1.last_ip_address IS NOT NULL AND p1.last_ip_address <> '') OR
        (p1.bank_account_number = p2.bank_account_number AND p1.bank_account_number IS NOT NULL AND p1.bank_account_number <> '')
      )
    ) INTO v_referral_self_abuse;

    IF v_referral_self_abuse THEN
      v_risk_score := v_risk_score + 90;
    END IF;
  END IF;

  -- Clamp risk score at 100
  IF v_risk_score > 100 THEN
    v_risk_score := 100;
  END IF;

  RETURN v_risk_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to recalculate risk_score whenever key columns are updated
CREATE OR REPLACE FUNCTION public.trg_recalculate_risk_func()
RETURNS TRIGGER AS $$
BEGIN
  NEW.risk_score := public.calculate_risk_score(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_recalculate_risk ON public.profiles;
CREATE TRIGGER trg_recalculate_risk
BEFORE UPDATE OF phone, bank_account_number, last_device_fingerprint, last_ip_address ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.trg_recalculate_risk_func();

-- 7. CHALLENGE MATCHDAY FIELD
ALTER TABLE public.challenge_matches 
ADD COLUMN IF NOT EXISTS matchday INTEGER CHECK (matchday IN (1, 2, 3));

-- 8. PREDICTIONS MATCHDAY LIMIT
CREATE OR REPLACE FUNCTION public.check_one_prediction_per_matchday()
RETURNS TRIGGER AS $$
DECLARE
  v_matchday INTEGER;
  v_round_id UUID;
  v_existing_count INTEGER;
  v_kickoff TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get match details
  SELECT matchday, round_id, kickoff_time INTO v_matchday, v_round_id, v_kickoff
  FROM public.challenge_matches
  WHERE id = NEW.match_id;

  -- Lock validation
  IF v_kickoff < NOW() THEN
    RAISE EXCEPTION 'Match has already kicked off and is locked.';
  END IF;

  -- Ensure only 1 prediction per matchday per entry
  SELECT count(*) INTO v_existing_count
  FROM public.predictions p
  JOIN public.challenge_matches m ON p.match_id = m.id
  WHERE p.entry_id = NEW.entry_id 
    AND m.matchday = v_matchday 
    AND p.id <> NEW.id;

  IF v_existing_count > 0 THEN
    RAISE EXCEPTION 'You have already submitted a prediction for Matchday %.', v_matchday;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_check_one_prediction_per_matchday ON public.predictions;
CREATE TRIGGER trg_check_one_prediction_per_matchday
BEFORE INSERT OR UPDATE ON public.predictions
FOR EACH ROW
EXECUTE FUNCTION public.check_one_prediction_per_matchday();

-- 8b. REWRITE CREATE PAYOUT REQUEST ATOMIC
-- Enforce phone verification, KYC status, bank flag, suspended role, and risk scores at database level.
CREATE OR REPLACE FUNCTION public.create_payout_request_atomic(
  p_user_id UUID,
  p_amount INTEGER,
  p_bank_info JSONB
) RETURNS VOID AS $$
DECLARE
  v_wallet_id UUID;
  v_current_balance INTEGER;
  v_status TEXT;
  v_phone_verified BOOLEAN;
  v_identity_status TEXT;
  v_bank_account_flagged BOOLEAN;
  v_risk_score INTEGER;
BEGIN
  -- Fetch security profile indicators
  SELECT status, phone_verified, identity_status, bank_account_flagged, risk_score
  INTO v_status, v_phone_verified, v_identity_status, v_bank_account_flagged, v_risk_score
  FROM public.profiles
  WHERE id = p_user_id;

  IF v_status = 'suspended' THEN
    RAISE EXCEPTION 'Withdrawal blocked: User account is suspended.';
  END IF;
  
  IF v_phone_verified = FALSE OR v_phone_verified IS NULL THEN
    RAISE EXCEPTION 'Withdrawal blocked: Phone number is not verified.';
  END IF;
  
  IF v_identity_status <> 'verified' OR v_identity_status IS NULL THEN
    RAISE EXCEPTION 'Withdrawal blocked: KYC status is not verified.';
  END IF;
  
  IF v_bank_account_flagged = TRUE THEN
    RAISE EXCEPTION 'Withdrawal blocked: Bank account is flagged for duplication.';
  END IF;
  
  IF v_risk_score >= 70 THEN
    RAISE EXCEPTION 'Withdrawal blocked: Account flagged for security review (High Risk).';
  END IF;

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

-- 9. WALLET TRANSACTIONS MODIFICATIONS
ALTER TABLE public.wallet_transactions DROP CONSTRAINT IF EXISTS wallet_transactions_type_check;
ALTER TABLE public.wallet_transactions ADD CONSTRAINT wallet_transactions_type_check CHECK (type IN ('deposit', 'entry_fee', 'reward', 'referral_credit', 'withdrawal', 'reversal', 'refund'));

ALTER TABLE public.wallet_transactions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'rejected', 'reversed'));

ALTER TABLE public.wallet_transactions DROP CONSTRAINT IF EXISTS wallet_transactions_reference_key;
ALTER TABLE public.wallet_transactions ADD CONSTRAINT wallet_transactions_reference_key UNIQUE (reference);

-- 10. REWRITE ATOMIC ROUND WINNER SETTLEMENT
-- Winnings enter manual review queue first; do not credit wallet automatically.
ALTER TABLE public.winners ALTER COLUMN verified SET DEFAULT FALSE;

CREATE OR REPLACE FUNCTION public.settle_round_winner_atomic(
  p_entry_id UUID,
  p_admin_id UUID
) RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_round_id UUID;
  v_tier_id UUID;
  v_reward_amount INTEGER;
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
  SET is_winner = TRUE
  WHERE id = p_entry_id;

  -- 4. Create Winner Record (default verified = FALSE, placing it in review queue)
  INSERT INTO public.winners (user_id, round_id, payout_amount, verified)
  VALUES (v_user_id, v_round_id, v_reward_amount, FALSE);

  -- 5. Audit Log
  IF p_admin_id IS NOT NULL THEN
    INSERT INTO public.admin_audit_logs (admin_id, action, target_user_id, details)
    VALUES (p_admin_id, 'settle_winner_to_queue', v_user_id, jsonb_build_object('entry_id', p_entry_id, 'amount', v_reward_amount));
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. ATOMIC WINNER APPROVAL RPC
CREATE OR REPLACE FUNCTION public.approve_winner_atomic(
  p_winner_id UUID,
  p_admin_id UUID
) RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_round_id UUID;
  v_payout_amount INTEGER;
  v_verified BOOLEAN;
  v_wallet_id UUID;
BEGIN
  -- Get and lock winner request
  SELECT user_id, round_id, payout_amount, verified
  INTO v_user_id, v_round_id, v_payout_amount, v_verified
  FROM public.winners
  WHERE id = p_winner_id
  FOR UPDATE;

  IF v_verified THEN
    RETURN; -- Already verified/processed
  END IF;

  -- Mark Winner as Verified
  UPDATE public.winners
  SET verified = TRUE
  WHERE id = p_winner_id;

  -- Credit Wallet
  SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = v_user_id FOR UPDATE;
  IF v_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found for user';
  END IF;

  UPDATE public.wallets
  SET balance_ngn = balance_ngn + v_payout_amount
  WHERE id = v_wallet_id;

  -- Record Transaction as Confirmed
  INSERT INTO public.wallet_transactions (wallet_id, amount, type, reference, status)
  VALUES (v_wallet_id, v_payout_amount, 'reward', 'round_win_approved_' || v_winner_id, 'confirmed');

  -- Audit Log
  INSERT INTO public.admin_audit_logs (admin_id, action, target_user_id, details)
  VALUES (p_admin_id, 'approve_winner_payout', v_user_id, jsonb_build_object('winner_id', p_winner_id, 'amount', v_payout_amount));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. DYNAMIC REFERRAL REWARD EVALUATION RPC
CREATE OR REPLACE FUNCTION public.evaluate_referral_bonus(p_referred_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_referral_id UUID;
  v_referrer_id UUID;
  v_reward_id UUID;
  v_reward_amount INTEGER;
  v_referred_phone_verified BOOLEAN;
  v_referred_has_purchased BOOLEAN;
  v_referred_has_predictions BOOLEAN;
  v_referred_fraud_score INTEGER;
  v_referrer_fraud_score INTEGER;
  v_wallet_id UUID;
  v_is_paid BOOLEAN;
  v_referred_device TEXT;
  v_referrer_device TEXT;
  v_referred_ip TEXT;
  v_referrer_ip TEXT;
  v_referred_bank TEXT;
  v_referrer_bank TEXT;
BEGIN
  -- Find referral record
  SELECT r.id, r.referrer_id, rr.id, rr.amount, rr.is_paid
  INTO v_referral_id, v_referrer_id, v_reward_id, v_reward_amount, v_is_paid
  FROM public.referrals r
  JOIN public.referral_rewards rr ON r.id = rr.referral_id
  WHERE r.referred_user_id = p_referred_user_id;

  IF v_referral_id IS NULL OR v_is_paid THEN
    RETURN; -- No active unpaid referral found
  END IF;

  -- Fetch metadata for fraud evaluation
  SELECT phone_verified, risk_score, last_device_fingerprint, last_ip_address, bank_account_number
  INTO v_referred_phone_verified, v_referred_fraud_score, v_referred_device, v_referred_ip, v_referred_bank
  FROM public.profiles
  WHERE id = p_referred_user_id;

  SELECT risk_score, last_device_fingerprint, last_ip_address, bank_account_number
  INTO v_referrer_fraud_score, v_referrer_device, v_referrer_ip, v_referrer_bank
  FROM public.profiles
  WHERE id = v_referrer_id;

  -- Perform immediate self-referral / linked accounts validation
  IF (v_referred_device = v_referrer_device AND v_referred_device IS NOT NULL AND v_referred_device <> '') OR
     (v_referred_ip = v_referrer_ip AND v_referred_ip IS NOT NULL AND v_referred_ip <> '') OR
     (v_referred_bank = v_referrer_bank AND v_referred_bank IS NOT NULL AND v_referred_bank <> '') OR
     (p_referred_user_id = v_referrer_id) THEN
     
     -- Lock both profiles under review for referral fraud
     UPDATE public.profiles
     SET risk_score = GREATEST(risk_score, 90),
         status = 'under_review',
         bank_account_flagged = TRUE,
         bank_account_flagged_reason = 'Referral self-abuse or linked account overlap detected.'
     WHERE id IN (p_referred_user_id, v_referrer_id);
     
     RETURN;
  END IF;

  -- Check referee valid prediction day
  SELECT EXISTS (
    SELECT 1 FROM public.predictions p
    JOIN public.challenge_entries e ON p.entry_id = e.id
    WHERE e.user_id = p_referred_user_id AND p.is_locked = TRUE
  ) INTO v_referred_has_predictions;

  -- Check referee purchase
  SELECT EXISTS (
    SELECT 1 FROM public.account_purchases
    WHERE user_id = p_referred_user_id AND status = 'completed'
  ) INTO v_referred_has_purchased;

  -- Validate referral requirements
  IF v_referred_phone_verified AND 
     v_referred_has_purchased AND 
     v_referred_has_predictions AND 
     v_referred_fraud_score < 70 AND 
     v_referrer_fraud_score < 70 THEN
     
     -- Lock and update referrer wallet
     SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = v_referrer_id FOR UPDATE;
     
     IF v_wallet_id IS NOT NULL THEN
       -- Update status to paid/confirmed
       UPDATE public.referral_rewards SET is_paid = TRUE WHERE id = v_reward_id;
       UPDATE public.referrals SET status = 'qualified' WHERE id = v_referral_id;
       
       UPDATE public.wallets SET balance_ngn = balance_ngn + v_reward_amount WHERE id = v_wallet_id;
       
       -- Add confirmed transaction ledger
       INSERT INTO public.wallet_transactions (wallet_id, amount, type, reference, status)
       VALUES (v_wallet_id, v_reward_amount, 'referral_credit', 'referral_bonus_confirmed_' || p_referred_user_id, 'confirmed');
     END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. REWRITE PROCESS REFERRAL REWARD ATOMIC
-- Tracks referral bonus instantly but does not credit wallet instantly (is_paid = FALSE, status = 'joined').
-- Blocks self-referral and linked-account referral abuse.
CREATE OR REPLACE FUNCTION public.process_referral_reward_atomic(
  p_referrer_id UUID,
  p_referred_user_id UUID,
  p_referral_code TEXT,
  p_reward_amount INTEGER
) RETURNS VOID AS $$
DECLARE
  v_referral_id UUID;
  v_referred_device TEXT;
  v_referrer_device TEXT;
  v_referred_ip TEXT;
  v_referrer_ip TEXT;
  v_referred_bank TEXT;
  v_referrer_bank TEXT;
BEGIN
  -- 1. Double check idempotency
  SELECT id INTO v_referral_id 
  FROM public.referrals 
  WHERE referrer_id = p_referrer_id AND referred_user_id = p_referred_user_id;

  IF v_referral_id IS NOT NULL THEN
    RETURN; -- Already processed
  END IF;

  -- 2. Fetch metadata for immediate fraud abuse check
  SELECT last_device_fingerprint, last_ip_address, bank_account_number
  INTO v_referred_device, v_referred_ip, v_referred_bank
  FROM public.profiles
  WHERE id = p_referred_user_id;

  SELECT last_device_fingerprint, last_ip_address, bank_account_number
  INTO v_referrer_device, v_referrer_ip, v_referrer_bank
  FROM public.profiles
  WHERE id = p_referrer_id;

  -- Block self-referral or immediate linked account overlap
  IF (p_referred_user_id = p_referrer_id) OR
     (v_referred_device = v_referrer_device AND v_referred_device IS NOT NULL AND v_referred_device <> '') OR
     (v_referred_ip = v_referrer_ip AND v_referred_ip IS NOT NULL AND v_referred_ip <> '') OR
     (v_referred_bank = v_referrer_bank AND v_referred_bank IS NOT NULL AND v_referred_bank <> '') THEN
     
     -- Insert flagged referral record but do not allow qualification
     INSERT INTO public.referrals (referrer_id, referred_user_id, referral_code, status)
     VALUES (p_referrer_id, p_referred_user_id, p_referral_code, 'flagged')
     RETURNING id INTO v_referral_id;

     INSERT INTO public.referral_rewards (referral_id, amount, is_paid)
     VALUES (v_referral_id, p_reward_amount, FALSE);

     -- Flag profiles for referral abuse
     UPDATE public.profiles
     SET risk_score = GREATEST(risk_score, 90),
         status = 'under_review',
         bank_account_flagged = TRUE,
         bank_account_flagged_reason = 'Referral self-abuse or linked account overlap detected.'
     WHERE id IN (p_referred_user_id, p_referrer_id);

     RETURN;
  END IF;

  -- 3. Create normal Referral Record (default status = 'joined')
  INSERT INTO public.referrals (referrer_id, referred_user_id, referral_code, status)
  VALUES (p_referrer_id, p_referred_user_id, p_referral_code, 'joined')
  RETURNING id INTO v_referral_id;

  -- 4. Create Reward Record (is_paid = FALSE)
  INSERT INTO public.referral_rewards (referral_id, amount, is_paid)
  VALUES (v_referral_id, p_reward_amount, FALSE);

  -- 5. Trigger evaluation in case they already qualify (though unlikely at signup/first purchase)
  PERFORM public.evaluate_referral_bonus(p_referred_user_id);

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
