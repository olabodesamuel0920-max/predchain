-- 0010_transaction_status.sql
-- Add status tracking to wallet transactions for better audit trails

ALTER TABLE public.wallet_transactions 
ADD COLUMN status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed'));

-- Update existing records to be 'completed'
UPDATE public.wallet_transactions SET status = 'completed' WHERE status IS NULL;
