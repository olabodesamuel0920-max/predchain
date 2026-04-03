-- 🚀 PREDCHAIN LAUNCH DATA: READY FOR LIVE ROUND
-- Run this in your Supabase SQL Editor to initialize the first professional round.

-- 1. Ensure Platform Settings are Production-Ready
UPDATE platform_settings SET 
  value = value || '{"maintenance_mode": false, "trust_stats_mode": "real", "announcement_banner": {"text": "Welcome to the new PredChain Platform! Join Round 42 now.", "active": true}}'::jsonb
WHERE id = (SELECT id FROM platform_settings LIMIT 1);

-- 2. Create the First Live Round (Round 42)
-- Using April 2nd, 2026 as the base start date.
INSERT INTO challenge_rounds (round_number, start_date, end_date, status)
VALUES (42, '2026-04-02 00:00:00+00', '2026-04-05 00:00:00+00', 'active')
ON CONFLICT (round_number) DO UPDATE 
SET status = 'active', start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date;

-- 3. Inject 3 Real Premier Matches
-- Match Data for the current round
-- Match 1: Day 1 (April 2)
-- Match 2: Day 2 (April 3)
-- Match 3: Day 3 (April 4)

DELETE FROM matches WHERE round_id = (SELECT id FROM challenge_rounds WHERE round_number = 42);

INSERT INTO matches (round_id, home_team, away_team, kickoff_time, day_number)
VALUES 
((SELECT id FROM challenge_rounds WHERE round_number = 42), 'Arsenal', 'Chelsea', '2026-04-02 20:00:00+00', 1),
((SELECT id FROM challenge_rounds WHERE round_number = 42), 'Man City', 'Liverpool', '2026-04-03 20:00:00+00', 2),
((SELECT id FROM challenge_rounds WHERE round_number = 42), 'Tottenham', 'Man Utd', '2026-04-04 20:00:00+00', 3);

-- 🔏 DONE: PREDCHAIN IS READY FOR USER ONBOARDING.
