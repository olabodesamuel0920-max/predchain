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
  ArrowRight,
  Radio,
  ArrowUpRight
} from 'lucide-react';
import { submitPrediction } from '@/app/actions/predictions';
import { ChallengeRound, ChallengeMatch, ChallengeEntry, Prediction } from '@/types';
import { useFeedback } from '@/hooks/useFeedback';

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
      <div className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4 opacity-40 italic">{label}</div>
      <div className="font-mono text-2xl font-bold text-white tracking-widest flex items-center gap-3">
        <span className="px-4 py-2 bg-black/40 rounded-xl border border-white/5">{pad(time.h)}</span>
        <span className="opacity-20 text-lg">:</span>
        <span className="px-4 py-2 bg-black/40 rounded-xl border border-white/5">{pad(time.m)}</span>
        <span className="opacity-20 text-lg">:</span>
        <span className="px-4 py-2 bg-black/40 rounded-xl border border-white/5">{pad(time.s)}</span>
      </div>
    </div>
  );
}

interface LiveChallengesClientProps {
  round: ChallengeRound | null;
  matches: ChallengeMatch[];
  userEntry: ChallengeEntry | null;
  predictions: Prediction[];
}

export default function LiveChallengesClient({ round, matches, userEntry, predictions }: LiveChallengesClientProps) {
  const [isPending, startTransition] = useTransition();
  const { success, error, showSuccess, showError, clear } = useFeedback();

  const streak = userEntry?.streak_count || 0;
  const roundNumber = round?.round_number || 'X';

  const handlePrediction = async (matchId: string, choice: '1' | 'X' | '2') => {
    if (!userEntry) {
      showError('Authentication required. Initialize account protocol.');
      return;
    }

    const formData = new FormData();
    formData.append('matchId', matchId);
    formData.append('entryId', userEntry.id);
    formData.append('prediction', choice);

    startTransition(async () => {
      try {
        await submitPrediction(formData);
        showSuccess('Prediction synchronized.');
      } catch (err: unknown) {
        showError((err as Error).message);
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-primary pt-32 pb-24">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-grad-glow opacity-30 pointer-events-none z-0" />

      {/* Hero */}
      <section className="relative z-10 mb-16 px-4">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-8">
                 <div className="badge-elite !text-success !bg-success/5 border-success/20">LIVE ARENA</div>
                 <div className="badge-elite !text-blue-electric !bg-blue-electric/5 border-blue-electric/10">CYCLE R-{roundNumber}</div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase mb-6 leading-tight">
                Active <span className="text-gradient-gold">Arena.</span>
              </h1>
              <p className="text-secondary text-sm font-medium opacity-60 leading-relaxed uppercase tracking-wide">
                Submit predictions and maintain integrity streaks to secure 10X reward settlement.
              </p>
            </div>

            {round && (
              <div className="card-elite p-8 bg-grad-glow opacity-90 border-blue-electric/10 min-w-[320px]">
                <CountdownTimer label="Cycle Expiry" targetDate={round.end_date} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Progress Monitor */}
      <section className="relative z-10 mb-16 px-4">
        <div className="container">
          <div className="card-elite p-8 bg-white/[0.015] border-white/5 flex flex-col md:flex-row md:items-center gap-10">
            <div className="flex items-center gap-4 shrink-0">
               <div className="p-3 bg-gold/10 rounded-xl border border-gold/10"><TrendingUp className="w-5 h-5 text-gold" /></div>
               <div className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">INTEGRITY MONITOR</div>
            </div>
            <div className="flex-1 h-2 bg-black/60 rounded-full border border-white/5 overflow-hidden">
              <div 
                className="h-full bg-grad-gold shadow-[0_0_15px_rgba(197,160,89,0.3)] transition-all duration-1000"
                style={{ width: `${(streak / 3) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-3 text-2xl font-bold text-white tracking-tighter italic">
               <span className="text-gold">{streak}</span>
               <span className="text-muted text-[10px] opacity-40 uppercase tracking-[0.2em] not-italic">/ 3 VERIFIED</span>
            </div>
          </div>
        </div>
      </section>

      {/* Match Grid */}
      <section className="relative z-10 px-4">
        <div className="container max-w-4xl">
          
          {/* Notifications */}
          {(success || error) && (
            <div className={`fixed bottom-8 right-8 z-50 card-elite px-8 py-5 border shadow-2xl animate-slide-up flex items-center gap-6 ${
                success ? 'bg-success/90 border-success/20 text-black' : 'bg-danger/90 border-danger/20 text-white'
              }`}>
               {success ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
               <span className="text-sm font-bold uppercase tracking-tight">{success || error}</span>
            </div>
          )}

          {!userEntry && (
            <div className="card-elite p-16 text-center bg-blue-electric/[0.02] border-blue-electric/10 mb-16">
              <ShieldCheck className="w-12 h-12 text-blue-electric/40 mx-auto mb-8" />
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Node Not Found</h3>
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-40 mb-12 max-w-xs mx-auto leading-relaxed">Initialization required. Activate an account plan to access the live arena protocol.</p>
              <Link href="/accounts" className="btn btn-primary px-12 py-4 rounded-2xl font-bold uppercase text-[11px] tracking-widest group inline-flex items-center">
                Initialize account <ArrowUpRight className="w-4 h-4 ml-3 group-hover:translate-y--1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 px-4 opacity-40">
               <Radio className="w-5 h-5 text-blue-electric" />
               <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">ARENA SYNCHRONIZATION</h2>
            </div>

            {matches.length === 0 ? (
               <div className="card-elite p-40 text-center flex flex-col items-center gap-6 border-dashed border-white/5 opacity-30">
                  <Activity className="w-16 h-16 text-muted" />
                  <p className="text-[11px] font-bold uppercase tracking-widest italic">No arena events detected for R-{roundNumber}.</p>
               </div>
            ) : (
               matches.map((m: ChallengeMatch, i: number) => {
                  const userPred = predictions.find((p: Prediction) => p.match_id === m.id);
                  const isLocked = m.status !== 'scheduled' || new Date(m.kickoff_time) < new Date();
                  
                  return (
                    <div key={m.id} className={`card-elite p-0 overflow-hidden transition-all duration-500 hover:border-blue-electric/20 ${isLocked ? 'grayscale-[0.8] opacity-60' : 'shadow-[0_0_50px_rgba(30,58,138,0.1)]'}`}>
                       <div className="px-8 py-4 flex justify-between items-center bg-white/[0.03] border-b border-white/5">
                          <div className="flex items-center gap-6">
                             <div className="w-8 h-8 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center text-xs font-bold text-muted">
                                {String(i + 1).padStart(2, '0')}
                             </div>
                             <span className="text-[10px] font-bold text-muted/50 uppercase tracking-widest">
                                KICKOFF {new Date(m.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                          </div>
                          {isLocked ? (
                            <div className="badge-elite !text-danger !bg-danger/5 border-danger/20">PROTOCOL LOCKED</div>
                          ) : (
                            <div className="badge-elite !text-success !bg-success/5 border-success/20 animate-pulse">SYNCHRONIZING</div>
                          )}
                       </div>
                       
                       <div className="p-10 md:p-12">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-12">
                             <div className="flex-1 text-center md:text-right">
                                <div className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight mb-2">{m.home_team}</div>
                                <div className="text-[8px] text-muted font-bold uppercase tracking-[0.2em] opacity-20">ENTRY NODE PRIMARY</div>
                             </div>
                             
                             <div className="flex flex-col items-center gap-4">
                                {m.status !== 'scheduled' ? (
                                   <div className="text-4xl font-bold text-white flex items-center gap-4 italic tracking-tighter">
                                      <span>{m.home_score}</span>
                                      <span className="opacity-10">:</span>
                                      <span>{m.away_score}</span>
                                   </div>
                                ) : (
                                   <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl"><Swords className="w-6 h-6 text-muted/20" /></div>
                                )}
                                <div className={`badge-elite !text-[8px] uppercase tracking-widest ${m.status === 'live' ? '!bg-danger !text-white' : '!bg-white/5 !text-muted opacity-40'}`}>
                                   {m.status}
                                </div>
                             </div>

                             <div className="flex-1 text-center md:text-left">
                                <div className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight mb-2">{m.away_team}</div>
                                <div className="text-[8px] text-muted font-bold uppercase tracking-[0.2em] opacity-20">ENTRY NODE SECONDARY</div>
                             </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                             {['1', 'X', '2'].map((choice) => (
                                <button
                                  key={choice}
                                  disabled={isLocked || isPending || !userEntry}
                                  onClick={() => handlePrediction(m.id, choice as '1' | 'X' | '2')}
                                  className={`py-5 rounded-2xl border transition-all duration-300 font-bold uppercase text-[10px] tracking-widest flex flex-col items-center justify-center gap-1.5 relative overflow-hidden ${
                                      userPred?.prediction === choice 
                                      ? 'bg-blue-electric text-white border-blue-electric shadow-[0_0_30px_rgba(56,189,248,0.2)]' 
                                      : 'bg-white/[0.01] border-white/5 text-muted/40 hover:text-white hover:border-white/10'
                                    }`}
                                >
                                   <span className="text-[8px] font-bold opacity-30 italic">{choice === '1' ? 'HOME' : choice === '2' ? 'AWAY' : 'DRAW'}</span>
                                   <span className="text-lg italic">{choice}</span>
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

      {/* Procedural Directives */}
      <section className="relative z-10 pt-24 mt-24 border-t border-white/5 bg-white/[0.01]">
         <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 px-4">
               {[
                 { id: '01', title: 'Streak Protocol', desc: 'Predict one outcome daily for three consecutive cycles to trigger reward.' },
                 { id: '02', title: 'Data Integrity', desc: 'Results verified based on official 90-minute outcomes. Predictions lock at T-minus 0.' },
                 { id: '03', title: 'Settlement Hub', desc: 'Verified streaks are processed for automated wallet settlement within 48-hour protocol.' }
               ].map(rule => (
                 <div key={rule.id} className="card-elite p-8 bg-white/[0.015] border-transparent hover:border-gold/20 transition-all flex flex-col gap-6 group">
                   <div className="w-10 h-10 rounded-xl bg-gold/5 flex items-center justify-center text-[10px] font-bold text-gold border border-gold/10">{rule.id}</div>
                   <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">{rule.title}</h4>
                   <p className="text-[10px] font-medium text-muted leading-relaxed uppercase tracking-widest opacity-30 italic">{rule.desc}</p>
                 </div>
               ))}
            </div>
            
            <div className="card-elite p-12 md:p-16 bg-blue-electric/[0.02] border-blue-electric/10 flex flex-col md:flex-row items-center justify-between gap-12 group">
               <div className="flex items-center gap-8">
                  <div className="p-4 bg-blue-electric/10 rounded-2xl group-hover:rotate-6 transition-transform"><Trophy className="w-8 h-8 text-blue-electric" /></div>
                  <div className="text-center md:text-left">
                    <h4 className="text-xl font-bold text-white uppercase tracking-tight mb-2">Initiate Winning Sequence?</h4>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-30">Connect your account node and establish your record today.</p>
                  </div>
               </div>
               <Link href="/accounts" className="btn btn-primary px-12 py-4 rounded-2xl font-bold uppercase text-[11px] tracking-widest group flex items-center">
                 View Tiers <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
