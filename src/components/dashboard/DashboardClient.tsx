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
import { motion } from 'framer-motion';
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
  };  return (
    <div className="relative min-h-screen bg-primary pt-24 pb-20 md:pt-48">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-full h-[800px] bg-gold-glow blur-[180px] opacity-[0.08]" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-glow blur-[150px] opacity-[0.03]" />
      </div>

      <div className="container-tight relative z-10 px-4 sm:px-0">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 animate-fade-in">
          <div className="space-y-6">
            <div className="badge-luxury !text-gold bg-gold/5 px-6 py-2 uppercase tracking-[0.4em] font-black text-[9px] italic">DASHBOARD</div>
            <h1 className="leading-none tracking-tighter uppercase italic font-black text-5xl md:text-7xl text-white">Performance <span className="text-gradient-gold">Hub.</span></h1>
            <div className="flex flex-wrap items-center gap-10">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-[1.2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center text-gold shadow-inner font-black font-display italic text-lg group-hover:rotate-12 transition-transform duration-500">
                    {displayName.charAt(0).toUpperCase()}
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-lg font-black text-white uppercase tracking-tight italic font-display">@{displayName}</span>
                    <span className="text-[9px] font-black text-text-dim uppercase tracking-[0.3em] opacity-30 italic">ARENA HANDLE • {user.id.slice(0, 8)}</span>
                 </div>
              </div>
              <div className="w-px h-8 bg-white/10 hidden md:block" />
              <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-full shadow-inner">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                 <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Arena Operational</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <Link href="/dashboard/settings" className="btn-luxury btn-outline !px-8 !py-4 border-white/10 hover:border-gold/30 group">
                <Settings className="w-4 h-4 mr-3 opacity-30 group-hover:opacity-100 transition-opacity" /> 
                <span className="text-[10px] font-black italic uppercase tracking-[0.2em]">Settings</span>
             </Link>
             <button onClick={() => logout()} className="btn-luxury btn-outline !px-8 !py-4 border-white/10 text-rose-500/40 hover:text-rose-500 hover:border-rose-500/20 group">
                <LogOut className="w-4 h-4 mr-3 transition-transform group-hover:-translate-x-1" />
                <span className="text-[10px] font-black italic uppercase tracking-[0.2em]">Disconnect</span>
             </button>
          </div>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {[
            { label: 'Available Balance', val: `₦${balance.toLocaleString()}`, icon: WalletIcon, color: 'text-gold' },
            { label: 'Active Plan', val: currentPlan?.name || 'INACTIVE', icon: Zap, color: 'text-blue-electric' },
            { label: 'Active Streak', val: `${streak}/3`, icon: Star, color: 'text-emerald-500' },
            { label: 'Verified Rewards', val: `₦${(totalRewards + totalReferrals).toLocaleString()}`, icon: Trophy, color: 'text-white' },
          ].map((m, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -6, scale: 1.02 }}
              className="card-luxury !p-10 group hover:border-gold/30 transition-all duration-700 depth-card shadow-2xl bg-[#07090e]"
            >
               <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em] opacity-30 italic">{m.label}</span>
                     <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center shadow-inner group-hover:bg-gold/10 transition-colors">
                        <m.icon className={`w-4.5 h-4.5 text-text-dim opacity-30 group-hover:opacity-100 transition-all duration-500`} />
                     </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-white font-display tracking-tighter italic leading-none group-hover:text-gold transition-colors duration-700">
                     {m.val}
                  </div>
               </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 mb-12 overflow-x-auto no-scrollbar pb-4 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            {[
              { id: 'overview', label: 'Overview', icon: Layout },
              { id: 'arena', label: 'Predictions', icon: Target },
              { id: 'wallet', label: 'Finances', icon: WalletIcon },
              { id: 'network', label: 'Partners', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-4 px-10 py-4 rounded-[2rem] border transition-all duration-700 whitespace-nowrap shadow-inner ${
                  activeTab === tab.id 
                  ? 'bg-white/[0.05] border-white/10 text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)]' 
                  : 'bg-transparent border-transparent text-text-dim opacity-30 hover:opacity-100 hover:text-white'
                }`}
              >
                 <tab.icon className={`w-4 h-4 transition-all duration-700 ${activeTab === tab.id ? 'text-gold scale-110' : 'opacity-20'}`} />
                 <span className="text-[11px] font-black uppercase tracking-[0.2em] font-display italic">{tab.label}</span>
              </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-8 space-y-10">
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card-luxury !p-16 md:!p-24 relative overflow-hidden group depth-card bg-[#07090e] border-white/10 shadow-2xl"
                 >
                    <div className="absolute top-0 right-0 p-24 opacity-[0.01] pointer-events-none group-hover:opacity-[0.05] transition-opacity rotate-12 duration-1000"><Target className="w-96 h-96" /></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-16 relative z-10">
                       <div className="max-w-xl">
                          <div className="badge-luxury !text-gold mb-12 px-8 py-2.5 uppercase tracking-[0.4em] font-black italic bg-white/[0.02] border-white/10 w-fit">Winning Streak</div>
                          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 font-display uppercase italic text-white leading-none">Arena <br /><span className="text-gradient-gold">Velocity.</span></h2>
                          <p className="text-text-dim text-base md:text-lg font-medium opacity-40 leading-relaxed mb-16 italic group-hover:opacity-100 transition-opacity duration-1000">
                            {userEntry ? `Your ${currentPlan?.name} program is active. Maintain perfect execution across 3 match days to trigger your verified multiplier payout.` : 'Your prediction arena is currently inactive. Select an entry tier to begin your participation in the arena.'}
                          </p>
                          <Link href={userEntry ? "/dashboard?tab=arena" : "/accounts"} className="btn-luxury btn-gold btn-premium-depth !px-16 !py-6 shadow-2xl flex items-center justify-center w-full sm:w-auto text-[11px] font-black italic tracking-[0.3em] uppercase">
                             {userEntry ? 'ENTER ARENA' : 'SELECT PLAN'} <ArrowRight className="w-5 h-5 ml-5 transition-transform group-hover:translate-x-2" />
                          </Link>
                       </div>
                       
                       <div className="shrink-0 text-center space-y-8">
                          <div className="relative w-56 h-56 mx-auto">
                            <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_20px_rgba(242,201,76,0.1)]">
                              <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/[0.02]" />
                              <motion.circle 
                                initial={{ strokeDashoffset: 628 }}
                                animate={{ strokeDashoffset: 628 - (628 * (streak / 3)) }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gold shadow-[0_0_40px_rgba(240,196,25,0.6)]" strokeDasharray="628" strokeLinecap="round" 
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-7xl font-black text-white font-display leading-none italic">{streak}/3</span>
                              <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em] mt-5 opacity-40 italic">STREAK LIVE</span>
                            </div>
                          </div>
                       </div>
                    </div>
                 </motion.div>

                 {/* Recent Activity */}
                 <div className="card-luxury !p-0 overflow-hidden group bg-[#07090e] border-white/10 shadow-2xl">
                    <div className="px-12 py-8 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                       <span className="text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-4 opacity-40 italic">
                          <History className="w-5 h-5 text-gold/40" /> Platform Records
                       </span>
                       <button onClick={() => setActiveTab('wallet')} className="text-[10px] font-black text-gold hover:text-white transition-all uppercase tracking-[0.2em] italic">VIEW ALL</button>
                    </div>
                    <div className="divide-y divide-white/5">
                       {transactions.length === 0 ? (
                        <div className="py-40 text-center opacity-20 space-y-6">
                           <Activity className="w-16 h-16 mx-auto text-gold/20" />
                           <span className="text-[12px] font-black uppercase tracking-[0.5em] italic leading-none">No records found</span>
                        </div>
                       ) : (
                        transactions.slice(0, 5).map(tx => (
                          <div key={tx.id} className="p-10 flex items-center justify-between hover:bg-white/[0.01] transition-all group/item duration-500">
                             <div className="flex items-center gap-10">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner transition-all duration-500 group-hover/item:rotate-12 ${tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 'bg-white/[0.03] text-white/20 border-white/5'}`}>
                                   {tx.type === 'reward' ? <Trophy className="w-6 h-6" /> : <WalletIcon className="w-6 h-6" />}
                                </div>
                                <div className="flex flex-col gap-1">
                                   <span className="text-base font-black text-white uppercase tracking-tighter italic font-display group-hover/item:text-gold transition-colors">{tx.type.split('_').join(' ')}</span>
                                   <span suppressHydrationWarning className="text-[10px] font-black text-text-dim opacity-30 uppercase tracking-[0.3em] italic">{formatDate(tx.created_at)} • {tx.reference.slice(0, 8)}</span>
                                </div>
                             </div>
                             <span className={`text-3xl font-black font-display tracking-tighter italic ${tx.amount > 0 ? 'text-emerald-500' : 'text-white'}`}>
                                {tx.amount > 0 ? '+' : ''}₦{Math.abs(tx.amount).toLocaleString()}
                             </span>
                          </div>
                        ))
                       )}
                    </div>
                 </div>
              </div>

              {/* Sidebar Cards */}
              <div className="lg:col-span-4 space-y-10">
                 <div className="card-luxury !p-12 group bg-[#07090e] border-white/10 shadow-2xl depth-card">
                    <div className="flex items-center justify-between mb-10">
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] italic opacity-40">PERFORMANCE DATA</span>
                       <Activity className="w-5 h-5 text-emerald-500 opacity-30 animate-pulse" />
                    </div>
                    <div className="flex items-end gap-3 h-32 mb-10">
                       {[45, 60, 30, 80, 50, 90, 70, 40].map((h, i) => (
                         <div key={i} className="flex-1 bg-white/[0.02] rounded-t-2xl relative group/bar overflow-hidden shadow-inner">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className="absolute bottom-0 w-full bg-emerald-500/10" 
                            />
                            <div className="absolute bottom-0 w-full bg-gold opacity-0 group-hover/bar:opacity-100 transition-all duration-500" style={{ height: `${h}%` }} />
                         </div>
                       ))}
                    </div>
                    <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em] opacity-30 italic leading-loose">Live match updates with global arena outcomes in progress.</p>
                 </div>

                 <Link href="/arena" className="card-luxury !p-12 block group hover:border-gold/30 transition-all duration-700 bg-[#07090e] border-white/10 shadow-2xl depth-card">
                    <div className="flex items-center justify-between mb-8">
                       <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em] italic opacity-40">EXPLORE ARENA</span>
                       <ArrowUpRight className="w-6 h-6 text-gold group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                    </div>
                    <p className="text-[11px] font-black text-text-dim uppercase tracking-[0.3em] opacity-30 leading-loose italic group-hover:opacity-100 transition-opacity duration-700">Audit the live match arena, monitor upcoming fixtures and analyze global prediction trends.</p>
                 </Link>
              </div>
            </div>
          )}

          {/* ARENA */}
          {activeTab === 'arena' && (
            <div className="space-y-12">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="card-luxury !p-10 md:!p-16 flex flex-col md:flex-row justify-between items-center gap-12 bg-[#07090e] border-white/10 shadow-2xl"
               >
                  <div className="flex items-center gap-10">
                     <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <Radio className="w-8 h-8 text-gold animate-pulse shadow-[0_0_20px_rgba(242,201,76,0.3)]" />
                     </div>
                     <div className="space-y-3">
                        <h3 className="text-3xl md:text-5xl font-black text-white font-display uppercase italic tracking-tighter leading-none">Arena Active</h3>
                        <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.4em] opacity-30 italic leading-none">Match Round {activeRound?.round_number || '01'} • Match Stream Functional</p>
                     </div>
                  </div>
                  <div className="px-16 py-8 bg-black/60 border border-white/5 rounded-[2.5rem] text-center shadow-inner glass-layered">
                     <span className="text-[10px] font-black text-text-dim uppercase mb-4 tracking-[0.4em] opacity-30 block italic">SECURE LOGOUT</span>
                     <div className="text-4xl font-black text-white font-display tracking-tighter italic leading-none transition-transform group-hover:scale-110 duration-700">
                        {activeRound?.end_date ? new Date(activeRound.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'LOCKED'}
                     </div>
                  </div>
               </motion.div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {matches.length === 0 ? (
                    <div className="col-span-full py-64 text-center card-luxury border border-dashed border-white/10 bg-[#07090e] rounded-[4rem] shadow-inner opacity-20 group">
                       <Zap className="w-20 h-20 mx-auto text-gold/20 animate-pulse mb-10" />
                       <span className="text-sm font-black uppercase tracking-[0.6em] italic block mb-12">NO MATCHES AVAILABLE</span>
                       <button onClick={() => window.location.reload()} className="btn-luxury btn-outline !px-16 !py-5 font-black text-[11px] tracking-[0.3em] italic uppercase">REFRESH ARENA</button>
                    </div>
                  ) : (
                    matches.map((m, i) => {
                      const pred = predictions.find(p => p.match_id === m.id);
                      return (
                        <motion.div 
                          key={m.id} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="card-luxury !p-12 group/match relative overflow-hidden flex flex-col bg-[#07090e] border-white/10 shadow-2xl depth-card duration-700"
                        >
                           <div className="flex justify-between items-center mb-16">
                              <span className="text-[11px] font-black text-text-dim uppercase tracking-[0.3em] opacity-30 italic">{new Date(m.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}_UTC</span>
                              <div className={`badge-luxury !py-2 !px-6 text-[9px] font-black tracking-[0.3em] italic ${pred ? '!bg-emerald-500/5 !text-emerald-500 border-emerald-500/10 shadow-inner' : 'bg-white/[0.02] text-text-dim opacity-20 border-white/5'}`}>
                                {pred ? 'SECURED' : 'PENDING'}
                              </div>
                           </div>
                           <div className="space-y-8 text-center mb-16 flex-1">
                              <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic font-display group-hover/match:text-gold transition-all duration-700">{m.home_team}</h4>
                              <div className="text-[10px] font-black text-text-dim opacity-20 tracking-[0.6em] italic py-2">_VS_</div>
                              <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic font-display group-hover/match:text-gold transition-all duration-700">{m.away_team}</h4>
                           </div>
                           <div className="grid grid-cols-3 gap-5 pt-10 border-t border-white/5">
                              {['1', 'X', '2'].map(choice => (
                                 <button 
                                   key={choice}
                                   onClick={() => handlePrediction(m.id, choice as '1' | 'X' | '2')}
                                   disabled={isPending || !!pred || !userEntry}
                                   className={`py-6 rounded-[1.5rem] font-black text-[13px] transition-all duration-700 border font-display italic tracking-widest ${
                                     pred?.prediction === choice 
                                     ? 'bg-gold text-black border-gold shadow-[0_15px_30px_rgba(242,201,76,0.3)] scale-105' 
                                     : 'bg-white/[0.02] border-white/5 text-text-dim opacity-40 hover:opacity-100 hover:text-white hover:border-gold/30 hover:bg-gold/5'
                                   }`}
                                 >
                                   {choice}
                                 </button>
                              ))}
                           </div>
                        </motion.div>
                      );
                    })
                  )}
               </div>
            </div>
          )}

          {/* FINANCES */}
          {activeTab === 'wallet' && (
            <div className="space-y-12">
               {/* Wallet Analytics */}
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { label: 'Network Balance', val: balance, icon: WalletIcon, color: 'text-gold' },
                    { label: 'Streak Rewards', val: totalRewards, icon: Trophy, color: 'text-emerald-500' },
                    { label: 'Partner Bonus', val: totalReferrals, icon: Users, color: 'text-blue-500' },
                    { label: 'Pending Payouts', val: pendingPayouts, icon: History, color: 'text-white' },
                  ].map((k, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="card-luxury !p-10 relative overflow-hidden group depth-card shadow-2xl bg-[#07090e]"
                    >
                       <k.icon className={`absolute -top-6 -right-6 w-24 h-24 opacity-[0.02] group-hover:opacity-[0.08] transition-all duration-1000 ${k.color} rotate-12`} />
                       <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.4em] mb-6 block opacity-30 italic">{k.label}</span>
                       <span className="text-3xl md:text-4xl font-black text-white font-display tracking-tighter leading-none italic group-hover:text-gold transition-colors duration-700">₦{k.val.toLocaleString()}</span>
                    </motion.div>
                  ))}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  {/* Ledger */}
                  <div className="lg:col-span-8 card-luxury !p-0 overflow-hidden shadow-2xl bg-[#07090e] border-white/10">
                     <div className="px-12 py-8 bg-white/[0.02] border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <span className="text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-4 opacity-40 italic"><History className="w-5 h-5 text-gold/40" /> PAYOUT RECORDS</span>
                        <div className="flex bg-black shadow-inner border border-white/5 rounded-[1.5rem] p-1.5 gap-2">
                           {[
                             { id: 'transactions', label: 'Arena Ledger' },
                             { id: 'payouts', label: 'Payout Logs' }
                           ].map(t => (
                             <button key={t.id} onClick={() => setWalletSubTab(t.id as any)} className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 font-display italic ${walletSubTab === t.id ? 'bg-white/10 text-white shadow-lg scale-105' : 'text-text-dim opacity-30 hover:opacity-100'}`}>{t.label}</button>
                           ))}
                        </div>
                     </div>
                     <div className="divide-y divide-white/5">
                        {walletSubTab === 'transactions' && (
                          transactions.length === 0 ? (
                            <div className="py-48 text-center opacity-20 space-y-8">
                               <History className="w-20 h-20 mx-auto text-gold/10 animate-pulse" />
                               <span className="text-xs font-black uppercase tracking-[0.5em] italic block">No records found</span>
                            </div>
                          ) : (
                             transactions.map(tx => (
                               <div key={tx.id} className="p-12 flex items-center justify-between hover:bg-white/[0.01] transition-all group/tx duration-500">
                                  <div className="flex items-center gap-10">
                                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner transition-all duration-700 group-hover/tx:rotate-12 ${tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 'bg-white/[0.03] text-white/30 border-white/5'}`}>
                                        {tx.amount > 0 ? <ArrowDownLeft className="w-7 h-7" /> : <ArrowUpLeft className="w-7 h-7" />}
                                     </div>
                                     <div className="space-y-2">
                                        <div className="text-lg font-black text-white uppercase tracking-tighter italic font-display group-hover/tx:text-gold transition-colors">{tx.type.split('_').join(' ')}</div>
                                        <div className="text-[10px] font-black text-text-dim opacity-30 uppercase tracking-[0.3em] italic">{tx.reference.slice(0, 16)} • {formatDate(tx.created_at)}</div>
                                     </div>
                                  </div>
                                  <span className={`text-3xl font-black font-display tracking-tighter italic ${tx.amount > 0 ? 'text-emerald-500' : 'text-white'}`}>₦{Math.abs(tx.amount).toLocaleString()}</span>
                               </div>
                             ))
                          )
                        )}
                        {walletSubTab === 'payouts' && (
                          <div className="py-48 text-center opacity-20 space-y-8">
                             <ShieldAlert className="w-20 h-20 mx-auto text-gold/10" />
                             <span className="text-xs font-black uppercase tracking-[0.5em] italic block">SECURE WITHDRAWAL VERIFIED</span>
                          </div>
                        )}
                     </div>
                  </div>

                  {/* Wallet Actions */}
                  <div className="lg:col-span-4 space-y-10">
                     <div className="card-luxury !p-12 bg-[#07090e] border-gold/15 shadow-2xl depth-card">
                        <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em] mb-12 block opacity-40 italic">DEPOSIT FUNDS</span>
                        <div className="grid grid-cols-2 gap-4 mb-10">
                           {[5000, 10000, 20000, 50000].map(amt => (
                             <button key={amt} onClick={() => handleTopUp(amt)} className="py-5 bg-white/[0.02] border border-white/5 rounded-2xl text-[11px] font-black text-white hover:bg-gold hover:text-black transition-all duration-500 italic tracking-[0.2em] shadow-inner font-display uppercase">+ ₦{amt.toLocaleString()}</button>
                           ))}
                        </div>
                        <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em] opacity-30 text-center leading-loose italic">Fast, high-integrity funding secured via the global Paystack gateway.</p>
                     </div>

                     <div className="card-luxury !p-12 bg-black border-white/10 shadow-2xl depth-card">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-12 block opacity-30 italic">REQUEST PAYOUT</span>
                        <form onSubmit={handlePayout} className="space-y-10">
                           <div className="space-y-5">
                              <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em] ml-2 opacity-30 italic">PAYOUT AMOUNT (₦)</span>
                              <input type="number" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} placeholder="0.00" className="w-full bg-[#07090e] border border-white/10 rounded-2xl px-8 py-8 text-white text-5xl font-black font-display tracking-tighter focus:border-gold/60 focus:bg-black transition-all outline-none shadow-inner" required />
                           </div>
                           <button disabled={isPending || balance < 5000} type="submit" className="btn-luxury btn-primary btn-premium-depth w-full py-6 text-[12px] font-black italic tracking-[0.3em] shadow-[0_30px_60px_-15px_rgba(242,201,76,0.2)] uppercase">
                              {isPending ? "PROCESSING..." : "CONFIRM PAYOUT"}
                           </button>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* NETWORK (PARTNERS) */}
          {activeTab === 'network' && (
            <div className="space-y-12">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="card-luxury !p-20 md:!p-32 bg-[#07090e] relative overflow-hidden group text-center md:text-left shadow-2xl depth-card border-white/10"
               >
                  <div className="absolute top-0 right-0 p-32 opacity-[0.01] pointer-events-none group-hover:opacity-[0.05] transition-all duration-1000 rotate-12"><Globe className="w-[500px] h-[500px]" /></div>
                  
                  <div className="flex flex-col md:flex-row items-center justify-between gap-20 relative z-10">
                     <div className="max-w-2xl">
                        <div className="badge-luxury !text-gold mb-12 px-8 py-2.5 bg-white/[0.02] border-white/10 italic font-black uppercase tracking-[0.4em] w-fit">Community</div>
                        <h2 className="text-5xl md:text-9xl font-black tracking-tighter mb-12 font-display uppercase italic text-white leading-none">Network <br /><span className="text-gradient-gold">Growth.</span></h2>
                        <p className="text-text-dim text-lg md:text-xl font-medium opacity-40 leading-relaxed italic group-hover:opacity-100 transition-opacity duration-1000">
                           Send invitations to professional challengers and analysis experts. Command a verified ₦1,000 performance reward for every successful partner activation in your network.
                        </p>
                     </div>
                     <div className="card-luxury !p-16 md:!p-24 bg-black border-gold/20 text-center shadow-[0_40px_80px_-20px_rgba(242,201,76,0.1)] min-w-[320px] glass-layered group shadow-depth-gold relative overflow-hidden">
                        <div className="absolute inset-0 bg-gold/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <span className="text-[12px] font-black text-text-dim uppercase tracking-[0.4em] opacity-30 block mb-8 italic">Community Network</span>
                        <div className="text-8xl md:text-9xl font-black text-white font-display tracking-tighter leading-none italic transition-transform group-hover:scale-110 duration-1000 group-hover:text-gold">{profile?.referral_count || 0}</div>
                     </div>
                  </div>
               </motion.div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                  <div className="lg:col-span-8 card-luxury !p-20 bg-[#07090e] border-white/10 shadow-2xl flex flex-col justify-center depth-card">
                     <div className="flex items-center gap-5 mb-12 opacity-40 italic">
                        <svg className="w-6 h-6 text-gold/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                           <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        <span className="text-[11px] font-black text-white uppercase tracking-[0.4em] font-display">Invitation Link</span>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-6 p-5 bg-black border border-white/5 rounded-[2.5rem] shadow-inner group overflow-hidden glass-layered">
                        <input readOnly value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://predchain.com'}/signup?ref=${profile.username}`} className="flex-1 bg-transparent px-8 py-5 font-black text-base text-gold outline-none italic opacity-80 font-display tracking-wider" />
                        <button 
                          onClick={() => { 
                            navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || 'https://predchain.com'}/signup?ref=${profile.username}`); 
                            showSuccess('LINK COPIED'); 
                          }} 
                          className="btn-luxury btn-gold btn-premium-depth !px-16 !py-6 rounded-2xl font-black uppercase text-[12px] italic tracking-[0.2em] shadow-2xl transition-all duration-700"
                        >
                          COPY LINK
                        </button>
                     </div>
                  </div>
                  <div className="lg:col-span-4 card-luxury !p-20 bg-gold/[0.02] border-gold/15 shadow-2xl flex flex-col justify-center items-center text-center depth-card group">
                     <div className="w-20 h-20 rounded-[2rem] bg-gold/10 border border-gold/10 flex items-center justify-center text-gold mb-12 group-hover:rotate-[360deg] transition-transform duration-1000 shadow-inner">
                        <Gift className="w-9 h-9" />
                     </div>
                     <h4 className="text-3xl font-black text-white font-display mb-4 uppercase italic tracking-tighter leading-none group-hover:text-gold transition-colors">Earn ₦1,000</h4>
                     <p className="text-[11px] font-black text-text-dim uppercase tracking-[0.4em] opacity-30 mb-0 leading-loose italic">Verified per activation <br />within your invitation network.</p>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Status Notifications */}
        {(successMsg || errorMsg) && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-12 right-6 left-6 md:left-auto md:w-[480px] z-[100] p-10 rounded-[2.5rem] backdrop-blur-3xl border shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] flex items-center gap-10 overflow-hidden group ${
            successMsg ? 'bg-emerald-500/90 border-emerald-500/20 text-white' : 'bg-rose-500/90 border-rose-500/20 text-white'
          }`}>
             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
             <div className="shrink-0 w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-500">
                {successMsg ? <Check className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
             </div>
             <div className="flex flex-col text-left relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2 italic">{successMsg ? 'Success' : 'Alert'}</span>
                <span className="text-base font-black tracking-tighter font-display italic uppercase">{successMsg || errorMsg}</span>
             </div>
             <button onClick={clear} className="ml-auto w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-2xl font-light">×</button>
          </motion.div>
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
