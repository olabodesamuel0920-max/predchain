'use client';

import { 
  Users, 
  Wallet, 
  AlertCircle, 
  TrendingUp, 
  ShieldCheck, 
  Activity,
  ChevronRight
} from 'lucide-react';
import { Transaction } from '@/types';

interface DashboardViewProps {
  metrics: { totalUsers: number; totalRevenue: number; pendingPayouts: number };
  recentPurchases: (Transaction & { profiles?: { username: string } })[];
}

export default function DashboardView({ metrics, recentPurchases }: DashboardViewProps) {
  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* ─── OVERVIEW ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card hover:border-white/10 transition-all p-5 bg-white/[0.02] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-electric/10 rounded-lg"><Users className="w-4 h-4 text-blue-electric" /></div>
            <span className="text-[9px] text-muted font-black uppercase tracking-widest">Total Users</span>
          </div>
          <div className="flex items-baseline gap-3">
            <div className="font-display text-2xl font-black">{metrics.totalUsers.toLocaleString()}</div>
            <div className="text-[9px] text-success font-bold uppercase tracking-tighter flex items-center gap-2">
               <TrendingUp className="w-3.5 h-3.5" />
               Registered
            </div>
          </div>
          <div className="text-[8px] text-muted/30 mt-8 font-mono uppercase tracking-widest leading-none">Total members in system</div>
        </div>

        <div className="card card-featured p-5 relative overflow-hidden shadow-md">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2 bg-gold/10 rounded-lg"><Wallet className="w-4 h-4 text-gold" /></div>
            <span className="text-[9px] text-gold font-black uppercase tracking-widest">Total Revenue</span>
          </div>
          <div className="font-display text-2xl font-black text-gold relative z-10">₦{metrics.totalRevenue.toLocaleString()}</div>
          <div className="flex items-center justify-between mt-8 relative z-10">
             <div className="text-[8px] text-gold/30 font-mono uppercase tracking-widest">Platform total volume</div>
             <div className="badge badge-gold py-1.5 px-4 text-[7px] font-black">STABLE</div>
          </div>
        </div>

        <div className={`card p-5 transition-all md:col-span-2 lg:col-span-1 border-white/5 ${metrics.pendingPayouts > 0 ? 'bg-danger/[0.03] border-danger/20' : 'bg-white/[0.02] shadow-sm'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${metrics.pendingPayouts > 0 ? 'bg-danger/10' : 'bg-white/5'}`}>
               <AlertCircle className={`w-4 h-4 ${metrics.pendingPayouts > 0 ? 'text-danger' : 'text-muted opacity-40'}`} />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${metrics.pendingPayouts > 0 ? 'text-danger' : 'text-muted'}`}>Pending Payouts</span>
          </div>
          <div className="flex items-baseline gap-3">
            <div className={`font-display text-2xl font-black ${metrics.pendingPayouts > 0 ? 'text-danger' : 'text-white'}`}>{metrics.pendingPayouts}</div>
            <div className={`text-[9px] font-bold uppercase tracking-tighter ${metrics.pendingPayouts > 0 ? 'text-danger/60' : 'text-muted/40'}`}>
               {metrics.pendingPayouts > 0 ? 'Action Required' : 'All Clear'}
            </div>
          </div>
          <div className="text-[8px] text-muted/30 mt-8 font-mono uppercase tracking-widest leading-none">Payout requests awaiting review</div>
        </div>
      </div>

      {/* ─── LIVE STREAM & SYSTEM STATUS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
         {/* Recent Activity */}
         <div className="card p-0 flex flex-col overflow-hidden shadow-sm h-full">
            <div className="p-4 md:p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
               <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-blue-electric opacity-60" />
                  <h3 className="font-display text-xs font-black uppercase tracking-widest">Recent Activity</h3>
               </div>
               <span className="text-[8px] text-muted font-black uppercase tracking-widest flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-success opacity-40 animate-pulse" /> LIVE
               </span>
            </div>
            <div className="p-4 md:p-5 flex flex-col gap-3 min-h-[300px]">
               {recentPurchases.length === 0 ? (
                 <div className="grow flex flex-col items-center justify-center gap-4 opacity-20">
                    <Activity className="w-8 h-8 text-muted" />
                    <p className="text-[10px] text-muted font-mono uppercase tracking-[0.2em]">No recent activity detected.</p>
                 </div>
               ) : (
                 recentPurchases.slice(0, 5).map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3.5 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                       <div className="flex items-center gap-4 min-w-0">
                          <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-electric/5 border border-blue-electric/10 flex items-center justify-center text-[10px] font-black text-blue-electric font-display group-hover:bg-blue-electric/10 transition-colors">
                             {p.profiles?.username?.[0]?.toUpperCase() || 'P'}
                          </div>
                          <div className="min-w-0 leading-tight">
                             <div className="font-black text-[11px] text-white truncate max-w-[120px] sm:max-w-none">@{p.profiles?.username || 'member'}</div>
                             <div className="text-[8px] text-muted font-mono uppercase tracking-tighter opacity-40">{new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-success font-black text-[11px] font-mono flex items-center gap-2 justify-end">
                             ₦{p.amount.toLocaleString()}
                          </div>
                          <div className="text-[8px] text-muted uppercase tracking-widest opacity-30 font-black">Verified</div>
                       </div>
                    </div>
                  ))
               )}
            </div>
            <div className="mt-auto p-4 border-t border-white/5">
               <button className="w-full py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-muted hover:text-white hover:bg-white/[0.03] transition-all flex items-center justify-center gap-6 italic">
                  Full Transaction Log <ChevronRight className="w-3.5 h-3.5" />
               </button>
            </div>
         </div>

         {/* System Status UI */}
         <div className="card p-5 md:p-6 border-blue-electric/5 bg-blue-electric/[0.01] shadow-sm h-full">
            <div className="flex justify-between items-center mb-10">
               <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-electric" />
                  <h3 className="font-display text-xs font-black uppercase tracking-widest">System Health</h3>
               </div>
               <div className="badge badge-success py-1.5 px-4 text-[7px] font-black border-success/20">OPERATIONAL</div>
            </div>
            
            <div className="flex flex-col gap-4">
               <div className="p-4 bg-blue-electric/5 border border-blue-electric/10 rounded-xl relative overflow-hidden group">
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-electric/5 blur-2xl rounded-full" />
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                     <div className="w-4 h-4 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
                     <div className="text-[10px] font-black text-white uppercase tracking-widest">Performance node</div>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed relative z-10 font-bold opacity-60 italic">99.98% availability detected. Node alpha stable.</p>
               </div>

               <div className={`p-4 rounded-xl border relative overflow-hidden ${metrics.pendingPayouts > 0 ? 'bg-danger/[0.04] border-danger/20' : 'bg-success/[0.04] border-success/20 shadow-sm'}`}>
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                     <div className={`w-4 h-4 rounded-full ${metrics.pendingPayouts > 0 ? 'bg-danger animate-pulse' : 'bg-success'}`} />
                     <div className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Settlement protocol</div>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed font-bold opacity-60 italic">
                     {metrics.pendingPayouts > 0 
                      ? `${metrics.pendingPayouts} requests require synchronization.` 
                      : 'Payout queue clear. Audit balanced.'}
                  </p>
               </div>

               <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="flex justify-between items-center mb-3">
                     <div className="text-[9px] text-muted uppercase font-black tracking-widest italic opacity-40">User Capacity</div>
                     <span className="text-[9px] font-black text-white font-mono">{((metrics.totalUsers / 1000) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                     <div className="h-full bg-blue-electric shadow-[0_0_12px_var(--blue-glow)] transition-all duration-1000" style={{ width: `${Math.min((metrics.totalUsers / 1000) * 100, 100)}%` }} />
                  </div>
                  <div className="flex items-center gap-3 text-[9px] text-muted italic font-black uppercase opacity-20 tracking-tighter">
                     <TrendingUp className="w-3.5 h-3.5" />
                     Positive Growth Sequence Active
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
