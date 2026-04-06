'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Swords, 
  Trophy, 
  Clock, 
  Target, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight,
  Check,
  TrendingUp,
  Activity,
  ArrowRight
} from 'lucide-react';
import { submitPrediction } from '@/app/actions/predictions';
import { ChallengeRound, ChallengeMatch, ChallengeEntry, Prediction } from '@/types';
import { useFeedback } from '@/hooks/useFeedback';

interface LiveChallengesClientProps {
  round: ChallengeRound | null;
  matches: ChallengeMatch[];
  userEntry: ChallengeEntry | null;
  predictions: Prediction[];
}

function CountdownTimer({ label, targetDate }: { label: string, targetDate?: string }) {
  const calculateTime = () => {
    const target = targetDate ? new Date(targetDate).getTime() : Date.now() + 17000000;
    const now = Date.now();
    const diff = Math.max(0, target - now);
    
    return {
      h: Math.floor(diff / (1000 * 60 * 60)),
      m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      s: Math.floor((diff % (1000 * 60)) / 1000)
    };
  };

  const [time, setTime] = useState(calculateTime);

  useEffect(() => {
    const id = setInterval(() => setTime(calculateTime()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const pad = (n: number) => String(n).padStart(2, '0');
  
  return (
    <div className="flex flex-col items-center">
      <div className="font-mono text-2xl font-bold text-white tracking-widest flex items-center gap-3">
        <span className="p-2 bg-white/5 rounded-lg border border-white/10">{pad(time.h)}</span>
        <span className="opacity-30 text-lg">:</span>
        <span className="p-2 bg-white/5 rounded-lg border border-white/10">{pad(time.m)}</span>
        <span className="opacity-30 text-lg">:</span>
        <span className="p-2 bg-white/5 rounded-lg border border-white/10">{pad(time.s)}</span>
      </div>
      <div className="text-[8px] font-bold text-muted/40 mt-4 uppercase tracking-widest italic">{label}</div>
    </div>
  );
}

export default function LiveChallengesClient({ round, matches, userEntry, predictions }: LiveChallengesClientProps) {
  const [isPending, startTransition] = useTransition();
  const { success, error, showSuccess, showError, clear } = useFeedback();

  const streak = userEntry?.streak_count || 0;
  const roundNumber = round?.round_number || 'N/A';

  const handlePrediction = async (matchId: string, choice: '1' | 'X' | '2') => {
    if (!userEntry) {
      showError('No active account found. Buy a plan to participate.');
      return;
    }

    const formData = new FormData();
    formData.append('matchId', matchId);
    formData.append('entryId', userEntry.id);
    formData.append('prediction', choice);

    startTransition(async () => {
      try {
        await submitPrediction(formData);
        showSuccess('Prediction saved. Good luck!');
      } catch (err: unknown) {
        showError((err as Error).message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-primary pt-20 flex flex-col items-stretch overflow-x-hidden animate-fade-in">
      {/* ─── DENSE ARENA HERO ─── */}
      <section className="relative py-10 md:py-16 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[#0D1321] opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)]" />
        
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-xl animate-slide-right">
              <div className="flex items-center gap-3 mb-6">
                 <div className="flex items-center gap-2 px-3 py-1 bg-success/5 border border-success/15 rounded-full">
                    <div className="w-1 h-1 bg-success rounded-full animate-pulse shadow-success" />
                    <span className="text-[8px] font-bold text-success uppercase tracking-widest italic">Live Protocol</span>
                 </div>
                 <div className="px-3 py-1 bg-blue-electric/5 border border-blue-electric/15 rounded-full">
                    <span className="text-[8px] font-bold text-blue-electric uppercase tracking-widest italic">Round R-{roundNumber}</span>
                 </div>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-4 uppercase italic">
                Active <span className="text-gradient-blue">Challenges</span>
              </h1>
              <p className="text-[10px] font-bold text-secondary leading-relaxed opacity-40 uppercase tracking-wide italic">
                Predict match outcomes to complete your 3-day sequence and unlock your 10X target reward.
              </p>
            </div>

            {round && (
              <div className="card p-5 md:p-8 bg-white/[0.02] border-blue-electric/10 shadow-2xl backdrop-blur-xl animate-slide-left min-w-[240px]">
                <CountdownTimer label="Round Ends In" targetDate={round.end_date} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── STREAK PROGRESS ─── */}
      <section className="py-10 border-b border-white/5 bg-white/[0.01]">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center gap-8 p-5 bg-white/[0.01] rounded-xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp className="w-24 h-24" /></div>
            <div className="flex items-center gap-3 shrink-0">
               <div className="p-2 bg-gold/5 rounded-lg border border-gold/15"><Zap className="w-3.5 h-3.5 text-gold" /></div>
               <div className="font-display text-[9px] font-bold text-muted uppercase tracking-widest italic">Progress Hub</div>
            </div>
            <div className="flex-1 h-1.5 bg-black/60 rounded-full border border-white/5 overflow-hidden">
              <div 
                className="h-full bg-grad-gold rounded-full transition-all duration-1000 shadow-gold"
                style={{ width: `${(streak / 3) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-2 font-display font-bold text-lg text-white shrink-0 italic">
               <span className="text-gold tracking-tighter">{streak}</span>
               <span className="text-muted text-[8px] opacity-40 uppercase tracking-widest">/ 3 Matches Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Match grid CONTENT ─── */}
      <section className="py-16 bg-primary relative">
        <div className="container max-w-4xl">
          
          {/* Notifications */}
          {(success || error) && (
            <div className={`card p-4 mb-10 text-center border animate-slide-up flex items-center justify-center gap-3 shadow-xl ${
                success ? 'bg-success/10 border-success/30 text-success' : 'bg-danger/10 border-danger/30 text-danger'
              }`}>
               {success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
               <span className="text-[10px] font-black uppercase tracking-widest">{success || error}</span>
            </div>
          )}

          {!userEntry && (
            <div className="card text-center p-12 md:p-20 mb-16 border-dashed border-blue-electric/20 bg-blue-electric/[0.01] animate-slide-up">
              <div className="w-16 h-16 bg-blue-electric/10 border border-blue-electric/20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <ShieldCheck className="w-8 h-8 text-blue-electric" />
              </div>
              <h3 className="font-display text-xl font-black text-white mb-4 uppercase italic">No Active Challenge Entry</h3>
              <p className="text-[10px] font-black text-muted mb-8 max-w-sm mx-auto leading-relaxed uppercase tracking-widest opacity-40">An active account plan is required to start your streak and access live matches.</p>
              <Link href="/accounts" className="btn btn-blue px-8 py-3 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-electric/20 flex items-center gap-3 mx-auto w-fit group">
                Get Account Plan <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-4 px-4">
               <Swords className="w-4 h-4 text-blue-electric opacity-40" />
               <h2 className="font-display text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Active Matches</h2>
            </div>

            {matches.length === 0 ? (
               <div className="card p-20 text-center flex flex-col items-center gap-4 border-dashed border-white/5 opacity-20">
                  <Activity className="w-12 h-12 text-muted" />
                  <p className="text-[9px] font-black uppercase tracking-widest font-mono italic">No matches found for Round {roundNumber}.</p>
               </div>
            ) : (
               matches.map((m, i) => {
                  const userPred = predictions.find(p => p.match_id === m.id);
                  const isLocked = m.status !== 'scheduled' || new Date(m.kickoff_time) < new Date();
                  
                  return (
                    <div key={m.id} className={`card p-0 overflow-hidden transition-all duration-500 hover:border-white/10 ${isLocked ? 'grayscale-[0.5] opacity-80' : 'animate-slide-up shadow-xl shadow-black/20'}`}>
                       <div className="px-5 py-3 flex justify-between items-center bg-white/[0.01] border-b border-white/5">
                          <div className="flex items-center gap-4">
                             <div className="w-6 h-6 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-[9px] font-black font-mono text-muted">
                                {i + 1}
                             </div>
                             <span className="font-mono text-[9px] font-black text-muted/40 uppercase tracking-widest">
                                Kickoff {new Date(m.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                          </div>
                          {isLocked ? (
                            <div className="flex items-center gap-2 px-3 py-1 bg-danger/10 border border-danger/20 rounded-md">
                               <ShieldCheck className="w-2.5 h-2.5 text-danger" />
                               <span className="text-[8px] font-black text-danger uppercase tracking-widest">Locked</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-3 py-1 bg-success/10 border border-success/20 rounded-md animate-pulse">
                               <Target className="w-2.5 h-2.5 text-success" />
                               <span className="text-[8px] font-black text-success uppercase tracking-widest">Open</span>
                            </div>
                          )}
                       </div>
                       
                       <div className="p-6 md:p-8">
                          <div className="flex items-center justify-between gap-6 md:gap-10 mb-8 flex-col md:flex-row">
                             <div className="flex-1 text-center md:text-right">
                                <div className="text-lg md:text-xl font-bold text-white uppercase tracking-tight italic mb-1">{m.home_team}</div>
                                <div className="text-[7px] text-muted font-bold uppercase tracking-widest opacity-20">Prime Entry (Home)</div>
                             </div>
                             
                             <div className="flex flex-col items-center gap-2 min-w-[100px]">
                                {m.status !== 'scheduled' ? (
                                   <div className="font-display text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                                      <span>{m.home_score}</span>
                                      <span className="text-blue-electric opacity-20 font-mono">:</span>
                                      <span>{m.away_score}</span>
                                   </div>
                                ) : (
                                   <div className="flex flex-col items-center gap-1">
                                      <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
                                         <Swords className="w-4 h-4 text-muted opacity-30" />
                                      </div>
                                   </div>
                                )}
                                <div className={`px-2 py-0.5 rounded text-[7px] font-bold uppercase tracking-widest ${m.status === 'live' ? 'bg-danger/10 text-danger animate-pulse border border-danger/20' : 'bg-white/5 text-muted opacity-40 border border-white/10'}`}>
                                   {m.status}
                                </div>
                             </div>

                             <div className="flex-1 text-center md:text-left">
                                <div className="text-lg md:text-xl font-bold text-white uppercase tracking-tight italic mb-1">{m.away_team}</div>
                                <div className="text-[7px] text-muted font-bold uppercase tracking-widest opacity-20">Rival Entry (Away)</div>
                             </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                             {['1', 'X', '2'].map((choice) => (
                                <button
                                  key={choice}
                                  disabled={isLocked || isPending || !userEntry}
                                  onClick={() => handlePrediction(m.id, choice as '1' | 'X' | '2')}
                                  className={`py-3 rounded-lg border transition-all duration-300 font-bold uppercase text-[9px] tracking-widest flex flex-col items-center justify-center gap-1 relative overflow-hidden ${
                                      userPred?.prediction === choice 
                                      ? 'bg-blue-electric text-white border-blue-electric shadow-sm' 
                                      : 'bg-white/[0.01] border-white/5 text-muted/60 hover:text-white hover:border-white/10'
                                    }`}
                                >
                                   {userPred?.prediction === choice && (
                                      <div className="absolute top-0 right-0 p-1.5"><Check className="w-2.5 h-2.5" /></div>
                                   )}
                                   <span className="text-[7px] font-bold opacity-30 tracking-tight">
                                      {choice === '1' ? 'HOME' : choice === '2' ? 'AWAY' : 'DRAW'}
                                   </span>
                                   <span className="truncate max-w-full italic text-[10px]">
                                      {choice === '1' ? '1' : choice === '2' ? '2' : 'X'}
                                   </span>
                                </button>
                             ))}
                          </div>
                       </div>
                    </div>
                  );
               })
            )}
          </div>
        </div>
      </section>

      {/* ─── Rules ─── */}
      <section className="py-16 border-t border-white/5 bg-white/[0.01]">
         <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="card p-6 bg-white/[0.01] hover:border-blue-electric/20 transition-all border border-transparent">
                  <div className="w-8 h-8 mb-4 rounded-lg bg-gold/10 flex items-center justify-center italic font-black text-[10px] text-gold">01</div>
                  <h4 className="font-display text-[10px] font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                     Streak Rules
                  </h4>
                  <p className="text-[10px] font-medium text-muted leading-relaxed uppercase tracking-wider opacity-35 italic">predict one match correctly every day for three consecutive days to unlock the reward.</p>
               </div>
               <div className="card p-6 bg-white/[0.01] hover:border-blue-electric/20 transition-all border border-transparent">
                  <div className="w-8 h-8 mb-4 rounded-lg bg-gold/10 flex items-center justify-center italic font-black text-[10px] text-gold">02</div>
                  <h4 className="font-display text-[10px] font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                     Rules
                  </h4>
                  <p className="text-[10px] font-medium text-muted leading-relaxed uppercase tracking-wider opacity-35 italic">results are based on official match outcomes at full-time. predictions lock at kickoff.</p>
               </div>
               <div className="card p-6 bg-white/[0.01] hover:border-blue-electric/20 transition-all border border-transparent">
                  <div className="w-8 h-8 mb-4 rounded-lg bg-gold/10 flex items-center justify-center italic font-black text-[10px] text-gold">03</div>
                  <h4 className="font-display text-[10px] font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                     Instant Payouts
                  </h4>
                  <p className="text-[10px] font-medium text-muted leading-relaxed uppercase tracking-wider opacity-35 italic">Upon verification of your streak, your 10X reward is settled instantly and credited to your wallet.</p>
               </div>
            </div>
            
            <div className="mt-16 p-6 bg-blue-electric/[0.02] border border-blue-electric/10 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 animate-slide-up">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-electric/10 rounded-lg"><Trophy className="w-5 h-5 text-blue-electric" /></div>
                  <div>
                    <h4 className="font-display text-[11px] font-black text-white uppercase tracking-widest">Ready to start winning?</h4>
                    <p className="text-[9px] font-bold text-muted uppercase tracking-[0.2em] mt-1 opacity-40">Join thousands of winners earning 10X rewards every 3 days.</p>
                  </div>
               </div>
               <Link href="/accounts" className="btn btn-blue px-8 py-3 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-electric/20 whitespace-nowrap">
                 View Account Plans
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
