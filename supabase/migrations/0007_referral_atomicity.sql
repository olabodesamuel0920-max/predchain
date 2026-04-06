-- 0007_referral_atomicity.sql
-- Atomic RPC for referral rewards to prevent race conditions during multiple concurrent signups

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
  -- 1. Double check idempotency (Avoid duplicate referral records)
  SELECT id INTO v_referral_id 
  FROM public.referrals 
  WHERE referrer_id = p_referrer_id AND referred_user_id = p_referred_user_id;

  IF v_referral_id IS NOT NULL THEN
    RETURN; -- Already processed
  END IF;

  -- 2. Create Referral Record
  INSERT INTO public.referrals (referrer_id, referred_user_id, referral_code, status)
  VALUES (p_referrer_id, p_referred_user_id, p_referral_code, 'qualified')
  RETURNING id INTO v_referral_id;

  -- 3. Create Reward Record
  INSERT INTO public.referral_rewards (referral_id, amount, is_paid)
  VALUES (v_referral_id, p_reward_amount, true);

  -- 4. Credit Referrer Wallet (Lock row for update)
  SELECT id INTO v_wallet_id 
  FROM public.wallets 
  WHERE user_id = p_referrer_id 
  FOR UPDATE;

  IF v_wallet_id IS NOT NULL THEN
    UPDATE public.wallets
    SET balance_ngn = balance_ngn + p_reward_amount
    WHERE id = v_wallet_id;

    -- 5. Record Transaction
    INSERT INTO public.wallet_transactions (wallet_id, amount, type, reference)
    VALUES (v_wallet_id, p_reward_amount, 'reward', 'referral_bonus_' || p_referred_user_id);
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
