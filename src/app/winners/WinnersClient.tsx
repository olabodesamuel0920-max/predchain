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
    <div className="relative min-h-screen bg-primary pt-32 pb-24 md:pt-44">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full h-[600px] bg-gold-glow blur-[140px] opacity-20" />
      </div>

      <div className="container relative z-10 px-6">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-stretch">
          <div className="lg:col-span-8 card-elite !p-12 md:!p-16 bg-[#080a0f] border-gold/10 flex flex-col justify-center">
             <div className="badge-elite !text-gold mb-8 px-5 py-1 bg-white/[0.03]">PAYOUT HISTORY</div>
             <h1 className="mb-6">Verified <span className="text-gradient-gold">Winners.</span></h1>
             <p className="text-muted text-sm md:text-base font-medium opacity-60 max-w-lg mb-8">
               A transparent record of participants who successfully completed their sequences and received confirmed payouts.
             </p>
          </div>
          
          <div className="lg:col-span-4 card-elite !p-12 bg-black border-white/5 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gold/5 blur-[40px] pointer-events-none" />
             <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4 opacity-40 italic">Total Rewards Paid</div>
             <div className="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-none mb-4">
                ₦{totalPaid.toLocaleString()}
             </div>
             <div className="flex items-center gap-2 text-[9px] font-bold text-success uppercase tracking-widest bg-success/10 px-3 py-1 rounded-full border border-success/10">
                <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                Live Ledger
             </div>
          </div>
        </div>

        {/* Winners Grid */}
        <div className="space-y-8 mb-24">
          <div className="flex items-center gap-3 px-2 opacity-40">
             <Trophy className="w-5 h-5 text-gold" />
             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white italic">Recent Distributions</h2>
             <div className="flex-1 h-px bg-white/5 ml-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {winners.length === 0 ? (
               <div className="card-elite !p-32 text-center col-span-full border-dashed border-white/10 opacity-10">
                  <Zap className="w-10 h-10 mx-auto mb-6 text-muted" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Waiting for next distribution...</p>
               </div>
            ) : (
                winners.map((w, i) => {
                  const name = w.profile?.username || w.profile?.full_name || 'Participant';
                  
                  return (
                    <div key={w.id} className="card-elite !p-8 bg-[#080a0f] border-white/5 flex flex-col gap-8 group hover:-translate-y-2 transition-all duration-700 shadow-xl" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[11px] font-black text-gold italic shadow-inner">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-black text-white uppercase tracking-tight truncate italic">{name}</div>
                          <div className="flex items-center gap-2 opacity-50">
                             <ShieldCheck className="w-3 h-3 text-success" />
                             <span className="text-[8px] font-black text-muted uppercase tracking-widest italic">VERIFIED</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/40 rounded-xl p-5 flex items-center justify-between border border-white/10 shadow-inner">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-muted uppercase tracking-widest opacity-30 italic">Reward</span>
                          <span className="text-2xl font-black text-white italic tracking-tighter">₦{w.payout_amount.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-black text-muted uppercase tracking-widest opacity-30 italic">Streak</span>
                          <span className="text-xl font-black text-success italic">3/3</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-muted opacity-20 italic">
                        <span>Round #{w.round?.round_number || 'X'}</span>
                        <span>{new Date(w.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="card-elite !p-20 text-center bg-[#05070a] border-gold/10 max-w-4xl mx-auto mb-24 group overflow-hidden relative shadow-3xl">
           <div className="absolute top-0 right-0 p-16 opacity-[0.01] pointer-events-none group-hover:opacity-10 transition-all duration-1000 rotate-12 translate-x-12"><Globe className="w-96 h-96" /></div>
           <div className="max-w-xl mx-auto relative z-10">
              <h2 className="mb-8">Claim Your <span className="text-gradient-gold">Spot.</span></h2>
              <p className="text-muted text-xs font-bold opacity-30 mb-12 uppercase tracking-widest leading-loose">
                Successful sequences lead to verified rewards. Start your first prediction today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/accounts" className="btn btn-primary !px-12 !py-4 rounded-xl font-black italic shadow-2xl transition-all hover:scale-105">
                  Get Started <ArrowUpRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/arena" className="btn btn-ghost !px-10 !py-4 rounded-xl border-white/5 font-black italic">Arena Live</Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
