import { createClient, createAdminClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';
import { Profile } from '@/types';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const supabase = await createClient();
  const adminClient = await createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user session is found, we redirect to login but preserve the returnTo location.
  if (!user) {
    return redirect('/login?error=Session+authentication+required&returnTo=/dashboard/settings');
  }

  // Fetch the user's protocol profile using Admin Override (Bypass RLS)
  const { data: profile } = await adminClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // If profile is missing, we don't kick them out immediately. 
  // We provide a fallback identity so the account center remains accessible for recovery/support.
  const fallbackProfile: Partial<Profile> = {
    id: user.id,
    full_name: 'Protocol Member',
    username: user.email?.split('@')[0] || 'member',
    email: user.email || '',
    role: 'user', // Match UserRole type
    status: 'active',
    created_at: user.created_at
  };

  const enrichedProfile: Profile = {
    ...(profile || fallbackProfile),
    email: user.email || (profile as Profile)?.email || 'not available',
    status: (profile as Profile)?.status || 'active',
  } as Profile;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar">
      <SettingsClient profile={enrichedProfile} />
    </div>
  );
}
