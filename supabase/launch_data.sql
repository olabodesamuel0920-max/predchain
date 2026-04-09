-- PREDCHAIN DAY 1 LAUNCH DATA
-- This script populates the platform with real live matches for the initial launch.

-- 1. Create Challenge Round 43 (The Launch Round)
-- Set it as 'active' so it shows up in "Live Challenges" immediately.
INSERT INTO public.challenge_rounds (id, round_number, start_date, end_date, status)
VALUES (
  'd43d43d4-43d4-43d4-43d4-43d443d443d4', 
  43, 
  NOW(), 
  NOW() + INTERVAL '7 days', 
  'active'
) ON CONFLICT (id) DO UPDATE SET status = 'active';

-- 2. Insert Live/Upcoming Matches for Round 43
-- Using stable hex UUIDs for consistency.
INSERT INTO public.challenge_matches (id, round_id, home_team, away_team, kickoff_time, status)
VALUES 
  -- Match 1: Arsenal vs Chelsea (Today)
  ('114343d4-43d4-43d4-43d4-43d443d443d1', 'd43d43d4-43d4-43d4-43d4-43d443d443d4', 'Arsenal', 'Chelsea', NOW() + INTERVAL '2 hours', 'scheduled'),
  
  -- Match 2: Man City vs Liverpool (Tomorrow)
  ('224343d4-43d4-43d4-43d4-43d443d443d2', 'd43d43d4-43d4-43d4-43d4-43d443d443d4', 'Man City', 'Liverpool', NOW() + INTERVAL '1 day', 'scheduled'),
  
  -- Match 3: Real Madrid vs Barcelona (Sunday)
  ('334343d4-43d4-43d4-43d4-43d443d443d3', 'd43d43d4-43d4-43d4-43d4-43d443d443d4', 'Real Madrid', 'Barcelona', NOW() + INTERVAL '3 days', 'scheduled')
ON CONFLICT (id) DO NOTHING;

-- 3. Update Platform Settings to reflect launch state
-- Our platform_settings table uses a key/value structure.
-- We ensure the key 'trust_stats_mode' is set to 'launch'.
INSERT INTO public.platform_settings (key, value, description)
VALUES (
  'trust_stats_mode', 
  '"launch"'::jsonb, 
  'Display mode for metrics: real or launch'
)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value,
    updated_at = NOW();

-- Ensure other critical settings exist
INSERT INTO public.platform_settings (key, value, description)
VALUES 
  ('maintenance_mode', 'false'::jsonb, 'Platform maintenance mode toggle'),
  ('referral_bonus', '1000'::jsonb, 'NGN bonus per referral')
ON CONFLICT (key) DO NOTHING;
