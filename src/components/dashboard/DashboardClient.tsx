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
  Settings,
  CreditCard,
  User,
  Gift,
  Star
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
  const [activeTab, setActiveTab] = useState<'overview' | 'arena' | 'wallet' | 'network'>('overview');
  const [walletSubTab, setWalletSubTab] = useState<'transactions' | 'payouts'>('transactions');

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const [payoutAmount, setPayoutAmount] = useState('');
  const [bankInfo, setBankInfo] = useState({ bank: '', account: '', name: '' });

  const totalRewards = transactions.filter(t => t.type === 'reward').reduce((acc, t) => acc + t.amount, 0);
  const totalReferrals = transactions.filter(t => t.type === 'referral_bonus').reduce((acc, t) => acc + t.amount, 0);
  const pendingPayouts = payoutRequests.filter(r => r.status === 'pending').reduce((acc, r) => acc + r.amount, 0);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'arena', 'wallet', 'network'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }

    const errorParam = searchParams.get('error');
    const successParam = searchParams.get('success');
    if (errorParam && errorParam !== 'NEXT_REDIRECT') showError(decodeURIComponent(errorParam));
    if (successParam) showSuccess(decodeURIComponent(successParam));
  }, [searchParams, showError, showSuccess]);

  const displayName = profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'User';
  const balance = wallet?.balance_ngn || 0;
  const streak = userEntry?.streak_count || 0;
  const currentPlan = tiers.find(t => t.id === userEntry?.tier_id);

  const handlePrediction = async (matchId: string, choice: '1' | 'X' | '2') => {
    if (!userEntry) {
      showError('Please activate a plan to join the arena.');
      return;
    }
    
    const formData = new FormData();
    formData.append('matchId', matchId);
    formData.append('entryId', userEntry.id);
    formData.append('prediction', choice);

    startTransition(async () => {
      try {
        await submitPrediction(formData);
        showSuccess('Prediction secured.');
      } catch (err: any) {
        showError(err.message || 'Submission failed.');
      }
    });
  };

  const handlePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(payoutAmount) < 5000) {
      showError('Minimum withdrawal is ₦5,000.');
      return;
    }
    startTransition(async () => {
      try {
        await requestPayout(Number(payoutAmount), bankInfo);
        showSuccess('Withdrawal request submitted.');
        setPayoutAmount('');
      } catch (err: any) {
        showError(err.message || 'Withdrawal failed.');
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
        showError(err.message || 'Funding failed.');
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-primary pt-24 pb-20 md:pt-40">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-full h-[600px] bg-gold-glow blur-[140px] opacity-20" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 animate-slide-up">
          <div className="space-y-4">
            <div className="badge-premium !text-gold bg-gold/10 px-4 py-1.5 uppercase tracking-widest font-bold text-[10px]">Command Center</div>
            <h1 className="leading-none tracking-tight">Performance <span className="text-gradient-gold">Hub.</span></h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gold shadow-inner font-bold font-display italic">
                    {displayName.charAt(0).toUpperCase()}
                 </div>
                 <div className="flex flex-col">
                    <span className="text-sm font-bold text-white tracking-tight italic">Welcome back, {displayName}</span>
                    <span className="text-[10px] font-medium text-secondary opacity-40 uppercase tracking-widest">Active Session • {user.id.slice(0, 8)}</span>
                 </div>
              </div>
              <div className="w-px h-6 bg-white/10 hidden md:block" />
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-40">System Connected</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <Link href="/dashboard/settings" className="btn btn-secondary !px-6 !py-3.5 border-white/10">
                <Settings className="w-4 h-4 mr-2 opacity-60" /> 
                <span className="text-[10px] font-bold italic uppercase tracking-widest">Settings</span>
             </Link>
             <button onClick={() => logout()} className="btn btn-secondary !px-6 !py-3.5 border-white/10 text-rose-500/80 hover:text-rose-500 hover:border-rose-500/20">
                <LogOut className="w-4 h-4 mr-2" />
                <span className="text-[10px] font-bold italic uppercase tracking-widest">Disconnect</span>
             </button>
          </div>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {[
            { label: 'Available Balance', val: `₦${balance.toLocaleString()}`, icon: WalletIcon, color: 'text-gold' },
            { label: 'Active Plan', val: currentPlan?.name || 'Inactivate', icon: Zap, color: 'text-blue-electric' },
            { label: 'Active Streak', val: `${streak}/3`, icon: Star, color: 'text-emerald-500' },
            { label: 'Total Earnings', val: `₦${(totalRewards + totalReferrals).toLocaleString()}`, icon: Trophy, color: 'text-white' },
          ].map((m, i) => (
            <div key={i} className="card-premium group hover:border-white/20 transition-all duration-500">
               <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] opacity-40">{m.label}</span>
                     <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center">
                        <m.icon className={`w-4 h-4 text-muted opacity-30 group-hover:opacity-100 transition-all duration-300`} />
                     </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white font-display tracking-tight">
                     {m.val}
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            {[
              { id: 'overview', label: 'Overview', icon: Layout },
              { id: 'arena', label: 'Predictions', icon: Target },
              { id: 'wallet', label: 'Finances', icon: WalletIcon },
              { id: 'network', label: 'Referrals', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl border transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                  ? 'bg-white/[0.04] border-white/10 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]' 
                  : 'bg-transparent border-transparent text-secondary opacity-60 hover:text-white hover:opacity-100'
                }`}
              >
                 <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-gold' : 'opacity-20'}`} />
                 <span className="text-[10px] font-bold uppercase tracking-widest font-display">{tab.label}</span>
              </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-8">
                 <div className="card-premium !p-12 md:!p-16 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity rotate-12"><Target className="w-80 h-80" /></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
                       <div className="max-w-md">
                          <div className="badge-premium !text-gold mb-8 px-6 py-1.5 uppercase tracking-widest font-bold">Winning Consistency</div>
                          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 font-display">Streak <span className="text-gradient-gold">Progress.</span></h2>
                          <p className="text-secondary text-sm font-medium opacity-60 leading-relaxed mb-12">
                            {userEntry ? `Your ${currentPlan?.name} performance cycle is active. Achieve a perfect 3-day winning sequence to unlock your verified 10X reward settlement.` : 'Your prediction sequence is currently inactive. Select an entry tier to join the live performance arena.'}
                          </p>
                          <Link href={userEntry ? "/dashboard?tab=arena" : "/accounts"} className="btn btn-primary !px-16 !py-5 shadow-2xl flex items-center justify-center w-full sm:w-auto">
                             {userEntry ? 'Active Arena' : 'Select Entry Tier'} <ArrowRight className="w-4 h-4 ml-4" />
                          </Link>
                       </div>
                       
                       <div className="shrink-0 text-center space-y-6">
                          <div className="relative w-44 h-44 mx-auto">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/[0.03]" />
                              <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gold shadow-[0_0_30px_rgba(240,196,25,0.4)] transition-all duration-1000" strokeDasharray="502.6" strokeDashoffset={502.6 - (502.6 * (streak / 3))} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-5xl font-bold text-white font-display leading-none">{streak}/3</span>
                              <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-3 opacity-50">Verified</span>
                            </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Recent Activity */}
                 <div className="card-premium !p-0 overflow-hidden group">
                    <div className="px-10 py-6 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                       <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3 opacity-60">
                          <History className="w-4 h-4 text-gold" /> Activity Feed
                       </span>
                       <button onClick={() => setActiveTab('wallet')} className="text-[10px] font-bold text-gold hover:text-white transition-colors uppercase tracking-widest font-display">Financial Ledger</button>
                    </div>
                    <div className="divide-y divide-white/5">
                       {transactions.length === 0 ? (
                        <div className="py-24 text-center opacity-20 space-y-4">
                           <Activity className="w-12 h-12 mx-auto" />
                           <span className="text-[11px] font-bold uppercase tracking-widest italic">No events recorded</span>
                        </div>
                       ) : (
                        transactions.slice(0, 4).map(tx => (
                          <div key={tx.id} className={`p-8 flex items-center justify-between hover:bg-white/[0.01] transition-all group/item ${tx.status === 'failed' ? 'opacity-50' : ''}`}>
                             <div className="flex items-center gap-7">
                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-inner transition-all ${tx.status === 'failed' ? 'border-rose-500/20 bg-rose-500/5 text-rose-500' : tx.status === 'pending' ? 'border-gold/20 bg-gold/5 text-gold' : tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 'bg-white/[0.03] text-white/20 border-white/5'}`}>
                                   {tx.status === 'failed' ? <ShieldAlert className="w-5 h-5" /> : tx.status === 'pending' ? <History className="w-5 h-5" /> : tx.type === 'reward' ? <Trophy className="w-5 h-5" /> : <WalletIcon className="w-5 h-5" />}
                                </div>
                                <div className="flex flex-col">
                                   <div className="flex items-center gap-3">
                                      <span className="text-sm font-bold text-white uppercase tracking-tight font-display">{tx.type.split('_').join(' ')}</span>
                                      {tx.status !== 'completed' && (
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest italic ${tx.status === 'pending' ? 'bg-gold/10 border-gold/20 text-gold' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                                          {tx.status}
                                        </span>
                                      )}
                                   </div>
                                   <span suppressHydrationWarning className="text-[10px] font-medium text-secondary opacity-40 uppercase tracking-widest mt-1 italic">{formatDate(tx.created_at)} • {tx.reference.slice(0, 8)}</span>
                                </div>
                             </div>
                             <span className={`text-2xl font-bold font-display tracking-tight ${tx.status === 'failed' ? 'text-rose-500 line-through' : tx.status === 'pending' ? 'text-gold' : tx.amount > 0 ? 'text-emerald-500' : 'text-white'}`}>
                                {tx.amount > 0 ? '+' : ''}₦{Math.abs(tx.amount).toLocaleString()}
                             </span>
                          </div>
                        ))
                       )}
                    </div>
                 </div>
              </div>

              {/* Sidebar Cards */}
              <div className="lg:col-span-4 space-y-8">
                 <div className="card-premium !p-10 group bg-emerald-500/[0.02]">
                    <div className="flex items-center justify-between mb-8">
                       <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest font-display">Live Performance</span>
                       <Activity className="w-5 h-5 text-emerald-500 opacity-30" />
                    </div>
                    <div className="flex items-end gap-3 h-24 mb-6">
                       {[45, 60, 30, 80, 50, 90, 70].map((h, i) => (
                         <div key={i} className="flex-1 bg-white/[0.03] rounded-t-xl relative group/bar overflow-hidden">
                            <div className="absolute bottom-0 w-full bg-emerald-500/10 transition-all duration-1000" style={{ height: `${h}%` }} />
                            <div className="absolute bottom-0 w-full bg-gold opacity-0 group-hover/bar:opacity-100 transition-all" style={{ height: `${h}%` }} />
                         </div>
                       ))}
                    </div>
                    <p className="text-[10px] font-medium text-secondary uppercase tracking-widest opacity-40 italic">Live synchronization with arena match outcomes in progress.</p>
                 </div>

                 <Link href="/arena" className="card-premium !p-10 block group hover:-translate-y-2 transition-all bg-gold/[0.02] border-gold/10">
                    <div className="flex items-center justify-between mb-6">
                       <span className="text-[10px] font-bold text-gold uppercase tracking-widest font-display">Explore Arena</span>
                       <ArrowUpRight className="w-5 h-5 text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                    <p className="text-[11px] font-medium text-secondary uppercase tracking-widest opacity-50 leading-relaxed italic">View upcoming fixtures and global prediction trends across all active pools.</p>
                 </Link>
              </div>
            </div>
          )}

          {/* ARENA */}
          {activeTab === 'arena' && (
            <div className="space-y-10">
               <div className="card-premium !p-8 md:!p-10 flex flex-col md:flex-row justify-between items-center gap-10">
                  <div className="flex items-center gap-6">
                     <div className="p-5 bg-gold/10 rounded-2xl border border-gold/10"><Radio className="w-6 h-6 text-gold animate-pulse" /></div>
                     <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white font-display uppercase tracking-tight">Arena Active</h3>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-40">Tournament Cycle {activeRound?.round_number || '01'} • Performance Flow Operational</p>
                     </div>
                  </div>
                  <div className="px-10 py-5 bg-white/[0.02] border border-white/5 rounded-3xl text-center shadow-inner">
                     <span className="text-[10px] font-bold text-secondary uppercase mb-2 tracking-widest opacity-30 block">Closing In</span>
                     <div className="text-3xl font-bold text-white font-display tracking-tighter">{activeRound?.end_date ? new Date(activeRound.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'CLOSED'}</div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {matches.length === 0 ? (
                    <div className="col-span-full py-48 text-center card-premium border-dashed opacity-30 space-y-8 flex flex-col items-center">
                       <Zap className="w-16 h-16 text-muted" />
                       <span className="text-xs font-bold uppercase tracking-[0.4em]">No match fixtures available</span>
                       <button onClick={() => window.location.reload()} className="btn btn-secondary !px-10 !py-3 font-bold text-[10px]">RELOAD FEED</button>
                    </div>
                  ) : (
                    matches.map(m => {
                      const pred = predictions.find(p => p.match_id === m.id);
                      return (
                        <div key={m.id} className="card-premium !p-10 group/match relative overflow-hidden flex flex-col">
                           <div className="flex justify-between items-center mb-12">
                              <span className="text-[11px] font-bold text-secondary uppercase tracking-widest opacity-50 italic">{new Date(m.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <div className={`badge-premium !py-1 !px-4 text-[9px] font-bold tracking-widest ${pred ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/[0.03] text-muted opacity-40'}`}>
                                {pred ? 'SECURED' : 'PENDING'}
                              </div>
                           </div>
                           <div className="space-y-6 text-center mb-12 flex-1">
                              <h4 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight font-display group-hover/match:text-gold transition-colors">{m.home_team}</h4>
                              <div className="text-[10px] font-bold text-muted opacity-20 tracking-[0.5em] italic">VS</div>
                              <h4 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight font-display group-hover/match:text-gold transition-colors">{m.away_team}</h4>
                           </div>
                           <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/5">
                              {['1', 'X', '2'].map(choice => (
                                 <button 
                                   key={choice}
                                   onClick={() => handlePrediction(m.id, choice as '1' | 'X' | '2')}
                                   disabled={isPending || !!pred || !userEntry}
                                   className={`py-5 rounded-2xl font-bold text-[12px] transition-all border font-display ${
                                     pred?.prediction === choice 
                                     ? 'bg-gold text-black border-gold shadow-[0_0_20px_rgba(240,196,25,0.4)]' 
                                     : 'bg-white/[0.02] border-white/5 text-secondary hover:text-white hover:border-gold/30 hover:bg-gold/5'
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

          {/* FINANCES */}
          {activeTab === 'wallet' && (
            <div className="space-y-10">
               {/* Wallet Analytics */}
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Balance', val: balance, icon: WalletIcon, color: 'text-gold' },
                    { label: 'Sequence Rewards', val: totalRewards, icon: Trophy, color: 'text-emerald-500' },
                    { label: 'Associate Bonus', val: totalReferrals, icon: Users, color: 'text-blue-500' },
                    { label: 'Active Requests', val: pendingPayouts, icon: History, color: 'text-white' },
                  ].map((k, i) => (
                    <div key={i} className="card-premium !p-8 relative overflow-hidden group">
                       <k.icon className={`absolute -top-4 -right-4 w-20 h-20 opacity-5 group-hover:opacity-10 transition-all duration-500 ${k.color}`} />
                       <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-4 block opacity-40 italic">{k.label}</span>
                       <span className="text-3xl font-bold text-white font-display tracking-tighter leading-none">₦{k.val.toLocaleString()}</span>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Ledger */}
                  <div className="lg:col-span-8 card-premium !p-0 overflow-hidden shadow-2xl">
                     <div className="px-10 py-6 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                        <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3 opacity-60"><History className="w-4 h-4 text-gold" /> Financial History</span>
                        <div className="flex bg-black shadow-inner border border-white/5 rounded-2xl p-1.5 gap-1.5">
                           {[
                             { id: 'transactions', label: 'Ledger' },
                             { id: 'payouts', label: 'Withdrawals' }
                           ].map(t => (
                             <button key={t.id} onClick={() => setWalletSubTab(t.id as any)} className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all font-display ${walletSubTab === t.id ? 'bg-white/10 text-white shadow-lg' : 'text-muted/40 hover:text-white'}`}>{t.label}</button>
                           ))}
                        </div>
                     </div>
                     <div className="divide-y divide-white/5">
                        {walletSubTab === 'transactions' && (
                          transactions.length === 0 ? (
                            <div className="py-32 text-center opacity-30 space-y-6">
                               <History className="w-16 h-16 mx-auto text-muted" />
                               <span className="text-xs font-bold uppercase tracking-[0.3em] font-display">No transactions found</span>
                            </div>
                          ) : (
                             <>
                              {transactions.map(tx => (
                                <div key={tx.id} className={`p-10 flex items-center justify-between hover:bg-white/[0.01] transition-all group border-b border-transparent hover:border-white/5 ${tx.status === 'failed' ? 'opacity-50' : ''}`}>
                                   <div className="flex items-center gap-8">
                                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110 ${tx.status === 'failed' ? 'border-rose-500/20 bg-rose-500/5 text-rose-500' : tx.status === 'pending' ? 'border-gold/20 bg-gold/5 text-gold' : tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 'bg-white/[0.03] text-white/30 border-white/5'}`}>
                                         {tx.status === 'failed' ? <ShieldAlert className="w-6 h-6" /> : tx.status === 'pending' ? <History className="w-6 h-6" /> : tx.amount > 0 ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpLeft className="w-6 h-6" />}
                                      </div>
                                      <div className="space-y-2">
                                         <div className="flex items-center gap-3">
                                            <div className="text-sm font-bold text-white uppercase tracking-tight font-display">{tx.type.split('_').join(' ')}</div>
                                            {tx.status !== 'completed' && (
                                              <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest italic ${tx.status === 'pending' ? 'bg-gold/10 border-gold/20 text-gold' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                                                {tx.status}
                                              </span>
                                            )}
                                         </div>
                                         <div className="text-[10px] font-medium text-secondary opacity-40 uppercase tracking-widest italic">{tx.reference.slice(0, 12)} • {formatDate(tx.created_at)}</div>
                                      </div>
                                   </div>
                                   <span className={`text-2xl font-bold font-display tracking-tight ${tx.status === 'failed' ? 'text-rose-500 line-through' : tx.status === 'pending' ? 'text-gold' : tx.amount > 0 ? 'text-emerald-500' : 'text-white'}`}>
                                      {tx.amount > 0 ? '+' : ''}₦{Math.abs(tx.amount).toLocaleString()}
                                   </span>
                                </div>
                              ))}
                             </>
                          )
                        )}
                        {walletSubTab === 'payouts' && (
                          <div className="py-32 text-center opacity-20 space-y-6">
                             <ShieldAlert className="w-16 h-16 mx-auto text-muted" />
                             <span className="text-xs font-bold uppercase tracking-[0.3em] font-display">Withdrawal history secured</span>
                          </div>
                        )}
                     </div>
                  </div>

                  {/* Wallet Actions */}
                  <div className="lg:col-span-4 space-y-8">
                     <div className="card-premium !p-10 bg-gold/[0.02] border-gold/10 shadow-xl">
                        <span className="text-[10px] font-bold text-gold uppercase tracking-[0.3em] mb-10 block opacity-50 font-display">Wallet Funding</span>
                        <div className="grid grid-cols-2 gap-3 mb-8">
                           {[5000, 10000, 20000, 50000].map(amt => (
                             <button key={amt} onClick={() => handleTopUp(amt)} className="py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-[10px] font-bold text-white hover:bg-gold hover:text-black transition-all font-display shadow-inner">+ ₦{amt.toLocaleString()}</button>
                           ))}
                        </div>
                        <p className="text-[10px] font-medium text-secondary uppercase tracking-widest opacity-30 text-center leading-relaxed italic">Fast, high-integrity funding secured via the Paystack network.</p>
                     </div>

                     <div className="card-premium !p-10 bg-[#0a0d14] border-white/5 shadow-xl">
                        <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-10 block opacity-40 font-display">Withdraw Rewards</span>
                        <form onSubmit={handlePayout} className="space-y-8">
                           <div className="space-y-4">
                              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1 opacity-40">Amount (₦)</span>
                              <input type="number" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} placeholder="0.00" className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-6 text-white text-4xl font-bold font-display tracking-tighter focus:border-gold/60 focus:bg-black/90 transition-all outline-none" required />
                           </div>
                           <button disabled={isPending || balance < 1000} type="submit" className="btn btn-primary w-full py-5 text-[12px] font-bold tracking-widest group shadow-2xl">
                              {isPending ? "PROCESSING REQUEST..." : "INITIATE WITHDRAWAL"}
                           </button>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* NETWORK (REFERRALS) */}
          {activeTab === 'network' && (
            <div className="space-y-10">
               <div className="card-premium !p-16 md:!p-24 bg-[#0a0d14] relative overflow-hidden group text-center md:text-left">
                  <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none group-hover:opacity-10 transition-all duration-1000"><Globe className="w-96 h-96" /></div>
                  
                  <div className="flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
                     <div className="max-w-xl">
                        <div className="badge-premium !text-gold mb-10 px-6 py-2">Associate Network</div>
                        <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-10 font-display">Expand the <br /><span className="text-gradient-gold">Global Pool.</span></h2>
                        <p className="text-secondary text-sm md:text-base font-medium opacity-60 leading-relaxed italic">
                           Invite colleagues and professional players to join the PredChain arena. Earn a verified ₦1,000 performance bonus for every successful account activation in your network.
                        </p>
                     </div>
                     <div className="card-premium !p-12 md:!p-16 bg-white/[0.03] text-center shadow-2xl min-w-[280px]">
                        <span className="text-[11px] font-bold text-secondary uppercase tracking-[0.2em] opacity-40 block mb-4">Total Network Size</span>
                        <div className="text-6xl md:text-8xl font-bold text-white font-display tracking-tighter leading-none">{profile?.referral_count || 0}</div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  <div className="lg:col-span-8 card-premium !p-16 flex flex-col justify-center">
                     <div className="flex items-center gap-4 mb-10 opacity-60">
                        <LinkIcon className="w-5 h-5 text-gold" />
                        <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em] font-display">Personal Invite Link</span>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-4 p-4 bg-black/40 border border-white/10 rounded-3xl shadow-inner group">
                        <input readOnly value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://predchain.com'}/signup?ref=${profile.username}`} className="flex-1 bg-transparent px-6 py-4 font-bold text-sm text-gold outline-none italic opacity-90 font-display" />
                        <button onClick={() => { navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || 'https://predchain.com'}/signup?ref=${profile.username}`); showSuccess('Invite link copied.'); }} className="btn btn-primary !px-16 !py-5 rounded-2xl font-bold uppercase text-[12px] shadow-2xl transition-all hover:scale-[1.02]">CLONE LINK</button>
                     </div>
                  </div>
                  <div className="lg:col-span-4 card-premium !p-16 bg-gold/[0.03] border-gold/10 shadow-xl flex flex-col justify-center items-center text-center">
                     <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/10 flex items-center justify-center text-gold mb-10">
                        <Gift className="w-7 h-7" />
                     </div>
                     <h4 className="text-xl font-bold text-white font-display mb-3 uppercase italic">Earn ₦1,000</h4>
                     <p className="text-[11px] font-bold text-secondary uppercase tracking-widest opacity-50 mb-0 leading-relaxed">Per active arena entry <br />verified via your link.</p>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Status Notifications */}
        {(successMsg || errorMsg) && (
          <div className={`fixed bottom-10 right-6 left-6 md:left-auto md:w-[420px] z-[100] p-8 rounded-3xl backdrop-blur-3xl border shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] animate-slide-up flex items-center gap-8 ${
            successMsg ? 'bg-emerald-500/90 border-emerald-500/20 text-white' : 'bg-rose-500/90 border-rose-500/20 text-white'
          }`}>
             <div className="shrink-0 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">{successMsg ? <Check className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}</div>
             <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-1">{successMsg ? 'VERIFIED ACTION' : 'SYSTEM ALERT'}</span>
                <span className="text-sm font-bold tracking-tight font-display">{successMsg || errorMsg}</span>
             </div>
             <button onClick={clear} className="ml-auto w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">×</button>
          </div>
        )}

      </div>
    </div>
  );
}

function LinkIcon({ className }: { className?: string }) {
   return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
   );
}
