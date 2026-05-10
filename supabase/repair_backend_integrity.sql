-- PREDCHAIN BACKEND INTEGRITY REPAIR
-- Standardizes pricing and backfills missing user data

BEGIN;

-- 1. Patch platform_settings.tier_pricing
-- Aligns Premium tier to 20,000 NGN truth
UPDATE public.platform_settings
SET value = '{"starter": 5000, "standard": 10000, "premium": 20000}'::jsonb
WHERE key = 'tier_pricing';

-- 2. Backfill missing profiles for auth.users
-- This ensures all authenticated users have a corresponding profile row
-- Defaulting username to part of email + suffix if metadata is missing
INSERT INTO public.profiles (id, username, full_name, role)
SELECT 
    u.id, 
    COALESCE(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1) || '_' || substr(u.id::text, 1, 4)),
    COALESCE(u.raw_user_meta_data->>'full_name', 'Guest Player'),
    'user'
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 3. Backfill missing wallets for profiles
-- Ensures all profiles (new or legacy) have an initialized wallet
INSERT INTO public.wallets (user_id, balance_ngn)
SELECT p.id, 0
FROM public.profiles p
LEFT JOIN public.wallets w ON p.id = w.user_id
WHERE w.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- 4. Integrity Reporting
-- Select final state for confirmation
SELECT 
    (SELECT count(*) FROM auth.users) as total_auth_users,
    (SELECT count(*) FROM public.profiles) as total_profiles,
    (SELECT count(*) FROM public.wallets) as total_wallets,
    (SELECT value->>'premium' FROM public.platform_settings WHERE key = 'tier_pricing') as verified_premium_price,
    (SELECT count(*) FROM public.profiles WHERE role = 'admin') as active_admin_count;

COMMIT;
