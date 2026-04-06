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
  ShieldAlert,
  Globe,
  Radio,
  Trophy,
  ArrowRight,
  History,
  Lock,
  Target
} from 'lucide-react';
import { submitPrediction } from '@/app/actions/predictions';
import { requestPayout, purchaseTierWithWallet } from '@/app/actions/wallet';
import { initializeWalletFunding } from '@/app/actions/paystack';
import { logout } from '@/app/actions/auth';
import { Profile, ChallengeRound, ChallengeMatch, ChallengeEntry, Prediction, Transaction, Wallet, PayoutRequest, AccountPurchase, AccountTier } from '@/types';
import { useFeedback } from '@/hooks/useFeedback';

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
  const initial = displayName.charAt(0).toUpperCase();

  const processStatus = (status: string) => {
    switch (status) {
      case 'active': return { label: 'Active', color: 'success' };
      case 'suspended': return { label: 'Suspended', color: 'danger' };
      case 'under_review': return { label: 'Under Review', color: 'gold' };
      case 'demo': return { label: 'Trial', color: 'blue-electric' };
      default: return { label: 'Active', color: 'success' };
    }
  };

  const status = processStatus(profile?.status || 'active');
  const balance = wallet?.balance_ngn || 0;
  const streak = userEntry?.streak_count || 0;

  const currentTier = tiers.find(t => t.id === userEntry?.tier_id);
  const potentialReward = currentTier?.perks?.reward || '₦0';

  const handlePrediction = async (match_id: string, choice: '1' | 'X' | '2') => {
    if (!userEntry) {
      showError('No active challenge round found.');
      return;
    }
    
    const formData = new FormData();
    formData.append('matchId', match_id);
    formData.append('entryId', userEntry.id);
    formData.append('prediction', choice);

    startTransition(async () => {
      try {
        await submitPrediction(formData);
        showSuccess('Prediction submitted successfully.');
      } catch (err: unknown) {
        showError((err as Error).message);
      }
    });
  };

  const handlePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await requestPayout(Number(payoutAmount), bankInfo);
        showSuccess('Withdrawal request submitted.');
        setPayoutAmount('');
      } catch (err: unknown) {
        showError((err as Error).message);
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
      } catch (err: unknown) {
        showError((err as Error).message);
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-primary">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[300px] bg-blue-electric/5 blur-[120px] pointer-events-none z-0" />

      <main className="relative z-10 flex-1">
        <div className="container">
          
          {/* Internal Navigation Tabs */}
          <div className="flex items-center gap-1.5 mb-6 overflow-x-auto no-scrollbar pb-2 border-b border-white/5">
             {[
               { id: 'overview',   label: 'Overview',   icon: Layout },
               { id: 'challenge',  label: 'Challenge',  icon: Zap },
               { id: 'wallet',     label: 'Wallet',     icon: WalletIcon },
               { id: 'referrals',  label: 'Referrals',  icon: Users }
             ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-lg transition-all whitespace-nowrap border ${
                    activeTab === tab.id 
                    ? 'bg-white/5 border-white/10 text-white shadow-sm' 
                    : 'bg-transparent border-transparent text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                   <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-blue-electric' : 'opacity-30'}`} />
                   <span className="text-[10px] font-bold uppercase tracking-wide">{tab.label}</span>
                </button>
             ))}
          </div>

          <div className="animate-slide-up">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-8 flex flex-col gap-5">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="card p-5 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp className="w-8 h-8" /></div>
                         <div className="flex justify-between items-start mb-5">
                            <div className="p-2 bg-gold/10 rounded-lg"><Activity className="w-3.5 h-3.5 text-gold" /></div>
                            <span className="badge badge-gold !text-[7px] font-bold tracking-wider">Active Protocol</span>
                         </div>
                         <h3 className="text-muted text-[8px] font-bold uppercase tracking-wide mb-1 opacity-50">Status</h3>
                         <div className="text-lg font-bold font-display text-white mb-4">
                             {userEntry ? `${streak} / 3 Daily Wins` : `Round ${activeRound?.round_number || ''}`}
                         </div>
                         <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-grad-gold shadow-gold" style={{ width: `${(streak / 3) * 100}%` }} />
                         </div>
                      </div>
                      <div className="card p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck className="w-8 h-8" /></div>
                        <div className="flex justify-between items-start mb-5">
                            <div className="p-2 bg-blue-electric/10 rounded-lg"><ShieldCheck className="w-3.5 h-3.5 text-blue-electric" /></div>
                            <span className="badge badge-blue !text-[7px] font-bold tracking-wider">Verified</span>
                         </div>
                         <h3 className="text-muted text-[8px] font-bold uppercase tracking-wide mb-1 opacity-50">Identity</h3>
                         <div className={`text-lg font-bold font-display text-${status.color} mb-4 tracking-tight uppercase italic`}>
                           {status.label} Member
                         </div>
                         <div className="flex items-center gap-2">
                            <div 
                               className={`w-1.5 h-1.5 rounded-full bg-${status.color} opacity-40`} 
                            />
                            <span className="text-[9px] text-muted font-bold uppercase tracking-wider opacity-30 italic">Encryption Active</span>
                         </div>
                      </div>
                   </div>

                   <div className="card p-0 overflow-hidden">
                      <div className="px-5 py-4 flex justify-between items-center bg-white/[0.02] border-b border-white/5">
                         <div className="flex items-center gap-3">
                            <History className="w-4 h-4 text-blue-electric opacity-60" />
                            <h3 className="font-display text-[9px] font-black uppercase tracking-widest">Match Schedule</h3>
                         </div>
                         <Link href="/live-challenges" className="text-[8px] text-blue-electric font-black uppercase tracking-widest hover:underline flex items-center gap-2 group">
                            Full Grid <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                         </Link>
                      </div>
                      <div className="flex flex-col divide-y divide-white/5">
                         {matches.length === 0 ? (
                            <div className="p-12 text-center text-[9px] text-muted italic font-mono opacity-40">No entries scheduled.</div>
                         ) : (
                            matches.slice(0, 5).map(m => (
                               <div key={m.id} className="flex items-center justify-between p-4 hover:bg-white/[0.01] transition-colors group">
                                  <div className="flex-1 text-right font-black text-[10px] text-white uppercase italic truncate">
                                     {m.home_team}
                                  </div>
                                  <div className="flex flex-col items-center gap-1 px-8 border-x border-white/5 min-w-[100px]">
                                     <span className="text-[8px] text-muted font-mono tracking-widest">
                                        {new Date(m.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                     </span>
                                     <div className="px-5 py-0.5 bg-white/5 border border-white/10 rounded-md text-[7px] font-black text-muted group-hover:text-white uppercase">VS</div>
                                  </div>
                                  <div className="flex-1 text-left font-black text-[10px] text-white uppercase italic truncate">
                                     {m.away_team}
                                  </div>
                               </div>
                            ))
                         )}
                      </div>
                   </div>
                </div>
                 <div className="lg:col-span-4 flex flex-col gap-5">
                   <div className="card p-5 border-blue-electric/20 bg-blue-electric/[0.01]">
                      <div className="flex justify-between items-center mb-6">
                         <h3 className="text-[9px] font-bold uppercase tracking-widest text-muted opacity-50">Settlement Protocol</h3>
                         <TrendingUp className="w-3.5 h-3.5 text-success/60" />
                      </div>
                      <div className="p-6 bg-black/40 border border-white/5 rounded-lg text-center mb-6 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Trophy className="w-8 h-8" /></div>
                         <div className="text-muted text-[8px] font-bold uppercase mb-1 tracking-wider leading-none opacity-40 italic">Potential Reward</div>
                         <div className="text-2xl font-bold font-display text-white italic tracking-tighter">10X REWARD</div>
                      </div>
                      <button onClick={() => setActiveTab('wallet')} className="btn btn-blue w-full font-bold uppercase tracking-wide text-xs">Wallet Hub</button>
                   </div>
                   
                   <div className="card p-5 bg-white/[0.015] border-white/5">
                      <h3 className="text-[9px] font-bold text-blue-electric uppercase tracking-widest mb-3 flex items-center gap-2">
                         <ShieldAlert className="w-3.5 h-3.5 opacity-60" /> System Note
                      </h3>
                      <p className="text-[10px] text-secondary leading-relaxed font-medium uppercase tracking-wide italic opacity-40">
                        Round {activeRound?.round_number || ''} protocol is active. 
                        Ensure all daily predictions are submitted.
                      </p>
                   </div>
                </div>

              </div>
            )}

            {activeTab === 'challenge' && (
              <div className="flex flex-col gap-6">
                <div className="card bg-blue-electric/[0.02] border-blue-electric/10 p-5 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                   <div className="flex items-center gap-6 relative z-10">
                      <div className="p-3 bg-blue-electric/10 rounded-lg border border-blue-electric/20"><Zap className="w-5 h-5 text-blue-electric" /></div>
                      <div>
                         <h3 className="font-display text-lg font-black text-white italic tracking-tight uppercase">Live Challenges</h3>
                         <p className="text-muted text-[8px] font-black uppercase tracking-widest opacity-60">Round {activeRound?.round_number || ''}</p>
                      </div>
                   </div>
                   <div className="relative z-10 w-full md:w-auto">
                      <div className="text-center p-3 px-8 bg-black/40 border border-white/5 rounded-lg">
                         <div className="text-[7px] text-muted font-black uppercase mb-1 tracking-widest">Time Remaining</div>
                         <div className="text-base font-black font-mono text-white tracking-widest italic">{activeRound?.end_date ? new Date(activeRound.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'OFFLINE'}</div>
                      </div>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {matches.length === 0 ? (
                    <div className="col-span-3 card py-60 text-center flex flex-col items-center gap-16 border-dashed border-white/5 opacity-30">
                       <Radio className="w-10 h-10 text-muted" />
                       <p className="text-[10px] font-black uppercase tracking-widest font-mono italic">No matches scheduled for this round.</p>
                    </div>
                  ) : (
                    matches.map(m => {
                      const pred = predictions.find(p => p.match_id === m.id);
                      return (
                        <div key={m.id} className="card p-5 hover:border-blue-electric/30 transition-all flex flex-col gap-6 bg-white/[0.01]">
                           <div className="flex justify-between items-center pb-3 border-b border-white/5">
                              <span className="text-[10px] font-bold text-muted font-mono tracking-widest opacity-40">{new Date(m.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {pred ? (
                                <div className="flex items-center gap-2 px-3 py-1 bg-success/5 border border-success/15 rounded-full">
                                   <Target className="w-3 h-3 text-success" />
                                   <span className="text-[8px] font-bold text-success uppercase tracking-wider italic">Locked</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full opacity-40">
                                   <Activity className="w-3 h-3 text-muted" />
                                   <span className="text-[8px] font-bold text-muted uppercase tracking-wider italic">Pending</span>
                                </div>
                              )}
                           </div>
                           <div className="flex flex-col gap-2 text-center py-4">
                              <div className="text-sm font-bold text-white uppercase tracking-tight truncate">{m.home_team}</div>
                              <div className="text-[8px] font-bold text-muted/20 uppercase tracking-[0.3em]">VS</div>
                              <div className="text-sm font-bold text-white uppercase tracking-tight truncate">{m.away_team}</div>
                           </div>
                           <div className="grid grid-cols-3 gap-2">
                              {['1', 'X', '2'].map(choice => (
                                 <button 
                                   key={choice}
                                   onClick={() => handlePrediction(m.id, choice as '1' | 'X' | '2')}
                                   disabled={isPending || !!pred}
                                   className={`py-3 rounded-lg text-[9px] font-bold transition-all border uppercase tracking-wider ${
                                     pred?.prediction === choice 
                                     ? 'bg-blue-electric text-white border-blue-electric shadow-sm' 
                                     : 'bg-white/[0.02] border-white/5 text-muted/60 hover:text-white hover:border-white/20'
                                   }`}
                                 >
                                   {choice === '1' ? '1' : choice === '2' ? '2' : 'X'}
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
            {activeTab === 'wallet' && (
              <div className="flex flex-col gap-6 animate-slide-up">
                
                {/* Financial Summary KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                  {[
                    { label: 'Available Balance', val: balance, icon: WalletIcon, color: 'text-blue-electric', bg: 'bg-blue-electric/5' },
                    { label: 'Pending Settlement', val: pendingPayouts, icon: Lock, color: 'text-gold', bg: 'bg-gold/5' },
                    { label: 'Total Withdrawn', val: txWithdrawn, icon: ArrowDownLeft, color: 'text-muted', bg: 'bg-white/5' },
                    { label: 'Protocol Rewards', val: txRewards, icon: Trophy, color: 'text-success', bg: 'bg-success/5' },
                    { label: 'Network Bonus', val: txReferrals, icon: Users, color: 'text-blue-electric', bg: 'bg-blue-electric/5' },
                  ].map((kpi, i) => (
                    <div key={i} className="card p-4 relative overflow-hidden group border-white/5 bg-white/[0.01]">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                          <kpi.icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-[7px] font-bold text-muted uppercase tracking-widest opacity-30 italic">Live</div>
                      </div>
                      <h3 className="text-muted text-[8px] font-bold uppercase tracking-wider mb-1 opacity-50">{kpi.label}</h3>
                      <div className="text-lg font-bold font-display text-white italic tracking-tighter">₦{kpi.val.toLocaleString()}</div>
                    </div>
                  ))}
                </div>

<div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
                  {/* Left Column: Transactions */}
                  <div className="flex flex-col gap-6">
                    <div className="card p-0 overflow-hidden">
                      <div className="px-5 py-4 bg-white/[0.02] border-b border-white/5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                         <div className="flex items-center gap-3">
                            <History className="w-3.5 h-3.5 text-blue-electric opacity-60" />
                            <h3 className="font-display text-[8px] font-black uppercase tracking-widest">Transaction History</h3>
                         </div>
                         <div className="flex bg-black/40 border border-white/5 rounded-lg p-1 gap-1 w-full sm:w-auto overflow-x-auto no-scrollbar">
                            {[
                              { id: 'transactions', label: 'History' },
                              { id: 'purchases', label: 'Orders' },
                              { id: 'payouts', label: 'Withdraw' }
                            ].map(btn => (
                              <button 
                                key={btn.id}
                                onClick={() => setWalletSubTab(btn.id as any)} 
                                className={`px-3 py-1 text-[7px] font-black uppercase tracking-widest rounded transition-all whitespace-nowrap ${walletSubTab === btn.id ? 'bg-white/10 text-white' : 'text-muted hover:text-white'}`}
                              >
                                {btn.label}
                              </button>
                            ))}
                         </div>
                      </div>
                      
                      {/* Responsive Card-Based List */}
                      <div className="flex flex-col divide-y divide-white/[0.03]">
                        {walletSubTab === 'transactions' && (
                          transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-40 gap-8 opacity-40">
                               <History className="w-8 h-8 text-muted" />
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted">No Wallet Activity Present</p>
                            </div>
                          ) : (
                            transactions.map(tx => {
                              const isPositive = tx.amount > 0;
                              const txIcon = tx.type === 'deposit' ? <ArrowUpRight className="w-4 h-4" /> :
                                           tx.type === 'purchase' ? <Target className="w-4 h-4" /> :
                                           tx.type === 'reward' ? <Trophy className="w-4 h-4" /> :
                                           tx.type === 'referral_bonus' ? <Users className="w-4 h-4" /> :
                                           <ArrowDownLeft className="w-4 h-4" />;
                              
                              return (
                                <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-white/[0.015] transition-colors group">
                                  <div className="flex items-center gap-4 min-w-[200px]">
                                    <div className={`p-2.5 rounded-lg ${isPositive ? 'bg-success/5 text-success' : 'bg-danger/5 text-danger'} border border-current/10`}>
                                      {txIcon}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-bold text-xs text-white uppercase italic tracking-tight">{tx.type.replace('_', ' ')}</span>
                                      <span className="text-[8px] text-muted font-bold uppercase tracking-widest opacity-30">{tx.reference.slice(0, 12)}...</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between sm:justify-end flex-1 gap-6">
                                     <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[7px] font-bold text-muted uppercase tracking-wider opacity-60">
                                           <Check className="w-2.5 h-2.5" /> Verified
                                        </div>
                                        <span className="text-muted font-mono text-[9px] opacity-40">{new Date(tx.created_at).toLocaleDateString()}</span>
                                     </div>
                                     <div className={`font-bold font-display italic text-lg tracking-tighter ${isPositive ? 'text-success' : 'text-white'}`}>
                                        {isPositive ? '+' : '-'}₦{Math.abs(tx.amount).toLocaleString()}
                                     </div>
                                  </div>
                                </div>
                              );
                            })
                          )
                        )}
                        {walletSubTab === 'purchases' && (
                           purchases.length === 0 ? (
                             <div className="flex flex-col items-center justify-center py-40 gap-8 opacity-40">
                                <Target className="w-8 h-8 text-muted" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted">No Purchase History</p>
                             </div>
                           ) : purchases.map(p => (
                             <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-16 gap-12 sm:gap-4 hover:bg-white/[0.01] transition-colors group">
                                <div className="flex items-center gap-10 min-w-[180px]">
                                  <div className="p-8 rounded-lg bg-blue-electric/10 text-blue-electric"><Target className="w-4 h-4" /></div>
                                  <div className="flex flex-col gap-1">
                                    <span className="font-black text-[11px] text-white uppercase italic">Account Tier</span>
                                    <span className="text-[8px] text-muted font-bold uppercase tracking-widest">{(p as any).account_tiers?.name || 'Tier Purchase'}</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end flex-1 gap-6 pl-12 sm:pl-0 border-l border-white/5 sm:border-l-0">
                                   <div className="flex items-center gap-4">
                                      <div className={`flex items-center gap-4 px-6 py-2 border rounded-md ${p.status === 'completed' ? 'bg-success/10 border-success/20' : 'bg-gold/10 border-gold/20'}`}>
                                         {p.status === 'completed' ? <Check className="w-3 h-3 text-success" /> : <AlertCircle className="w-3 h-3 text-gold" />}
                                         <span className={`text-[7px] font-black uppercase tracking-widest hidden sm:block ${p.status === 'completed' ? 'text-success' : 'text-gold'}`}>{p.status === 'completed' ? 'Verified' : p.status}</span>
                                      </div>
                                      <span className="text-muted font-mono text-[9px]">{new Date(p.created_at).toLocaleDateString()}</span>
                                   </div>
                                   <div className="font-black font-display italic text-lg text-white">
                                      ₦{p.amount_paid.toLocaleString()}
                                   </div>
                                </div>
                             </div>
                           ))
                        )}
                        {walletSubTab === 'payouts' && (
                           payoutRequests.length === 0 ? (
                             <div className="flex flex-col items-center justify-center py-40 gap-8 opacity-40">
                                <LogOut className="w-8 h-8 text-muted" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted">No Payout Requests</p>
                             </div>
                           ) : payoutRequests.map(req => (
                             <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-16 gap-12 sm:gap-4 hover:bg-white/[0.01] transition-colors group">
                                <div className="flex items-center gap-10 min-w-[180px]">
                                  <div className={`p-8 rounded-lg ${req.status === 'completed' ? 'bg-success/10 text-success' : req.status === 'rejected' ? 'bg-danger/10 text-danger' : 'bg-gold/10 text-gold'}`}>
                                    <WalletIcon className="w-4 h-4" />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className="font-black text-[11px] text-white uppercase italic">Withdrawal</span>
                                    <span className="text-[8px] text-muted font-bold uppercase tracking-widest truncate max-w-[140px]">{req.bank_account_info?.bank} - {req.bank_account_info?.account?.slice(-4)}</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end flex-1 gap-6 pl-12 sm:pl-0 border-l border-white/5 sm:border-l-0">
                                   <div className="flex items-center gap-4">
                                      <div className={`flex items-center gap-4 px-6 py-2 border rounded-md ${req.status === 'completed' ? 'bg-success/10 border-success/20' : req.status === 'rejected' ? 'bg-danger/10 border-danger/20' : 'bg-gold/10 border-gold/20'}`}>
                                         {req.status === 'completed' ? <Check className="w-3 h-3 text-success" /> : req.status === 'rejected' ? <AlertCircle className="w-3 h-3 text-danger" /> : <Activity className="w-3 h-3 text-gold animate-spin" />}
                                         <span className={`text-[7px] font-black uppercase tracking-widest hidden sm:block ${req.status === 'completed' ? 'text-success' : req.status === 'rejected' ? 'text-danger' : 'text-gold'}`}>{req.status}</span>
                                      </div>
                                      <span className="text-muted font-mono text-[9px]">{new Date(req.created_at).toLocaleDateString()}</span>
                                   </div>
                                   <div className={`font-black font-display italic text-lg ${req.status === 'rejected' ? 'text-danger line-through opacity-50' : req.status === 'pending' ? 'text-gold' : 'text-success'}`}>
                                      ₦{req.amount.toLocaleString()}
                                   </div>
                                </div>
                             </div>
                           ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-col gap-6">
                    {/* Top Up Panel */}
                    <div className="card p-5 bg-blue-electric/[0.01] border-blue-electric/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5"><Zap className="w-12 h-12" /></div>
                      <div className="flex items-center gap-4 mb-5 relative z-10">
                         <div className="p-2 bg-blue-electric/10 rounded-lg border border-blue-electric/20"><Zap className="w-3.5 h-3.5 text-blue-electric" /></div>
                         <div>
                            <h3 className="font-display text-[9px] font-black text-white uppercase tracking-widest">Add Funds</h3>
                            <p className="text-[7px] text-muted font-black uppercase tracking-widest mt-0.5 opacity-60">Top Up</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 relative z-10">
                         {[2500, 5000, 10000, 25000].map(amt => (
                           <button 
                             key={amt}
                             onClick={() => handleTopUp(amt)}
                             disabled={isPending}
                             className="py-2.5 bg-white/[0.02] border border-white/5 rounded-lg text-[8px] font-black text-white hover:bg-blue-electric/10 hover:border-blue-electric/30 transition-all uppercase tracking-widest flex items-center justify-center"
                           >
                             + ₦{amt.toLocaleString()}
                           </button>
                         ))}
                      </div>
                    </div>
                    
                    {/* Withdrawal Panel */}
                    <div className="card p-24 bg-white/[0.02] border-blue-electric/10">
                      <div className="flex items-center gap-12 mb-20">
                         <div className="p-10 bg-gold/10 rounded-xl border border-gold/20"><WalletIcon className="w-4 h-4 text-gold" /></div>
                         <div>
                            <h3 className="font-display text-[11px] font-black text-white uppercase tracking-widest">Withdrawal</h3>
                            <p className="text-[8px] text-muted font-black uppercase tracking-widest mt-1">Wallet Payout</p>
                         </div>
                      </div>
                      <form onSubmit={handlePayout} className="flex flex-col gap-14">
                        <div>
                          <label className="text-[9px] font-black text-muted uppercase block mb-4 tracking-widest ml-4">Amount (₦)</label>
                          <input 
                            type="number" 
                            value={payoutAmount}
                            onChange={(e) => setPayoutAmount(e.target.value)}
                            placeholder="0.00" 
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-16 py-12 text-white font-mono font-black italic focus:outline-none focus:border-blue-electric/40 transition-all text-lg"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-4">
                          <label className="text-[9px] font-black text-muted uppercase block ml-4 tracking-widest">Bank Details</label>
                          <input 
                            type="text" 
                            value={bankInfo.bank}
                            onChange={(e) => setBankInfo({...bankInfo, bank: e.target.value})}
                            placeholder="Bank Name (e.g. Zenith, GTB)" 
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-16 py-10 text-[10px] font-bold text-white focus:outline-none focus:border-white/20 transition-all"
                            required
                          />
                          <input 
                            type="text" 
                            value={bankInfo.account}
                            onChange={(e) => setBankInfo({...bankInfo, account: e.target.value})}
                            placeholder="Account Number (10 digits)" 
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-16 py-10 text-[10px] font-mono font-black text-white focus:outline-none focus:border-white/20 transition-all"
                            required
                          />
                          <input 
                            type="text" 
                            value={bankInfo.name}
                            onChange={(e) => setBankInfo({...bankInfo, name: e.target.value})}
                            placeholder="Account Holder Name" 
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-16 py-10 text-[10px] font-bold text-white focus:outline-none focus:border-white/20 transition-all uppercase"
                            required
                          />
                        </div>
                        <button 
                          disabled={isPending || balance < 1000} 
                          type="submit" 
                          className="btn btn-blue w-full mt-6 py-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-electric/20 flex items-center justify-center gap-8 group"
                        >
                          {isPending ? <Activity className="w-4 h-4 animate-spin" /> : <>Process Payout <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" /></>}
                        </button>
                        {balance < 1000 && (
                          <div className="flex items-center justify-center gap-8 px-12 py-8 bg-danger/10 border border-danger/20 rounded-lg">
                             <AlertCircle className="w-3.5 h-3.5 text-danger" />
                             <span className="text-[8px] text-danger font-black uppercase tracking-widest text-center">Min: ₦1,000</span>
                          </div>
                        )}
                      </form>
                    </div>
                    
                    {/* Integrity Label */}
                    <div className="card p-5 bg-gold/[0.01] border-gold/10 flex flex-col items-center text-center">
                        <div className="flex items-center gap-3 mb-2">
                           <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                           <span className="text-[8px] text-white font-black uppercase tracking-widest">Payment Security</span>
                        </div>
                        <p className="text-[8px] text-muted font-bold italic opacity-40 uppercase tracking-widest leading-relaxed">
                          Withdrawals are processed within 48 hours.
                        </p>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'referrals' && (
              <div className="animate-slide-up flex flex-col gap-6">
                 <div className="card p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden bg-white/[0.01] border-white/5">
                     <div className="absolute top-0 right-0 p-8 opacity-5"><Globe className="w-12 h-12" /></div>
                     <div className="flex-1 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-electric/5 border border-blue-electric/15 rounded-full mb-6">
                           <TrendingUp className="w-3.5 h-3.5 text-blue-electric" />
                           <span className="text-[8px] font-bold text-blue-electric uppercase tracking-wider">Network Rewards</span>
                        </div>
                        <h3 className="font-display text-4xl font-extrabold text-white italic tracking-tight mb-4 uppercase">Refer & <span className="text-gradient-gold">Earn</span></h3>
                        <p className="text-secondary text-[11px] font-medium leading-relaxed max-w-md uppercase tracking-wide italic opacity-40">
                          Scale your portfolio by referring associates. Earn instant yield protocols for every verified onboarding.
                        </p>
                     </div>
                     <div className="relative z-10">
                        <div className="text-center p-8 px-12 bg-black/40 border border-white/5 rounded-2xl shadow-xl backdrop-blur-xl group hover:border-blue-electric/30 transition-all">
                           <div className="text-[9px] text-muted font-bold uppercase mb-1 tracking-widest opacity-40">Verified Referrals</div>
                           <div className="text-4xl font-extrabold font-display text-white italic">{(profile?.referral_count || 0)}</div>
                        </div>
                     </div>
                  </div>

                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="card p-6 bg-white/[0.01] border-white/5 lg:col-span-8">
                       <div className="flex items-center gap-3 mb-8">
                          <div className="p-2 bg-blue-electric/5 rounded-lg border border-blue-electric/10"><Users className="w-4 h-4 text-blue-electric opacity-60" /></div>
                          <h4 className="font-display text-[10px] font-bold text-white uppercase tracking-widest">Identification Protocol</h4>
                       </div>
                       <div className="flex gap-2 p-2 bg-black/40 border border-white/5 rounded-xl focus-within:border-blue-electric/20 transition-all">
                          <input readOnly value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://predchain.com'}/signup?ref=${profile.username}`} className="flex-1 bg-transparent px-4 py-3 font-mono text-xs text-blue-electric font-bold focus:outline-none truncate" />
                          <button onClick={() => { navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || 'https://predchain.com'}/signup?ref=${profile.username}`); showSuccess('Link copied to clipboard.'); }} className="btn btn-blue px-8 font-bold uppercase text-[10px] tracking-wide">COPY</button>
                       </div>
                       <p className="mt-6 text-[8px] text-muted font-bold uppercase tracking-widest italic ml-2 opacity-30">Account Signature: {profile.username?.toUpperCase() || 'NONE'}</p>
                    </div>
                    <div className="card p-6 bg-white/[0.015] border-white/5 flex flex-col justify-between lg:col-span-4">
                       <div>
                          <div className="flex items-center gap-3 mb-4">
                             <div className="p-2 bg-gold/5 rounded-lg border border-gold/10"><Activity className="w-4 h-4 text-gold opacity-60" /></div>
                             <h4 className="font-display text-[10px] font-bold text-white uppercase tracking-widest">Bonus Yield</h4>
                          </div>
                          <p className="text-[10px] text-secondary font-medium uppercase tracking-wide leading-relaxed mb-12 italic opacity-40">
                             Each verification credits <strong>₦1,000</strong> to your active balance hub.
                          </p>
                       </div>
                       <div className="w-full h-1 bg-black/40 rounded-full border border-white/5 overflow-hidden">
                          <div className="h-full bg-grad-gold opacity-20 animate-pulse" style={{ width: '20%' }} />
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* Toast Notifications */}
          {(successMsg || errorMsg) && (
            <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl backdrop-blur-2xl border flex items-center gap-4 shadow-2xl animate-slide-up ${
              successMsg ? 'bg-success/90 border-success/20 text-black' : 'bg-danger/90 border-danger/20 text-white'
            }`}>
               <div className="p-1.5 bg-black/5 rounded-lg">
                 {successMsg ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
               </div>
               <div className="flex flex-col">
                  <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">{successMsg ? 'Protocol Success' : 'System Alert'}</span>
                  <span className="text-[11px] font-bold tracking-tight">{successMsg || errorMsg}</span>
               </div>
               <button onClick={clear} className="ml-8 p-2 hover:bg-black/10 rounded-lg opacity-40 hover:opacity-100 transition-all font-bold text-sm">×</button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
