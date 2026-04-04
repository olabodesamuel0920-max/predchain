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
      <div className="font-mono text-3xl font-black text-white tracking-widest flex items-center gap-4">
        <span>{pad(time.h)}</span>
        <span className="opacity-30 text-xl">:</span>
        <span>{pad(time.m)}</span>
        <span className="opacity-30 text-xl">:</span>
        <span>{pad(time.s)}</span>
      </div>
      <div className="text-[10px] font-black text-muted/60 mt-6 uppercase tracking-[0.2em]">{label}</div>
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
      showError('No active deployment found. Connect a tier to participate.');
      return;
    }

    const formData = new FormData();
    formData.append('matchId', matchId);
    formData.append('entryId', userEntry.id);
    formData.append('prediction', choice);

    startTransition(async () => {
      try {
        await submitPrediction(formData);
        showSuccess('Prediction locked. Prediction verified.');
      } catch (err: unknown) {
        showError((err as Error).message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-primary pt-80 flex flex-col items-stretch overflow-x-hidden animate-fade-in">
      {/* ─── DENSE ARENA HERO ─── */}
      <section className="relative py-48 md:py-64 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[#0D1321] opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)]" />
        
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-32">
            <div className="max-w-600 animate-slide-right">
              <div className="flex items-center gap-12 mb-16">
                 <div className="flex items-center gap-6 px-10 py-4 bg-success/10 border border-success/20 rounded-full">
                    <div className="w-6 h-6 bg-success rounded-full animate-pulse shadow-[0_0_8px_var(--success)]" />
                    <span className="text-[10px] font-black text-success uppercase tracking-widest">Round Live</span>
                 </div>
                 <div className="px-10 py-4 bg-blue-electric/10 border border-blue-electric/20 rounded-full">
                    <span className="text-[10px] font-black text-blue-electric uppercase tracking-widest">Round R-{roundNumber}</span>
                 </div>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-tight mb-16">
                Active Match <span className="text-blue-electric">Match Grid</span>
              </h1>
              <p className="text-sm font-medium text-muted leading-relaxed opacity-80 uppercase tracking-wide">
                Predict global outcomes to finalize your 10X reward sequence. 
                <span className="block mt-4 text-[10px] font-black text-white/40 tracking-widest">Node ID: ADJ-XP-928 /// Synchronized</span>
              </p>
            </div>

            {round && (
              <div className="card p-24 md:p-32 bg-white/[0.03] border-blue-electric/20 shadow-2xl shadow-blue-electric/5 backdrop-blur-xl animate-slide-left min-w-280">
                <CountdownTimer label="Round Lock-in Remaining" targetDate={round.end_date} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── STREAK PROGRESS ─── */}
      <section className="py-24 border-b border-white/5 bg-white/[0.01]">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center gap-24 md:gap-48 p-20 bg-white/[0.02] rounded-2xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp className="w-48 h-48" /></div>
            <div className="flex items-center gap-12 shrink-0">
               <div className="p-10 bg-gold/10 rounded-xl"><Zap className="w-18 h-18 text-gold" /></div>
               <div className="font-display text-xs font-black text-muted uppercase tracking-widest">Streak Flux</div>
            </div>
            <div className="flex-1 h-12 bg-black/40 rounded-full border border-white/5 p-2 overflow-hidden">
              <div 
                className="h-full bg-grad-gold rounded-full transition-all duration-1000 shadow-[0_0_12px_var(--gold-glow)]"
                style={{ width: `${(streak / 3) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-10 font-display font-black text-2xl text-gold shrink-0">
               {streak} <span className="text-muted text-sm opacity-40">/ 3 Matches</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Match Grid CONTENT ─── */}
      <section className="py-64 bg-primary relative">
        <div className="container max-w-900">
          
          {/* Notifications */}
          {(success || error) && (
            <div className={`card p-16 mb-40 text-center border animate-slide-up flex items-center justify-center gap-12 shadow-xl ${
                success ? 'bg-success/10 border-success/30 text-success' : 'bg-danger/10 border-danger/30 text-danger'
              }`}>
               {success ? <Check className="w-16 h-16" /> : <AlertCircle className="w-16 h-16" />}
               <span className="text-xs font-black uppercase tracking-widest">{success || error}</span>
            </div>
          )}

          {!userEntry && (
            <div className="card text-center p-48 md:p-80 mb-64 border-dashed border-blue-electric/20 bg-blue-electric/[0.02] animate-slide-up">
              <div className="w-64 h-64 bg-blue-electric/10 border border-blue-electric/20 rounded-full flex items-center justify-center mx-auto mb-24">
                 <ShieldCheck className="w-32 h-32 text-blue-electric" />
              </div>
              <h3 className="font-display text-2xl font-black text-white mb-16 uppercase tracking-tight">No Active Challenge Entry</h3>
              <p className="text-sm font-medium text-muted mb-32 max-w-400 mx-auto leading-relaxed">System requires a verified account tier to initialize your reward sequence and access live challenge nodes.</p>
              <Link href="/accounts" className="btn btn-blue px-32 py-12 font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-electric/20 flex items-center gap-12 mx-auto w-fit group">
                Initialize Account Tier <ArrowRight className="w-14 h-14 transition-transform group-hover:translate-x-4" />
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-10">
            <div className="flex items-center gap-12 mb-10 px-4">
               <Swords className="w-16 h-16 text-blue-electric opacity-60" />
               <h2 className="font-display text-sm font-black uppercase tracking-[0.2em] text-white/40">Active Matches</h2>
            </div>

            {matches.length === 0 ? (
               <div className="card p-80 text-center flex flex-col items-center gap-16 border-dashed border-white/5 opacity-30">
                  <Activity className="w-48 h-48 text-muted" />
                  <p className="text-[10px] font-black uppercase tracking-widest font-mono italic">No matches found for Round {roundNumber}.</p>
               </div>
            ) : (
               matches.map((m, i) => {
                  const userPred = predictions.find(p => p.match_id === m.id);
                  const isLocked = m.status !== 'scheduled' || new Date(m.kickoff_time) < new Date();
                  
                  return (
                    <div key={m.id} className={`card p-0 overflow-hidden transition-all duration-500 hover:border-white/10 ${isLocked ? 'grayscale-[0.5] opacity-90' : 'animate-slide-up shadow-xl shadow-black/20'}`}>
                       <div className="px-20 py-12 flex justify-between items-center bg-white/[0.03] border-b border-white/5">
                          <div className="flex items-center gap-12">
                             <div className="w-24 h-24 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-[10px] font-black font-mono text-muted">
                                {i + 1}
                             </div>
                             <span className="font-mono text-[10px] font-black text-muted/60 uppercase tracking-widest">
                                Kickoff {new Date(m.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                          </div>
                          {isLocked ? (
                            <div className="flex items-center gap-6 px-10 py-4 bg-danger/10 border border-danger/20 rounded-lg">
                               <ShieldCheck className="w-10 h-10 text-danger" />
                               <span className="text-[9px] font-black text-danger uppercase tracking-widest">Locked</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-6 px-10 py-4 bg-success/10 border border-success/20 rounded-lg animate-pulse">
                               <Target className="w-10 h-10 text-success" />
                               <span className="text-[9px] font-black text-success uppercase tracking-widest">Open</span>
                            </div>
                          )}
                       </div>
                       
                       <div className="p-24 md:p-40">
                          <div className="flex items-center justify-between gap-16 md:gap-48 mb-32 flex-col md:flex-row">
                             <div className="flex-1 text-center md:text-right">
                                <div className="text-xl md:text-2xl font-black text-white uppercase tracking-tight italic mb-2">{m.home_team}</div>
                                <div className="text-[9px] text-muted font-black uppercase tracking-[0.2em] opacity-40">Primary Side</div>
                             </div>
                             
                             <div className="flex flex-col items-center gap-8 min-w-100">
                                {m.status !== 'scheduled' ? (
                                   <div className="font-display text-4xl md:text-5xl font-black text-white flex items-center gap-12">
                                      <span>{m.home_score}</span>
                                      <span className="text-blue-electric opacity-20 text-2xl font-mono">:</span>
                                      <span>{m.away_score}</span>
                                   </div>
                                ) : (
                                   <div className="px-24 py-12 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center gap-4">
                                      <Swords className="w-20 h-20 text-muted opacity-20" />
                                      <span className="text-[10px] font-black text-muted/30 uppercase tracking-[0.3em]">VS</span>
                                   </div>
                                )}
                                <div className={`text-[9px] font-black uppercase tracking-[0.2em] ${m.status === 'live' ? 'text-danger flex items-center gap-4' : 'text-muted opacity-40'}`}>
                                   {m.status === 'live' && <div className="w-4 h-4 bg-danger rounded-full animate-pulse" />} {m.status}
                                </div>
                             </div>

                             <div className="flex-1 text-center md:text-left">
                                <div className="text-xl md:text-2xl font-black text-white uppercase tracking-tight italic mb-2">{m.away_team}</div>
                                <div className="text-[9px] text-muted font-black uppercase tracking-[0.2em] opacity-40">Secondary Side</div>
                             </div>
                          </div>

                          <div className="flex gap-4">
                             {['1', 'X', '2'].map((choice) => (
                                <button
                                  key={choice}
                                  disabled={isLocked || isPending || !userEntry}
                                  onClick={() => handlePrediction(m.id, choice as '1' | 'X' | '2')}
                                  className={`flex-1 py-14 rounded-xl border transition-all duration-300 font-black uppercase text-[10px] tracking-[0.2em] flex flex-col items-center justify-center gap-6 group relative overflow-hidden ${
                                      userPred?.prediction === choice 
                                      ? 'bg-blue-electric text-white border-blue-electric shadow-lg shadow-blue-electric/20 translate-y-[-2px]' 
                                      : 'bg-white/[0.02] border-white/5 text-muted hover:border-white/20 hover:bg-white/[0.04]'
                                    }`}
                                >
                                   {userPred?.prediction === choice && (
                                      <div className="absolute top-0 right-0 p-8 animate-fade-in"><Check className="w-12 h-12 text-white" /></div>
                                   )}
                                   <span className="text-[8px] font-black opacity-40 group-hover:opacity-100 transition-opacity">
                                      {choice === '1' ? 'HOME WIN' : choice === '2' ? 'AWAY WIN' : 'NEUTRAL'}
                                   </span>
                                   <span className="truncate max-w-full italic">
                                      {choice === '1' ? m.home_team : choice === '2' ? m.away_team : 'DRAW'}
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

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-64 border-t border-white/5 bg-white/[0.01]">
         <div className="container">
            <div className="grid grid-3 gap-24">
               <div className="card p-32 bg-white/[0.02] hover:border-blue-electric/20 transition-all border border-transparent">
                  <div className="w-32 h-32 bg-gold/10 rounded-lg flex items-center justify-center mb-16 italic font-black text-xs text-gold">01</div>
                  <h4 className="font-display text-sm font-black text-white uppercase tracking-widest mb-12 flex items-center gap-8">
                     Streak Rules
                  </h4>
                  <p className="text-[11px] font-medium text-muted leading-relaxed uppercase tracking-wider opacity-60">You must finalize one correct prediction every 24 hours for three consecutive cycles to unlock the reward.</p>
               </div>
               <div className="card p-32 bg-white/[0.02] hover:border-blue-electric/20 transition-all border border-transparent">
                  <div className="w-32 h-32 bg-gold/10 rounded-lg flex items-center justify-center mb-16 italic font-black text-xs text-gold">02</div>
                  <h4 className="font-display text-sm font-black text-white uppercase tracking-widest mb-12 flex items-center gap-8">
                     Outcome Rules
                  </h4>
                  <p className="text-[11px] font-medium text-muted leading-relaxed uppercase tracking-wider opacity-60">We focus strictly on Match Outcomes (1X2). All results categorized via official platform data nodes after full-time.</p>
               </div>
               <div className="card p-32 bg-white/[0.02] hover:border-blue-electric/20 transition-all border border-transparent">
                  <div className="w-32 h-32 bg-gold/10 rounded-lg flex items-center justify-center mb-16 italic font-black text-xs text-gold">03</div>
                  <h4 className="font-display text-sm font-black text-white uppercase tracking-widest mb-12 flex items-center gap-8">
                     Instant Payouts
                  </h4>
                  <p className="text-[11px] font-medium text-muted leading-relaxed uppercase tracking-wider opacity-60">Upon verified 3/3 synchronization, your 10X multiplier is settled instantly and credited to your wallet.</p>
               </div>
            </div>
            
            <div className="mt-64 p-24 bg-blue-electric/[0.03] border border-blue-electric/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-24 animate-slide-up">
               <div className="flex items-center gap-16">
                  <div className="p-12 bg-blue-electric/10 rounded-xl"><Trophy className="w-24 h-24 text-blue-electric" /></div>
                  <div>
                    <h4 className="font-display text-base font-black text-white uppercase tracking-widest">Ready to scale your capital?</h4>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-2">Active tiers currently yielding 10X average across all verified nodes.</p>
                  </div>
               </div>
               <Link href="/accounts" className="btn btn-blue px-32 py-12 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-electric/20 whitespace-nowrap">
                 Optimize Account Tier
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
