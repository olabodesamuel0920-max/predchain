import { ReactNode } from 'react';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import DashboardMenu from './DashboardMenu';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const adminClient = await createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect(`/login?returnTo=/dashboard`);
  }

  // Fetch full rich profile using Master Override (Bypass RLS)
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role, username, full_name, status, phone')
    .eq('id', user.id)
    .single();

  // Unified Identity Resolver Data
  const enrichedProfile = {
    ...profile,
    email: user.email,
    id: user.id
  };

  return (
    <DashboardMenu profile={enrichedProfile}>
      {children}
    </DashboardMenu>
  );
}
