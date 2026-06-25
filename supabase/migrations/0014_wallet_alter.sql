-- 9. WALLET TRANSACTIONS MODIFICATIONS
ALTER TABLE public.wallet_transactions 
  DROP CONSTRAINT IF EXISTS wallet_transactions_type_check,
  ADD CONSTRAINT wallet_transactions_type_check CHECK (type IN ('deposit', 'entry_fee', 'reward', 'referral_credit', 'withdrawal', 'reversal', 'refund')),
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'rejected', 'reversed')),
  DROP CONSTRAINT IF EXISTS wallet_transactions_reference_key,
  ADD CONSTRAINT wallet_transactions_reference_key UNIQUE (reference);
