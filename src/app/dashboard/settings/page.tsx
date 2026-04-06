import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';
import { Profile } from '@/types';

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return redirect('/login');
  }

  // Inject email from user object as it's more reliable than profile table for auth info
  const enrichedProfile: Profile = {
    ...profile,
    email: user.email || (profile as any).email || 'not available',
    status: (profile as any).status || 'active',
  } as Profile;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar">
      <SettingsClient profile={enrichedProfile} />
    </div>
  );
}
