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
  Target
} from 'lucide-react';
import { submitPrediction } from '@/app/actions/predictions';
import { requestPayout, purchaseTierWithWallet } from '@/app/actions/wallet';
import { initializeWalletFunding } from '@/app/actions/paystack';
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
      case 'active': return { label: 'Verified', color: 'success' };
      case 'suspended': return { label: 'Suspended', color: 'danger' };
      case 'under_review': return { label: 'Review', color: 'gold' };
      default: return { label: 'Verified', color: 'success' };
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
    <div className="relative min-h-screen bg-primary pt-24 pb-12">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-grad-glow opacity-30 pointer-events-none z-0" />

      <main className="relative z-10">
        <div className="container">
          
          {/* Header Summary */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="flex flex-col gap-2">
              <div className="glass-pill px-3 py-1 mb-2 max-w-max">
                <span className={`flex items-center gap-2 text-[10px] font-bold text-${status.color} uppercase tracking-widest`}>
                   <div className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`} />
                   {status.label} Operator Status
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Welcome back, <span className="text-gradient-gold">{displayName}</span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="card-elite !bg-bg-primary/40 px-6 py-3 flex flex-col gap-1 min-w-[140px]">
                <span className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-50">Balance (NGN)</span>
                <span className="text-xl font-bold text-white font-mono leading-none">₦{balance.toLocaleString()}</span>
              </div>
              <button onClick={() => setActiveTab('wallet')} className="btn btn-primary h-[54px] px-6 rounded-2xl">
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
             {[
               { id: 'overview',   label: 'Hub',        icon: Layout },
               { id: 'challenge',  label: 'Arena',      icon: Zap },
               { id: 'wallet',     label: 'Console',    icon: WalletIcon },
               { id: 'referrals',  label: 'Referrals',  icon: Users }
             ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl transition-all border whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'card-elite !border-gold/20 !bg-gold/5 text-white' 
                    : 'bg-transparent border-transparent text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                   <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-gold' : 'opacity-40'}`} />
                   <span className="text-[11px] font-bold uppercase tracking-widest">{tab.label}</span>
                </button>
             ))}
          </div>

          <div className="animate-slide-up">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 flex flex-col gap-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="card-elite p-6 group">
                         <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-gold/10 rounded-xl border border-gold/10"><Activity className="w-4 h-4 text-gold" /></div>
                            <span className="badge-elite !text-gold border-gold/10">LIVE NODE</span>
                         </div>
                         <h3 className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">STREAK STATUS</h3>
                         <div className="text-2xl font-bold text-white mb-6">
                             {userEntry ? `${streak} / 3 SUCCESSFUL` : `PROTOCOL INACTIVE`}
                         </div>
                         <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-grad-gold shadow-[0_0_15px_rgba(197,160,89,0.3)] transition-all duration-700" style={{ width: `${(streak / 3) * 100}%` }} />
                         </div>
                      </div>

                      <div className="card-elite p-6 group">
                         <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-blue-electric/10 rounded-xl border border-blue-electric/10"><ShieldCheck className="w-4 h-4 text-blue-electric" /></div>
                            <span className="badge-elite !text-blue-electric border-blue-electric/10">SECURE</span>
                         </div>
                         <h3 className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">NODE SECURITY</h3>
                         <div className="text-2xl font-bold text-white mb-6 tracking-tight uppercase">
                           ENCRYPTED
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-success opacity-60 animate-pulse" />
                            <span className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-40">Encryption Handshake Verified</span>
                         </div>
                      </div>
                   </div>

                   <div className="card-elite !p-0">
                      <div className="px-6 py-5 flex justify-between items-center bg-white/[0.02] border-b border-white/5">
                         <div className="flex items-center gap-3">
                            <History className="w-5 h-5 text-blue-electric opacity-60" />
                            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Active Schedule</h3>
                         </div>
                         <Link href="/live-challenges" className="btn btn-ghost !py-1 !px-3 rounded-full text-[10px] gap-2">
                             Full Arena <ArrowRight className="w-3.5 h-3.5" />
                         </Link>
                      </div>
                      <div className="flex flex-col divide-y divide-white/5">
                         {matches.length === 0 ? (
                            <div className="p-16 text-center text-muted text-[10px] font-bold uppercase tracking-widest opacity-30 italic">No arena events scheduled.</div>
                         ) : (
                            matches.slice(0, 5).map(m => (
                               <div key={m.id} className="flex items-center justify-between p-5 hover:bg-white/[0.015] transition-all">
                                  <div className="flex-1 text-right font-bold text-xs text-white uppercase truncate">
                                     {m.home_team}
                                  </div>
                                  <div className="flex flex-col items-center gap-1.5 px-10 border-x border-white/5 min-w-[120px]">
                                     <span className="text-[10px] text-muted font-mono tracking-widest">
                                        {new Date(m.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                     </span>
                                     <div className="px-4 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-bold text-muted uppercase">VS</div>
                                  </div>
                                  <div className="flex-1 text-left font-bold text-xs text-white uppercase truncate">
                                     {m.away_team}
                                  </div>
                                </div>
                            ))
                         )}
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                   <div className="card-elite p-6 border-gold/10 bg-gold/[0.02] relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><Trophy className="w-16 h-16" /></div>
                      <div className="flex justify-between items-center mb-10">
                         <h3 className="text-secondary text-[10px] font-bold uppercase tracking-widest opacity-50">REWARD HUB</h3>
                         <Trophy className="w-4 h-4 text-gold/60" />
                      </div>
                      <div className="p-6 bg-bg-primary/40 border border-white/5 rounded-2xl text-center mb-8">
                         <div className="text-muted text-[9px] font-bold uppercase mb-2 tracking-widest opacity-40">ESTIMATED YIELD</div>
                         <div className="text-3xl font-bold text-white italic tracking-tighter">10X PAYOUT</div>
                      </div>
                      <button onClick={() => setActiveTab('wallet')} className="btn btn-primary w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs">Access Console</button>
                   </div>
                   
                   <div className="card-elite p-6 bg-white/[0.01] border-white/5">
                      <div className="flex items-center gap-3 mb-4">
                         <ShieldAlert className="w-4 h-4 text-danger opacity-60" />
                         <span className="text-[10px] font-bold text-white uppercase tracking-widest">Operator Directive</span>
                      </div>
                      <p className="text-[11px] text-secondary leading-relaxed font-medium opacity-50">
                        Maintain 100% streak integrity during the Round {activeRound?.round_number || 'X'} protocol 
                        to ensure automated reward settlement.
                      </p>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'challenge' && (
              <div className="flex flex-col gap-6">
                <div className="card-elite p-6 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden border-blue-electric/20">
                   <div className="absolute top-0 right-0 p-8 opacity-5"><Zap className="w-16 h-16" /></div>
                   <div className="flex items-center gap-6">
                      <div className="p-3 bg-blue-electric/10 rounded-xl border border-blue-electric/20"><Radio className="w-5 h-5 text-blue-electric" /></div>
                      <div>
                         <h3 className="text-xl font-bold text-white tracking-tight">Arena Protocol</h3>
                         <p className="text-muted text-[9px] font-bold uppercase tracking-widest opacity-50">Round {activeRound?.round_number || ''} Connection Active</p>
                      </div>
                   </div>
                   <div className="px-8 py-3 bg-black/40 border border-white/5 rounded-2xl text-center min-w-[200px]">
                      <div className="text-[8px] text-muted font-bold uppercase mb-1 tracking-widest opacity-40 italic">Cycle Expiry</div>
                      <div className="text-lg font-bold font-mono text-white tracking-widest">{activeRound?.end_date ? new Date(activeRound.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'OFFLINE'}</div>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matches.length === 0 ? (
                    <div className="col-span-full card-elite py-40 border-dashed border-white/5 flex flex-col items-center gap-6 opacity-30">
                       <Zap className="w-12 h-12" />
                       <p className="text-[11px] font-bold uppercase tracking-widest">No active arena events synchronized.</p>
                    </div>
                  ) : (
                    matches.map(m => {
                      const pred = predictions.find(p => p.match_id === m.id);
                      return (
                        <div key={m.id} className="card-elite p-6 hover:border-blue-electric/30 transition-all flex flex-col gap-8">
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold font-mono text-muted opacity-40">{new Date(m.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {pred ? (
                                <div className="badge-elite !text-success border-success/20 !px-4">LOCKED</div>
                              ) : (
                                <div className="badge-elite !text-muted border-white/5 !px-4 opacity-40">AWAITING</div>
                              )}
                           </div>
                           <div className="flex flex-col gap-3 text-center">
                              <div className="text-sm font-bold text-white uppercase tracking-tight">{m.home_team}</div>
                              <div className="text-[9px] font-bold text-muted/20 uppercase tracking-[0.3em]">VERSUS</div>
                              <div className="text-sm font-bold text-white uppercase tracking-tight">{m.away_team}</div>
                           </div>
                           <div className="grid grid-cols-3 gap-2">
                              {['1', 'X', '2'].map(choice => (
                                 <button 
                                   key={choice}
                                   onClick={() => handlePrediction(m.id, choice as '1' | 'X' | '2')}
                                   disabled={isPending || !!pred}
                                   className={`py-3.5 rounded-xl text-[10px] font-bold transition-all border uppercase tracking-widest ${
                                     pred?.prediction === choice 
                                     ? 'bg-blue-electric text-white border-blue-electric shadow-[0_0_20px_rgba(56,189,248,0.2)]' 
                                     : 'bg-white/[0.02] border-white/5 text-muted/60 hover:text-white hover:border-white/20'
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

            {activeTab === 'wallet' && (
              <div className="flex flex-col gap-8 animate-slide-up">
                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                  {[
                    { label: 'Network Balance', val: balance, icon: WalletIcon, color: 'text-blue-electric', bg: 'bg-blue-electric/10' },
                    { label: 'Settlement Node', val: pendingPayouts, icon: Lock, color: 'text-gold', bg: 'bg-gold/10' },
                    { label: 'Net Withdrawal', val: txWithdrawn, icon: ArrowDownLeft, color: 'text-muted', bg: 'bg-white/10' },
                    { label: 'Cycle Rewards', val: txRewards, icon: Trophy, color: 'text-success', bg: 'bg-success/10' },
                    { label: 'Partner Bonus', val: txReferrals, icon: Users, color: 'text-blue-electric', bg: 'bg-blue-electric/10' },
                  ].map((kpi, i) => (
                    <div key={i} className="card-elite p-5 relative group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><kpi.icon className="w-10 h-10" /></div>
                      <div className={`p-2.5 w-max rounded-xl ${kpi.bg} ${kpi.color} mb-6 border border-current/10`}>
                        <kpi.icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-1 opacity-50">{kpi.label}</h3>
                      <div className="text-xl font-bold text-white font-mono tracking-tight">₦{kpi.val.toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">
                  {/* Ledger */}
                  <div className="flex flex-col gap-6">
                    <div className="card-elite !p-0">
                      <div className="px-6 py-5 bg-white/[0.02] border-b border-white/5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                         <div className="flex items-center gap-3">
                            <History className="w-5 h-5 text-blue-electric opacity-60" />
                            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Operation Ledger</h3>
                         </div>
                         <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 gap-1">
                            {['transactions', 'purchases', 'payouts'].map(id => (
                              <button 
                                key={id}
                                onClick={() => setWalletSubTab(id as any)} 
                                className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all ${walletSubTab === id ? 'bg-white/10 text-white' : 'text-muted'}`}
                              >
                                {id}
                              </button>
                            ))}
                         </div>
                      </div>
                      
                      <div className="flex flex-col divide-y divide-white/5">
                        {walletSubTab === 'transactions' && (
                          transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-40 gap-6 opacity-30">
                               <History className="w-10 h-10" />
                               <p className="text-[11px] font-bold uppercase tracking-widest">No wallet movements detected.</p>
                            </div>
                          ) : (
                            transactions.map(tx => (
                                <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-6 hover:bg-white/[0.015] transition-all">
                                  <div className="flex items-center gap-5 min-w-[220px]">
                                    <div className={`p-3 rounded-xl ${tx.amount > 0 ? 'bg-success/5 text-success' : 'bg-danger/5 text-danger'} border border-current/10`}>
                                      {tx.type === 'deposit' ? <ArrowUpLeft className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <span className="font-bold text-xs text-white uppercase tracking-tight">{tx.type.replace('_', ' ')}</span>
                                      <span className="text-[9px] font-mono text-muted opacity-40 uppercase">{tx.reference.slice(0, 10)}</span>
                                    </div>
                                  </div>
                                  <div className="font-bold text-xl font-mono tracking-tighter text-white">
                                     ₦{Math.abs(tx.amount).toLocaleString()}
                                  </div>
                                </div>
                            ))
                          )
                        )}
                        {walletSubTab !== 'transactions' && (
                           <div className="flex flex-col items-center justify-center py-40 gap-6 opacity-30">
                            <Lock className="w-10 h-10" />
                            <p className="text-[11px] font-bold uppercase tracking-widest">Access Restricted to Master Ledger.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-8">
                    <div className="card-elite p-6 bg-blue-electric/5 border-blue-electric/10">
                      <div className="flex items-center gap-4 mb-8">
                         <div className="p-2.5 bg-blue-electric/10 rounded-xl border border-blue-electric/20"><Zap className="w-4 h-4 text-blue-electric" /></div>
                         <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Top Up Wallet</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                         {[5000, 10000, 25000, 50000].map(amt => (
                           <button 
                             key={amt}
                             onClick={() => handleTopUp(amt)}
                             disabled={isPending}
                             className="py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-white hover:bg-white/10 hover:border-blue-electric/40 transition-all uppercase tracking-widest"
                           >
                             + ₦{amt.toLocaleString()}
                           </button>
                         ))}
                      </div>
                    </div>
                    
                    <div className="card-elite p-8">
                      <div className="flex items-center gap-4 mb-8">
                         <div className="p-2.5 bg-gold/10 rounded-xl border border-gold/20"><LogOut className="w-4 h-4 text-gold rotate-90" /></div>
                         <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Payout Request</h3>
                      </div>
                      <form onSubmit={handlePayout} className="flex flex-col gap-8">
                        <input 
                          type="number" 
                          value={payoutAmount}
                          onChange={(e) => setPayoutAmount(e.target.value)}
                          placeholder="₦0.00" 
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white font-mono text-2xl font-bold focus:border-blue-electric/40 outline-none"
                          required
                        />
                        <button 
                          disabled={isPending || balance < 1000} 
                          type="submit" 
                          className="btn btn-primary w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px]"
                        >
                          {isPending ? "PROCESSING..." : "PROCESS PAYOUT"}
                        </button>
                      </form>
                      <p className="mt-6 text-[8px] text-muted font-bold text-center uppercase opacity-30">Withdrawals processed within 48h</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'referrals' && (
              <div className="animate-slide-up flex flex-col gap-8">
                 <div className="card-elite p-10 flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden bg-grad-glow opacity-90">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.03]"><Globe className="w-32 h-32" /></div>
                     <div className="flex-1 relative z-10">
                        <div className="badge-elite mb-6">NETWORK GROWER</div>
                        <h3 className="text-4xl font-bold text-white tracking-tight mb-4">Scale the <span className="text-gradient-gold">Network.</span></h3>
                        <p className="text-secondary text-sm opacity-60">Invite associates to the arena pool and earn yield rewards.</p>
                     </div>
                     <div className="card-elite p-10 px-14 text-center">
                        <div className="text-[10px] text-muted font-bold uppercase mb-2 tracking-widest opacity-40">Verified</div>
                        <div className="text-5xl font-bold text-white italic">{(profile?.referral_count || 0)}</div>
                     </div>
                  </div>

                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="card-elite p-10 lg:col-span-8">
                       <h4 className="text-[11px] font-bold text-white uppercase tracking-widest mb-8">Identification Protocol</h4>
                       <div className="flex gap-3 p-3 bg-black/60 border border-white/10 rounded-2xl">
                          <input readOnly value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://predchain.com'}/signup?ref=${profile.username}`} className="flex-1 bg-transparent px-5 py-4 font-mono text-sm text-gold font-bold outline-none truncate" />
                          <button onClick={() => { navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || 'https://predchain.com'}/signup?ref=${profile.username}`); showSuccess('Protocol link copied.'); }} className="btn btn-primary px-10 rounded-xl font-bold uppercase text-[11px] tracking-widest">COPY</button>
                       </div>
                    </div>
                    <div className="card-elite p-10 flex flex-col justify-between lg:col-span-4 bg-gold/[0.02]">
                       <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">Yield Rewards</h4>
                       <p className="text-secondary text-xs opacity-50 uppercase font-bold tracking-wider leading-relaxed">
                          Each verified Node activation credits <strong>₦1,000</strong> to your balanced volume.
                       </p>
                       <div className="w-full h-1.5 bg-black/60 rounded-full border border-white/5 overflow-hidden">
                          <div className="h-full bg-grad-gold opacity-10 animate-pulse" style={{ width: '20%' }} />
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* Toast Notifications */}
          {(successMsg || errorMsg) && (
            <div className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-2xl backdrop-blur-3xl border flex items-center gap-6 shadow-2xl animate-slide-up ${
              successMsg ? 'bg-success/90 border-success/20 text-black' : 'bg-danger/90 border-danger/20 text-white'
            }`}>
               <div className="p-2 bg-black/5 rounded-xl">
                 {successMsg ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">{successMsg ? 'NODE SUCCESS' : 'NETWORK ALERT'}</span>
                  <span className="text-[13px] font-bold tracking-tight">{successMsg || errorMsg}</span>
               </div>
               <button onClick={clear} className="ml-10 p-2 hover:bg-black/10 rounded-xl opacity-40 hover:opacity-100 transition-all font-bold text-lg">×</button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
