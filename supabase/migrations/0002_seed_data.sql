-- 0002_seed_data.sql
-- Populate core data for PredChain

-- 1. ACCOUNT TIERS
INSERT INTO public.account_tiers (name, price_ngn, perks) VALUES
('Starter', 5000, '{"reward": "₦50,000", "predictions_per_round": 3, "referral_bonus": 1000}'::jsonb),
('Standard', 10000, '{"reward": "₦100,000", "predictions_per_round": 3, "referral_bonus": 1000, "priority": true}'::jsonb),
('Premium', 20000, '{"reward": "₦200,000", "predictions_per_round": 3, "referral_bonus": 1000, "priority": true, "elite_badge": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- 2. INITIAL CHALLENGE ROUND (Optional: User can create via Admin)
-- INSERT INTO public.challenge_rounds (round_number, start_date, end_date, status)
-- VALUES (42, now(), now() + interval '3 days', 'active');
