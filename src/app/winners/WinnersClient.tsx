'use client';

import Link from 'next/link';
import { CheckCircle2, TrendingUp, Trophy, ArrowUpRight, Globe, ShieldCheck, Zap, DollarSign } from 'lucide-react';

interface WinnersClientProps {
  winners: Array<{
    id: string;
    payout_amount: number;
    created_at: string;
    profile?: { username?: string; full_name?: string };
    round?: { round_number: number };
  }>;
}

export default function WinnersClient({ winners }: WinnersClientProps) {
  const totalPaid = winners.reduce((sum, w) => sum + w.payout_amount, 0);

  return (
    <div className="relative min-h-screen pt-24 sm:pt-32 pb-24">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-muted/5 blur-[120px]" />
      </div>

      <div className="container-tight relative z-10">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16 items-stretch">
          <div className="lg:col-span-8 card-luxury !p-10 sm:!p-16 bg-[#11161D] border-gold/10 flex flex-col justify-center">
             <div className="badge-luxury mb-6 px-4 py-1.5 uppercase italic font-black tracking-widest">PAYOUT PROTOCOL</div>
             <h1 className="mb-4 uppercase italic font-black leading-tight tracking-tight">Verified <span className="text-gradient-gold">Winners.</span></h1>
             <p className="text-text-secondary text-sm font-normal leading-relaxed max-w-lg mb-0 italic">
               A transparent record of participants who successfully completed their sequences and received automated reward settlement.
             </p>
          </div>
          
          <div className="lg:col-span-4 card-luxury !p-10 bg-bg-card border-border-subtle flex flex-col items-center justify-center text-center relative overflow-hidden">
             <div className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em] mb-3 italic opacity-60">Total Verified Payouts</div>
             <div className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter leading-none mb-4 font-display">
                ₦{totalPaid.toLocaleString()}
             </div>
             <div className="flex items-center gap-2 text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-3 py-1 rounded-lg border border-emerald-500/10 italic">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live Network Ledger
             </div>
          </div>
        </div>

        {/* Winners Grid */}
        <div className="space-y-6 mb-24">
          <div className="flex items-center gap-3 px-2 opacity-50">
             <Trophy className="w-4 h-4 text-gold/40" />
             <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-white italic">Recent Distributions</h2>
             <div className="flex-1 h-px bg-border-subtle ml-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {winners.length === 0 ? (
               <div className="card-luxury !p-24 text-center col-span-full border-dashed border-border-subtle opacity-20">
                  <Zap className="w-8 h-8 mx-auto mb-4 text-text-dim" />
                  <p className="text-[9px] font-black uppercase tracking-widest italic opacity-40">Awaiting next sequence settlement...</p>
               </div>
            ) : (
                 winners.map((w, i) => {
                   const name = w.profile?.username || w.profile?.full_name || 'Anonymous Node';
                   
                   return (
                     <div key={w.id} className="card-luxury !p-6 bg-bg-card border-border-subtle flex flex-col gap-6 group hover:-translate-y-1 transition-all duration-500 shadow-sm">
                       <div className="flex items-center gap-4">
                         <div className="w-9 h-9 rounded-lg bg-white/[0.02] border border-border-subtle flex items-center justify-center text-[10px] font-black text-gold italic">
                           {name.charAt(0).toUpperCase()}
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="text-[13px] font-black text-white uppercase tracking-tight truncate italic">{name}</div>
                           <div className="flex items-center gap-2 opacity-40">
                              <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
                              <span className="text-[7px] font-black text-text-dim uppercase tracking-widest italic">Node Verified</span>
                           </div>
                         </div>
                       </div>

                       <div className="bg-bg-secondary p-4 rounded-xl flex items-center justify-between border border-border-subtle shadow-sm">
                         <div className="flex flex-col">
                           <span className="text-[7px] font-black text-text-dim uppercase tracking-widest italic opacity-40 mb-1">Settlement</span>
                           <span className="text-xl font-black text-white italic tracking-tighter font-display">₦{w.payout_amount.toLocaleString()}</span>
                         </div>
                         <div className="text-right">
                           <span className="text-[7px] font-black text-text-dim uppercase tracking-widest italic opacity-40 mb-1">Streak</span>
                           <span className="text-base font-black text-emerald-500 italic">3/3</span>
                         </div>
                       </div>

                       <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest text-text-dim italic opacity-30">
                         <span>CYCLE v2.0-{(w.round?.round_number || 0).toString().padStart(2, '0')}</span>
                         <span>{new Date(w.created_at).toLocaleDateString()}</span>
                       </div>
                     </div>
                   );
                 })
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="card-luxury-gold !p-12 sm:!p-20 text-center border-gold/10 max-w-3xl mx-auto mb-24 group relative shadow-md">
           <div className="max-w-xl mx-auto relative z-10">
              <h2 className="mb-4 text-4xl uppercase italic font-black">Claim Your <span className="text-gradient-gold">Spot.</span></h2>
              <p className="text-text-secondary text-[10px] font-normal mb-10 uppercase tracking-widest italic">
                Successful sequences lead to verified settlements. Initialize your node prediction today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/accounts" className="btn-luxury btn-gold !py-4 !px-10 !text-[10px] shadow-sm">
                  INITIALIZE ACCESS <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link href="/arena" className="btn-luxury btn-outline !py-4 !px-10 !text-[10px]">LATEST FIXTURES</Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
