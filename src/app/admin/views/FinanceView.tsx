'use client';

import { useState, useEffect, useTransition } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  XCircle, 
  Banknote, 
  ShieldCheck, 
  Activity,
  ChevronRight,
  ShieldAlert,
  Check
} from 'lucide-react';
import { approvePayout, rejectPayout } from '@/app/actions/wallet';
import { getAdminLedger } from '@/app/actions/admin';
import { PayoutRequest, AdminLedgerEntryWithProfile } from '@/types';
import { useFeedback } from '@/hooks/useFeedback';

interface FinanceViewProps {
  payoutRequests: (PayoutRequest & { profiles?: { username: string } })[];
  initialMetrics: { totalRevenue: number; pendingPayouts: number };
}

export default function FinanceView({ payoutRequests, initialMetrics }: FinanceViewProps) {
  const [isPending, startTransition] = useTransition();
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({});
  const [isRejecting, setIsRejecting] = useState<string | null>(null);
  const [ledger, setLedger] = useState<AdminLedgerEntryWithProfile[]>([]);
  const { success: successMsg, error: errorMsg, showSuccess, showError, clear } = useFeedback();

  const loadLedger = async () => {
    try {
      const data = await getAdminLedger(20);
      setLedger(data);
    } catch (err) {
      console.error('Failed to load ledger:', err);
    }
  };

  useEffect(() => {
    loadLedger();
  }, []);

  const handleApprove = async (id: string) => {
    startTransition(async () => {
      try {
        await approvePayout(id, 'Approved by Administrator');
        showSuccess('Payout approved successfully.');
        loadLedger();
      } catch (err: unknown) {
        showError((err as Error).message || 'Approval failed');
      }
    });
  };

  const handleReject = async (id: string) => {
    const reason = rejectionReason[id];
    if (!reason) return;
    
    startTransition(async () => {
      try {
        await rejectPayout(id, reason);
        setIsRejecting(null);
        showSuccess('Payout rejected. Funds restored.');
        loadLedger();
      } catch (err: unknown) {
        showError((err as Error).message || 'Rejection failed');
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

      {/* ─── KPI GRID ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-white/[0.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-electric/10 rounded-lg"><TrendingUp className="w-4 h-4 text-blue-electric" /></div>
            <span className="text-[9px] text-muted font-black uppercase tracking-widest">Total Revenue</span>
          </div>
          <div className="font-display text-2xl font-black text-white">₦{initialMetrics.totalRevenue.toLocaleString()}</div>
          <div className="text-[9px] text-muted/40 mt-3 font-mono uppercase tracking-widest">Total revenue</div>
        </div>

        <div className="card p-6 bg-white/[0.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-electric/10 rounded-lg"><Wallet className="w-4 h-4 text-blue-electric" /></div>
            <span className="text-[9px] text-muted font-black uppercase tracking-widest">Payout Volume</span>
          </div>
          <div className="font-display text-2xl font-black text-blue-electric">₦{(payoutRequests.reduce((sum, r) => sum + r.amount, 0)).toLocaleString()}</div>
          <div className="text-[9px] text-muted/40 mt-3 font-mono uppercase tracking-widest">Pending distributions</div>
        </div>

        <div className={`card p-6 transition-all ${initialMetrics.pendingPayouts > 0 ? 'bg-danger/[0.02] border-danger/20 shadow-[0_0_20px_rgba(255,23,68,0.05)]' : 'bg-white/[0.02]'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${initialMetrics.pendingPayouts > 0 ? 'bg-danger/10' : 'bg-white/5'}`}>
               <ShieldAlert className={`w-4 h-4 ${initialMetrics.pendingPayouts > 0 ? 'text-danger' : 'text-muted opacity-40'}`} />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${initialMetrics.pendingPayouts > 0 ? 'text-danger' : 'text-muted'}`}>Pending Requests</span>
          </div>
          <div className="font-display text-2xl font-black text-danger">{initialMetrics.pendingPayouts}</div>
          <div className="text-[9px] text-muted/40 mt-3 font-mono uppercase tracking-widest">Awaiting Verification</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── PAYOUT REQUESTS ─── */}
        <div className="card p-0 flex flex-col overflow-hidden">
          <div className="p-20 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
             <div className="flex items-center gap-10">
                <Clock className="w-5 h-5 text-blue-electric opacity-60" />
                <h3 className="font-display text-sm font-black uppercase tracking-widest">Payout Requests</h3>
             </div>
             <div className="flex items-center gap-12 font-mono text-[9px] font-black text-muted opacity-60">
                <span className="flex items-center gap-6"><div className="w-4 h-4 rounded-full bg-danger opacity-40" /> AWAITING APPROVAL</span>
             </div>
          </div>
          
          <div className="p-4 flex flex-col gap-4">
            {payoutRequests.length === 0 ? (
              <div className="text-center py-48 flex flex-col items-center gap-4 opacity-30">
                 <ShieldCheck className="w-10 h-10 text-muted" />
                 <p className="text-[10px] uppercase font-black tracking-widest italic font-mono">No pending payout requests.</p>
              </div>
            ) : (
              payoutRequests.map(r => (
                <div key={r.id} className={`card p-16 transition-all border outline-none ${
                    r.is_flagged 
                    ? 'border-danger/30 bg-danger/[0.03] shadow-lg shadow-danger/5' 
                    : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center mb-16">
                    <div className="flex items-center gap-12">
                      <div className="w-24 h-24 rounded-lg bg-blue-electric/10 border border-blue-electric/20 flex items-center justify-center font-black text-[10px] text-blue-electric font-display uppercase">
                         {r.profiles?.username?.[0] || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-8 mb-1">
                           <span className="font-black text-sm text-white">@{r.profiles?.username}</span>
                           {r.is_flagged && <span className="badge badge-danger text-[7px] font-black uppercase px-6">Risk: {r.flagging_reason}</span>}
                        </div>
                        <div className="text-[9px] text-muted font-mono uppercase tracking-tighter opacity-60 flex items-center gap-6">
                           ID: {r.id.split('-')[0]} <ChevronRight className="w-3 h-3" /> {r.id.split('-').pop()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-xl font-black text-white font-display">₦{r.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="p-12 bg-white/[0.03] rounded-xl mb-16 border border-white/5 flex gap-12">
                    <div className="p-8 bg-white/5 rounded-lg h-fit"><Banknote className="w-5 h-5 text-muted opacity-40" /></div>
                    <div className="flex-1">
                       <div className="text-[8px] text-muted uppercase font-black mb-4 tracking-widest">Bank Details</div>
                       <div className="flex justify-between items-center">
                          <div className="text-[11px] font-black text-white uppercase">{r.bank_account_info?.bank}</div>
                          <div className="text-[11px] font-mono text-blue-electric font-black tracking-widest">{r.bank_account_info?.account}</div>
                       </div>
                       <div className="text-[9px] text-muted mt-2 font-mono uppercase font-medium">{r.bank_account_info?.name}</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    {isRejecting === r.id ? (
                      <div className="flex gap-4 w-full animate-slide-right">
                        <input 
                          type="text" 
                          placeholder="REASON FOR REJECTION..." 
                          value={rejectionReason[r.id] || ''}
                          onChange={(e) => setRejectionReason(prev => ({ ...prev, [r.id]: e.target.value }))}
                          className="input-premium flex-1 py-8 text-[11px] font-medium"
                        />
                        <button onClick={() => handleReject(r.id)} disabled={isPending} className="btn btn-danger btn-xs px-12 font-black uppercase text-[10px]">REJECT</button>
                        <button onClick={() => setIsRejecting(null)} className="p-8 hover:bg-white/5 rounded-lg opacity-40 hover:opacity-100 transition-all font-black">×</button>
                      </div>
                    ) : (
                      <>
                        <button 
                          disabled={isPending}
                          className="btn btn-blue btn-xs flex-1 py-10 font-black uppercase tracking-[0.15em] text-[10px] shadow-lg shadow-blue-electric/20" 
                          onClick={() => handleApprove(r.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-8" />
                          {isPending ? 'Processing...' : 'Approve Payout'}
                        </button>
                        <button 
                          disabled={isPending}
                          className="p-10 px-16 hover:bg-danger/10 text-danger rounded-xl transition-all font-black uppercase tracking-[0.15em] text-[10px] border border-transparent hover:border-danger/20 flex items-center justify-center gap-8" 
                          onClick={() => setIsRejecting(r.id)}
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ─── TRANSACTION LOGS ─── */}
        <div className="card p-0 flex flex-col overflow-hidden h-fit sticky top-24">
           <div className="p-20 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <div className="flex items-center gap-10">
                 <Activity className="w-5 h-5 text-blue-electric opacity-60" />
                 <h3 className="font-display text-sm font-bold uppercase tracking-widest">Transaction Audit</h3>
              </div>
              <div className="badge badge-muted text-[8px] font-black px-8 py-2">System Logs</div>
           </div>
           
           <div className="flex flex-col">
              {ledger.length === 0 ? (
                <p className="text-[10px] text-muted italic opacity-30 py-60 text-center font-mono">No recent transactions recorded.</p>
              ) : (
                ledger.map(entry => (
                  <div key={entry.id} className="p-16 border-b border-white/5 flex justify-between items-center hover:bg-white/[0.02] last:border-0 transition-colors">
                    <div className="flex items-center gap-12">
                       <div className={`p-8 rounded-lg ${entry.type === 'credit' ? 'bg-success/5 border border-success/10' : 'bg-danger/5 border border-danger/10'}`}>
                          {entry.type === 'credit' ? <ArrowDownLeft className={`w-4 h-4 text-success`} /> : <ArrowUpRight className={`w-4 h-4 text-danger`} />}
                       </div>
                       <div>
                          <div className="flex items-center gap-6">
                            <span className="text-[11px] font-black text-white">@{entry.profiles?.username || 'system'}</span>
                            <ChevronRight className="w-3 h-3 text-muted opacity-20" />
                          </div>
                          <div className="text-[9px] text-muted font-bold tracking-widest uppercase opacity-40 mt-1 italic truncate max-w-150">"{(entry.reason || 'Platform Adjustment')}"</div>
                       </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                       <div className={`font-black font-display text-sm ${entry.type === 'credit' ? 'text-success' : 'text-danger'}`}>
                         {entry.type === 'credit' ? '+' : '-'} ₦{Math.abs(entry.amount).toLocaleString()}
                       </div>
                       <div className="text-[8px] text-muted font-mono font-bold">{new Date(entry.created_at).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))
              )}
           </div>
           
             <div className="p-20 bg-white/[0.01] border-t border-white/5">
              <div className="flex items-center gap-12 p-12 bg-blue-electric/5 border border-blue-electric/10 rounded-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><ShieldCheck className="w-12 h-12" /></div>
                 <div className="p-8 bg-blue-electric/10 rounded-lg"><ShieldCheck className="w-5 h-5 text-blue-electric" /></div>
                 <div className="relative z-10">
                    <h4 className="text-[9px] font-black text-white uppercase tracking-widest mb-2">Platform Integrity</h4>
                    <p className="text-[10px] text-muted leading-relaxed font-medium">All platform transactions are verified and logged for complete audit transparency.</p>
                 </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
