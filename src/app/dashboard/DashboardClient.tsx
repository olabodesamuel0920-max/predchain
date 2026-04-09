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
import { requestPayout } from '@/app/actions/wallet';
import { logout } from '@/app/actions/auth';
import { Profile, ChallengeRound, ChallengeMatch, ChallengeEntry, Prediction, Transaction, Wallet } from '@/types';
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
}

export default function DashboardClient({ 
  user, 
  profile, 
  wallet, 
  activeRound, 
  matches, 
  userEntry,
  predictions,
  transactions
}: DashboardClientProps) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'challenge' | 'wallet' | 'referrals'>('overview');
  const [isPending, startTransition] = useTransition();
  const [payoutAmount, setPayoutAmount] = useState('');
  const [bankInfo, setBankInfo] = useState({ bank: '', account: '', name: '' });
  const { success: successMsg, error: errorMsg, showSuccess, showError, clear } = useFeedback(5000);

  useEffect(() => {
    const successParam = searchParams.get('success');
    const errorParam = searchParams.get('error');
    if (successParam) {
      showSuccess(decodeURIComponent(successParam));
    } else if (errorParam) {
      showError(decodeURIComponent(errorParam));
    }
  }, [searchParams, showSuccess, showError]);

  const initial = profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?';
  const username = profile?.username || user?.email?.split('@')[0] || 'User';
  const balance = wallet?.balance_ngn || 0;
  const streak = userEntry?.streak_count || 0;

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

  return (
    <div className="relative min-h-screen bg-primary">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[300px] bg-blue-electric/5 blur-[120px] pointer-events-none z-0" />

      <main className="relative z-10 flex-1">
        <div className="container">
          
          <div className="animate-slide-up">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
                <div className="flex flex-col gap-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="card p-24 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp className="w-12 h-12" /></div>
                         <div className="flex justify-between items-start mb-24">
                            <div className="p-10 bg-gold/10 rounded-xl"><Activity className="w-5 h-5 text-gold" /></div>
                            <span className="badge badge-gold py-2 px-10 text-[8px] font-black tracking-widest">Active Round</span>
                         </div>
                         <h3 className="text-muted text-[9px] font-black uppercase tracking-widest mb-2">Round Progression</h3>
                         <div className="text-xl font-black font-display text-white mb-12">
                             {userEntry ? `Step ${streak + 1} / 3` : `Round ${activeRound?.round_number || ''} Entry`}
                         </div>
                         <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-grad-gold" style={{ width: `${(streak / 3) * 100}%` }} />
                         </div>
                      </div>
                      <div className="card p-24 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck className="w-12 h-12" /></div>
                        <div className="flex justify-between items-start mb-24">
                            <div className="p-10 bg-blue-electric/10 rounded-xl"><ShieldCheck className="w-5 h-5 text-blue-electric" /></div>
                            <span className="badge badge-blue py-2 px-10 text-[8px] font-black tracking-widest">Security Active</span>
                         </div>
                         <h3 className="text-muted text-[9px] font-black uppercase tracking-widest mb-2">Account State</h3>
                         <div className="text-xl font-black font-display text-white mb-12">Verified</div>
                         <div className="flex items-center gap-6">
                            <div className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_8px_var(--success)] animate-pulse" />
                            <span className="text-[9px] text-muted font-bold uppercase tracking-widest">Sync Active</span>
                         </div>
                      </div>
                   </div>

                   <div className="card p-0 overflow-hidden">
                      <div className="p-20 flex justify-between items-center bg-white/[0.02] border-b border-white/5">
                         <div className="flex items-center gap-10">
                            <History className="w-5 h-5 text-blue-electric opacity-60" />
                            <h3 className="font-display text-[10px] font-black uppercase tracking-widest">Match Schedule</h3>
                         </div>
                         <Link href="/live-challenges" className="text-[9px] text-blue-electric font-black uppercase tracking-widest hover:underline flex items-center gap-4 group">
                            Full Grid <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                         </Link>
                      </div>
                      <div className="flex flex-col divide-y divide-white/5">
                         {matches.length === 0 ? (
                           <div className="p-48 text-center text-[10px] text-muted italic font-mono opacity-40">No matches found for current period.</div>
                         ) : (
                           matches.slice(0, 5).map(m => (
                              <div key={m.id} className="flex items-center justify-between p-16 hover:bg-white/[0.01] transition-colors group">
                                 <div className="flex-1 text-right font-black text-xs text-white uppercase italic truncate">
                                    {m.home_team}
                                 </div>
                                 <div className="flex flex-col items-center gap-4 px-24 border-x border-white/5 min-w-[120px]">
                                    <span className="text-[9px] text-muted font-mono tracking-widest">
                                       {new Date(m.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <div className="px-8 py-2 bg-white/5 border border-white/10 rounded-md text-[8px] font-black text-muted group-hover:text-white">VS</div>
                                 </div>
                                 <div className="flex-1 text-left font-black text-xs text-white uppercase italic truncate">
                                    {m.away_team}
                                 </div>
                              </div>
                           ))
                         )}
                      </div>
                   </div>
                </div>

                <div className="flex flex-col gap-6">
                   <div className="card p-24 border-blue-electric/20 bg-blue-electric/[0.02]">
                      <div className="flex justify-between items-center mb-16">
                         <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted">Est. Earnings</h3>
                         <TrendingUp className="w-4 h-4 text-success" />
                      </div>
                      <div className="p-20 bg-black/40 border border-white/5 rounded-2xl text-center mb-16 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Trophy className="w-12 h-12" /></div>
                         <div className="text-muted text-[8px] font-black uppercase mb-4 tracking-widest">Cycle Reward</div>
                         <div className="text-3xl font-black font-display text-white">₦25,000</div>
                      </div>
                      <button onClick={() => setActiveTab('referrals')} className="btn btn-blue w-full py-12 font-black uppercase tracking-widest text-[9px] shadow-lg shadow-blue-electric/20">Refer Network</button>
                   </div>
                   
                   <div className="card p-24 bg-danger/[0.02] border-danger/20">
                      <h3 className="text-[9px] font-black text-danger uppercase tracking-[0.2em] mb-12 flex items-center gap-6">
                         <ShieldAlert className="w-4 h-4" /> Priority Alert
                      </h3>
                      <p className="text-[10px] text-muted leading-relaxed font-black uppercase tracking-wider italic">
                        Round {activeRound?.round_number || ''} is ending soon. 
                        Finalize all predictions to secure current points.
                      </p>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'challenge' && (
              <div className="flex flex-col gap-6">
                <div className="card bg-blue-electric/[0.03] border-blue-electric/20 p-24 flex flex-col md:flex-row justify-between items-center gap-24 relative overflow-hidden">
                   <div className="flex items-center gap-20 relative z-10">
                      <div className="p-12 bg-blue-electric/10 rounded-2xl border border-blue-electric/20"><Zap className="w-6 h-6 text-blue-electric" /></div>
                      <div>
                         <h3 className="font-display text-xl font-black text-white italic tracking-tight uppercase">Challenge Hub</h3>
                         <p className="text-muted text-[10px] font-black uppercase tracking-widest">Active Verification Cycle /// Round {activeRound?.round_number || ''}</p>
                      </div>
                   </div>
                   <div className="relative z-10">
                      <div className="text-center p-12 px-20 bg-black/40 border border-white/10 rounded-xl">
                         <div className="text-[8px] text-muted font-black uppercase mb-2 tracking-widest">Remaining Time</div>
                         <div className="text-lg font-black font-mono text-white tracking-widest italic">{activeRound?.end_date ? new Date(activeRound.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '12:45:00'}</div>
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
                        <div key={m.id} className="card p-24 hover:border-blue-electric/30 transition-all flex flex-col gap-24 group">
                           <div className="flex justify-between items-center pb-12 border-b border-white/5">
                              <span className="text-[10px] font-black text-muted font-mono tracking-widest">{new Date(m.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {pred ? (
                                <div className="flex items-center gap-6 px-10 py-4 bg-success/10 border border-success/20 rounded-lg">
                                   <Target className="w-3.5 h-3.5 text-success" />
                                   <span className="text-[9px] font-black text-success uppercase tracking-widest italic">Locked</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-6 px-10 py-4 bg-white/5 border border-white/10 rounded-lg opacity-40">
                                   <Lock className="w-3.5 h-3.5 text-muted" />
                                   <span className="text-[9px] font-black text-muted uppercase tracking-widest italic">Open</span>
                                </div>
                              )}
                           </div>
                           <div className="flex flex-col gap-10 text-center py-12">
                              <div className="text-sm font-black text-white uppercase tracking-tight italic">{m.home_team}</div>
                              <div className="text-[9px] font-black text-muted/30 uppercase tracking-[0.4em]">VS</div>
                              <div className="text-sm font-black text-white uppercase tracking-tight italic">{m.away_team}</div>
                           </div>
                           <div className="grid grid-cols-3 gap-3">
                              {['1', 'X', '2'].map(choice => (
                                 <button 
                                   key={choice}
                                   onClick={() => handlePrediction(m.id, choice as '1' | 'X' | '2')}
                                   disabled={isPending || !!pred}
                                   className={`py-12 rounded-xl text-[9px] font-black transition-all border uppercase tracking-widest ${
                                     pred?.prediction === choice 
                                     ? 'bg-blue-electric text-white border-blue-electric shadow-lg shadow-blue-electric/20' 
                                     : 'bg-white/[0.02] border-white/5 text-muted hover:text-white hover:border-white/20'
                                   }`}
                                 >
                                   {choice === '1' ? 'HOME' : choice === '2' ? 'AWAY' : 'DRAW'}
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
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
                <div className="flex flex-col gap-6">
                  <div className="card p-0 overflow-hidden overflow-x-auto">
                    <div className="p-20 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                       <div className="flex items-center gap-10">
                          <History className="w-5 h-5 text-blue-electric opacity-60" />
                          <h3 className="font-display text-[10px] font-black uppercase tracking-widest">Transaction Audit</h3>
                       </div>
                       <div className="text-[9px] text-muted font-mono uppercase tracking-widest">System Logs</div>
                    </div>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white/[0.01] border-b border-white/5">
                          <th className="p-16 text-[9px] font-black text-muted uppercase tracking-widest">Description</th>
                          <th className="p-16 text-[9px] font-black text-muted uppercase tracking-widest">Status</th>
                          <th className="p-16 text-[9px] font-black text-muted uppercase tracking-widest">Date</th>
                          <th className="p-16 text-[9px] font-black text-muted uppercase tracking-widest text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {transactions.length === 0 ? (
                          <tr><td colSpan={4} className="text-center py-60 text-muted/30 italic text-[10px] font-black uppercase tracking-widest">No entries found.</td></tr>
                        ) : (
                          transactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors group">
                              <td className="p-16 font-black text-xs text-white uppercase italic">{tx.type}</td>
                              <td className="p-16">
                                 <div className="flex items-center gap-6 px-10 py-4 bg-success/10 border border-success/20 rounded-lg w-fit">
                                    <Check className="w-3 h-3 text-success" />
                                    <span className="text-[8px] font-black text-success uppercase tracking-widest">Verified</span>
                                 </div>
                              </td>
                              <td className="p-16 text-muted font-mono text-[9px]">{new Date(tx.created_at).toLocaleDateString()}</td>
                              <td className={`p-16 text-right font-black font-display italic text-base ${tx.amount > 0 ? 'text-success' : 'text-danger'}`}>
                                 <div className="flex items-center justify-end gap-6 text-sm">
                                    {tx.amount > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                                    ₦{Math.abs(tx.amount).toLocaleString()}
                                 </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="card p-24 bg-white/[0.02] border-blue-electric/10">
                    <div className="flex items-center gap-12 mb-24">
                       <div className="p-10 bg-gold/10 rounded-xl border border-gold/20"><WalletIcon className="w-4 h-4 text-gold" /></div>
                       <div>
                          <h3 className="font-display text-[11px] font-black text-white uppercase tracking-widest">Withdrawal</h3>
                          <p className="text-[8px] text-muted font-black uppercase tracking-widest mt-1">Wallet Payout</p>
                       </div>
                    </div>
                    <form onSubmit={handlePayout} className="flex flex-col gap-16">
                      <div>
                        <label className="text-[9px] font-black text-muted uppercase block mb-6 tracking-widest ml-4">Amount (₦)</label>
                        <input 
                          type="number" 
                          value={payoutAmount}
                          onChange={(e) => setPayoutAmount(e.target.value)}
                          placeholder="0.00" 
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-16 py-14 text-white font-mono font-black italic focus:outline-none focus:border-blue-electric/40 transition-all text-xl"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-6">
                        <label className="text-[9px] font-black text-muted uppercase block ml-4 tracking-widest">Bank Details</label>
                        <input 
                          type="text" 
                          value={bankInfo.bank}
                          onChange={(e) => setBankInfo({...bankInfo, bank: e.target.value})}
                          placeholder="Bank Name" 
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-16 py-12 text-[10px] font-bold text-white focus:outline-none focus:border-white/20 transition-all"
                          required
                        />
                        <input 
                          type="text" 
                          value={bankInfo.account}
                          onChange={(e) => setBankInfo({...bankInfo, account: e.target.value})}
                          placeholder="Account Number" 
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-16 py-12 text-[10px] font-mono font-black text-white focus:outline-none focus:border-white/20 transition-all"
                          required
                        />
                      </div>
                      <button 
                        disabled={isPending || balance < 1000} 
                        type="submit" 
                        className="btn btn-blue w-full mt-12 py-14 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-electric/20 flex items-center justify-center gap-8 group"
                      >
                        {isPending ? <Activity className="w-4 h-4 animate-spin" /> : <>Process Payout <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" /></>}
                      </button>
                      {balance < 1000 && (
                        <div className="flex items-center justify-center gap-8 px-12 py-10 bg-danger/10 border border-danger/20 rounded-lg">
                           <AlertCircle className="w-3.5 h-3.5 text-danger" />
                           <span className="text-[8px] text-danger font-black uppercase tracking-widest">Minimum withdrawal: ₦1,000</span>
                        </div>
                      )}
                    </form>
                  </div>
                  
                  <div className="card p-24 bg-gold/[0.02] border-gold/20 shadow-xl shadow-gold/5">
                     <div className="flex items-center gap-10 mb-12">
                        <ShieldCheck className="w-5 h-5 text-gold" />
                        <span className="text-[10px] text-white font-black uppercase tracking-widest">Verified Integrity</span>
                     </div>
                     <p className="text-[10px] text-muted font-medium italic opacity-60 uppercase tracking-widest leading-relaxed">
                       All transactions are verified through our platform node and settled within 48 business hours.
                     </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'referrals' && (
              <div className="animate-slide-up flex flex-col gap-6">
                 <div className="card p-24 flex flex-col md:flex-row justify-between items-center gap-24 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Globe className="w-12 h-12" /></div>
                    <div className="flex-1 relative z-10">
                       <div className="flex items-center gap-10 mb-20 px-12 py-6 bg-blue-electric/10 border border-blue-electric/20 rounded-full w-fit">
                          <TrendingUp className="w-4 h-4 text-blue-electric" />
                          <span className="text-[9px] font-black text-blue-electric uppercase tracking-widest">Referral Program</span>
                       </div>
                       <h3 className="font-display text-4xl font-black text-white italic tracking-tight mb-16 uppercase">Network Rewards</h3>
                       <p className="text-muted text-xs font-black leading-relaxed max-w-[500px] uppercase tracking-widest italic opacity-60">
                         Invite members to the PredChain network and receive automated financial bonuses for every verified synchronization.
                       </p>
                    </div>
                    <div className="flex flex-col items-center gap-16 relative z-10">
                       <div className="text-center p-24 px-32 bg-black/40 border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl group hover:border-gold/40 transition-all">
                          <div className="text-[9px] text-muted font-black uppercase mb-4 tracking-widest">Total Referrals</div>
                          <div className="text-5xl font-black font-display text-white italic">00</div>
                          <div className="mt-8 px-12 py-4 bg-white/5 rounded-lg text-[8px] font-black text-muted uppercase tracking-widest">Invite Members</div>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card p-32 bg-white/[0.02]">
                       <div className="flex items-center gap-12 mb-24">
                          <div className="p-10 bg-blue-electric/10 rounded-xl border border-blue-electric/20"><Users className="w-5 h-5 text-blue-electric" /></div>
                          <h4 className="font-display text-[11px] font-black text-white uppercase tracking-widest">Referral Link</h4>
                       </div>
                       <div className="flex gap-4 p-4 bg-black/40 border border-white/10 rounded-xl group focus-within:border-blue-electric/40 transition-all">
                          <input readOnly value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://predchain.com'}/signup?ref=${profile.username}`} className="flex-1 bg-transparent px-16 py-12 font-mono text-[11px] text-blue-electric font-black focus:outline-none" />
                          <button onClick={() => { navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || 'https://predchain.com'}/signup?ref=${profile.username}`); showSuccess('Synchronization link copied.'); }} className="btn btn-blue px-20 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-electric/20">COPY</button>
                       </div>
                       <p className="mt-16 text-[9px] text-muted font-black uppercase tracking-widest italic ml-4 opacity-40">Identifier: {profile.username?.toUpperCase() || 'NONE'}</p>
                    </div>
                    <div className="card p-32 bg-white/[0.02] flex flex-col justify-between">
                       <div>
                          <div className="flex items-center gap-12 mb-24">
                             <div className="p-10 bg-gold/10 rounded-xl border border-gold/20"><Activity className="w-5 h-5 text-gold" /></div>
                             <h4 className="font-display text-[11px] font-black text-white uppercase tracking-widest">Bonus Structure</h4>
                          </div>
                          <p className="text-[10px] text-muted font-black uppercase tracking-widest leading-relaxed mb-20 italic opacity-60">
                             Each successful referral credits <strong>₦1,000</strong> to your balance. No upper threshold defined.
                          </p>
                       </div>
                       <div className="w-full h-2 bg-black/40 rounded-full border border-white/5 overflow-hidden">
                          <div className="h-full bg-grad-gold opacity-10 animate-pulse" style={{ width: '10%' }} />
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* Toast Notifications */}
          {(successMsg || errorMsg) && (
            <div className={`fixed bottom-6 right-6 z-[100] px-5 py-4 rounded-xl backdrop-blur-xl border flex items-center gap-4 shadow-2xl animate-slide-up ${
              successMsg ? 'bg-success/90 border-success/20 text-black' : 'bg-danger/90 border-danger/20 text-white'
            }`}>
               {successMsg ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
               <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{successMsg ? 'Verified' : 'Alert'}</span>
                  <span className="text-xs font-bold">{successMsg || errorMsg}</span>
               </div>
               <button onClick={clear} className="ml-12 p-4 hover:bg-black/10 rounded-lg opacity-40 hover:opacity-100 transition-all font-black">×</button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
