export interface AccountTier {
  id: string;
  name: string;
  price_ngn: number;
  description: string;
  is_active: boolean;
  perks: {
    reward: string;
    predictions_per_round: number;
    referral_bonus: number;
    priority?: boolean;
  };
}

export interface ChallengeRound {
  id: string;
  round_number: number;
  status: 'upcoming' | 'active' | 'completed';
  start_date: string;
  end_date: string;
}

export interface ChallengeMatch {
  id: string;
  round_id: string;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  kickoff_time: string;
  status: 'scheduled' | 'live' | 'finished';
}

export interface ChallengeEntry {
  id: string;
  user_id: string;
  round_id: string;
  tier_id: string;
  streak_count: number;
  is_winner: boolean;
  created_at: string;
}

export interface Prediction {
  id: string;
  entry_id: string;
  match_id: string;
  prediction: '1' | 'X' | '2';
  is_correct: boolean | null;
  is_locked: boolean;
  created_at: string;
}

export interface AccountPurchase {
  id: string;
  user_id: string;
  tier_id: string;
  amount_paid: number;
  payment_reference: string;
  provider_reference: string | null;
  status: string;
  verified_at: string | null;
  created_at: string;
}
