-- Fix: Ensure all users have wallets
INSERT INTO public.wallets (user_id, balance_ngn)
SELECT p.id, 0
FROM public.profiles p
LEFT JOIN public.wallets w ON p.id = w.user_id
WHERE w.id IS NULL;

-- Verification
SELECT count(*) as users_without_wallets
FROM public.profiles p
LEFT JOIN public.wallets w ON p.id = w.user_id
WHERE w.id IS NULL;
