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

  -- 7. Auto-Enroll in Active Round
  SELECT id INTO v_active_round_id
  FROM public.challenge_rounds
  WHERE status = 'active'
  LIMIT 1;

  IF v_active_round_id IS NOT NULL THEN
    INSERT INTO public.challenge_entries (user_id, round_id, tier_id, streak_count)
    VALUES (p_user_id, v_active_round_id, p_tier_id, 0);
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
