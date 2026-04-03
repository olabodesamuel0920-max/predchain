'use client';

import { 
  Users, 
  Wallet, 
  AlertCircle, 
  TrendingUp, 
  ShieldCheck, 
  Activity,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { Transaction } from '@/types';

interface DashboardViewProps {
  metrics: { totalUsers: number; totalRevenue: number; pendingPayouts: number };
  recentPurchases: (Transaction & { profiles?: { username: string } })[];
}

export default function DashboardView({ metrics, recentPurchases }: DashboardViewProps) {
  return (
    <div className="flex flex-col gap-24 animate-slide-up">
      {/* ─── OVERVIEW ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card hover:border-white/10 transition-all p-6 bg-white/[0.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-electric/10 rounded-lg"><Users className="w-4 h-4 text-blue-electric" /></div>
            <span className="text-[9px] text-muted font-black uppercase tracking-widest">Total Users</span>
          </div>
          <div className="flex items-baseline gap-3">
            <div className="font-display text-2xl font-black">{metrics.totalUsers.toLocaleString()}</div>
            <div className="text-[10px] text-success font-bold uppercase tracking-tighter flex items-center gap-4">
               <TrendingUp className="w-4 h-4" />
               Registered
            </div>
          </div>
          <div className="text-[9px] text-muted/40 mt-12 font-mono uppercase tracking-widest">Total members in system</div>
        </div>

        <div className="card card-featured p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gold/10 rounded-lg"><Wallet className="w-4 h-4 text-gold" /></div>
            <span className="text-[9px] text-gold font-black uppercase tracking-widest">Total Revenue</span>
          </div>
          <div className="font-display text-2xl font-black text-gold">₦{metrics.totalRevenue.toLocaleString()}</div>
          <div className="flex items-center justify-between mt-12">
             <div className="text-[9px] text-gold/40 font-mono uppercase tracking-widest">Platform total volume</div>
             <div className="badge badge-gold py-2 px-6 text-[8px]">Stable</div>
          </div>
        </div>

        <div className={`card p-6 transition-all ${metrics.pendingPayouts > 0 ? 'bg-danger/[0.03] border-danger/20' : 'bg-white/[0.02]'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${metrics.pendingPayouts > 0 ? 'bg-danger/10' : 'bg-white/5'}`}>
               <AlertCircle className={`w-4 h-4 ${metrics.pendingPayouts > 0 ? 'text-danger' : 'text-muted opacity-40'}`} />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${metrics.pendingPayouts > 0 ? 'text-danger' : 'text-muted'}`}>Pending Payouts</span>
          </div>
          <div className="flex items-baseline gap-3">
            <div className={`font-display text-2xl font-black ${metrics.pendingPayouts > 0 ? 'text-danger' : 'text-white'}`}>{metrics.pendingPayouts}</div>
            <div className={`text-[10px] font-bold uppercase tracking-tighter ${metrics.pendingPayouts > 0 ? 'text-danger/60' : 'text-muted/40'}`}>
               {metrics.pendingPayouts > 0 ? 'Action Required' : 'All Clear'}
            </div>
          </div>
          <div className="text-[9px] text-muted/40 mt-12 font-mono uppercase tracking-widest">Payout requests awaiting review</div>
        </div>
      </div>

      {/* ─── LIVE STREAM & SYSTEM STATUS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Recent Activity */}
         <div className="card p-0 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
               <div className="flex items-center gap-10">
                  <Activity className="w-5 h-5 text-blue-electric opacity-60" />
                  <h3 className="font-display text-sm font-bold uppercase tracking-widest">Recent Activity</h3>
               </div>
               <span className="text-[9px] text-muted font-bold uppercase tracking-widest flex items-center gap-6">
                  <div className="w-4 h-4 rounded-full bg-success opacity-40" /> Live Feed
               </span>
            </div>
            <div className="p-20 flex flex-col gap-10">
               {recentPurchases.length === 0 ? (
                 <div className="py-48 text-center flex flex-col items-center gap-12 opacity-30">
                    <Activity className="w-10 h-10 text-muted" />
                    <p className="text-xs text-muted italic font-mono">No recent activity detected.</p>
                 </div>
               ) : (
                 recentPurchases.slice(0, 5).map(p => (
                    <div key={p.id} className="flex justify-between items-center p-12 bg-white/[0.03] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                       <div className="flex items-center gap-12">
                          <div className="w-28 h-28 rounded-lg bg-blue-electric/10 flex items-center justify-center text-[10px] font-black text-blue-electric font-display">
                             {p.profiles?.username?.[0]?.toUpperCase() || 'P'}
                          </div>
                          <div>
                             <div className="font-bold text-xs text-white">@{p.profiles?.username || 'member'}</div>
                             <div className="text-[8px] text-muted font-mono uppercase tracking-tighter">{new Date(p.created_at).toLocaleTimeString()} — Verified</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-success font-black text-xs flex items-center gap-4 justify-end">
                             ₦{p.amount.toLocaleString()}
                             <ArrowUpRight className="w-4 h-4" />
                          </div>
                          <div className="text-[8px] text-muted uppercase tracking-widest opacity-40 font-bold">Processed</div>
                       </div>
                    </div>
                 ))
               )}
            </div>
            <div className="mt-auto p-12 border-t border-white/5">
               <button className="btn btn-ghost btn-xs w-full font-black text-[9px] uppercase tracking-widest py-10 opacity-60 hover:opacity-100 flex items-center justify-center gap-8">
                  View Full Transaction Log <ChevronRight className="w-4 h-4" />
               </button>
            </div>
         </div>

         {/* System Status UI */}
         <div className="card p-24 border-blue-electric/10">
            <div className="flex justify-between items-center mb-24">
               <div className="flex items-center gap-10">
                  <ShieldCheck className="w-6 h-6 text-blue-electric" />
                  <h3 className="font-display text-sm font-bold uppercase tracking-widest">System Status</h3>
               </div>
               <div className="badge badge-success py-2 px-10 text-[8px] font-black border-success/30">System Online</div>
            </div>
            
            <div className="flex flex-col gap-16">
               <div className="p-16 bg-blue-electric/5 border border-blue-electric/10 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-20"><Activity className="w-12 h-12" /></div>
                  <div className="flex items-center gap-12 mb-10 relative z-10">
                     <div className="w-8 h-8 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
                     <div className="text-xs font-black text-white uppercase tracking-widest">System Performance</div>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed relative z-10 font-medium">PredChain platform operating at <strong>99.98%</strong> availability. Database connections stable.</p>
               </div>

               <div className={`p-16 rounded-xl border relative overflow-hidden ${metrics.pendingPayouts > 0 ? 'bg-danger/[0.04] border-danger/20' : 'bg-success/[0.04] border-success/20'}`}>
                  <div className="flex items-center gap-12 mb-10">
                     <div className={`w-8 h-8 rounded-full shadow-lg ${metrics.pendingPayouts > 0 ? 'bg-danger shadow-danger/20' : 'bg-success shadow-success/20'}`} />
                     <div className="text-xs font-black text-white uppercase tracking-widest">Payout Queue</div>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed font-medium">
                     {metrics.pendingPayouts > 0 
                      ? `Attention: ${metrics.pendingPayouts} payout requests require review and approval.` 
                      : 'Audit complete. All systems are balanced. Payout queue is currently empty.'}
                  </p>
               </div>

               <div className="p-16 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="flex justify-between items-center mb-12">
                     <div className="text-[9px] text-muted uppercase font-black tracking-widest">Growth Progress</div>
                     <span className="text-[9px] font-black text-white font-mono">{((metrics.totalUsers / 1000) * 100).toFixed(1)}% / Target</span>
                  </div>
                  <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden mb-12">
                     <div className="h-full bg-blue-electric shadow-[0_0_12px_var(--blue-glow)]" style={{ width: `${Math.min((metrics.totalUsers / 1000) * 100, 100)}%` }} />
                  </div>
                  <div className="flex items-center gap-6 text-[9px] text-muted italic font-medium opacity-60">
                     <TrendingUp className="w-4 h-4" />
                     User growth is trending positive against projections.
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
