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
    <div className="flex flex-col items-center md:items-end">
      <div className="text-[9px] font-black text-muted uppercase tracking-[0.4em] mb-4 opacity-40 italic">{label}</div>
      <div className="flex items-center gap-2">
        {[
          { label: 'HH', val: pad(time.h) },
          { label: 'MM', val: pad(time.m) },
          { label: 'SS', val: pad(time.s) }
        ].map((unit, i) => (
          <div key={unit.label} className="flex flex-col items-center gap-1.5">
             <div className="px-4 py-3 bg-white/[0.04] border border-white/5 rounded-xl shadow-inner font-black text-xl md:text-2xl text-white tracking-widest italic leading-none">
                {unit.val}
             </div>
             <span className="text-[7px] font-black text-muted uppercase tracking-widest opacity-20 italic">{unit.label}</span>
          </div>
        ))}
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
  const { success: successMsg, error: errorMsg, showSuccess, showError, clear } = useFeedback(5000);

  const streak = userEntry?.streak_count || 0;
  const roundNumber = round?.round_number || 'X';

  const handlePrediction = async (matchId: string, choice: '1' | 'X' | '2') => {
    if (!userEntry) {
      showError('Authorized node required. Initialize account protocol.');
      return;
    }

    const formData = new FormData();
    formData.append('matchId', matchId);
    formData.append('entryId', userEntry.id);
    formData.append('prediction', choice);

    startTransition(async () => {
      try {
        await submitPrediction(formData);
        showSuccess('Aura pick synchronized.');
      } catch (err: unknown) {
        showError((err as Error).message);
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-primary pt-32 pb-24 md:pt-48">
      {/* Cinematic Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full h-[600px] bg-grad-glow opacity-30 blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-electric/5 blur-[120px]" />
      </div>

      {/* Elite Arena Header */}
      <section className="relative z-10 mb-16 px-4">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 animate-slide-up">
            <div className="max-w-xl">
              <div className="flex flex-wrap items-center gap-3 mb-8">
                 <div className="badge-elite !text-success !bg-success/5 border-success/10 !px-4 !py-1 !text-[9px] italic">ARENA: LIVE</div>
                 <div className="badge-elite !text-muted border-white/5 !px-4 !py-1 !text-[9px] opacity-40 italic uppercase">PROTOCOL R-{roundNumber}</div>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-2 leading-[0.9] italic">
                Live <span className="text-gradient-gold">Arena.</span>
              </h1>
              <p className="text-muted text-[11px] md:text-xs font-black opacity-30 uppercase tracking-[0.3em] leading-relaxed max-w-sm mt-8 italic">
                Maintain 3-day integrity to secure verify 10X reward settlement.
              </p>
            </div>

            {round && (
              <div className="card-elite !p-8 !bg-black/40 border-white/5 relative overflow-hidden group">
                 <CountdownTimer label="Cycle Closing" targetDate={round.end_date} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Performance Integrity Monitor */}
      <section className="relative z-10 mb-16 px-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="container">
          <div className="card-elite !p-6 md:p-10 border-white/5 bg-black/40 flex flex-col md:flex-row md:items-center gap-8 shadow-2xl">
            <div className="flex items-center gap-5 shrink-0 text-left">
               <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><TrendingUp className="w-5 h-5 text-gold opacity-50" /></div>
               <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic">Sequence Integrity</span>
                  <span className="text-[8px] font-black text-muted uppercase tracking-[0.2em] opacity-20 italic">R-{roundNumber} Cycle Monitoring Active</span>
               </div>
            </div>
            <div className="flex-1 h-2.5 bg-black/40 rounded-full border border-white/5 overflow-hidden shadow-inner relative">
              <div 
                className="h-full bg-grad-gold shadow-glow-gold transition-all duration-1000"
                style={{ width: `${(streak / 3) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-2.5 text-3xl font-black text-white tracking-tighter italic leading-none">
               <span className="text-gold">{streak}</span>
               <span className="text-muted text-[10px] opacity-30 uppercase tracking-[0.5em] not-italic font-black mt-1">/ 3 CYCLE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Arena Grid Audit */}
      <section className="relative z-10 px-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="container max-w-4xl">
          
          {!userEntry && (
            <div className="card-elite !p-20 text-center bg-blue-electric/[0.02] border-blue-electric/10 mb-20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-24 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700"><ShieldCheck className="w-64 h-64" /></div>
              <ShieldCheck className="w-16 h-16 text-blue-electric opacity-30 mx-auto mb-10" />
              <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter italic">Node Authorization Missing</h3>
              <p className="text-[11px] text-muted font-bold uppercase tracking-[0.3em] opacity-30 mb-12 max-w-sm mx-auto leading-loose italic">Node protocol inactive. Initialize an authorized operational tier to synchronize with the live arena grid.</p>
              <Link href="/accounts" className="btn btn-primary !px-16 !py-5 rounded-full font-bold italic group inline-flex items-center shadow-glow-gold">
                Initialize account <ArrowUpRight className="w-4 h-4 ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-6 px-4 opacity-20 italic">
               <Radio className="w-4 h-4 text-blue-electric animate-pulse" />
               <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">ARENA FEED</h2>
               <div className="flex-1 h-px bg-white/5" />
            </div>

            {matches.length === 0 ? (
               <div className="card-elite !p-32 text-center flex flex-col items-center gap-8 border-dashed border-white/5 opacity-10">
                  <Activity className="w-16 h-16 text-muted opacity-30" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">No active transmissions detected.</p>
               </div>
            ) : (
               matches.map((m: ChallengeMatch, i: number) => {
                  const userPred = predictions.find((p: Prediction) => p.match_id === m.id);
                  const isLocked = m.status !== 'scheduled' || new Date(m.kickoff_time) < new Date();
                  
                  return (
                    <div key={m.id} className={`card-elite !p-0 overflow-hidden transition-all duration-700 bg-black/40 border-white/5 ${isLocked ? 'grayscale-[0.5] opacity-50' : 'group hover:border-white/10'}`}>
                       <div className="px-8 py-4 flex justify-between items-center bg-white/[0.02] border-b border-white/5">
                          <div className="flex items-center gap-6">
                             <div className="w-9 h-9 bg-white/[0.04] border border-white/5 rounded-xl flex items-center justify-center text-[10px] font-black text-white/20 italic shadow-inner">
                                {String(i + 1).padStart(2, '0')}
                             </div>
                             <span className="text-[10px] font-black text-white/30 uppercase tracking-widest italic leading-none">
                                KICKOFF {new Date(m.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                          </div>
                          {isLocked ? (
                            <div className="badge-elite !text-danger border-danger/10 !bg-danger/5 !px-5 !py-0.5 !text-[9px] italic">LOCKED</div>
                          ) : (
                            <div className="badge-elite !text-success border-success/10 !bg-success/5 !px-5 !py-0.5 !text-[9px] italic">SYNCED</div>
                          )}
                       </div>
                       
                       <div className="p-10 md:p-12">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-12">
                             <div className="flex-1 text-center md:text-right">
                                <div className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-2 italic leading-tight">{m.home_team}</div>
                                <div className="text-[8px] font-black text-muted uppercase tracking-[0.4em] opacity-20 italic">Primary Choice</div>
                             </div>
                             
                             <div className="flex flex-col items-center gap-4 shrink-0">
                                {m.status !== 'scheduled' ? (
                                   <div className="text-4xl font-black text-white italic tracking-tighter flex items-center gap-4 leading-none">
                                      <span className="shadow-2xl">{m.home_score}</span>
                                      <span className="opacity-10">:</span>
                                      <span className="shadow-2xl">{m.away_score}</span>
                                   </div>
                                ) : (
                                   <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl shadow-inner group-hover:scale-110 transition-transform"><Swords className="w-6 h-6 text-white/10" /></div>
                                )}
                                <div className={`badge-elite !text-[8px] uppercase tracking-[0.4em] italic font-black !py-0.5 !px-3 ${m.status === 'live' ? '!bg-danger !text-white' : 'opacity-20 shadow-inner'}`}>
                                   {m.status}
                                </div>
                             </div>

                             <div className="flex-1 text-center md:text-left">
                                <div className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-2 italic leading-tight">{m.away_team}</div>
                                <div className="text-[8px] font-black text-muted uppercase tracking-[0.4em] opacity-20 italic">Secondary Choice</div>
                             </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                             {['1', 'X', '2'].map((choice) => (
                                <button
                                  key={choice}
                                  disabled={isLocked || isPending || !userEntry}
                                  onClick={() => handlePrediction(m.id, choice as '1' | 'X' | '2')}
                                  className={`py-5 rounded-xl border transition-all duration-500 font-black uppercase text-[10px] tracking-[0.4em] flex flex-col items-center justify-center gap-1.5 relative overflow-hidden italic shadow-inner ${
                                      userPred?.prediction === choice 
                                      ? 'bg-gold text-black border-gold shadow-glow-gold scale-105' 
                                      : 'bg-white/[0.02] border-white/5 text-muted hover:text-white hover:border-gold/30 hover:bg-gold/5'
                                    }`}
                                >
                                   <span className="text-xl leading-none">{choice}</span>
                                   <span className="text-[8px] font-black opacity-30 mt-1">{choice === '1' ? 'HOME' : choice === '2' ? 'AWAY' : 'DRAW'}</span>
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

      {/* Operational Protocol Directives */}
      <section className="relative z-10 pt-24 mt-32 border-t border-white/5">
         <div className="container px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
               {[
                 { id: '01', title: 'Cycle Protocol', desc: 'Settle one outcome every 24-hours for three cycles to secure yield.' },
                 { id: '02', title: 'Data Settlement', desc: 'Results verified based on official 90-minute outcomes. Windows lock at kickoff.' },
                 { id: '03', title: 'Payout Hub', desc: 'Verified 3/3 integrity streaks are triggered for automated settlement.' }
               ].map(rule => (
                 <div key={rule.id} className="card-elite !p-10 bg-black/40 border-white/5 flex flex-col gap-8 group">
                   <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-[10px] font-black text-gold shadow-inner group-hover:scale-110 transition-transform italic">PH-{rule.id}</div>
                   <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] italic leading-tight">{rule.title}</h4>
                   <p className="text-[9px] font-black text-muted leading-relaxed uppercase tracking-[0.2em] opacity-20 italic">{rule.desc}</p>
                 </div>
               ))}
            </div>
            
            <div className="card-elite !p-12 md:p-20 bg-black/40 border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group">
               <div className="absolute top-0 right-0 p-16 opacity-[0.01] group-hover:opacity-[0.03] transition-opacity -rotate-12 pointer-events-none -translate-x-12"><Trophy className="w-64 h-64 shadow-glow-gold" /></div>
               <div className="flex items-center gap-10 relative z-10">
                  <div className="p-4 bg-white/[0.04] rounded-2xl border border-white/5 group-hover:rotate-12 transition-transform shadow-inner shrink-0"><Trophy className="w-8 h-8 text-gold opacity-40 shadow-glow-gold" /></div>
                  <div className="text-center md:text-left">
                    <h4 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4 italic">Deploy Operational Node.</h4>
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em] opacity-20 italic">Connect your cluster and establish your record today.</p>
                  </div>
               </div>
               <Link href="/accounts" className="btn btn-primary !px-12 !py-4 rounded-xl font-black italic shadow-2xl group relative z-10 uppercase text-[11px] tracking-widest">
                 View Tiers <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
         </div>
      </section>

      {/* Global Arena Notifications */}
      {(successMsg || errorMsg) && (
        <div className={`fixed bottom-10 right-10 z-[100] px-10 py-6 rounded-3xl backdrop-blur-3xl border flex items-center gap-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] animate-slide-up ${
          successMsg ? 'bg-success/90 border-success/30 text-black' : 'bg-danger/90 border-danger/30 text-white'
        }`}>
           <div className="p-3 bg-black/10 rounded-2xl shadow-inner italic">
             {successMsg ? <Check className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
           </div>
           <div className="flex flex-col gap-1 text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">{successMsg ? 'ARENA SUCCESS' : 'ARENA MONITOR'}</span>
              <span className="text-[14px] font-black tracking-tight uppercase italic">{successMsg || errorMsg}</span>
           </div>
           <button onClick={clear} className="ml-12 p-3 hover:bg-black/10 rounded-2xl opacity-40 hover:opacity-100 transition-all font-black text-xl leading-none">×</button>
        </div>
      )}
    </div>
  );
}
