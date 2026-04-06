import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import AdminClient from './admin-client';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?error=Admin+access+required&returnTo=/admin');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="absolute inset-0 bg-grad-aurora opacity-10 blur-[140px] pointer-events-none" />
        <div className="flex flex-col items-center text-center gap-24 relative z-10 px-6">
           <div className="w-20 h-20 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger">
              <ShieldCheck className="w-10 h-10" />
           </div>
           <div>
              <h2 className="font-display text-2xl font-black text-white uppercase italic tracking-tighter mb-8">Access Restricted</h2>
              <p className="text-muted text-xs font-black uppercase tracking-[0.2em] italic max-w-sm mx-auto leading-relaxed opacity-60">
                Administrative privileges are required to access this protocol node. Your attempt has been logged.
              </p>
           </div>
           <Link href="/dashboard" className="btn btn-primary px-10 py-5 text-sm font-black uppercase tracking-widest">
              Return to Command Center
           </Link>
        </div>
      </div>
    )
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
