import { Profile } from '../models/user';
import { SupportTicket } from '../models/platform';

export interface AdminSearchProfile extends Profile {
  wallets: { balance_ngn: number }[];
}

export interface SupportTicketWithProfile extends SupportTicket {
  profiles?: {
    username: string;
    email: string;
  };
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

export interface AdminLedgerEntryWithProfile extends AdminLedgerEntry {
  profiles?: {
    username: string;
  };
}
