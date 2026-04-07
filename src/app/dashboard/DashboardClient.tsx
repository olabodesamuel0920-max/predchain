'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Layout, 
  Zap, 
  Wallet as WalletIcon, 
  Users, 
  LogOut, 
  ChevronRight, 
  Check, 
  AlertCircle, 
  TrendingUp, 
  ShieldCheck, 
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowUpLeft,
  ShieldAlert,
  Globe,
  Radio,
  Trophy,
  ArrowRight,
  History,
  Lock,
  Target,
  Settings
} from 'lucide-react';
import { submitPrediction } from '@/app/actions/predictions';
import { requestPayout } from '@/app/actions/wallet';
import { initializeWalletFunding } from '@/app/actions/paystack';
import { Profile, ChallengeRound, ChallengeMatch, ChallengeEntry, Prediction, Transaction, Wallet, PayoutRequest, AccountPurchase, AccountTier } from '@/types';
import { useFeedback } from '@/hooks/useFeedback';
import { logout } from '@/app/actions/auth';

interface DashboardClientProps {
  user: { id: string; email?: string };
  profile: Profile;
  wallet: Wallet | null;
  activeRound: ChallengeRound | null;
  matches: ChallengeMatch[];
  userEntry: ChallengeEntry | null;
  predictions: Prediction[];
  transactions: Transaction[];
  payoutRequests: PayoutRequest[];
  purchases: AccountPurchase[];
  tiers: AccountTier[];
}

export default function DashboardClient({ 
  user, 
  profile, 
  wallet, 
  activeRound, 
  matches, 
  userEntry,
  predictions,
  transactions,
  payoutRequests,
  purchases,
  tiers
}: DashboardClientProps) {
  const { success: successMsg, error: errorMsg, showSuccess, showError, clear } = useFeedback(5000);
  const [activeTab, setActiveTab] = useState<'overview' | 'challenge' | 'wallet' | 'referrals'>('overview');
  const [walletSubTab, setWalletSubTab] = useState<'transactions' | 'purchases' | 'payouts'>('transactions');
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const [payoutAmount, setPayoutAmount] = useState('');
  const [bankInfo, setBankInfo] = useState({ bank: '', account: '', name: '' });

  const pendingPayouts = payoutRequests.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0);
  const txWithdrawn = transactions.filter(t => t.type === 'withdrawal').reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const txRewards = transactions.filter(t => t.type === 'reward').reduce((acc, t) => acc + t.amount, 0);
  const txReferrals = transactions.filter(t => t.type === 'referral_bonus').reduce((acc, t) => acc + t.amount, 0);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'challenge', 'wallet', 'referrals'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }

    const successParam = searchParams.get('success');
    const errorParam = searchParams.get('error');
    if (successParam) {
      showSuccess(decodeURIComponent(successParam));
    } else if (errorParam) {
      showError(decodeURIComponent(errorParam));
    }
  }, [searchParams, showSuccess, showError]);

  const displayName = profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'Account';
  const balance = wallet?.balance_ngn || 0;
  const streak = userEntry?.streak_count || 0;
  const currentTier = tiers.find(t => t.id === userEntry?.tier_id);

  const handlePrediction = async (match_id: string, choice: '1' | 'X' | '2') => {
    if (!userEntry) {
      showError('No active node authorization found.');
      return;
    }
    
    const formData = new FormData();
    formData.append('matchId', match_id);
    formData.append('entryId', userEntry.id);
    formData.append('prediction', choice);

    startTransition(async () => {
      try {
        await submitPrediction(formData);
        showSuccess('Aura pick synchronized successfully.');
      } catch (err: any) {
        showError(err.message || 'Pick synchronization failed.');
      }
    });
  };

  const handlePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(payoutAmount) < 1000) {
      showError('Minimum payout threshold is ₦1,000.');
      return;
    }
    startTransition(async () => {
      try {
        await requestPayout(Number(payoutAmount), bankInfo);
        showSuccess('Withdrawal protocol initialized.');
        setPayoutAmount('');
      } catch (err: any) {
        showError(err.message || 'Withdrawal transmission error.');
      }
    });
  };

  const handleTopUp = async (amount: number) => {
    startTransition(async () => {
      try {
        const result = await initializeWalletFunding(amount);
        if (result.authorization_url) {
          window.location.href = result.authorization_url;
        }
      } catch (err: any) {
        showError(err.message || 'Funding protocol error.');
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-primary pt-32 pb-24 md:pt-40">
      {/* Cinematic Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-full h-[600px] bg-grad-glow opacity-20 blur-[140px]" />
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-electric/5 blur-[100px] rounded-full" />
      </div>

      <div className="container relative z-10">
        
        {/* Elite Hub Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-slide-up">
          <div className="flex flex-col gap-5">
            <div className="badge-elite !text-gold !px-4 !py-1 !text-[9px] border-gold/10">IDENTITY VERIFIED</div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
              Elite <span className="text-gradient-gold">Dashboard.</span>
            </h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-gold text-xs font-black shadow-inner">
                    {displayName.charAt(0).toUpperCase()}
                 </div>
                 <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em] opacity-30 italic">ID: {user.id.slice(0, 8)}</span>
              </div>
              <div className="w-px h-3 bg-white/10 hidden md:block" />
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                 <span className="text-[9px] font-black text-muted uppercase tracking-[0.25em] opacity-30 italic">Server Status: 100%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <Link href="/dashboard/settings" className="btn btn-ghost !px-6 !py-3 !rounded-xl group !border-white/5">
                <Settings className="w-3.5 h-3.5 mr-2 group-hover:rotate-45 transition-transform" /> 
                <span className="text-[10px] font-black uppercase tracking-widest italic">Config</span>
             </Link>
             <button onClick={() => logout()} className="btn btn-ghost !px-6 !py-3 !rounded-xl border-white/5 text-muted hover:text-danger hover:border-danger/20">
                <LogOut className="w-3.5 h-3.5 mr-2" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">Terminate</span>
             </button>
          </div>
        </div>

        {/* Global Analytics Row: High-Density Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {[
            { label: 'Available Hub', val: `₦${balance.toLocaleString()}`, icon: <WalletIcon className="w-4 h-4" />, color: 'var(--gold)' },
            { label: 'Plan Cluster', val: currentTier?.name || 'Inert', icon: <Zap className="w-4 h-4" />, color: 'var(--blue-electric)' },
            { label: 'Cycle Integrity', val: userEntry ? `${streak}/3` : '0/3', icon: <ShieldCheck className="w-4 h-4" />, color: '#FFF' },
            { label: 'Reward Volume', val: `₦${txRewards.toLocaleString()}`, icon: <TrendingUp className="w-4 h-4" />, color: 'var(--success)' },
          ].map((m, i) => (
            <div key={i} className="card-elite !p-6 md:p-8 border-white/5 shadow-2xl hover:border-white/10 transition-all duration-500 overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">{m.icon}</div>
               <div className="flex flex-col gap-4 relative z-10">
                  <div className="flex items-center gap-2 text-muted/30">
                     <span className="text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-40">{m.label}</span>
                  </div>
                  <div className="text-xl md:text-3xl font-black text-white italic tracking-tighter">
                     {m.val}
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-12 overflow-x-auto no-scrollbar pb-2 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            {[
              { id: 'overview',  label: 'Overview',  icon: Layout },
              { id: 'challenge', label: 'Arena',     icon: Zap },
              { id: 'wallet',    label: 'Balance',   icon: WalletIcon },
              { id: 'referrals', label: 'Network',   icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-6 py-2.5 rounded-xl transition-all border whitespace-nowrap group ${
                  activeTab === tab.id 
                  ? 'bg-white/[0.04] border-white/10 text-white shadow-xl' 
                  : 'bg-transparent border-transparent text-muted hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                 <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-gold' : 'opacity-20 group-hover:opacity-100'} transition-all`} />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{tab.label}</span>
              </button>
            ))}
        </div>

        {/* Tab Content Rendering */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
              <div className="lg:col-span-8 flex flex-col gap-8">
                 <div className="card-elite !p-10 md:p-14 border-white/5 !bg-black/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-16 opacity-[0.01] group-hover:opacity-[0.03] -rotate-12 transition-opacity pointer-events-none"><Activity className="w-64 h-64" /></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-10">
                       <div className="max-w-md">
                          <div className="badge-elite !text-gold mb-8 italic border-gold/10">Cycle Performance Monitor</div>
                          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 italic">Picks <span className="text-gradient-gold">Progress.</span></h2>
                          <p className="text-muted text-[11px] md:text-xs font-bold opacity-30 uppercase tracking-[0.25em] leading-relaxed mb-10 italic">
                             {userEntry ? `Tier ${currentTier?.name} Cluster active. Maintain peak sequence integrity to secure verified ${currentTier?.price_ngn ? '₦' + (currentTier.price_ngn * 10).toLocaleString() : '10X'} yield.` : 'Cluster inactive. Synchronize your operator plan to access the live prediction arena.'}
                          </p>
                          <Link href={userEntry ? "/dashboard?tab=challenge" : "/accounts"} className="btn btn-primary !px-10 rounded-xl !py-4 font-black shadow-2xl flex items-center justify-center w-full md:w-fit italic">
                             {userEntry ? 'Active Arena' : 'Activate Cluster'} <ArrowRight className="w-4 h-4 ml-3" />
                          </Link>
                       </div>
                       <div className="w-full md:w-56 shrink-0 text-center flex flex-col gap-6">
                          <div className="relative w-36 h-36 mx-auto">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="72" cy="72" r="66" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                              <circle cx="72" cy="72" r="66" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gold shadow-glow-gold transition-all duration-1000" strokeDasharray="414.69" strokeDashoffset={414.69 - (414.69 * (streak / 3))} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-4xl font-black text-white italic tracking-tighter">{streak}/3</span>
                              <span className="text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-30 mt-1 italic">Verified</span>
                            </div>
                          </div>
                          <span className="text-[9px] font-black text-gold uppercase tracking-[0.4em] opacity-30 italic">Integrity Secure</span>
                       </div>
                    </div>
                 </div>

                 {/* Recent Activity */}
                 <div className="card-elite !p-10 border-white/5 bg-black/20 overflow-hidden relative group">
                    <div className="flex items-center justify-between mb-10">
                       <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic flex items-center gap-3">
                          <History className="w-4 h-4 text-gold opacity-30" /> System Ledger Feed
                       </span>
                       <button onClick={() => { setActiveTab('wallet'); setWalletSubTab('transactions'); }} className="text-[9px] font-black text-gold/40 uppercase tracking-[0.3em] hover:text-gold transition-colors italic">View Entire Feed</button>
                    </div>
                    <div className="flex flex-col gap-2">
                       {transactions.length === 0 ? (
                        <div className="py-20 border border-dashed border-white/5 rounded-2xl flex flex-col items-center gap-6 opacity-20 text-center">
                           <AlertCircle className="w-10 h-10" />
                           <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">No activity detected</span>
                        </div>
                       ) : (
                        transactions.slice(0, 5).map(tx => (
                          <div key={tx.id} className="p-5 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between group/tx hover:bg-white/[0.03] transition-all">
                             <div className="flex items-center gap-5 text-left">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-inner ${tx.amount > 0 ? 'bg-success/5 text-success border border-success/10' : 'bg-white/[0.03] text-white/40 border border-white/5'}`}>
                                   {tx.type === 'reward' ? <Trophy className="w-4 h-4" /> : <WalletIcon className="w-4 h-4" />}
                                </div>
                                <div className="flex flex-col gap-1">
                                   <span className="text-[11px] font-black text-white uppercase tracking-tight italic">{tx.type.split('_').join(' ')}</span>
                                   <span className="text-[8px] font-black text-muted uppercase tracking-[0.2em] opacity-20 italic">{new Date(tx.created_at).toLocaleDateString()} — {tx.reference.slice(0,8)}</span>
                                </div>
                             </div>
                             <div className="flex flex-col items-end gap-1.5">
                                <span className={`text-lg font-black italic tracking-tighter ${tx.amount > 0 ? 'text-success' : 'text-white/40'}`}>
                                   {tx.amount > 0 ? '+' : ''}₦{Math.abs(tx.amount).toLocaleString()}
                                </span>
                             </div>
                          </div>
                        ))
                       )}
                    </div>
                 </div>
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-4 flex flex-col gap-10">
                 <div className="card-elite !p-12 border-blue-electric/10 bg-blue-electric/[0.01] overflow-hidden group">
                    <div className="flex items-center gap-4 mb-10 text-blue-electric/40">
                       <TrendingUp className="w-6 h-6" />
                       <span className="text-[11px] font-bold uppercase tracking-[0.4em]">Integrity Vector</span>
                    </div>
                    <div className="flex items-end gap-3 h-28 mb-8">
                       {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                         <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group/bar hover:bg-blue-electric/5 transition-all">
                            <div className="absolute bottom-0 w-full bg-blue-electric/20 rounded-t-lg transition-all duration-1000" style={{ height: `${h}%` }} />
                            <div className="absolute bottom-0 w-full bg-blue-electric opacity-0 group-hover/bar:opacity-100 transition-all cursor-crosshair" style={{ height: `${h}%` }} />
                         </div>
                       ))}
                    </div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] opacity-20 italic">Live streak probability and node synchronization metrics active.</p>
                 </div>

                 <div className="card-elite !p-10 border-white/5 flex flex-col gap-8 opacity-60">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-[0.5em] opacity-40 italic">Global Rankings</span>
                    <div className="flex flex-col gap-4">
                       {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                           <div className="w-6 h-6 rounded bg-white/5 text-[9px] font-bold flex items-center justify-center">#{i}</div>
                           <div className="flex-1 h-2 bg-white/5 rounded-full" />
                           <div className="w-12 h-2 bg-gold/10 rounded-full" />
                        </div>
                       ))}
                    </div>
                    <Link href="/leaderboard" className="btn btn-ghost w-full rounded-full text-[10px] uppercase font-bold tracking-widest">Explore Arena</Link>
                 </div>
              </div>
            </div>
          )}

          {/* CHALLENGE TAB */}
          {activeTab === 'challenge' && (
            <div className="flex flex-col gap-8 md:gap-10">
               <div className="card-elite !p-10 flex flex-col md:flex-row justify-between items-center gap-10 border-white/5 bg-black/40">
                  <div className="flex items-center gap-6 text-left">
                     <div className="p-4 bg-blue-electric/10 rounded-xl border border-blue-electric/20 shadow-glow-blue"><Radio className="w-5 h-5 text-blue-electric animate-pulse" /></div>
                     <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">Arena Linked</h3>
                        <p className="text-muted text-[9px] font-black uppercase tracking-[0.3em] opacity-30 italic">Round {activeRound?.round_number || 'X'} — Cycle Synchronization Verified</p>
                     </div>
                  </div>
                  <div className="px-8 py-4 bg-black/40 border border-white/5 rounded-2xl text-center min-w-[200px] shadow-inner">
                     <div className="text-[8px] text-muted font-black uppercase mb-1 tracking-[0.4em] opacity-20 italic">Closing Time</div>
                     <div className="text-xl font-black text-white tracking-[0.1em] italic">{activeRound?.end_date ? new Date(activeRound.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'OFFLINE'}</div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {matches.length === 0 ? (
                    <div className="col-span-full py-40 text-center card-elite border-dashed border-white/5 opacity-20 flex flex-col items-center gap-6">
                       <Zap className="w-12 h-12 animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">No arena matches detected</span>
                    </div>
                  ) : (
                    matches.map(m => {
                      const pred = predictions.find(p => p.match_id === m.id);
                      return (
                        <div key={m.id} className="card-elite !p-8 flex flex-col gap-10 hover:border-gold/20 transition-all group/match border-white/5 relative overflow-hidden bg-white/[0.01]">
                           <div className="flex justify-between items-center relative z-10">
                              <span className="text-[9px] font-black text-muted opacity-30 uppercase tracking-[0.2em] italic">{new Date(m.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <div className={`badge-elite !py-1 !px-4 ${pred ? '!text-success border-success/10 !bg-success/5' : '!text-muted border-white/5'} shadow-inner italic`}>
                                {pred ? 'SYNCED' : 'PENDING'}
                              </div>
                           </div>
                           <div className="flex flex-col gap-4 text-center relative z-10">
                              <div className="text-base md:text-lg font-black text-white uppercase tracking-tighter group-hover/match:text-gold transition-colors italic leading-tight">{m.home_team}</div>
                              <div className="text-[8px] font-black text-muted/20 uppercase tracking-[0.5em] italic">VS</div>
                              <div className="text-base md:text-lg font-black text-white uppercase tracking-tighter group-hover/match:text-gold transition-colors italic leading-tight">{m.away_team}</div>
                           </div>
                           <div className="grid grid-cols-3 gap-2.5 relative z-10">
                              {['1', 'X', '2'].map(choice => (
                                 <button 
                                   key={choice}
                                   onClick={() => handlePrediction(m.id, choice as '1' | 'X' | '2')}
                                   disabled={isPending || !!pred || !userEntry}
                                   className={`py-4 rounded-xl text-[10px] font-black transition-all border uppercase tracking-[0.3em] italic ${
                                     pred?.prediction === choice 
                                     ? 'bg-gold text-black border-gold shadow-glow-gold scale-105' 
                                     : 'bg-white/[0.02] border-white/5 text-muted hover:text-white hover:border-gold/30 hover:bg-gold/5'
                                   }`}
                                 >
                                   {choice}
                                 </button>
                              ))}
                           </div>
                        </div>
                      );
                    })
                  )}
               </div>
            </div>
          )}

          {/* WALLET/CONSOLE TAB */}
          {activeTab === 'wallet' && (
            <div className="flex flex-col gap-10">
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { label: 'Asset Balance', val: balance, icon: WalletIcon, color: 'text-gold' },
                    { label: 'Total Settle', val: txWithdrawn, icon: ArrowUpLeft, color: 'text-success' },
                    { label: 'Yield Volume', val: txRewards, icon: Trophy, color: 'text-blue-electric' },
                    { label: 'Queue Lock', val: pendingPayouts, icon: Lock, color: 'text-muted' },
                  ].map((k, i) => (
                    <div key={i} className="card-elite !p-6 md:p-8 flex flex-col gap-6 group hover:border-white/10 transition-all border-white/5 bg-black/40">
                       <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none"><k.icon className="w-8 h-8" /></div>
                       <div className="flex flex-col gap-2 relative z-10">
                          <span className="text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-30 italic leading-none">{k.label}</span>
                          <span className="text-xl md:text-2xl font-black text-white italic tracking-tighter">₦{k.val.toLocaleString()}</span>
                       </div>
                    </div>
                  ))}
               </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">
                  {/* Ledger Section */}
                  <div className="lg:col-span-8 flex flex-col gap-8">
                     <div className="card-elite !p-0 overflow-hidden border-white/5 bg-black/40">
                        <div className="px-8 py-6 bg-white/[0.02] border-b border-white/5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                           <span className="text-[10px] font-black text-white uppercase tracking-widest italic flex items-center gap-3 opacity-60"><History className="w-4 h-4 text-gold opacity-50" /> System Ledger</span>
                           <div className="flex bg-black/40 border border-white/5 rounded-xl p-1 gap-1">
                              {['transactions', 'purchases', 'payouts'].map(id => (
                                <button 
                                  key={id} 
                                  onClick={() => setWalletSubTab(id as any)} 
                                  className={`px-5 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all italic ${walletSubTab === id ? 'bg-white/10 text-white' : 'text-muted/40 hover:text-white'}`}
                                >
                                  {id}
                                </button>
                              ))}
                           </div>
                        </div>
                        <div className="flex flex-col divide-y divide-white/5">
                           {walletSubTab === 'transactions' && (
                             transactions.length === 0 ? (
                              <div className="py-32 text-center opacity-20 flex flex-col items-center gap-6">
                                 <History className="w-12 h-12" />
                                 <span className="text-[9px] font-black uppercase tracking-[0.5em] italic">Ledger Empty</span>
                              </div>
                             ) : (
                                transactions.map(tx => (
                                 <div key={tx.id} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-8 group/tx hover:bg-white/[0.01] transition-all">
                                    <div className="flex items-center gap-6 text-left">
                                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${tx.amount > 0 ? 'bg-success/5 text-success border border-success/10' : 'bg-white/[0.03] text-white/40 border border-white/5'}`}>
                                          {tx.amount > 0 ? <ArrowUpLeft className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                                       </div>
                                       <div className="flex flex-col gap-1">
                                          <span className="text-[11px] font-black text-white uppercase tracking-tight italic">{tx.type.split('_').join(' ')}</span>
                                          <span className="text-[8px] font-black text-muted opacity-20 uppercase tracking-widest italic">{tx.reference.slice(0, 12)} — {new Date(tx.created_at).toLocaleDateString()}</span>
                                       </div>
                                    </div>
                                    <div className="text-xl font-black italic tracking-tighter text-white">₦{Math.abs(tx.amount).toLocaleString()}</div>
                                 </div>
                                ))
                             )
                           )}
                           {walletSubTab !== 'transactions' && (
                             <div className="py-32 text-center opacity-10 flex flex-col items-center gap-6">
                                <Lock className="w-12 h-12" />
                                <span className="text-[9px] font-black uppercase tracking-[0.5em] italic">Protocol Locked</span>
                             </div>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Actions Section */}
                  <div className="lg:col-span-4 flex flex-col gap-8">
                     <div className="card-elite !p-10 border-blue-electric/10 bg-blue-electric/[0.02]">
                        <h4 className="text-[9px] font-black text-muted uppercase tracking-[0.4em] mb-8 opacity-40 italic">Initialize Funding</h4>
                        <div className="grid grid-cols-2 gap-3 mb-8">
                           {[5000, 10000, 25000, 50000].map(amt => (
                             <button key={amt} onClick={() => handleTopUp(amt)} className="py-3.5 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-black text-white hover:bg-gold hover:text-black hover:border-gold transition-all uppercase tracking-widest italic shadow-inner">+ ₦{amt.toLocaleString()}</button>
                           ))}
                        </div>
                        <p className="text-[8px] font-black text-muted uppercase leading-relaxed opacity-20 tracking-[0.2em] italic">Direct funding protocol through Paystack Gateway secured.</p>
                     </div>

                     <div className="card-elite !p-10 border-white/5 bg-black/40">
                        <h4 className="text-[9px] font-black text-muted uppercase tracking-[0.4em] mb-8 opacity-40 italic">Payout Transmission</h4>
                        <form onSubmit={handlePayout} className="flex flex-col gap-6">
                           <div className="flex flex-col gap-3">
                              <span className="text-[8px] font-black text-muted uppercase tracking-[0.3em] opacity-20 ml-1">Volume Analysis</span>
                              <input type="number" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} placeholder="₦0.00" className="w-full bg-black/40 border border-white/5 rounded-xl px-6 py-5 text-white text-2xl font-black italic tracking-tighter focus:border-gold/30 outline-none shadow-inner" required />
                           </div>
                           <button disabled={isPending || balance < 1000} type="submit" className="btn btn-primary w-full py-4 rounded-xl font-black uppercase tracking-widest text-[11px] italic shadow-2xl">{isPending ? "TRANSMITTING..." : "SETTLE VOLUME"}</button>
                        </form>
                        <p className="mt-6 text-[8px] text-muted font-black text-center uppercase opacity-20 italic tracking-[0.2em]">Automated settlement processed 24/7.</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* REFERRAL TAB */}
          {activeTab === 'referrals' && (
            <div className="flex flex-col gap-10 animate-slide-up">
               <div className="card-elite !p-12 md:p-16 flex flex-col md:flex-row justify-between items-center gap-12 relative overflow-hidden bg-black/40 border-white/5">
                  <div className="absolute top-0 right-0 p-20 opacity-[0.01] -rotate-12 pointer-events-none"><Globe className="w-64 h-64" /></div>
                  <div className="flex-1 relative z-10 text-center md:text-left">
                     <div className="badge-elite !bg-white/[0.03] !text-gold mb-8 border-gold/10 !px-5 !py-1.5 italic">NETWORK GROWTH PROTOCOL</div>
                     <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 italic">Scale Your <span className="text-gradient-gold">Yield.</span></h3>
                     <p className="text-muted text-[11px] md:text-xs font-bold opacity-30 uppercase tracking-[0.2em] leading-relaxed max-w-sm italic">Invite associates to the arena pool and secure secondary yield rewards on every verified activation.</p>
                  </div>
                  <div className="card-elite !p-10 !px-14 text-center shadow-2xl border-white/5 bg-white/[0.02]">
                     <div className="text-[9px] text-muted font-black uppercase mb-3 tracking-[0.4em] opacity-20 italic">Verified Nodes</div>
                     <div className="text-5xl md:text-6xl font-black text-white italic tracking-tighter">{profile?.referral_count || 0}</div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-stretch">
                  <div className="card-elite !p-10 lg:col-span-8 flex flex-col justify-center border-white/5 bg-black/40">
                     <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-8 italic flex items-center gap-3 opacity-60"><Globe className="w-4 h-4 text-blue-electric opacity-50" /> Operational Invite Protocol</h4>
                     <div className="flex flex-col sm:flex-row gap-3 p-3 bg-black/40 border border-white/5 rounded-2xl shadow-inner group">
                        <input readOnly value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://predchain.com'}/signup?ref=${profile.username}`} className="flex-1 bg-transparent px-5 py-4 font-black text-[10px] md:text-xs text-gold outline-none truncate italic opacity-80" />
                        <button onClick={() => { navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || 'https://predchain.com'}/signup?ref=${profile.username}`); showSuccess('Protocol link synchronized.'); }} className="btn btn-primary !px-10 rounded-xl font-black uppercase text-[11px] tracking-widest italic shadow-2xl">CLONE LINK</button>
                     </div>
                  </div>
                  <div className="card-elite !p-10 flex flex-col justify-between lg:col-span-4 bg-gold/[0.01] border-gold/10">
                     <h4 className="text-[9px] font-black text-white uppercase tracking-[0.4em] italic opacity-20">Settlement Incentives</h4>
                     <p className="text-muted text-[10px] font-bold uppercase tracking-[0.2em] leading-loose opacity-30 my-8 italic">
                        Every verified associate credits <strong>₦1,000</strong> to your balance instantly.
                     </p>
                     <div className="w-full h-1.5 bg-black/40 rounded-full border border-white/5 overflow-hidden">
                        <div className="h-full bg-grad-gold opacity-20 animate-pulse" style={{ width: '35%' }} />
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Global Toast Monitor */}
        {(successMsg || errorMsg) && (
          <div className={`fixed bottom-10 right-10 z-[100] px-10 py-6 rounded-3xl backdrop-blur-3xl border flex items-center gap-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] animate-slide-up ${
            successMsg ? 'bg-success/90 border-success/30 text-black' : 'bg-danger/90 border-danger/30 text-white'
          }`}>
             <div className="p-3 bg-black/10 rounded-2xl shadow-inner italic">
               {successMsg ? <Check className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
             </div>
             <div className="flex flex-col gap-1 text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">{successMsg ? 'NODE SUCCESS' : 'SYSTEM ALERT'}</span>
                <span className="text-[14px] font-black tracking-tight uppercase italic">{successMsg || errorMsg}</span>
             </div>
             <button onClick={clear} className="ml-12 p-3 hover:bg-black/10 rounded-2xl opacity-40 hover:opacity-100 transition-all font-black text-xl leading-none">×</button>
          </div>
        )}

      </div>
    </div>
  );
}
