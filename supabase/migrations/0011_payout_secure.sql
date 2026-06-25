-- 8b. REWRITE CREATE PAYOUT REQUEST TRANSACTION
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

-- 9. WALLET TRANSACTIONS MODIFICATIONS (Combined into a single statement to prevent prepared statement parser issues)
ALTER TABLE public.wallet_transactions 
  DROP CONSTRAINT IF EXISTS wallet_transactions_type_check,
  ADD CONSTRAINT wallet_transactions_type_check CHECK (type IN ('deposit', 'entry_fee', 'reward', 'referral_credit', 'withdrawal', 'reversal', 'refund')),
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'rejected', 'reversed')),
  DROP CONSTRAINT IF EXISTS wallet_transactions_reference_key,
  ADD CONSTRAINT wallet_transactions_reference_key UNIQUE (reference);
