-- 0004_atomic_operations.sql
-- Atomic RPCs to prevent data drift in wallet and winner flows

-- 1. Atomic Payout Request
CREATE OR REPLACE FUNCTION public.create_payout_request_atomic(
  p_user_id UUID,
  p_amount INTEGER,
  p_bank_info JSONB
) RETURNS VOID AS $$
DECLARE
  v_wallet_id UUID;
  v_current_balance INTEGER;
BEGIN
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

-- 2. Atomic Payout Resolution (Approval/Rejection)
CREATE OR REPLACE FUNCTION public.resolve_payout_request_atomic(
  p_request_id UUID,
  p_admin_id UUID,
  p_new_status TEXT, -- 'completed' or 'rejected'
  p_admin_notes TEXT
) RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_amount INTEGER;
  v_current_status TEXT;
  v_wallet_id UUID;
BEGIN
  -- 1. Get and lock request
  SELECT user_id, amount, status INTO v_user_id, v_amount, v_current_status
  FROM public.payout_requests
  WHERE id = p_request_id
  FOR UPDATE;

  IF v_current_status IS NULL THEN
    RAISE EXCEPTION 'Payout request % not found', p_request_id;
  END IF;

  IF v_current_status != 'pending' THEN
    RAISE EXCEPTION 'Request is already %', v_current_status;
  END IF;

  -- 2. Handle Rejection (Refund)
  IF p_new_status = 'rejected' THEN
    SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = v_user_id FOR UPDATE;
    
    UPDATE public.wallets
    SET balance_ngn = balance_ngn + v_amount
    WHERE id = v_wallet_id;

    INSERT INTO public.wallet_transactions (wallet_id, amount, type, reference)
    VALUES (v_wallet_id, v_amount, 'refund', 'payout_rejected_' || p_request_id);
  END IF;

  -- 3. Update Request Status
  UPDATE public.payout_requests
  SET status = p_new_status,
      admin_notes = p_admin_notes,
      processed_at = now()
  WHERE id = p_request_id;

  -- 4. Log Admin Action
  INSERT INTO public.admin_audit_logs (admin_id, action, target_user_id, details)
  VALUES (p_admin_id, 'payout_' || p_new_status, v_user_id, jsonb_build_object('request_id', p_request_id, 'amount', v_amount));

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Atomic Winner Settlement
CREATE OR REPLACE FUNCTION public.settle_round_winner_atomic(
  p_entry_id UUID,
  p_admin_id UUID
) RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_round_id UUID;
  v_tier_id UUID;
  v_reward_amount INTEGER;
  v_wallet_id UUID;
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
  SET is_winner = true
  WHERE id = p_entry_id;

  -- 4. Create Winner Record
  INSERT INTO public.winners (user_id, round_id, payout_amount)
  VALUES (v_user_id, v_round_id, v_reward_amount);

  -- 5. Credit Wallet
  SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = v_user_id FOR UPDATE;
  
  UPDATE public.wallets
  SET balance_ngn = balance_ngn + v_reward_amount
  WHERE id = v_wallet_id;

  -- 6. Record Transaction
  INSERT INTO public.wallet_transactions (wallet_id, amount, type, reference)
  VALUES (v_wallet_id, v_reward_amount, 'reward', 'round_win_' || v_round_id);

  -- 7. Audit Log
  IF p_admin_id IS NOT NULL THEN
    INSERT INTO public.admin_audit_logs (admin_id, action, target_user_id, details)
    VALUES (p_admin_id, 'settle_winner', v_user_id, jsonb_build_object('entry_id', p_entry_id, 'amount', v_reward_amount));
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
