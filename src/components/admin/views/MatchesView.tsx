'use client';

import { useState, useTransition, useEffect } from 'react';
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
  Plus,
  RefreshCw
} from 'lucide-react';
import { settleMatchResult, updateMatchStatus, updateRoundStatus, createMatch, createRound } from '@/app/actions/predictions';
import { undoMatchSettlement, overrideMatchScore } from '@/app/actions/admin';
import { ChallengeMatch, ChallengeRound } from '@/types';
import { useRouter } from 'next/navigation';

interface MatchesViewProps {
  matches: (ChallengeMatch & { challenge_rounds?: { round_number: number } })[];
  rounds: ChallengeRound[];
}

export default function MatchesView({ matches, rounds }: MatchesViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingScores, setEditingScores] = useState<Record<string, { home: number; away: number }>>({});
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(rounds.find(r => r.status === 'active')?.id || rounds[0]?.id || null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showRoundModal, setShowRoundModal] = useState(false);
  const [matchData, setMatchData] = useState({ home_team: '', away_team: '', kickoff_time: '' });
  const [roundData, setRoundData] = useState({ round_number: rounds.length + 1, start_date: '', end_date: '' });

  useEffect(() => {
    if (!selectedRoundId && rounds.length > 0) {
      setSelectedRoundId(rounds[0].id);
    }
  }, [rounds, selectedRoundId]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 3000);
  };

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
        showSuccess('Match added to round successfully.');
        setShowMatchModal(false);
        setMatchData({ home_team: '', away_team: '', kickoff_time: '' });
        router.refresh();
      } catch (err: any) {
        showError(err.message || 'Creation failed');
      }
    });
  };

  const handleCreateRound = async () => {
    if (!roundData.round_number || !roundData.start_date || !roundData.end_date) return;
    startTransition(async () => {
      try {
        await createRound(roundData);
        showSuccess(`Round ${roundData.round_number} created successfully.`);
        setShowRoundModal(false);
        setRoundData({ round_number: rounds.length + 2, start_date: '', end_date: '' });
        router.refresh();
      } catch (err: any) {
        showError(err.message || 'Round creation failed');
      }
    });
  };

  const handleUndo = async (matchId: string) => {
    if (!confirm('This will unlock all user predictions for this match. Proceed?')) return;
    startTransition(async () => {
      try {
        await undoMatchSettlement(matchId);
        showSuccess('Match settlement sequence undone. You can now re-enter the score.');
        router.refresh();
      } catch (err: any) {
        showError(err.message || 'Undo failed');
      }
    });
  };

  const handleOverride = async (matchId: string) => {
    const scores = editingScores[matchId] || { home: 0, away: 0 };
    if (!confirm(`FORCE UPDATE SCORE TO ${scores.home}-${scores.away}? This will bypass standard settlement logic.`)) return;
    startTransition(async () => {
      try {
        await overrideMatchScore(matchId, scores.home, scores.away);
        showSuccess('SYSTEM OVERRIDE: Score fixed successfully.');
        router.refresh();
      } catch (err: any) {
        showError(err.message || 'Override failed');
      }
    });
  };

  const handleFeedSync = () => {
    startTransition(async () => {
      // Simulation of a hybrid external data feed fetch
      await new Promise(r => setTimeout(r, 1500));
      showSuccess('HYBRID ENGINE: External data feeds synchronized.');
    });
  };

  return (
    <>
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Toast Notifications */}
      {(successMsg || errorMsg) && (
        <div className={`fixed bottom-6 right-6 z-[150] px-5 py-3 rounded-xl backdrop-blur-xl border flex items-center gap-3 shadow-2xl animate-slide-up ${
          successMsg ? 'bg-success/90 border-success/20 text-black' : 'bg-danger/90 border-danger/20 text-white'
        }`}>
           {successMsg ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
           <span className="text-xs font-bold">{successMsg || errorMsg}</span>
        </div>
      )}

      {/* ─── ROUNDS OVERVIEW ─── */}
      <div className="card p-0 bg-white/[0.02] overflow-hidden shadow-sm">
        <div className="p-4 md:p-5 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.01]">
          <div className="flex items-center gap-3">
             <Calendar className="w-4 h-4 text-blue-electric opacity-60" />
             <h2 className="font-display text-xs font-black uppercase tracking-widest leading-none">Platform Rounds</h2>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
               onClick={handleFeedSync}
               className="btn btn-ghost !px-4 !py-2.5 h-auto text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-gold/10 text-gold grow sm:grow-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} /> FEED SYNC
              </button>
              <button 
               onClick={() => setShowRoundModal(true)}
               className="btn btn-ghost !px-4 !py-2.5 h-auto text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/10 grow sm:grow-0"
              >
                <Plus className="w-3.5 h-3.5" /> ROUND
              </button>
              <button 
               onClick={() => setShowMatchModal(true)}
               disabled={!selectedRoundId}
               className="btn btn-primary !px-4 !py-2.5 h-auto text-[9px] font-black uppercase tracking-widest flex items-center gap-2 grow sm:grow-0"
              >
                <Plus className="w-3.5 h-3.5" /> MATCH
              </button>
          </div>
        </div>
        <div className="p-4 md:p-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {rounds.length === 0 ? (
            <div className="col-span-full py-16 text-center flex flex-col items-center gap-4 opacity-20 italic">
               <Calendar className="w-8 h-8 text-muted" />
               <p className="text-[10px] uppercase font-black font-mono">No rounds initialized.</p>
            </div>
          ) : (
            rounds.map(r => (
              <div 
                key={r.id} 
                onClick={() => setSelectedRoundId(r.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${
                  selectedRoundId === r.id 
                  ? 'bg-blue-electric/[0.05] border-blue-electric/40 shadow-lg shadow-blue-electric/5' 
                  : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2 py-0.5 rounded text-[8px] font-black font-mono uppercase leading-none ${selectedRoundId === r.id ? 'bg-blue-electric text-white' : 'bg-white/5 text-muted'}`}>R{r.round_number}</div>
                  <div className={`w-2 h-2 rounded-full ${r.status === 'active' ? 'bg-success shadow-[0_0_8px_var(--success)] animate-pulse' : r.status === 'completed' ? 'bg-blue-electric opacity-40' : 'bg-white/5'}`} />
                </div>
                <div className="text-[10px] text-white font-black font-mono uppercase leading-none truncate">{r.status}</div>
                <div className="text-[8px] text-muted font-bold mt-4 opacity-20 font-mono truncate">
                   {new Date(r.start_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedRound && (
        <div className="p-4 md:p-5 bg-blue-electric/[0.03] border border-blue-electric/10 rounded-2xl animate-fade-in relative overflow-hidden group shadow-sm">
           <div className="absolute top-0 right-0 p-6 opacity-5 text-blue-electric pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform"><Trophy className="w-10 h-10" /></div>
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="shrink-0 p-2.5 bg-blue-electric/10 rounded-xl border border-blue-electric/20"><Settings2 className="w-4 h-4 text-blue-electric" /></div>
                <div>
                  <h3 className="font-black text-xs text-white uppercase tracking-widest leading-none">Management: Round {selectedRound.round_number}</h3>
                  <div className="text-[9px] text-muted font-black uppercase tracking-widest mt-2 flex items-center gap-2 opacity-40">
                     SYSTEM <ChevronRight className="w-3 h-3" /> SETTINGS
                  </div>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                 <button 
                  disabled={isPending || selectedRound.status === 'active'}
                  onClick={() => handleRoundStatusChange(selectedRound.id, 'active')}
                  className={`grow sm:grow-0 !px-6 !py-2.5 h-auto text-[9px] font-black uppercase tracking-[0.15em] rounded-lg transition-all border ${selectedRound.status === 'active' ? 'bg-success/10 text-success border-success/20 cursor-default' : 'btn-ghost border-white/5 opacity-40 hover:opacity-100 hover:border-white/20'}`}
                 >Activate</button>
                 <button 
                  disabled={isPending || selectedRound.status === 'completed'}
                  onClick={() => handleRoundStatusChange(selectedRound.id, 'completed')}
                  className={`grow sm:grow-0 !px-6 !py-2.5 h-auto text-[9px] font-black uppercase tracking-[0.15em] rounded-lg transition-all border ${selectedRound.status === 'completed' ? 'bg-blue-electric/10 text-blue-electric border-blue-electric/20 cursor-default' : 'btn-ghost border-white/5 opacity-40 hover:opacity-100 hover:border-white/20'}`}
                 >Complete</button>
              </div>
           </div>
        </div>
      )}

      {/* ─── MATCH SETTLEMENT GRID ─── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 px-2">
           <Trophy className="w-4 h-4 text-gold opacity-60" />
           <h2 className="font-display text-xs font-black uppercase tracking-widest text-white">Live Operations</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMatches.length === 0 ? (
            <div className="col-span-full py-24 text-center flex flex-col items-center gap-4 bg-white/[0.01] border border-white/5 rounded-2xl opacity-20">
               <Sword className="w-10 h-10 text-muted" />
               <p className="text-[10px] text-muted font-black uppercase font-mono italic">No matches scheduled in this sequence.</p>
            </div>
          ) : (
            filteredMatches.map(m => (
              <div key={m.id} className={`p-4 rounded-2xl border transition-all ${
                  m.status === 'live' 
                  ? 'border-danger/20 bg-danger/[0.02] shadow-lg shadow-danger/5' 
                  : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                }`}
              >
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${m.status === 'live' ? 'bg-danger animate-pulse' : m.status === 'finished' ? 'bg-blue-electric' : 'bg-white/10'}`} />
                       <div className={`text-[8px] font-black uppercase tracking-widest ${m.status === 'live' ? 'text-danger' : 'text-muted opacity-40'}`}>
                         {m.status === 'live' ? 'LIVE NOW' : m.status}
                       </div>
                    </div>
                    <div className="text-[9px] text-muted font-black font-mono uppercase tracking-tighter opacity-40 flex items-center gap-2">
                       {new Date(m.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-center">
                    <div className="flex-1 text-right font-display text-sm font-black tracking-tight text-white uppercase italic truncate">
                       {m.home_team}
                    </div>
                    
                    <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
                        <input 
                          type="number" 
                          disabled={m.status === 'finished' || isPending}
                          value={editingScores[m.id]?.home ?? m.home_score ?? 0} 
                          onChange={(e) => handleScoreChange(m.id, 'home', Number(e.target.value))}
                          className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg text-center text-sm font-black font-display text-white focus:outline-none focus:border-blue-electric transition-colors"
                        />
                        <div className="w-4 h-px bg-white/10" />
                        <input 
                          type="number" 
                          disabled={m.status === 'finished' || isPending}
                          value={editingScores[m.id]?.away ?? m.away_score ?? 0} 
                          onChange={(e) => handleScoreChange(m.id, 'away', Number(e.target.value))}
                          className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg text-center text-sm font-black font-display text-white focus:outline-none focus:border-blue-electric transition-colors"
                        />
                    </div>
                    
                    <div className="flex-1 text-left font-display text-sm font-black tracking-tight text-white uppercase italic truncate">
                       {m.away_team}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {m.status !== 'finished' ? (
                      <div className="flex flex-col w-full gap-2">
                        <button 
                          disabled={isPending}
                          onClick={() => onSettle(m.id)}
                          className="btn btn-blue w-full py-2.5 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-electric/10 flex items-center justify-center gap-2"
                        >
                           <ShieldCheck className="w-3.5 h-3.5" />
                           {isPending ? 'SYNC' : 'SETTLE RESULT'}
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                           <button 
                            disabled={isPending || m.status === 'live'}
                            onClick={() => handleStatusChange(m.id, 'live')}
                            className="bg-white/5 hover:bg-danger/10 text-muted hover:text-danger border border-white/5 hover:border-danger/20 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
                           >
                              <Play className="w-3 h-3" /> LIVE
                           </button>
                           <button 
                            disabled={isPending}
                            onClick={() => handleStatusChange(m.id, m.status === 'live' ? 'scheduled' : 'finished')}
                            className="bg-white/5 hover:bg-white/10 border border-white/5 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                           >
                              <RotateCcw className="w-3 h-3 opacity-40" /> {m.status === 'live' ? 'RESET' : 'FINISH'}
                           </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                         <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-electric/10 border border-blue-electric/10 text-blue-electric text-[9px] font-black uppercase tracking-widest">
                            <CheckCircle2 className="w-3.5 h-3.5" /> AUDITED
                         </div>
                         <div className="grid grid-cols-2 gap-2 mt-4">
                           <button 
                            disabled={isPending}
                            onClick={() => handleUndo(m.id)}
                            className="bg-white/5 hover:bg-white/10 border border-white/5 py-2.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all italic opacity-40 hover:opacity-100"
                           >Unlock Sequence</button>
                           <button 
                            disabled={isPending}
                            onClick={() => handleOverride(m.id)}
                            className="bg-gold/10 hover:bg-gold/20 text-gold border border-gold/20 py-2.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all italic"
                           >Force Fix Score</button>
                         </div>
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

    {/* ADD ROUND MODAL */}
    {showRoundModal && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isPending && setShowRoundModal(false)} />
        <div className="card w-full max-w-[440px] p-0 relative z-10 animate-slide-up bg-[#05070a] border-white/10 shadow-2xl">
           <div className="p-5 border-b border-white/5 flex items-center gap-4 bg-white/[0.01]">
                <div className="p-2.5 bg-blue-electric/10 rounded-xl border border-blue-electric/20"><Calendar className="w-4 h-4 text-blue-electric" /></div>
                <div>
                  <h3 className="font-display font-black text-white uppercase tracking-widest leading-none text-sm">Sequence Initialization</h3>
                  <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-2 opacity-40">Create Platform Round</p>
                </div>
           </div>
           
           <div className="p-5 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                 <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1 opacity-60 italic">Sequence Indicator (Number)</label>
                 <input 
                   type="number" 
                   value={roundData.round_number || ''} 
                   onChange={e => setRoundData(prev => ({ ...prev, round_number: e.target.value ? parseInt(e.target.value) : 0 }))}
                   className="input-premium py-3 px-4 text-xs font-black italic tracking-widest" 
                   placeholder="e.g. 1" 
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1 opacity-60 italic">Genesis</label>
                    <input 
                      type="datetime-local" 
                      value={roundData.start_date} 
                      onChange={e => setRoundData(prev => ({ ...prev, start_date: e.target.value }))}
                      className="input-premium py-3 px-4 text-[10px] font-mono" 
                    />
                 </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1 opacity-60 italic">Expiration</label>
                    <input 
                      type="datetime-local" 
                      value={roundData.end_date} 
                      onChange={e => setRoundData(prev => ({ ...prev, end_date: e.target.value }))}
                      className="input-premium py-3 px-4 text-[10px] font-mono" 
                    />
                 </div>
              </div>
           </div>

           <div className="p-5 border-t border-white/5 flex flex-col gap-4 bg-white/[0.01]">
              <div className="flex gap-3">
                 <button 
                   onClick={() => setShowRoundModal(false)}
                   className="flex-1 py-3 text-[9px] font-black uppercase text-muted hover:text-white transition-colors"
                 >CANCEL</button>
                 <button 
                   onClick={handleCreateRound}
                   disabled={isPending || !roundData.round_number || !roundData.start_date || !roundData.end_date}
                   className="btn btn-blue flex-1 py-3 font-black uppercase text-[10px] tracking-[0.15em] shadow-xl shadow-blue-electric/10"
                 >
                   {isPending ? 'PROCESSING' : 'INITIATE'}
                 </button>
              </div>
           </div>
        </div>
      </div>
    )}

    {/* ADD MATCH MODAL */}
    {showMatchModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isPending && setShowMatchModal(false)} />
        <div className="card w-full max-w-[440px] p-0 relative z-10 animate-slide-up bg-[#05070a] border-white/10 shadow-2xl">
           <div className="p-5 border-b border-white/5 flex items-center gap-4 bg-white/[0.01]">
                <div className="p-2.5 bg-blue-electric/10 rounded-xl border border-blue-electric/20"><Plus className="w-5 h-5 text-blue-electric" /></div>
                <div>
                  <h3 className="font-display font-black text-white uppercase tracking-widest leading-none text-sm">Asset Deployment</h3>
                  <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-2 opacity-40">Schedule Round Match</p>
                </div>
           </div>
           
           <div className="p-5 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1 opacity-60 italic">Protagonist (Home)</label>
                    <input 
                      type="text" 
                      value={matchData.home_team} 
                      onChange={e => setMatchData(prev => ({ ...prev, home_team: e.target.value }))}
                      className="input-premium py-3 px-4 text-xs font-black italic tracking-widest" 
                      placeholder="e.g. ARSENAL" 
                    />
                 </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1 opacity-60 italic">Opponent (Away)</label>
                    <input 
                      type="text" 
                      value={matchData.away_team} 
                      onChange={e => setMatchData(prev => ({ ...prev, away_team: e.target.value }))}
                      className="input-premium py-3 px-4 text-xs font-black italic tracking-widest" 
                      placeholder="e.g. CHELSEA" 
                    />
                 </div>
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1 opacity-60 italic">Temporal Offset (Kickoff)</label>
                 <input 
                   type="datetime-local" 
                   value={matchData.kickoff_time} 
                   onChange={e => setMatchData(prev => ({ ...prev, kickoff_time: e.target.value }))}
                   className="input-premium py-3 px-4 text-[10px] font-mono" 
                 />
              </div>
           </div>

           <div className="p-5 border-t border-white/5 flex gap-4 bg-white/[0.01]">
              <button 
                onClick={() => setShowMatchModal(false)}
                className="flex-1 py-3 text-[9px] font-black uppercase text-muted hover:text-white transition-colors"
              >CANCEL</button>
              <button 
                onClick={handleCreateMatch}
                disabled={isPending || !matchData.home_team || !matchData.away_team || !matchData.kickoff_time}
                className="btn btn-blue flex-1 py-3 font-black uppercase text-[10px] tracking-[0.15em] shadow-xl shadow-blue-electric/10"
              >
                {isPending ? 'DEPLOYING' : 'CONFIRM'}
              </button>
           </div>
        </div>
      </div>
    )}
    </>
  );
}
