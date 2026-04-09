'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
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

  const loadLedger = useCallback(async () => {
    try {
      const data = await getAdminLedger(20);
      setLedger(data);
    } catch (err) {
      console.error('Failed to load ledger:', err);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadLedger();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [loadLedger]);

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

      {/* ─── KPI GRID ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-5 bg-white/[0.02] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-electric/10 rounded-lg"><TrendingUp className="w-4 h-4 text-blue-electric" /></div>
            <span className="text-[9px] text-muted font-black uppercase tracking-widest">Revenue Alpha</span>
          </div>
          <div className="font-display text-2xl font-black text-white">₦{initialMetrics.totalRevenue.toLocaleString()}</div>
          <div className="text-[8px] text-muted/30 mt-8 font-mono uppercase tracking-widest leading-none">Global platform volume</div>
        </div>

        <div className="card p-5 bg-white/[0.02] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-electric/10 rounded-lg"><Wallet className="w-4 h-4 text-blue-electric" /></div>
            <span className="text-[9px] text-muted font-black uppercase tracking-widest">Active Payouts</span>
          </div>
          <div className="font-display text-2xl font-black text-blue-electric">₦{(payoutRequests.reduce((sum, r) => sum + r.amount, 0)).toLocaleString()}</div>
          <div className="text-[8px] text-muted/30 mt-8 font-mono uppercase tracking-widest leading-none">Unsettled distributions</div>
        </div>

        <div className={`card p-5 transition-all md:col-span-2 lg:col-span-1 border-white/5 ${initialMetrics.pendingPayouts > 0 ? 'bg-danger/[0.02] border-danger/20' : 'bg-white/[0.02] shadow-sm'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${initialMetrics.pendingPayouts > 0 ? 'bg-danger/10' : 'bg-white/5'}`}>
               <ShieldAlert className={`w-4 h-4 ${initialMetrics.pendingPayouts > 0 ? 'text-danger' : 'text-muted opacity-40'}`} />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${initialMetrics.pendingPayouts > 0 ? 'text-danger' : 'text-muted'}`}>Pending Sync</span>
          </div>
          <div className="font-display text-2xl font-black text-danger/80">{initialMetrics.pendingPayouts}</div>
          <div className="text-[8px] text-muted/30 mt-8 font-mono uppercase tracking-widest leading-none">Verification required</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ─── PAYOUT REQUESTS ─── */}
        <div className="card p-0 flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 md:p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
             <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-electric opacity-60" />
                <h3 className="font-display text-xs font-black uppercase tracking-widest">Payout Queue</h3>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-danger opacity-40 animate-pulse" />
                <span className="text-[8px] font-black text-muted uppercase tracking-widest opacity-60 italic">Critical Sync</span>
             </div>
          </div>
          
          <div className="p-4 md:p-5 flex flex-col gap-4 text-xs">
            {payoutRequests.length === 0 ? (
              <div className="grow flex flex-col items-center justify-center py-24 gap-4 opacity-20">
                 <ShieldCheck className="w-8 h-8 text-muted" />
                 <p className="text-[10px] text-muted font-mono uppercase tracking-[0.2em] italic">Queue is currently clear.</p>
              </div>
            ) : (
              payoutRequests.map(r => (
                <div key={r.id} className={`p-4 rounded-xl border transition-all ${
                    r.is_flagged 
                    ? 'border-danger/20 bg-danger/[0.02]' 
                    : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-electric/5 border border-blue-electric/10 flex items-center justify-center font-black text-xs text-blue-electric font-display">
                         {r.profiles?.username?.[0] || 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                           <span className="font-black text-[13px] text-white truncate">@{r.profiles?.username}</span>
                           {r.is_flagged && <span className="text-[8px] font-black bg-danger/20 text-danger px-1.5 py-0.5 rounded leading-none">FLAGGED</span>}
                        </div>
                        <div className="text-[8px] text-muted font-mono uppercase tracking-tighter opacity-40">SystemID: {r.id.split('-')[0]}</div>
                      </div>
                    </div>
                    <div className="sm:text-right shrink-0">
                       <span className="text-xl font-black text-white font-display">₦{r.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/[0.03] rounded-xl mb-4 border border-white/5 flex gap-3">
                    <div className="p-2 bg-white/5 rounded-lg h-fit shrink-0"><Banknote className="w-4 h-4 text-muted opacity-40" /></div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-center mb-1">
                          <div className="text-[11px] font-black text-white uppercase truncate mr-2">{r.bank_account_info?.bank}</div>
                          <div className="text-[10px] font-mono text-blue-electric font-black shrink-0">{r.bank_account_info?.account}</div>
                       </div>
                       <div className="text-[9px] text-muted font-mono uppercase italic truncate opacity-40">{r.bank_account_info?.name}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {isRejecting === r.id ? (
                      <div className="flex gap-3 w-full items-center">
                        <input 
                          type="text" 
                          placeholder="REQUIRED REASON..." 
                          value={rejectionReason[r.id] || ''}
                          onChange={(e) => setRejectionReason(prev => ({ ...prev, [r.id]: e.target.value }))}
                          className="input-premium flex-1 py-2 px-3 text-[10px] font-black"
                        />
                        <button onClick={() => handleReject(r.id)} disabled={isPending} className="btn btn-danger !px-6 !py-2 h-auto text-[9px] font-black">CONFIRM</button>
                        <button onClick={() => setIsRejecting(null)} className="p-2 text-muted hover:text-white transition-colors">×</button>
                      </div>
                    ) : (
                      <>
                        <button 
                          disabled={isPending}
                          className="btn btn-blue grow py-2.5 font-black uppercase tracking-widest text-[9px] shadow-lg shadow-blue-electric/10" 
                          onClick={() => handleApprove(r.id)}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                          {isPending ? 'SYNCING...' : 'SETTLE ASSET'}
                        </button>
                        <button 
                          disabled={isPending}
                          className="grow py-2.5 font-black uppercase tracking-widest text-[9px] text-muted hover:text-danger hover:bg-danger/5 rounded-lg transition-all border border-transparent hover:border-danger/10 flex items-center justify-center gap-2" 
                          onClick={() => setIsRejecting(r.id)}
                        >
                          <XCircle className="w-3.5 h-3.5" />
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
        <div className="card p-0 flex flex-col overflow-hidden h-full shadow-sm">
           <div className="p-4 md:p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <div className="flex items-center gap-3">
                 <Activity className="w-4 h-4 text-blue-electric opacity-60" />
                 <h3 className="font-display text-xs font-black uppercase tracking-widest">Asset Ledger</h3>
              </div>
              <div className="badge badge-muted text-[7px] font-black px-4 py-1.5 opacity-40">AUTO-AUDIT</div>
           </div>
           
           <div className="flex flex-col grow">
              {ledger.length === 0 ? (
                <div className="grow flex flex-col items-center justify-center py-24 gap-4 opacity-20">
                   <Activity className="w-8 h-8 text-muted" />
                   <p className="text-[10px] text-muted font-mono uppercase tracking-[0.2em] italic">No transaction records.</p>
                </div>
              ) : (
                ledger.map(entry => (
                  <div key={entry.id} className="p-4 border-b border-white/5 flex justify-between items-center hover:bg-white/[0.02] last:border-0 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                       <div className={`shrink-0 p-1.5 rounded-lg ${entry.type === 'credit' ? 'bg-success/5 border border-success/10' : 'bg-danger/5 border border-danger/10'}`}>
                          {entry.type === 'credit' ? <ArrowDownLeft className={`w-3.5 h-3.5 text-success`} /> : <ArrowUpRight className={`w-3.5 h-3.5 text-danger`} />}
                       </div>
                       <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-white truncate max-w-[100px]">@{entry.profiles?.username || 'system'}</span>
                          </div>
                          <div className="text-[8px] text-muted font-black tracking-widest uppercase opacity-30 italic truncate max-w-[150px]">&quot;{(entry.reason || 'Settle')}&quot;</div>
                       </div>
                    </div>
                    <div className="text-right flex flex-col items-end shrink-0">
                       <div className={`font-black font-mono text-[11px] ${entry.type === 'credit' ? 'text-success' : 'text-danger'}`}>
                         {entry.type === 'credit' ? '+' : '-'} ₦{Math.abs(entry.amount).toLocaleString()}
                       </div>
                       <div className="text-[8px] text-muted font-mono opacity-30 mt-0.5">{new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                ))
              )}
           </div>
           
           <div className="p-4 border-t border-white/5 bg-blue-electric/[0.01]">
              <div className="flex items-center gap-3 p-3 bg-blue-electric/5 border border-blue-electric/10 rounded-xl relative overflow-hidden group">
                 <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-blue-electric/5 blur-xl group-hover:bg-blue-electric/10 transition-colors" />
                 <div className="p-1.5 bg-blue-electric/10 rounded-lg shrink-0"><ShieldCheck className="w-4 h-4 text-blue-electric" /></div>
                 <div className="relative z-10 leading-tight">
                    <h4 className="text-[9px] font-black text-white uppercase tracking-widest mb-1.5">Integrity Verified</h4>
                    <p className="text-[9px] text-muted font-bold opacity-40 italic">Ledger sequences are atomically immutable.</p>
                 </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
