'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { 
  Trophy, 
  Activity, 
  ShieldCheck, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { getPredictionsOverview } from '@/app/actions/admin';
import { ChallengeRound } from '@/types';
import { useFeedback } from '@/hooks/useFeedback';

interface PredictionWithMatch {
  id: string;
  prediction: string;
  is_correct: boolean | null;
  is_locked: boolean;
  challenge_matches?: {
    home_team: string;
    away_team: string;
    kickoff_time: string;
    home_score?: number;
    away_score?: number;
  } | {
    home_team: string;
    away_team: string;
    kickoff_time: string;
    home_score?: number;
    away_score?: number;
  }[];
}

interface PredictionEntry {
  id: string;
  streak_count: number;
  is_winner: boolean;
  created_at: string;
  profiles?: {
    username: string;
  } | {
    username: string;
  }[];
  account_tiers?: {
    name: string;
  } | {
    name: string;
  }[];
  challenge_rounds?: {
    round_number: number;
  } | {
    round_number: number;
  }[];
  predictions?: PredictionWithMatch[];
}

interface PlaysViewProps {
  rounds: ChallengeRound[];
}

export default function PlaysView({ rounds }: PlaysViewProps) {
  const [entries, setEntries] = useState<PredictionEntry[]>([]);
  const [filterRoundId, setFilterRoundId] = useState<string>('all');
  const [isPending, startTransition] = useTransition();
  const { success: successMsg, error: errorMsg, showError, clear } = useFeedback();

  const loadPlays = useCallback(() => {
    startTransition(async () => {
      try {
        const data = await getPredictionsOverview({ round_id: filterRoundId });
        setEntries(data);
      } catch (err: unknown) {
        showError((err as Error).message || 'Failed to fetch plays');
      }
    });
  }, [filterRoundId, showError]);

  useEffect(() => {
    loadPlays();
  }, [loadPlays]);

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
      {/* Search & Filter Bar */}
      <div className="bg-[#030508] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:opacity-10 transition-all font-black text-6xl italic transform rotate-6">ANALYTICS</div>
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-electric/10 rounded-xl border border-blue-electric/20">
                  <TrendingUp className="w-5 h-5 text-blue-electric" />
               </div>
               <div>
                 <h2 className="font-display text-xl font-black italic tracking-tighter text-white uppercase">Active <span className="text-gradient-gold">Plays.</span></h2>
                 <p className="text-[9px] text-muted font-bold tracking-widest uppercase mt-2 opacity-50 flex items-center gap-2">
                    ORGANIZED <ChevronRight className="w-3 h-3" /> USER DATA LAKE
                 </p>
               </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
               <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 min-w-[200px]">
                  <Filter className="w-3.5 h-3.5 text-muted opacity-40" />
                  <select 
                    value={filterRoundId}
                    onChange={(e) => setFilterRoundId(e.target.value)}
                    className="bg-transparent text-[10px] font-black uppercase tracking-widest text-white border-none outline-none cursor-pointer w-full"
                  >
                    <option value="all" className="bg-[#0b0d14]">ALL ROUNDS</option>
                    {rounds.map(r => (
                      <option key={r.id} value={r.id} className="bg-[#0b0d14]">ROUND {r.round_number}</option>
                    ))}
                  </select>
               </div>
               <button 
                 onClick={loadPlays}
                 disabled={isPending}
                 className="btn btn-ghost !px-6 !py-3 h-auto text-[10px] font-black border border-white/10 grow lg:grow-0"
               >
                 {isPending ? 'SYNCING...' : 'REFRESH'}
               </button>
            </div>
         </div>
      </div>

      {/* Plays Table/Grid */}
      <div className="flex flex-col gap-4">
        {entries.length === 0 ? (
          <div className="card py-60 text-center flex flex-col items-center gap-6 opacity-30">
             <Activity className="w-10 h-10 text-muted" />
             <p className="text-[10px] font-black uppercase tracking-widest italic font-mono">No active predictions found across selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {entries.map(entry => {
              const profile = Array.isArray(entry.profiles) ? entry.profiles[0] : entry.profiles;
              const tier = Array.isArray(entry.account_tiers) ? entry.account_tiers[0] : entry.account_tiers;
              const round = Array.isArray(entry.challenge_rounds) ? entry.challenge_rounds[0] : entry.challenge_rounds;

              return (
                <div key={entry.id} className="card p-0 border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] transition-all overflow-hidden">
                   <div className="p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                      {/* User & Entry Info */}
                      <div className="flex items-center gap-6 min-w-[250px]">
                         <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs text-blue-electric">
                            {profile?.username?.[0] || 'U'}
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                               <span className="text-sm font-black text-white">@{profile?.username}</span>
                               <span className="badge badge-muted !text-[7px] px-2 py-0.5 uppercase">{tier?.name}</span>
                            </div>
                            <div className="text-[9px] text-muted font-bold font-mono tracking-tighter opacity-50">
                               R{round?.round_number} <span className="mx-2">|</span> {new Date(entry.created_at).toLocaleDateString()}
                            </div>
                         </div>
                      </div>

                    {/* Streak Visualization */}
                    <div className="flex-1 max-w-2xl px-8 border-x border-white/5 hidden xl:block">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-[9px] font-black text-muted uppercase tracking-widest">3-Day Sequence Integrity</span>
                          <span className={`text-[9px] font-black uppercase tracking-widest ${entry.is_winner ? 'text-success' : 'text-blue-electric'}`}>
                             Streak: {entry.streak_count}/3
                          </span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-1 p-0.5">
                          {[1, 2, 3].map(step => (
                            <div key={step} className={`h-full flex-1 rounded-full transition-all duration-700 ${
                              step <= entry.streak_count ? 'bg-grad-premium shadow-[0_0_10px_rgba(240,196,25,0.2)]' : 'bg-white/5 opacity-40'
                            }`} />
                          ))}
                       </div>
                    </div>

                    {/* Quick Outcome */}
                    <div className="flex items-center gap-6 xl:min-w-[200px] justify-end">
                       <div className="text-right">
                          <div className="text-[10px] font-black text-white font-mono leading-none mb-2 italic">
                             {entry.is_winner ? 'WINNER (10X)' : 'IN PROGRESS'}
                          </div>
                          <div className="text-[8px] text-muted font-black tracking-widest uppercase opacity-40">Status Code: {entry.is_winner ? 'SETTLED' : 'ACTIVE'}</div>
                       </div>
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          entry.is_winner ? 'bg-success/10 border border-success/20 text-success' : 'bg-white/5 border border-white/10 text-muted opacity-40'
                       }`}>
                          {entry.is_winner ? <Trophy className="w-5 h-5 shadow-inner" /> : <Clock className="w-5 h-5" />}
                       </div>
                    </div>
                 </div>

                 {/* Predictions Breakdown */}
                 <div className="bg-black/20 border-t border-white/5 p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[0, 1, 2].map(idx => {
                      const pred = entry.predictions?.[idx];
                      const match = pred ? (Array.isArray(pred.challenge_matches) ? pred.challenge_matches[0] : pred.challenge_matches) : null;
                      
                      return (
                        <div key={idx} className={`p-4 rounded-xl border transition-all ${
                          pred ? 'bg-white/[0.02] border-white/5' : 'bg-transparent border-white/5 border-dashed opacity-20'
                        }`}>
                           {!pred ? (
                              <div className="flex items-center justify-center h-12 italic text-[9px] font-bold text-muted uppercase tracking-widest">Awaiting Submission</div>
                           ) : (
                              <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                   <span className="text-[8px] font-black text-muted uppercase tracking-widest">MATCH {idx + 1}</span>
                                   {pred.is_locked ? (
                                     pred.is_correct ? <CheckCircle2 className="w-3.5 h-3.5 text-success" /> : <XCircle className="w-3.5 h-3.5 text-danger" />
                                   ) : (
                                     <Clock className="w-3.5 h-3.5 text-blue-electric animate-pulse" />
                                   )}
                                </div>
                                <div className="flex justify-between items-end">
                                   <div>
                                     <div className="text-[10px] font-black text-white uppercase italic tracking-tight truncate max-w-[120px]">
                                        {match?.home_team} vs {match?.away_team}
                                     </div>
                                     <div className="text-[8px] text-muted font-bold uppercase mt-1">Prediction: {pred.prediction === '1' ? 'Home' : pred.prediction === '2' ? 'Away' : 'Draw'}</div>
                                   </div>
                                   <div className="text-xs font-black text-white italic tracking-tighter">
                                      {match?.home_score ?? "-"} : {match?.away_score ?? "-"}
                                   </div>
                                </div>
                              </div>
                           )}
                        </div>
                      );
                    })}
                 </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Global Status notifications */}
      {(successMsg || errorMsg) && (
        <div className={`fixed bottom-6 right-6 z-[120] px-5 py-3 rounded-xl backdrop-blur-xl border flex items-center gap-3 shadow-2xl animate-slide-up ${
          successMsg ? 'bg-success/90 border-success/20 text-black' : 'bg-danger/90 border-danger/20 text-white'
        }`}>
           {successMsg ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
           <span className="text-xs font-bold">{successMsg || errorMsg}</span>
           <button onClick={clear} className="ml-12 p-3 hover:bg-black/10 rounded-lg opacity-40 hover:opacity-100 transition-all font-black">×</button>
        </div>
      )}
    </div>
  );
}
