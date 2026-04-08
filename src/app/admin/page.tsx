import { createClient, createAdminClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import AdminClient from './admin-client';

export default async function AdminPage() {
  const supabase = await createClient();
  const adminClient = await createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login?error=Administrative+authentication+required&returnTo=/admin');
  }

  // IDENTITY RESOLVER: Use Admin Client to bypass RLS recursion
  const { data: profile, error } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    console.error('[ADMIN_AUTH_FAILURE]: Profile resolution failed.', { userId: user.id, error });
  }

  // Strict role enforcement
  if (profile?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030508]">
        <div className="absolute inset-0 bg-gold-glow blur-[140px] opacity-10 pointer-events-none" />
        <div className="flex flex-col items-center text-center gap-16 relative z-10 px-6 max-w-lg">
           <div className="w-24 h-24 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gold shadow-2xl">
              <Lock className="w-10 h-10" />
           </div>
           <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase font-display italic">Access <span className="text-gradient-gold">Restricted.</span></h2>
              <p className="text-secondary text-sm font-medium opacity-50 leading-relaxed max-w-sm mx-auto">
                Administrative privileges are required to access this terminal. If you believe this is an error, please contact the network supervisor.
              </p>
           </div>
           <Link href="/dashboard" className="btn btn-primary !px-12 !py-5 text-sm shadow-2xl group">
              <ArrowLeft className="w-4 h-4 mr-3 transition-transform group-hover:-translate-x-1" /> Return to Dashboard
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
