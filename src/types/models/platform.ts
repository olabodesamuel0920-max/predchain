import { Profile } from './user';
import { AccountTier, ChallengeEntry, ChallengeRound, AccountPurchase } from './challenge';
import { Wallet, PayoutRequest } from './wallet';

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

export interface Referral {
  id: string;
  referrer_id: string;
  referred_user_id: string;
  referral_code: string;
  status: 'joined' | 'qualified';
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
