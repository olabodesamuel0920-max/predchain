import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminClient from './admin-client';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && user.email !== 'olabodesamuel0920@gmail.com') {
    redirect('/dashboard');
  }

  // Fetch Admin Data
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { data: recentPurchases } = await supabase.from('account_purchases').select('amount:amount_paid, created_at, profiles(username, full_name)').order('created_at', { ascending: false }).limit(5);
  const { data: activeRounds } = await supabase.from('challenge_rounds').select('*').order('round_number', { ascending: false });
  const { data: pendingPayouts } = await supabase.from('payout_requests').select('*, profiles(username)').eq('status', 'pending');
  const { data: allMatches } = await supabase.from('challenge_matches').select('*, challenge_rounds!round_id(round_number)').order('kickoff_time', { ascending: false });

  // Revenue calculation
  const { data: purchases } = await supabase.from('account_purchases').select('amount_paid');
  const totalRevenue = purchases?.reduce((acc, curr) => acc + curr.amount_paid, 0) || 0;

  return (
    <AdminClient 
      initialMetrics={{
        totalUsers: userCount || 0,
        totalRevenue: totalRevenue,
        pendingPayouts: pendingPayouts?.length || 0
      }}
      rounds={activeRounds || []}
      matches={allMatches || []}
      recentPurchases={(recentPurchases || []) as any[]}
      payoutRequests={pendingPayouts || []}
    />
  );
}
