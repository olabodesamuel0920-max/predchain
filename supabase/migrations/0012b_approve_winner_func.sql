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
