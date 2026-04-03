export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'under_review' | 'demo' | 'test';

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  status: UserStatus;
  email: string | null;
  is_demo: boolean;
  is_verified: boolean;
  is_suspended: boolean;
  admin_notes: string | null;
  phone: string | null;
  phone_verified: boolean;
  referral_count: number;
  created_at: string;
}

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

export interface Wallet {
  id: string;
  user_id: string;
  balance_ngn: number;
  updated_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'reward' | 'refund' | 'admin_adjustment';
  reference: string;
  created_at: string;
}

export interface BankInfo {
  bank: string;
  account: string;
  name: string;
}

export interface PayoutRequest {
  id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  bank_account_info: BankInfo;
  admin_notes: string | null;
  is_flagged: boolean;
  flagging_reason: string | null;
  processed_at: string | null;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: string;
  internal_notes: string | null;
  created_at: string;
}

export interface AdminLedgerEntry {
  id: string;
  admin_id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit' | 'refund';
  reason: string;
  created_at: string;
}

export interface AdminSearchProfile extends Profile {
  wallets: { balance_ngn: number }[];
}

export interface SupportTicketWithProfile extends SupportTicket {
  profiles?: {
    username: string;
    email: string;
  };
}

export interface AdminLedgerEntryWithProfile extends AdminLedgerEntry {
  profiles?: {
    username: string;
  };
}

export interface FullUserDetails {
  profile: Profile | null;
  wallet: Wallet | null;
  purchases: (AccountPurchase & { account_tiers: AccountTier | null })[];
  entries: (ChallengeEntry & { 
    challenge_rounds: ChallengeRound | null, 
    account_tiers: AccountTier | null 
  })[];
  referrals: (Referral & { 
    profiles: { username: string } | null 
  })[];
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

export interface Referral {
  id: string;
  referrer_id: string;
  referred_user_id: string;
  referral_code: string;
  status: 'joined' | 'qualified';
  created_at: string;
}

export interface PlatformStats {
  activeChallengers: number;
  roundsCompleted: number;
  perfectStreaks: number;
  totalCashPaid: number;
}

export interface HomeMatch {
  id: number;
  day: string;
  match: string;
  status: 'correct' | 'open' | 'pending' | 'locked';
  time: string;
  pick: string | null;
}

export interface PlatformSettings {
  maintenance_mode: boolean;
  referral_bonus: number;
  announcement_banner: {
    text: string;
    active: boolean;
  };
  trust_stats_mode: 'real' | 'launch' | 'hidden';
  tier_pricing: Record<string, number>;
}
