'use client';

import { useState, useEffect, useTransition } from 'react';
import { 
  ShieldAlert, 
  User, 
  ShieldCheck, 
  Activity, 
  Check, 
  X, 
  AlertCircle, 
  Tv, 
  Smartphone, 
  MapPin, 
  CreditCard, 
  TrendingUp, 
  ExternalLink,
  Lock,
  Unlock,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { getFraudReport, getWinnerReviewQueue, approveKyc, rejectKyc, clearBankFlag, approveWinner, updateUserStatus } from '@/app/actions/admin';
import { useFeedback } from '@/hooks/useFeedback';

export default function FraudView() {
  const [reports, setReports] = useState<any[]>([]);
  const [winnersQueue, setWinnersQueue] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'fraud' | 'winners'>('fraud');
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [kycNotes, setKycNotes] = useState('');
  const [isPending, startTransition] = useTransition();
  const { success: successMsg, error: errorMsg, showSuccess, showError, clear } = useFeedback();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    startTransition(async () => {
      try {
        const [fraudData, winnersData] = await Promise.all([
          getFraudReport(),
          getWinnerReviewQueue()
        ]);
        setReports(fraudData);
        setWinnersQueue(winnersData);
      } catch (err: any) {
        showError(err.message || 'Failed to load integrity data.');
      }
    });
  };

  const handleAction = async (actionFn: () => Promise<any>, successText: string) => {
    startTransition(async () => {
      try {
        await actionFn();
        showSuccess(successText);
        loadData();
        setSelectedReport(null);
      } catch (err: any) {
        showError(err.message || 'Operation failed.');
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
      {/* Toast Notifications */}
      {(successMsg || errorMsg) && (
        <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl backdrop-blur-xl border flex items-center gap-3 shadow-2xl animate-slide-up ${
          successMsg ? 'bg-emerald-500/90 border-emerald-500/20 text-black' : 'bg-rose-500/90 border-rose-500/20 text-white'
        }`}>
          {successMsg ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-xs font-bold">{successMsg || errorMsg}</span>
          <button onClick={clear} className="ml-12 p-1 hover:bg-black/10 rounded font-black text-sm">×</button>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex items-center gap-4 bg-[#030508] border border-white/5 p-2 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('fraud')}
          className={`flex items-center gap-3 px-8 py-3 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${
            activeTab === 'fraud' ? 'bg-white/10 text-white shadow' : 'text-secondary hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          Fraud & Multi-Accounts
          {reports.length > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded bg-rose-500 text-black font-black text-[8px]">{reports.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('winners')}
          className={`flex items-center gap-3 px-8 py-3 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${
            activeTab === 'winners' ? 'bg-white/10 text-white shadow' : 'text-secondary hover:text-white'
          }`}
        >
          <FileCheck className="w-4 h-4 text-gold" />
          Winners review queue
          {winnersQueue.filter(w => !w.verified).length > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded bg-gold text-black font-black text-[8px]">
              {winnersQueue.filter(w => !w.verified).length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: LIST */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {activeTab === 'fraud' ? (
            reports.length === 0 ? (
              <div className="card py-32 text-center flex flex-col items-center gap-4 opacity-40 bg-[#030508] border-white/5 rounded-2xl">
                <ShieldCheck className="w-12 h-12 text-emerald-500" />
                <p className="text-[10px] font-black uppercase tracking-widest italic text-white">All systems clean. No security flags raised.</p>
              </div>
            ) : (
              reports.map((report, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedReport(report)}
                  className={`card p-6 cursor-pointer border rounded-2xl transition-all flex flex-col gap-6 ${
                    selectedReport?.profile?.id === report.profile.id
                      ? 'border-rose-500 bg-rose-500/[0.02] shadow-lg shadow-rose-500/5'
                      : 'border-white/5 hover:border-white/10 bg-[#030508]/60'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs ${
                        report.profile.risk_score >= 70 ? 'bg-rose-500 text-black' : 'bg-amber-500/20 text-amber-500 border border-amber-500/20'
                      }`}>
                        {report.profile.risk_score}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-white">@{report.profile.username}</span>
                          <span className="text-[9px] uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded text-secondary italic">
                            {report.profile.status}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-muted uppercase tracking-tighter opacity-60">
                          ID: {report.profile.id}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-end">
                      {report.reasons.map((reason: string, rIdx: number) => (
                        <span key={rIdx} className="text-[8px] font-black uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2.5 py-1 rounded-full italic">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Overlaps Quick Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-black/40 border border-white/5 rounded-xl text-[10px]">
                    <div className="flex items-center gap-2 text-secondary">
                      <Smartphone className={`w-3.5 h-3.5 ${report.profile.last_device_fingerprint ? 'text-white' : 'opacity-30'}`} />
                      <span className="truncate">
                        Device: {report.profile.last_device_fingerprint ? report.profile.last_device_fingerprint.slice(0, 10) : 'None'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary">
                      <MapPin className={`w-3.5 h-3.5 ${report.profile.last_ip_address ? 'text-white' : 'opacity-30'}`} />
                      <span>IP: {report.profile.last_ip_address || 'None'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary">
                      <CreditCard className={`w-3.5 h-3.5 ${report.profile.bank_account_number ? 'text-white' : 'opacity-30'}`} />
                      <span className="truncate">Bank: {report.profile.bank_account_number || 'None'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-electric" />
                      <span>Overlaps: {report.linkedAccounts.length} accounts</span>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            /* WINNERS QUEUE */
            winnersQueue.length === 0 ? (
              <div className="card py-32 text-center flex flex-col items-center gap-4 opacity-40 bg-[#030508] border-white/5 rounded-2xl">
                <Activity className="w-12 h-12 text-secondary" />
                <p className="text-[10px] font-black uppercase tracking-widest italic text-white">No entries in the reward review queue.</p>
              </div>
            ) : (
              winnersQueue.map((winner, idx) => (
                <div 
                  key={idx}
                  className={`card p-6 border rounded-2xl bg-[#030508]/60 border-white/5 hover:border-white/10 flex justify-between items-center`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs ${
                      winner.verified ? 'bg-emerald-500 text-black' : 'bg-gold/20 text-gold border border-gold/20'
                    }`}>
                      {winner.verified ? 'OK' : 'KYC'}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-white">@{winner.profile?.username}</span>
                        <span className="text-[9px] uppercase bg-white/5 text-secondary px-2 py-0.5 rounded">
                          Round {winner.round?.round_number}
                        </span>
                      </div>
                      <div className="text-[9px] text-muted font-mono uppercase tracking-tighter opacity-60 mt-1">
                        Reward: ₦{winner.payout_amount.toLocaleString()} • Status: {winner.verified ? 'Verified & Paid' : 'Pending Verification Queue'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!winner.verified ? (
                      <button
                        onClick={() => handleAction(() => approveWinner(winner.id), 'Winner approved and wallet credited.')}
                        disabled={isPending}
                        className="btn btn-primary !px-5 !py-2 text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow shadow-gold/20"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Approve
                      </button>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> SATELLITE SETTLED
                      </span>
                    )}
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* RIGHT COLUMN: ACTION PANEL */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="card p-6 bg-[#030508] border border-white/5 rounded-2xl flex flex-col gap-6 min-h-[400px]">
            <h3 className="text-[12px] font-black uppercase tracking-widest text-white border-b border-white/5 pb-4">
              Integrity Console
            </h3>

            {selectedReport ? (
              <div className="flex flex-col gap-6 animate-fade-in">
                
                {/* Profile detail cards */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gold mb-2">Selected Node</h4>
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
                    <div className="font-black text-sm text-white">@{selectedReport.profile.username}</div>
                    <div className="text-[9px] text-secondary mt-1">{selectedReport.profile.full_name}</div>
                    <div className="text-[9px] text-rose-500/80 font-bold uppercase mt-2">Risk Factor: {selectedReport.profile.risk_score}/100</div>
                  </div>
                </div>

                {/* Bank / KYC Status */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gold">Identity status</h4>
                  <div className="grid grid-cols-2 gap-4 text-[10px]">
                    <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex flex-col">
                      <span className="text-[8px] text-muted uppercase">KYC Gate</span>
                      <span className="font-black text-white mt-1 uppercase">{selectedReport.profile.identity_status}</span>
                    </div>
                    <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex flex-col">
                      <span className="text-[8px] text-muted uppercase">Bank Verification</span>
                      <span className={`font-black mt-1 uppercase ${selectedReport.profile.bank_account_flagged ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {selectedReport.profile.bank_account_flagged ? 'FLAGGED' : 'CLEARED'}
                      </span>
                    </div>
                  </div>

                  {selectedReport.profile.bank_account_flagged_reason && (
                    <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl text-[9px] text-rose-400 font-bold uppercase italic leading-normal">
                      Reason: {selectedReport.profile.bank_account_flagged_reason}
                    </div>
                  )}

                  {selectedReport.profile.identity_legal_name && (
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl text-[9px] space-y-2 text-secondary font-mono">
                      <div>Legal Name: <span className="text-white font-bold">{selectedReport.profile.identity_legal_name}</span></div>
                      <div>DOB: <span className="text-white font-bold">{selectedReport.profile.identity_dob}</span></div>
                      <div>ID Type: <span className="text-white font-bold">{selectedReport.profile.identity_type} ({selectedReport.profile.identity_number})</span></div>
                    </div>
                  )}
                </div>

                {/* Overlaps details */}
                {selectedReport.linkedAccounts.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gold mb-2">Overlapping Nodes</h4>
                    <div className="flex flex-col gap-2 max-h-32 overflow-y-auto no-scrollbar">
                      {selectedReport.linkedAccounts.map((acc: any, aIdx: number) => (
                        <div key={aIdx} className="p-2 bg-black/50 border border-white/5 rounded-lg flex justify-between text-[9px] items-center">
                          <span className="text-white font-bold">@{acc.username}</span>
                          <span className="text-rose-500/80 font-black">Score: {acc.risk_score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions forms */}
                <div className="border-t border-white/5 pt-4 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gold">Actions</h4>
                  
                  {selectedReport.profile.identity_status === 'pending' && (
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="Admin notes/rejection reason..."
                        value={kycNotes}
                        onChange={(e) => setKycNotes(e.target.value)}
                        className="input-premium pl-4 py-2.5 text-[9.5px] italic font-black uppercase placeholder:text-muted/30"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleAction(() => approveKyc(selectedReport.profile.id, kycNotes), 'KYC approved successfully.')}
                          disabled={isPending}
                          className="btn btn-blue !py-2.5 text-[9px] font-black uppercase tracking-wider shadow"
                        >
                          Approve KYC
                        </button>
                        <button
                          onClick={() => handleAction(() => rejectKyc(selectedReport.profile.id, kycNotes), 'KYC rejected.')}
                          disabled={isPending}
                          className="btn btn-outline border-rose-500/20 text-rose-500 hover:bg-rose-500/10 !py-2.5 text-[9px] font-black uppercase tracking-wider shadow"
                        >
                          Reject KYC
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2.5">
                    {selectedReport.profile.bank_account_flagged && (
                      <button
                        onClick={() => handleAction(() => clearBankFlag(selectedReport.profile.id), 'Bank flag cleared.')}
                        disabled={isPending}
                        className="btn btn-outline border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 !py-3.5 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <Unlock className="w-3.5 h-3.5" /> Clear bank flag
                      </button>
                    )}

                    {selectedReport.profile.status !== 'suspended' ? (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleAction(() => updateUserStatus(selectedReport.profile.id, { status: 'suspended' }), 'User suspended.')}
                          disabled={isPending}
                          className="btn btn-outline border-rose-500/20 text-rose-500 hover:bg-rose-500/10 !py-3.5 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                          <Lock className="w-3.5 h-3.5" /> Suspend
                        </button>
                        <button
                          onClick={() => handleAction(() => updateUserStatus(selectedReport.profile.id, { status: 'suspended', is_suspended: true, admin_notes: 'Banned by administrator' }), 'User banned.')}
                          disabled={isPending}
                          className="btn btn-danger !py-3.5 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                          <X className="w-3.5 h-3.5" /> Ban User
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAction(() => updateUserStatus(selectedReport.profile.id, { status: 'active', is_suspended: false, admin_notes: undefined }), 'User activated.')}
                        disabled={isPending}
                        className="btn btn-outline border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 !py-3.5 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <Unlock className="w-3.5 h-3.5" /> Activate user
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center gap-3 opacity-30 select-none">
                <AlertTriangle className="w-10 h-10 text-muted" />
                <p className="text-[9px] font-black uppercase tracking-widest italic font-mono max-w-[150px]">
                  Select a flagged account or winner to inspect details.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
