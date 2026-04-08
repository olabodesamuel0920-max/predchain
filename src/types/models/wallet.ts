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
  type: 'deposit' | 'withdrawal' | 'reward' | 'refund' | 'purchase' | 'referral_bonus' | 'admin_adjustment';
  status: 'pending' | 'completed' | 'failed';
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
