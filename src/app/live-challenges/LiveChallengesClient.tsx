'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight,
  Check,
  TrendingUp,
  Activity,
  ArrowRight,
  Radio,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { submitPrediction } from '@/app/actions/predictions';
import { ChallengeRound, ChallengeMatch, ChallengeEntry, Prediction } from '@/types';
import { useFeedback } from '@/hooks/useFeedback';

function CountdownTimer({ label, targetDate }: { label: string, targetDate?: string }) {
  const calculateTime = () => {
    const target = targetDate ? new Date(targetDate).getTime() : Date.now() + 172800000;
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
      <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-3 opacity-40 italic">{label}</div>
      <div className="flex items-center gap-1.5">
        {[
          { label: 'H', val: pad(time.h) },
          { label: 'M', val: pad(time.m) },
          { label: 'S', val: pad(time.s) }
        ].map((unit, i) => (
          <div key={unit.label} className="flex flex-col items-center gap-1">
             <div className="px-3 py-2 bg-white/[0.03] border border-white/5 rounded-lg font-black text-xl text-white tracking-widest italic leading-none">
                {unit.val}
             </div>
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
      showError('Please select a plan to participate in the arena.');
      return;
    }

    const formData = new FormData();
    formData.append('matchId', matchId);
    formData.append('entryId', userEntry.id);
    formData.append('prediction', choice);

    startTransition(async () => {
      try {
        await submitPrediction(formData);
        showSuccess('Prediction secured successfully.');
      } catch (err: unknown) {
        showError((err as Error).message);
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-primary pt-32 pb-24 md:pt-44">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full h-[600px] bg-gold-glow blur-[140px] opacity-30" />
      </div>

      <div className="container relative z-10 px-6">
        {/* Arena Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 animate-slide-up">
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
               <div className="badge-elite !text-success bg-success/10 border-success/10 px-4 py-1">LIVE ARENA</div>
               <div className="badge-elite text-muted border-white/5 px-4 py-1">SEASON 01</div>
            </div>
            <h1 className="mb-4">Match <span className="text-gradient-gold">Arena.</span></h1>
            <p className="text-muted text-sm md:text-base font-medium opacity-60 max-w-sm">
              Study the upcoming fixture list and commit to your 3-day sequence.
            </p>
          </div>

          {round && <CountdownTimer label="Arena Cycle Closing" targetDate={round.end_date} />}
        </div>

        {/* Streak Integrity Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-8">
            <div className="card-elite !p-6 bg-[#080a0f] border-white/5 flex flex-col md:flex-row md:items-center gap-8 shadow-xl">
               <div className="flex items-center gap-4 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center text-gold shadow-inner"><TrendingUp className="w-5 h-5" /></div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Sequence Tracker</span>
                     <span className="text-[8px] font-black text-muted uppercase tracking-widest opacity-30 italic">Round {roundNumber} Active</span>
                  </div>
               </div>
               <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden relative border border-white/5">
                 <div 
                   className="h-full bg-grad-premium shadow-glow-gold transition-all duration-1000"
                   style={{ width: `${(streak / 3) * 100}%` }}
                 />
               </div>
               <div className="flex items-center gap-2 text-2xl font-black text-white italic leading-none">
                  <span className="text-gold">{streak}</span>
                  <span className="text-muted text-xs opacity-20 not-italic font-black mt-1">/ 3</span>
               </div>
            </div>
          </div>
          
          <div className="lg:col-span-4 card-elite !p-6 bg-gold/5 border-gold/10 flex items-center justify-between shadow-xl group">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-gold uppercase tracking-widest italic">Potential Pot</span>
                <span className="text-xl font-black text-white italic tracking-tighter transition-all group-hover:scale-105 origin-left">₦{(userEntry?.tier_id ? (userEntry as any).price_ngn * 10 : 0).toLocaleString()}</span>
             </div>
             <Trophy className="w-8 h-8 text-gold opacity-30 group-hover:rotate-12 transition-transform" />
          </div>
        </div>

        {/* Global Notifications */}
        {(successMsg || errorMsg) && (
          <div className={`fixed top-24 right-6 left-6 md:left-auto md:w-96 z-[100] p-6 rounded-2xl backdrop-blur-3xl border flex items-center gap-6 shadow-2xl animate-slide-up ${
            successMsg ? 'bg-success/90 border-success/20 text-black' : 'bg-danger/90 border-danger/20 text-white'
          }`}>
             <div className="shrink-0">{successMsg ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}</div>
             <span className="text-xs font-bold uppercase tracking-widest">{successMsg || errorMsg}</span>
             <button onClick={clear} className="ml-auto text-lg leading-none opacity-50 hover:opacity-100 transition-opacity">×</button>
          </div>
        )}

        {/* Arena Grid */}
        <div className="max-w-4xl mx-auto space-y-6">
          {!userEntry ? (
            <div className="card-elite !p-16 text-center border-dashed border-white/10 bg-white/[0.01]">
              <ShieldCheck className="w-12 h-12 text-muted opacity-20 mx-auto mb-8" />
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 italic">No Active Subscription</h3>
              <p className="text-xs font-bold text-muted uppercase tracking-widest opacity-40 mb-10 max-w-xs mx-auto leading-loose">
                Select a premium plan to synchronize with the live match arena.
              </p>
              <Link href="/accounts" className="btn btn-primary !px-12 !py-4 rounded-xl font-black italic shadow-2xl">
                View Plans <ArrowRight className="w-4 h-4 ml-3" />
              </Link>
            </div>
          ) : (
            matches.map((m, i) => {
               const userPred = predictions.find((p) => p.match_id === m.id);
               const isLocked = m.status !== 'scheduled' || new Date(m.kickoff_time) < new Date();
               
               return (
                 <div key={m.id} className={`card-elite !p-0 overflow-hidden bg-[#080a0f] border-white/5 transition-all duration-500 ${isLocked ? 'opacity-40 grayscale-[0.2]' : 'hover:border-white/10 shadow-lg'}`}>
                    <div className="px-6 py-3 flex justify-between items-center bg-white/[0.02] border-b border-white/5">
                       <span className="text-[10px] font-black text-muted uppercase tracking-widest italic">{new Date(m.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Match {i + 1}</span>
                       <div className={`badge-elite !text-[8px] italic ${isLocked ? 'text-danger border-danger/10' : 'text-success border-success/10'}`}>
                         {isLocked ? 'LOCKED' : 'AVAILABLE'}
                       </div>
                    </div>
                    
                    <div className="p-10 md:p-12">
                       <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-10">
                          <div className="flex-1 text-center md:text-right">
                             <div className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-1 italic leading-tight">{m.home_team}</div>
                             <div className="text-[8px] font-bold text-muted uppercase tracking-widest opacity-20 italic">HOME</div>
                          </div>
                          
                          <div className="flex flex-col items-center gap-3 shrink-0">
                             {m.status !== 'scheduled' ? (
                                <div className="text-4xl font-black text-white italic tracking-tighter flex items-center gap-3">
                                   <span>{m.home_score}</span>
                                   <span className="opacity-10">:</span>
                                   <span>{m.away_score}</span>
                                </div>
                             ) : (
                                <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/10 italic font-black shadow-inner">VS</div>
                             )}
                             <div className={`badge-elite !text-[7px] italic border-none ${m.status === 'live' ? 'bg-danger text-white' : 'opacity-20'}`}>
                                {m.status}
                             </div>
                          </div>

                          <div className="flex-1 text-center md:text-left">
                             <div className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-1 italic leading-tight">{m.away_team}</div>
                             <div className="text-[8px] font-bold text-muted uppercase tracking-widest opacity-20 italic">AWAY</div>
                          </div>
                       </div>

                       <div className="grid grid-cols-3 gap-3">
                          {['1', 'X', '2'].map((choice) => (
                             <button
                               key={choice}
                               disabled={isLocked || isPending}
                               onClick={() => handlePrediction(m.id, choice as '1' | 'X' | '2')}
                               className={`py-4 rounded-xl border transition-all duration-500 font-black text-xs tracking-widest flex flex-col items-center justify-center gap-1 italic shadow-inner ${
                                   userPred?.prediction === choice 
                                   ? 'bg-gold text-black border-gold shadow-glow-gold' 
                                   : 'bg-white/[0.02] border-white/5 text-muted hover:text-white hover:border-gold/30'
                                 }`}
                             >
                                <span className={userPred?.prediction === choice ? 'text-lg' : 'text-md'}>{choice}</span>
                                <span className="text-[7px] opacity-40">{choice === '1' ? 'HOME' : choice === '2' ? 'AWAY' : 'DRAW'}</span>
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
    </div>
  );
}
