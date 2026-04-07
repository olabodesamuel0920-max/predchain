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
  Gift
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
    if (Number(payoutAmount) < 1000) {
      showError('Minimum withdrawal is ₦1,000.');
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
    <div className="relative min-h-screen bg-primary pt-32 pb-24 md:pt-40">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-full h-[600px] bg-gold-glow blur-[140px] opacity-20" />
      </div>

      <div className="container relative z-10 px-6">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 animate-slide-up">
          <div className="space-y-4">
            <div className="badge-elite !text-gold bg-white/[0.03] border-gold/10 px-4 py-1">SECURE DASHBOARD</div>
            <h1 className="leading-none">Elite <span className="text-gradient-gold">Hub.</span></h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold shadow-inner font-black italic">
                    {displayName.charAt(0).toUpperCase()}
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs font-bold text-white tracking-tight italic">Welcome, {displayName}</span>
                    <span className="text-[8px] font-bold text-muted uppercase tracking-widest opacity-30">Account ID: {user.id.slice(0, 8)}</span>
                 </div>
              </div>
              <div className="w-px h-6 bg-white/10 hidden md:block" />
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                 <span className="text-[9px] font-black text-muted uppercase tracking-widest opacity-30">Status: Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <Link href="/dashboard/settings" className="btn btn-ghost !px-6 !py-3 bg-white/[0.02] border-white/5">
                <Settings className="w-4 h-4 mr-2" /> 
                <span className="text-[10px] font-bold italic">SETTINGS</span>
             </Link>
             <button onClick={() => logout()} className="btn btn-ghost !px-6 !py-3 bg-white/[0.02] border-white/5 text-muted hover:text-danger hover:border-danger/20">
                <LogOut className="w-4 h-4 mr-2" />
                <span className="text-[10px] font-bold italic">LOGOUT</span>
             </button>
          </div>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {[
            { label: 'Wallet Balance', val: `₦${balance.toLocaleString()}`, icon: WalletIcon, color: 'text-gold' },
            { label: 'Active Plan', val: currentPlan?.name || 'None', icon: Zap, color: 'text-blue-electric' },
            { label: 'Match Streak', val: `${streak}/3`, icon: ShieldCheck, color: 'text-success' },
            { label: 'Total Earned', val: `₦${(totalRewards + totalReferrals).toLocaleString()}`, icon: Trophy, color: 'text-white' },
          ].map((m, i) => (
            <div key={i} className="card-elite !p-6 md:!p-8 bg-[#080a0f] border-white/5 shadow-xl group">
               <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-muted uppercase tracking-widest opacity-40">{m.label}</span>
                     <m.icon className={`w-4 h-4 text-muted opacity-20 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  <div className="text-xl md:text-2xl font-black text-white italic tracking-tighter">
                     {m.val}
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-2 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            {[
              { id: 'overview', label: 'Overview', icon: Layout },
              { id: 'arena', label: 'Predictions', icon: Target },
              { id: 'wallet', label: 'Finances', icon: CreditCard },
              { id: 'network', label: 'Referrals', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl border transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                  ? 'bg-white/[0.04] border-white/10 text-white shadow-lg' 
                  : 'bg-transparent border-transparent text-muted hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                 <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-gold' : 'opacity-20'}`} />
                 <span className="text-[10px] font-black uppercase tracking-widest italic">{tab.label}</span>
              </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-8">
                 <div className="card-elite !p-12 bg-[#080a0f] border-white/5 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.01] pointer-events-none group-hover:opacity-[0.03] transition-opacity rotate-12"><Target className="w-64 h-64" /></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                       <div className="max-w-md">
                          <div className="badge-elite !text-gold bg-white/[0.03] mb-8 border-gold/10 italic">Performance Streak</div>
                          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 italic">Sequence <span className="text-gradient-gold">Integrity.</span></h2>
                          <p className="text-muted text-xs font-bold opacity-40 uppercase tracking-widest leading-loose mb-10">
                            {userEntry ? `Your ${currentPlan?.name} plan is active. Complete three consecutive correct predictions to claim your 10X reward.` : 'You do not have an active prediction sequence. Start your journey by selecting a plan.'}
                          </p>
                          <Link href={userEntry ? "/dashboard?tab=arena" : "/accounts"} className="btn btn-primary !px-12 !py-4 shadow-xl">
                             {userEntry ? 'Active Matches' : 'Choose a Plan'} <ArrowRight className="w-4 h-4 ml-3" />
                          </Link>
                       </div>
                       
                       <div className="shrink-0 text-center space-y-4">
                          <div className="relative w-32 h-32 mx-auto">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gold shadow-glow-gold transition-all duration-1000" strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * (streak / 3))} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-3xl font-black text-white italic tracking-tighter">{streak}/3</span>
                              <span className="text-[8px] font-black text-muted uppercase tracking-widest opacity-30 mt-0.5">Secure</span>
                            </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Recent Activity */}
                 <div className="card-elite !p-0 bg-[#080a0f] border-white/5 overflow-hidden shadow-xl">
                    <div className="px-8 py-5 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                       <span className="text-[10px] font-black text-white uppercase tracking-widest italic flex items-center gap-2 opacity-50">
                          <History className="w-3.5 h-3.5" /> Recent Activity
                       </span>
                       <button onClick={() => setActiveTab('wallet')} className="text-[9px] font-bold text-gold/60 uppercase tracking-widest hover:text-gold transition-colors italic">View Ledger</button>
                    </div>
                    <div className="divide-y divide-white/5">
                       {transactions.length === 0 ? (
                        <div className="py-20 text-center opacity-20 space-y-4">
                           <Activity className="w-10 h-10 mx-auto" />
                           <span className="text-[10px] font-black uppercase tracking-widest italic">No events recorded</span>
                        </div>
                       ) : (
                        transactions.slice(0, 4).map(tx => (
                          <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-all group">
                             <div className="flex items-center gap-5">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-inner ${tx.amount > 0 ? 'bg-success/5 text-success' : 'bg-white/[0.03] text-white/20'}`}>
                                   {tx.type === 'reward' ? <Trophy className="w-4 h-4" /> : <WalletIcon className="w-4 h-4" />}
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-xs font-bold text-white uppercase tracking-tight italic">{tx.type.split('_').join(' ')}</span>
                                   <span className="text-[8px] font-bold text-muted opacity-40 uppercase tracking-widest italic">{new Date(tx.created_at).toLocaleDateString()} — {tx.reference.slice(0, 6)}</span>
                                </div>
                             </div>
                             <span className={`text-lg font-black italic tracking-tighter ${tx.amount > 0 ? 'text-success' : 'text-white/40'}`}>
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
                 <div className="card-elite !p-10 bg-blue-electric/[0.02] border-blue-electric/10 group">
                    <div className="flex items-center justify-between mb-8">
                       <span className="text-[10px] font-bold text-blue-electric uppercase tracking-widest italic">Node Activity</span>
                       <TrendingUp className="w-5 h-5 text-blue-electric opacity-30" />
                    </div>
                    <div className="flex items-end gap-2.5 h-20 mb-6">
                       {[45, 60, 30, 80, 50, 90, 70].map((h, i) => (
                         <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group/bar">
                            <div className="absolute bottom-0 w-full bg-blue-electric/20 rounded-t-lg transition-all duration-1000" style={{ height: `${h}%` }} />
                            <div className="absolute bottom-0 w-full bg-blue-electric opacity-0 group-hover/bar:opacity-100 transition-all" style={{ height: `${h}%` }} />
                         </div>
                       ))}
                    </div>
                    <p className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-20 italic">Live synchronization with match outcomes in progress.</p>
                 </div>

                 <Link href="/arena" className="card-elite !p-10 bg-gold/[0.02] border-gold/10 block group hover:-translate-y-1 transition-all">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-[10px] font-bold text-gold uppercase tracking-widest italic">Explore Arena</span>
                       <ArrowUpRight className="w-5 h-5 text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-40 leading-loose">View upcoming fixtures and global prediction trends.</p>
                 </Link>
              </div>
            </div>
          )}

          {/* ARENA */}
          {activeTab === 'arena' && (
            <div className="space-y-10">
               <div className="card-elite !p-8 bg-[#080a0f] border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl">
                  <div className="flex items-center gap-5">
                     <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5"><Radio className="w-5 h-5 text-blue-electric animate-pulse" /></div>
                     <div className="space-y-1">
                        <h3 className="text-xl font-black text-white italic">Arena Synchronized</h3>
                        <p className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-30">Round {activeRound?.round_number || 'X'} • Global Prediction Flow Active</p>
                     </div>
                  </div>
                  <div className="px-8 py-4 bg-black/40 border border-white/5 rounded-2xl text-center shadow-inner">
                     <span className="text-[9px] font-black text-muted uppercase mb-1 tracking-widest opacity-30 italic">Cycle Resolution</span>
                     <div className="text-2xl font-black text-white italic tracking-tighter">{activeRound?.end_date ? new Date(activeRound.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'CLOSED'}</div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matches.length === 0 ? (
                    <div className="col-span-full py-40 text-center card-elite border-dashed border-white/10 opacity-20 space-y-6">
                       <Zap className="w-12 h-12 mx-auto" />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">No active matches</span>
                    </div>
                  ) : (
                    matches.map(m => {
                      const pred = predictions.find(p => p.match_id === m.id);
                      return (
                        <div key={m.id} className="card-elite !p-8 bg-[#080a0f] border-white/5 hover:border-gold/30 transition-all group/match shadow-lg">
                           <div className="flex justify-between items-center mb-10">
                              <span className="text-[10px] font-black text-muted opacity-40 italic">{new Date(m.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <div className={`badge-elite !py-0.5 !px-3 font-bold italic border-none ${pred ? 'bg-success/10 text-success' : 'bg-white/[0.03] text-muted opacity-40'}`}>
                                {pred ? 'SECURED' : 'PENDING'}
                              </div>
                           </div>
                           <div className="space-y-5 text-center mb-10">
                              <div className="text-lg font-black text-white uppercase italic tracking-tight group-hover/match:text-gold transition-colors">{m.home_team}</div>
                              <div className="text-[9px] font-black text-muted opacity-20 tracking-[0.4em]">VS</div>
                              <div className="text-lg font-black text-white uppercase italic tracking-tight group-hover/match:text-gold transition-colors">{m.away_team}</div>
                           </div>
                           <div className="grid grid-cols-3 gap-2">
                              {['1', 'X', '2'].map(choice => (
                                 <button 
                                   key={choice}
                                   onClick={() => handlePrediction(m.id, choice as '1' | 'X' | '2')}
                                   disabled={isPending || !!pred || !userEntry}
                                   className={`py-4 rounded-xl font-black text-[11px] transition-all border uppercase tracking-widest italic shadow-inner ${
                                     pred?.prediction === choice 
                                     ? 'bg-gold text-black border-gold shadow-glow-gold' 
                                     : 'bg-white/[0.02] border-white/5 text-muted hover:text-white hover:border-gold/30'
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
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { label: 'Current Assets', val: balance, icon: WalletIcon },
                    { label: 'Success Rewards', val: totalRewards, icon: Trophy },
                    { label: 'Referral Yield', val: totalReferrals, icon: Users },
                    { label: 'Pending Payout', val: pendingPayouts, icon: History },
                  ].map((k, i) => (
                    <div key={i} className="card-elite !p-6 md:!p-8 bg-[#080a0f] border-white/5 shadow-xl relative overflow-hidden group">
                       <k.icon className="absolute top-4 right-4 w-10 h-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
                       <span className="text-[10px] font-black text-muted uppercase tracking-widest mb-2 block opacity-40 italic">{k.label}</span>
                       <span className="text-2xl font-black text-white italic tracking-tighter leading-none">₦{k.val.toLocaleString()}</span>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Ledger */}
                  <div className="lg:col-span-8 card-elite !p-0 bg-[#080a0f] border-white/5 overflow-hidden shadow-2xl">
                     <div className="px-8 py-5 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest italic flex items-center gap-2 opacity-50"><History className="w-3.5 h-3.5" /> Finance Ledger</span>
                        <div className="flex bg-black shadow-inner border border-white/5 rounded-xl p-1 gap-1">
                           {[
                             { id: 'transactions', label: 'History' },
                             { id: 'payouts', label: 'Withdraws' }
                           ].map(t => (
                             <button key={t.id} onClick={() => setWalletSubTab(t.id as any)} className={`px-5 py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all italic ${walletSubTab === t.id ? 'bg-white/10 text-white' : 'text-muted/40 hover:text-white'}`}>{t.label}</button>
                           ))}
                        </div>
                     </div>
                     <div className="divide-y divide-white/5">
                        {walletSubTab === 'transactions' && (
                          transactions.length === 0 ? (
                            <div className="py-24 text-center opacity-20 space-y-4">
                               <History className="w-12 h-12 mx-auto" />
                               <span className="text-[10px] font-black uppercase tracking-widest italic">Ledger Clean</span>
                            </div>
                          ) : (
                             transactions.map(tx => (
                               <div key={tx.id} className="p-8 flex items-center justify-between hover:bg-white/[0.01] transition-all group">
                                  <div className="flex items-center gap-6">
                                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${tx.amount > 0 ? 'bg-success/5 text-success' : 'bg-white/[0.03] text-white/20'}`}>
                                        {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpLeft className="w-5 h-5" />}
                                     </div>
                                     <div className="space-y-1">
                                        <div className="text-xs font-bold text-white uppercase tracking-tight italic">{tx.type.split('_').join(' ')}</div>
                                        <div className="text-[8px] font-bold text-muted opacity-30 uppercase tracking-widest italic">{tx.reference.slice(0, 10)} — {new Date(tx.created_at).toLocaleDateString()}</div>
                                     </div>
                                  </div>
                                  <span className={`text-xl font-black italic tracking-tighter ${tx.amount > 0 ? 'text-success' : 'text-white'}`}>₦{Math.abs(tx.amount).toLocaleString()}</span>
                               </div>
                             ))
                          )
                        )}
                        {walletSubTab === 'payouts' && (
                          <div className="py-24 text-center opacity-10 space-y-4">
                             <ShieldAlert className="w-12 h-12 mx-auto" />
                             <span className="text-[10px] font-black uppercase tracking-widest italic">Withdrawal Log Protected</span>
                          </div>
                        )}
                     </div>
                  </div>

                  {/* Wallet Actions */}
                  <div className="lg:col-span-4 space-y-8">
                     <div className="card-elite !p-10 bg-gold/[0.02] border-gold/10 shadow-xl">
                        <span className="text-[9px] font-black text-gold uppercase tracking-[0.3em] mb-8 block opacity-30 italic">Wallet Funding</span>
                        <div className="grid grid-cols-2 gap-3 mb-10">
                           {[5000, 10000, 25000, 50000].map(amt => (
                             <button key={amt} onClick={() => handleTopUp(amt)} className="py-4 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-black text-white hover:bg-gold hover:text-black transition-all italic shadow-inner tracking-widest">+ ₦{amt.toLocaleString()}</button>
                           ))}
                        </div>
                        <p className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-20 text-center leading-loose italic">Fast, secure funding through the Paystack network.</p>
                     </div>

                     <div className="card-elite !p-10 bg-[#080a0f] border-white/5 shadow-xl">
                        <span className="text-[9px] font-black text-white uppercase tracking-[0.3em] mb-8 block opacity-20 italic">Withdraw Assets</span>
                        <form onSubmit={handlePayout} className="space-y-6">
                           <div className="space-y-3">
                              <span className="text-[8px] font-black text-muted uppercase tracking-widest ml-1 opacity-20">Amount (₦)</span>
                              <input type="number" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} placeholder="0.00" className="w-full bg-black/60 border border-white/5 rounded-xl px-5 py-5 text-white text-3xl font-black italic tracking-tighter focus:border-gold/40 focus:bg-black/80 transition-all outline-none" required />
                           </div>
                           <button disabled={isPending || balance < 1000} type="submit" className="btn btn-primary w-full py-4 text-[11px] italic tracking-widest">{isPending ? "PROCESSING..." : "WITHDRAW FUNDS"}</button>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* NETWORK (REFERRALS) */}
          {activeTab === 'network' && (
            <div className="space-y-10">
               <div className="card-elite !p-12 md:!p-20 bg-[#080a0f] border-white/5 shadow-3xl relative overflow-hidden group text-center md:text-left">
                  <div className="absolute top-0 right-0 p-16 opacity-[0.01] pointer-events-none group-hover:opacity-10 transition-all duration-1000"><Globe className="w-96 h-96" /></div>
                  
                  <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                     <div className="max-w-md">
                        <div className="badge-elite !text-gold bg-white/[0.03] border-gold/10 mb-8 italic">Affiliate Network</div>
                        <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter mb-8 italic leading-none">Global <span className="text-gradient-gold">Growth.</span></h2>
                        <p className="text-muted text-xs font-bold opacity-30 uppercase tracking-widest leading-loose italic">
                           Expand the PredChain network and claim ₦1,000 for every successfully referred seat activation. Uncapped earnings active.
                        </p>
                     </div>
                     <div className="card-elite !p-10 md:!p-14 bg-white/[0.02] border-white/5 text-center shadow-2xl min-w-[240px]">
                        <span className="text-[10px] font-black text-muted uppercase tracking-widest opacity-20 italic block mb-3">Qualified Leads</span>
                        <div className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none">{profile?.referral_count || 0}</div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  <div className="lg:col-span-8 card-elite !p-12 bg-[#080a0f] border-white/5 shadow-xl flex flex-col justify-center">
                     <div className="flex items-center gap-3 mb-10 opacity-60">
                        <LinkIcon className="w-4 h-4 text-gold" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Invite Link Transmission</span>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-3 p-3 bg-black/40 border border-white/5 rounded-2xl shadow-inner group">
                        <input readOnly value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://predchain.com'}/signup?ref=${profile.username}`} className="flex-1 bg-transparent px-5 py-4 font-black text-xs text-gold outline-none italic opacity-80" />
                        <button onClick={() => { navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || 'https://predchain.com'}/signup?ref=${profile.username}`); showSuccess('Invite link copied.'); }} className="btn btn-primary !px-12 !py-4 rounded-xl font-black uppercase text-[11px] italic shadow-2xl transition-all">CLONE LINK</button>
                     </div>
                  </div>
                  <div className="lg:col-span-4 card-elite !p-12 bg-gold/5 border-gold/10 shadow-xl flex flex-col justify-center items-center text-center">
                     <Gift className="w-10 h-10 text-gold mb-8 opacity-20" />
                     <h4 className="text-sm font-black text-white italic tracking-tight mb-2 uppercase">Earn ₦1,000</h4>
                     <p className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-40 leading-loose">Per successful arena activation using your link.</p>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Status Notifications */}
        {(successMsg || errorMsg) && (
          <div className={`fixed bottom-10 right-6 left-6 md:left-auto md:w-96 z-[100] p-6 rounded-2xl backdrop-blur-3xl border shadow-3xl animate-slide-up flex items-center gap-6 ${
            successMsg ? 'bg-success/90 border-success/20 text-black' : 'bg-danger/90 border-danger/20 text-white'
          }`}>
             <div className="shrink-0">{successMsg ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}</div>
             <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">{successMsg ? 'SYSTEM SUCCESS' : 'CORE ALERT'}</span>
                <span className="text-xs font-bold uppercase tracking-tight italic">{successMsg || errorMsg}</span>
             </div>
             <button onClick={clear} className="ml-auto text-lg leading-none opacity-50 hover:opacity-100 transition-opacity">×</button>
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
