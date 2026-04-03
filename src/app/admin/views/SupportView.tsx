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
    <div className="flex flex-col gap-8 animate-slide-up">
      {/* Notifications */}
      {(successMsg || errorMsg) && (
        <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl backdrop-blur-xl border flex items-center gap-3 shadow-2xl animate-slide-up ${
          successMsg ? 'bg-success/90 border-success/20 text-black' : 'bg-danger/90 border-danger/20 text-white'
        }`}>
           {successMsg ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
           <span className="text-xs font-bold">{successMsg || errorMsg}</span>
           <button onClick={clear} className="ml-12 p-4 hover:bg-black/10 rounded-lg opacity-40 hover:opacity-100 transition-all font-black">×</button>
        </div>
      )}

      {/* ─── FILTER HEADER ─── */}
      <div className="card p-4 flex justify-between items-center gap-6">
        <div className="flex items-center gap-12">
           <div className="p-10 bg-blue-electric/10 rounded-lg"><HelpCircle className="w-5 h-5 text-blue-electric" /></div>
           <div>
              <h2 className="font-display text-lg font-black tracking-tight">Support Center</h2>
              <p className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-60">Ticket Management</p>
           </div>
        </div>
        <div className="flex items-center gap-12">
            <Filter className="w-4 h-4 text-muted opacity-40" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-12 py-8 rounded-lg focus:outline-none focus:border-blue-electric transition-all"
            >
              <option value="all" className="bg-primary">All Tickets</option>
              <option value="open" className="bg-primary">Open</option>
              <option value="in_progress" className="bg-primary">In Progress</option>
              <option value="resolved" className="bg-primary">Resolved</option>
              <option value="closed" className="bg-primary">Closed</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        {/* ─── TICKET STREAM ─── */}
        <div className="flex flex-col gap-10">
          {tickets.length === 0 ? (
            <div className="card py-60 text-center flex flex-col items-center gap-4 opacity-30">
               <Archive className="w-10 h-10 text-muted" />
               <p className="text-[10px] font-black uppercase tracking-widest font-mono italic">No tickets found for this filter.</p>
            </div>
          ) : (
            tickets.map(t => (
              <div 
                key={t.id} 
                onClick={() => {
                  setSelectedTicket(t);
                  setInternalNotes(t.internal_notes || '');
                }}
                className={`card p-16 cursor-pointer transition-all border outline-none ${
                    selectedTicket?.id === t.id 
                    ? 'border-blue-electric bg-blue-electric/[0.03] shadow-lg shadow-blue-electric/10' 
                    : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                  }`}
              >
                <div className="flex justify-between items-center gap-24">
                  <div className="flex items-center gap-16 flex-1 min-w-0">
                    <span className={`badge text-[9px] uppercase border whitespace-nowrap px-6 py-1 ${
                      t.status === 'open' ? 'badge-danger' : 
                      t.status === 'in_progress' ? 'badge-blue' : 
                      t.status === 'resolved' ? 'badge-success' : 'badge-muted'
                    }`}>
                      {t.status.toUpperCase().replace('_', ' ')}
                    </span>
                    <div className="min-w-0 truncate">
                      <div className="font-black text-xs text-white truncate max-w-[300px]">{t.subject}</div>
                      <div className="text-[9px] text-muted font-bold tracking-widest uppercase opacity-40 mt-1 flex items-center gap-6">
                        @{t.profiles?.username || 'user'} <ChevronRight className="w-3 h-3" /> 
                        <span className={t.priority === 'urgent' || t.priority === 'high' ? 'text-danger font-black' : 'text-success'}>
                           {t.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                     <div className="text-[9px] text-muted font-mono">{new Date(t.created_at).toLocaleDateString()}</div>
                     <div className="text-[8px] text-white/40 uppercase font-black tracking-widest">{t.category}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* ─── RESOLUTION PANEL ─── */}
        <div className="sticky top-24">
          {!selectedTicket ? (
            <div className="card h-96 flex flex-col items-center justify-center border-dashed border-white/10 opacity-20 bg-transparent shadow-none">
              <MessageSquare className="w-8 h-8 mb-8 opacity-40" />
              <p className="text-[9px] font-black uppercase tracking-widest text-center max-w-[150px] leading-relaxed italic">Select a ticket to begin resolution</p>
            </div>
          ) : (
            <div className="card p-0 animate-slide-up flex flex-col overflow-hidden">
              <div className="p-24 border-b border-white/5 bg-white/[0.01]">
                <div className="flex justify-between items-start mb-24">
                  <div className="flex-1">
                    <div className="flex items-center gap-12 mb-8 text-white">
                      <span className="badge badge-muted text-[8px] px-2 py-0.5">ID:{selectedTicket.id.split('-')[0]}</span>
                      <h3 className="font-display text-lg font-black tracking-tight leading-tight">{selectedTicket.subject}</h3>
                    </div>
                    <div className="flex items-center gap-10 text-[9px] text-muted font-bold tracking-widest uppercase opacity-60">
                       <User className="w-3.5 h-3.5" /> {selectedTicket.profiles?.username} 
                       <span className="mx-2 opacity-30">|</span>
                       <Clock className="w-3.5 h-3.5" /> {new Date(selectedTicket.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </div>
                </div>

                <div className="p-16 bg-white/[0.03] rounded-xl border border-white/5 mb-24">
                  <div className="text-[9px] text-muted uppercase font-black mb-10 tracking-widest flex items-center gap-6">
                     <MessageSquare className="w-4 h-4" /> Message Content
                  </div>
                  <div className="text-[12px] text-white leading-relaxed font-medium italic">"{selectedTicket.message}"</div>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="text-[9px] text-muted uppercase font-black tracking-widest ml-4 mb-4">Resolution Notes</div>
                  <textarea 
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Document internal actions or notes..."
                    className="input-premium h-24 text-xs font-medium py-12"
                  />
                </div>
              </div>

              <div className="p-24 bg-white/[0.01] flex flex-col gap-16">
                <div className="grid grid-cols-2 gap-6">
                   <button 
                    onClick={() => handleUpdateStatus('in_progress')}
                    disabled={isPending || selectedTicket.status === 'in_progress'}
                    className={`btn btn-xs py-10 font-black uppercase text-[10px] tracking-widest ${selectedTicket.status === 'in_progress' ? 'bg-blue-electric text-white' : 'btn-ghost border-dashed'}`}
                   >
                     {selectedTicket.status === 'in_progress' ? 'Reviewing' : 'Mark Review'}
                   </button>
                   <button 
                    onClick={() => handleUpdateStatus('resolved')}
                    disabled={isPending || selectedTicket.status === 'resolved'}
                    className={`btn btn-xs py-10 font-black uppercase text-[10px] tracking-widest ${selectedTicket.status === 'resolved' ? 'bg-success/20 text-success border-success/30' : 'btn-success text-black shadow-lg shadow-success/10'}`}
                   >
                     Resolve
                   </button>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                   <button 
                    onClick={() => handleUpdateStatus('open')}
                    disabled={isPending || selectedTicket.status === 'open'}
                    className="btn btn-ghost btn-xs py-10 font-black uppercase text-[9px] tracking-widest opacity-60 hover:opacity-100"
                   >Re-Open</button>
                   <button 
                    onClick={() => handleUpdateStatus('closed')}
                    disabled={isPending || selectedTicket.status === 'closed'}
                    className="btn btn-ghost btn-xs py-10 font-black uppercase text-[9px] tracking-widest opacity-60 hover:opacity-100"
                   >Close Permanently</button>
                </div>

                <div className="p-16 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-between mt-8">
                   <div className="flex items-center gap-12">
                      <div className="p-8 bg-white/5 rounded-lg text-muted"><History className="w-5 h-5 opacity-40" /></div>
                      <div>
                        <div className="text-[9px] text-muted font-black uppercase tracking-widest mb-1">Audit Data</div>
                        <div className="text-[10px] font-bold text-white uppercase">{selectedTicket.category} • <span className={selectedTicket.priority === 'urgent' ? 'text-danger' : 'text-white'}>{selectedTicket.priority}</span></div>
                      </div>
                   </div>
                   <button 
                    onClick={() => handleUpdateStatus(selectedTicket.status)}
                    disabled={isPending}
                    className="btn btn-blue btn-xs px-6 font-black uppercase tracking-widest text-[8px] h-10"
                   >
                     Update Notes
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
