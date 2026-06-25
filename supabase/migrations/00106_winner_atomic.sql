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