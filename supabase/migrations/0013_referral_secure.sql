-- 12. DYNAMIC REFERRAL REWARD EVALUATION
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

-- 13. REWRITE PROCESS REFERRAL REWARD TRANSACTION
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
