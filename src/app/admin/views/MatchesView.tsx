'use client';

import { useState, useTransition } from 'react';
import { 
  Sword, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Activity, 
  Trophy, 
  ShieldCheck, 
  AlertCircle, 
  Settings2,
  ChevronRight,
  Play,
  RotateCcw,
  Check,
  Plus
} from 'lucide-react';
import { settleMatchResult, updateMatchStatus, updateRoundStatus, createMatch } from '@/app/actions/predictions';
import { ChallengeMatch, ChallengeRound } from '@/types';

interface MatchesViewProps {
  matches: (ChallengeMatch & { challenge_rounds?: { round_number: number } })[];
  rounds: ChallengeRound[];
}

export default function MatchesView({ matches, rounds }: MatchesViewProps) {
  const [isPending, startTransition] = useTransition();
  const [editingScores, setEditingScores] = useState<Record<string, { home: number; away: number }>>({});
  const [selectedRoundId, setSelectedRoundId] = useState<string>(rounds.find(r => r.status === 'active')?.id || rounds[0]?.id || '');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchData, setMatchData] = useState({ home_team: '', away_team: '', kickoff_time: '' });

  const filteredMatches = matches.filter(m => m.round_id === selectedRoundId);
  const selectedRound = rounds.find(r => r.id === selectedRoundId);

  const handleScoreChange = (matchId: string, side: 'home' | 'away', val: number) => {
    setEditingScores(prev => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || { home: 0, away: 0 }),
        [side]: val
      }
    }));
  };

  const onSettle = async (matchId: string) => {
    const scores = editingScores[matchId] || { home: 0, away: 0 };
    startTransition(async () => {
      try {
        await settleMatchResult(matchId, scores.home, scores.away);
        setSuccessMsg('Match result settled successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err: any) {
        setErrorMsg(err.message || 'Settlement failed');
      }
    });
  };

  const handleStatusChange = async (matchId: string, status: 'scheduled' | 'live' | 'finished') => {
    startTransition(async () => {
      try {
        await updateMatchStatus(matchId, status);
        setSuccessMsg(`Match marked as ${status}.`);
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err: any) {
        setErrorMsg(err.message || 'Status update failed');
      }
    });
  };

  const handleRoundStatusChange = async (roundId: string, status: 'upcoming' | 'active' | 'completed') => {
    startTransition(async () => {
      try {
        await updateRoundStatus(roundId, status);
        setSuccessMsg(`Round status updated to ${status}.`);
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err: any) {
        setErrorMsg(err.message || 'Round status update failed');
      }
    });
  };

  const handleCreateMatch = async () => {
    if (!matchData.home_team || !matchData.away_team || !matchData.kickoff_time || !selectedRoundId) return;
    startTransition(async () => {
      try {
        await createMatch({ ...matchData, round_id: selectedRoundId });
        setSuccessMsg('Match added to round successfully.');
        setShowMatchModal(false);
        setMatchData({ home_team: '', away_team: '', kickoff_time: '' });
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err: any) {
        setErrorMsg(err.message || 'Creation failed');
      }
    });
  };

  return (
    <>
    <div className="flex flex-col gap-24 animate-slide-up">
      {/* Toast Notifications */}
      {(successMsg || errorMsg) && (
        <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl backdrop-blur-xl border flex items-center gap-3 shadow-2xl animate-slide-up ${
          successMsg ? 'bg-success/90 border-success/20 text-black' : 'bg-danger/90 border-danger/20 text-white'
        }`}>
           {successMsg ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
           <span className="text-xs font-bold">{successMsg || errorMsg}</span>
        </div>
      )}

      {/* ─── ROUNDS OVERVIEW ─── */}
      <div className="card p-6 bg-white/[0.02]">
        <div className="flex justify-between items-center mb-6 px-4">
          <div className="flex items-center gap-10">
             <Calendar className="w-5 h-5 text-blue-electric opacity-60" />
             <h2 className="font-display text-lg font-black uppercase tracking-widest">Platform Rounds</h2>
          </div>
          <button 
            onClick={() => setShowMatchModal(true)}
            disabled={!selectedRoundId}
            className="btn btn-primary btn-xs px-16 h-40 font-black uppercase tracking-widest text-[10px] flex items-center gap-8"
          >
            <Plus className="w-4 h-4" /> ADD MATCH TO ROUND
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {rounds.map(r => (
            <div 
              key={r.id} 
              onClick={() => setSelectedRoundId(r.id)}
              className={`p-16 rounded-xl border transition-all cursor-pointer group ${
                selectedRoundId === r.id 
                ? 'bg-blue-electric/[0.05] border-blue-electric/40 shadow-lg shadow-blue-electric/5' 
                : 'bg-white/[0.02] border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-center mb-10">
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${selectedRoundId === r.id ? 'text-blue-electric' : 'text-muted'}`}>Round {r.round_number}</span>
                <div className={`w-3 h-3 rounded-full ${r.status === 'active' ? 'bg-success animate-pulse' : r.status === 'completed' ? 'bg-blue-electric' : 'bg-muted opacity-20'}`} />
              </div>
              <div className="text-[10px] text-white font-black font-mono uppercase tracking-tighter">
                 {r.status}
              </div>
              <div className="text-[9px] text-muted font-bold mt-4 opacity-40 font-mono">
                 {new Date(r.start_date).toLocaleDateString()} — Logged
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRound && (
        <div className="card border-blue-electric/20 p-6 bg-blue-electric/[0.03] animate-fade-in relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-electric"><Trophy className="w-12 h-12" /></div>
           <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-12">
                <div className="p-10 bg-blue-electric/10 rounded-xl"><Settings2 className="w-5 h-5 text-blue-electric" /></div>
                <div>
                  <h3 className="font-black text-sm text-white uppercase tracking-widest">Management: Round {selectedRound.round_number}</h3>
                  <p className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-60 flex items-center gap-6">
                     Platform Settings <ChevronRight className="w-3 h-3" /> Management Mode
                  </p>
                </div>
              </div>
              <div className="flex gap-8">
                 <button 
                  disabled={isPending || selectedRound.status === 'active'}
                  onClick={() => handleRoundStatusChange(selectedRound.id, 'active')}
                  className={`btn btn-xs px-16 py-8 font-black uppercase text-[9px] tracking-widest ${selectedRound.status === 'active' ? 'bg-success/20 text-success border-success/30' : 'btn-ghost border-dashed opacity-40 hover:opacity-100'}`}
                 >Activate</button>
                 <button 
                  disabled={isPending || selectedRound.status === 'completed'}
                  onClick={() => handleRoundStatusChange(selectedRound.id, 'completed')}
                  className={`btn btn-xs px-16 py-8 font-black uppercase text-[9px] tracking-widest ${selectedRound.status === 'completed' ? 'bg-blue-electric text-white border-blue-electric/40 shadow-lg shadow-blue-electric/20' : 'btn-ghost border-dashed opacity-40 hover:opacity-100'}`}
                 >Settle Round</button>
              </div>
           </div>
        </div>
      )}

      {/* ─── MATCH SETTLEMENT GRID ─── */}
      <div className="card p-6 bg-white/[0.02]">
        <div className="flex justify-between items-center mb-6 px-4">
          <div className="flex items-center gap-10">
             <Trophy className="w-5 h-5 text-gold opacity-60" />
             <h2 className="font-display text-lg font-black uppercase tracking-widest text-white">Match Management</h2>
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          {filteredMatches.length === 0 ? (
            <div className="py-60 text-center flex flex-col items-center gap-4 opacity-30">
               <Sword className="w-10 h-10 text-muted" />
               <p className="text-[10px] text-muted font-black uppercase tracking-widest font-mono italic">No matches scheduled in this round.</p>
            </div>
          ) : (
            filteredMatches.map(m => (
              <div key={m.id} className={`card p-16 transition-all border outline-none ${
                  m.status === 'live' 
                  ? 'border-danger/30 bg-danger/[0.03] shadow-lg shadow-danger/5' 
                  : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                }`}
              >
                <div className="flex justify-between items-center gap-24 flex-wrap md:flex-nowrap">
                  <div className="min-w-[120px]">
                    <div className="flex items-center gap-8 mb-2">
                       <div className={`w-3 h-3 rounded-full ${m.status === 'live' ? 'bg-danger animate-pulse shadow-[0_0_6px_var(--danger)]' : 'bg-muted opacity-40'}`} />
                       <div className={`text-[9px] font-black uppercase tracking-[0.2em] ${m.status === 'live' ? 'text-danger' : 'text-muted'}`}>
                         {m.status === 'live' ? 'LIVE NOW' : m.status}
                       </div>
                    </div>
                    <div className="text-[10px] text-muted font-black font-mono uppercase tracking-tighter opacity-60 flex items-center gap-6">
                       <Activity className="w-3.5 h-3.5" /> {new Date(m.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className="flex-1 flex items-center gap-16 md:gap-24 min-w-[250px] justify-center">
                    <div className="flex-1 text-right font-display text-base font-black tracking-tight text-white uppercase italic truncate">
                       {m.home_team}
                    </div>
                    
                    <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/10">
                        <input 
                          type="number" 
                          disabled={m.status === 'finished'}
                          value={editingScores[m.id]?.home ?? m.home_score ?? 0} 
                          onChange={(e) => handleScoreChange(m.id, 'home', Number(e.target.value))}
                          className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg text-center text-sm font-black font-display text-white focus:outline-none focus:border-blue-electric transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <div className="flex flex-col items-center opacity-20 ml-2 mr-2">
                           <span className="text-[8px] font-black uppercase tracking-tighter">VS</span>
                        </div>
                        <input 
                          type="number" 
                          disabled={m.status === 'finished'}
                          value={editingScores[m.id]?.away ?? m.away_score ?? 0} 
                          onChange={(e) => handleScoreChange(m.id, 'away', Number(e.target.value))}
                          className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg text-center text-sm font-black font-display text-white focus:outline-none focus:border-blue-electric transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                    
                    <div className="flex-1 text-left font-display text-base font-black tracking-tight text-white uppercase italic truncate">
                       {m.away_team}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 min-w-[180px]">
                    {m.status !== 'finished' ? (
                      <>
                        <button 
                          disabled={isPending}
                          onClick={() => onSettle(m.id)}
                          className="btn btn-blue w-full py-10 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-electric/20 flex items-center justify-center gap-8"
                        >
                           <ShieldCheck className="w-4 h-4" />
                           {isPending ? 'SAVING...' : 'SAVE RESULT'}
                        </button>
                        <div className="flex gap-4 mt-1">
                           <button 
                            disabled={isPending || m.status === 'live'}
                            onClick={() => handleStatusChange(m.id, 'live')}
                            className="bg-white/5 hover:bg-danger/10 text-muted hover:text-danger border border-white/5 hover:border-danger/20 p-8 rounded-lg flex-1 text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 group"
                           >
                              <Play className="w-3 h-3 group-hover:fill-danger" /> GO LIVE
                           </button>
                           <button 
                            disabled={isPending || m.status === 'scheduled'}
                            onClick={() => handleStatusChange(m.id, 'scheduled')}
                            className="bg-white/5 hover:bg-white/10 border border-white/5 p-8 rounded-lg flex-1 text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4"
                           >
                              <RotateCcw className="w-3 h-3 opacity-40" /> RESET
                           </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col gap-4">
                         <div className="flex items-center justify-center gap-8 py-10 rounded-xl bg-success/10 border border-success/30 text-success text-[10px] font-black uppercase tracking-widest shadow-lg shadow-success/10">
                            <CheckCircle2 className="w-4 h-4 font-black" /> Finalized
                         </div>
                         <button 
                          disabled={isPending}
                          onClick={() => handleStatusChange(m.id, 'scheduled')}
                          className="text-[8px] text-muted hover:text-white transition-colors underline uppercase font-black tracking-widest mt-4 opacity-40 text-center"
                         >Undo Settlement</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>

    {/* ADD MATCH MODAL */}
    {showMatchModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-24">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isPending && setShowMatchModal(false)} />
        <div className="card w-full max-w-[440px] p-0 relative z-10 animate-slide-up bg-zinc-950 border-white/10">
           <div className="p-24 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <div className="flex items-center gap-12">
                 <div className="p-10 bg-blue-electric/10 rounded-xl"><Plus className="w-5 h-5 text-blue-electric" /></div>
                 <div>
                    <h3 className="font-display font-black text-white uppercase tracking-widest leading-none">Schedule Match</h3>
                    <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-4 opacity-60">Round {selectedRound?.round_number} Assignment</p>
                 </div>
              </div>
           </div>
           
           <div className="p-24 flex flex-col gap-20">
              <div className="grid grid-cols-2 gap-12">
                 <div className="flex flex-col gap-6">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-4">Home Team</label>
                    <input 
                      type="text" 
                      value={matchData.home_team} 
                      onChange={e => setMatchData(prev => ({ ...prev, home_team: e.target.value }))}
                      className="input-premium py-12 text-xs font-bold" 
                      placeholder="e.g. Arsenal" 
                    />
                 </div>
                 <div className="flex flex-col gap-6">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-4">Away Team</label>
                    <input 
                      type="text" 
                      value={matchData.away_team} 
                      onChange={e => setMatchData(prev => ({ ...prev, away_team: e.target.value }))}
                      className="input-premium py-12 text-xs font-bold" 
                      placeholder="e.g. Chelsea" 
                    />
                 </div>
              </div>

              <div className="flex flex-col gap-6">
                 <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-4">Kickoff Time</label>
                 <input 
                   type="datetime-local" 
                   value={matchData.kickoff_time} 
                   onChange={e => setMatchData(prev => ({ ...prev, kickoff_time: e.target.value }))}
                   className="input-premium py-12 text-xs font-mono" 
                 />
              </div>

              <div className="p-12 bg-blue-electric/5 border border-blue-electric/10 rounded-xl flex items-center gap-12 mt-8">
                 <AlertCircle className="w-5 h-5 text-blue-electric opacity-40" />
                 <p className="text-[9px] text-muted leading-relaxed font-bold uppercase tracking-tight">Predictions will open immediately upon scheduling unless the kickoff time has passed.</p>
              </div>
           </div>

           <div className="p-24 border-t border-white/5 flex gap-12 bg-white/[0.01]">
              <button 
                onClick={() => setShowMatchModal(false)}
                className="btn btn-ghost flex-1 py-12 font-black uppercase text-[10px] tracking-widest opacity-60 hover:opacity-100"
              >Cancel</button>
              <button 
                onClick={handleCreateMatch}
                disabled={isPending || !matchData.home_team || !matchData.away_team || !matchData.kickoff_time}
                className="btn btn-blue flex-1 py-12 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-electric/20"
              >
                {isPending ? 'SCHEDULING...' : 'CONFIRM MATCH'}
              </button>
           </div>
        </div>
      </div>
    )}
    </>
  );
}
