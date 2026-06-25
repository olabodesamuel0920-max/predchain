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
