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
