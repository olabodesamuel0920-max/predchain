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
