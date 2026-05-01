'use client';

import { useState, useEffect, useTransition } from 'react';
import { 
  HelpCircle, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Filter, 
  MoreVertical, 
  ShieldCheck, 
  Activity, 
  ChevronRight,
  Check,
  Archive,
  User,
  History
} from 'lucide-react';
import { getSupportTickets, updateTicketStatus } from '@/app/actions/admin';
import { SupportTicketWithProfile, SupportTicket } from '@/types';
import { useFeedback } from '@/hooks/useFeedback';

export default function SupportView() {
  const [tickets, setTickets] = useState<SupportTicketWithProfile[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketWithProfile | null>(null);
  const [filter, setFilter] = useState('all');
  const [isPending, startTransition] = useTransition();
  const [internalNotes, setInternalNotes] = useState('');
  const { success: successMsg, error: errorMsg, showSuccess, showError, clear } = useFeedback();

  const loadTickets = async () => {
    try {
        const data = await getSupportTickets({ status: filter });
        setTickets(data);
    } catch (err: unknown) {
        showError((err as Error).message || 'Failed to load tickets');
    }
  };

  useEffect(() => {
    loadTickets();
  }, [filter]);

  const handleUpdateStatus = async (status: SupportTicket['status']) => {
    if (!selectedTicket) return;
    startTransition(async () => {
      try {
        await updateTicketStatus(selectedTicket.id, status, internalNotes);
        showSuccess(`Ticket marked as ${status}.`);
        loadTickets();
        setSelectedTicket(prev => prev ? { ...prev, status: status, internal_notes: internalNotes } : null);
      } catch (err: unknown) {
        showError((err as Error).message || 'Update failed');
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Notifications */}
      {(successMsg || errorMsg) && (
        <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl backdrop-blur-xl border flex items-center gap-3 shadow-2xl animate-slide-up ${
          successMsg ? 'bg-success/90 border-success/20 text-black' : 'bg-danger/90 border-danger/20 text-white'
        }`}>
           {successMsg ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
           <span className="text-xs font-bold">{successMsg || errorMsg}</span>
           <button onClick={clear} className="ml-12 p-3 hover:bg-black/10 rounded-lg opacity-40 hover:opacity-100 transition-all font-black text-xs">×</button>
        </div>
      )}

      {/* ─── FILTER HEADER ─── */}
      <div className="bg-[#030508] border border-white/5 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div className="flex items-center gap-4">
           <div className="p-2.5 bg-blue-electric/10 rounded-xl border border-blue-electric/20"><HelpCircle className="w-5 h-5 text-blue-electric" /></div>
           <div className="leading-tight">
              <h2 className="font-display text-base font-black tracking-tight text-white uppercase italic">Support <span className="text-gradient-gold">Matrix.</span></h2>
              <p className="text-[9px] text-muted font-black uppercase tracking-widest mt-1 opacity-40 italic">Queue synchronization active</p>
           </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-muted opacity-40" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-electric transition-all grow sm:grow-0"
            >
              <option value="all" className="bg-primary">GLOBAL STREAM</option>
              <option value="open" className="bg-primary">OPEN PROTOCOLS</option>
              <option value="in_progress" className="bg-primary">ACTIVE REVIEW</option>
              <option value="resolved" className="bg-primary">RESOLVED</option>
              <option value="closed" className="bg-primary">ARCHIVED</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6">
        {/* ─── TICKET STREAM ─── */}
        <div className="flex flex-col gap-3">
          {tickets.length === 0 ? (
            <div className="card py-16 text-center flex flex-col items-center gap-4 opacity-20 border-dashed bg-transparent shadow-none">
               <Archive className="w-10 h-10 text-muted" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">No active protocols detected.</p>
            </div>
          ) : (
            tickets.map(t => (
              <div 
                key={t.id} 
                onClick={() => {
                  setSelectedTicket(t);
                  setInternalNotes(t.internal_notes || '');
                }}
                className={`p-4 rounded-xl cursor-pointer transition-all border outline-none ${
                    selectedTicket?.id === t.id 
                    ? 'border-blue-electric/40 bg-blue-electric/[0.04] shadow-md shadow-blue-electric/5 scale-[1.01]' 
                    : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                  }`}
              >
                <div className="flex justify-between items-center gap-6">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter shrink-0 border ${
                      t.status === 'open' ? 'bg-danger/10 text-danger border-danger/20' : 
                      t.status === 'in_progress' ? 'bg-blue-electric/10 text-blue-electric border-blue-electric/20' : 
                      t.status === 'resolved' ? 'bg-success/10 text-success border-success/20' : 'bg-white/5 text-muted border-white/5'
                    }`}>
                      {t.status.toUpperCase().replace('_', ' ')}
                    </span>
                    <div className="min-w-0">
                      <div className="font-black text-[13px] text-white truncate group-hover:text-blue-electric transition-colors">{t.subject}</div>
                      <div className="text-[9px] text-muted font-black tracking-widest uppercase opacity-40 mt-1 flex items-center gap-2">
                        @{t.profiles?.username || 'member'} <ChevronRight className="w-3 h-3 opacity-20" /> 
                        <span className={t.priority === 'urgent' || t.priority === 'high' ? 'text-danger font-black italic' : 'text-success/60 italic'}>
                           {t.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1 shrink-0">
                     <div className="text-[9px] text-muted font-mono opacity-30">{new Date(t.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                     <div className="text-[8px] text-white/20 uppercase font-black tracking-widest italic">{t.category}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* ─── RESOLUTION PANEL ─── */}
        <div className="h-fit lg:sticky lg:top-6">
          {!selectedTicket ? (
            <div className="card h-64 flex flex-col items-center justify-center border-dashed border-white/10 opacity-20 bg-transparent shadow-none">
              <MessageSquare className="w-6 h-6 mb-4 opacity-40" />
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-center max-w-[150px] leading-relaxed italic">Synchronize Protocol to Resolve</p>
            </div>
          ) : (
            <div className="card p-0 animate-slide-up flex flex-col overflow-hidden shadow-xl border-blue-electric/10 bg-[#05070a]">
              <div className="p-5 border-b border-white/5 bg-white/[0.01]">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-white/5 text-white/30 text-[8px] font-mono px-1.5 py-0.5 rounded leading-none">ID:{selectedTicket.id.split('-')[0]}</span>
                      <h3 className="font-display text-base font-black tracking-tight leading-tight text-white uppercase italic truncate pr-4">{selectedTicket.subject}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-[9px] text-muted font-black tracking-widest uppercase opacity-30 italic">
                       <User className="w-3 h-3" /> @{selectedTicket.profiles?.username} 
                       <span className="opacity-30">|</span>
                       <Clock className="w-3 h-3" /> {new Date(selectedTicket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 mb-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform"><MessageSquare className="w-10 h-10" /></div>
                  <div className="text-[9px] text-muted uppercase font-black mb-4 tracking-widest flex items-center gap-2 opacity-40 italic">
                     User Transmission:
                  </div>
                  <div className="text-[13px] text-white leading-relaxed font-bold italic opacity-85">"{selectedTicket.message}"</div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center px-1">
                     <div className="text-[9px] text-muted uppercase font-black tracking-widest opacity-40 italic leading-none">Management Notation</div>
                     <span className="text-[8px] text-muted font-bold opacity-30">INTERNAL ONLY</span>
                  </div>
                  <textarea 
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Document system reconciliation..."
                    className="input-premium h-28 text-[11px] font-black py-3 px-4 italic placeholder:opacity-20 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="p-5 bg-white/[0.01] flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                   <button 
                    onClick={() => handleUpdateStatus('in_progress')}
                    disabled={isPending || selectedTicket.status === 'in_progress'}
                    className={`h-11 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all border ${selectedTicket.status === 'in_progress' ? 'bg-blue-electric text-white border-blue-electric shadow-lg shadow-blue-electric/20' : 'btn-ghost border-white/5 opacity-40 hover:opacity-100 hover:border-white/20'}`}
                   >
                     {selectedTicket.status === 'in_progress' ? 'ACTIVE REVIEW' : 'MARK REVIEW'}
                   </button>
                   <button 
                    onClick={() => handleUpdateStatus('resolved')}
                    disabled={isPending || selectedTicket.status === 'resolved'}
                    className={`h-11 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all shadow-xl shadow-success/10 ${selectedTicket.status === 'resolved' ? 'bg-success/10 text-success border-success/20 cursor-default' : 'bg-success text-black border-success hover:scale-[1.02]'}`}
                   >
                     RESOLVE
                   </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-2">
                   <button 
                    onClick={() => handleUpdateStatus('open')}
                    disabled={isPending || selectedTicket.status === 'open'}
                    className="h-10 rounded-xl text-[8px] font-black uppercase tracking-widest text-muted hover:text-white border border-transparent hover:border-white/5 transition-all opacity-40 hover:opacity-100 italic"
                   >Re-Open Sequence</button>
                   <button 
                    onClick={() => handleUpdateStatus('closed')}
                    disabled={isPending || selectedTicket.status === 'closed'}
                    className="h-10 rounded-xl text-[8px] font-black uppercase tracking-widest text-muted hover:text-danger border border-transparent hover:border-danger/10 transition-all opacity-40 hover:opacity-100 italic"
                   >Close Protocol</button>
                </div>

                <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-blue-electric/20 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/5 rounded-xl text-muted group-hover:text-blue-electric transition-colors"><History className="w-4 h-4 opacity-40" /></div>
                      <div>
                        <div className="text-[8px] text-muted font-black uppercase tracking-[0.2em] mb-1 opacity-30">Metadata Analysis</div>
                        <div className="text-[10px] font-black text-white uppercase italic">{selectedTicket.category} • <span className={selectedTicket.priority === 'urgent' ? 'text-danger shadow-[0_0_8px_var(--danger)]/20' : 'text-success/60'}>{selectedTicket.priority} SEVERITY</span></div>
                      </div>
                   </div>
                   <button 
                    onClick={() => handleUpdateStatus(selectedTicket.status)}
                    disabled={isPending}
                    className="h-9 !px-4 btn btn-blue text-[8px] font-black shadow-lg shadow-blue-electric/10 rounded-lg"
                   >
                     SAVE NOTES
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
