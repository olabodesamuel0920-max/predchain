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
  identity_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  identity_legal_name: string | null;
  identity_dob: string | null;
  identity_type: string | null;
  identity_number: string | null;
  identity_notes: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  bank_account_flagged: boolean;
  bank_account_flagged_reason: string | null;
  last_device_fingerprint: string | null;
  last_ip_address: string | null;
  risk_score: number;
}
