import { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import DashboardMenu from './DashboardMenu';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role, username').eq('id', user?.id).single();

  return (
    <DashboardMenu profile={profile}>
      {children}
    </DashboardMenu>
  );
}
