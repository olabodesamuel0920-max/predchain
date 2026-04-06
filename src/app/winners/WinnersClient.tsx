'use client';

import Link from 'next/link';
import { CheckCircle2, TrendingUp, Trophy, ArrowUpRight, Globe, ShieldCheck, Zap } from 'lucide-react';

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
    <div className="relative min-h-screen bg-primary pt-32 pb-24">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-grad-glow opacity-30 pointer-events-none z-0" />

      {/* Hero */}
      <section className="relative z-10 mb-20">
        <div className="container">
          <div className="card-elite p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 bg-grad-glow opacity-90 border-gold/20">
            <div className="flex-1 text-center md:text-left">
              <div className="badge-elite mb-8 !px-4">NETWORK SETTLEMENT RECORD</div>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase mb-6 leading-tight">
                Verified <span className="text-gradient-gold">Winners.</span>
              </h1>
              <p className="text-secondary text-sm font-medium opacity-60 max-w-md mx-auto md:mx-0">
                A public ledger of successful operators who completed perfect arena cycles and received confirmed payouts.
              </p>
            </div>
            <div className="card-elite !bg-bg-primary/60 p-10 px-14 text-center min-w-[280px]">
              <div className="text-[10px] text-muted font-bold uppercase mb-2 tracking-widest opacity-40">
                Total Protocol Payouts
              </div>
              <div className="text-5xl font-bold text-white font-mono tracking-tighter">
                ₦{totalPaid.toLocaleString()}
              </div>
              <div className="flex items-center justify-center gap-2 mt-4 text-[9px] text-success font-bold uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                Live Distribution
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Winners grid */}
      <section className="relative z-10 mb-24">
        <div className="container">
          <div className="flex items-center gap-4 mb-12 px-4">
             <Trophy className="w-6 h-6 text-gold opacity-60" />
             <h2 className="text-xl font-bold text-white uppercase tracking-tight">Active Hall of Fame</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {winners.length === 0 ? (
               <div className="card-elite p-40 text-center col-span-full border-dashed border-white/10 opacity-30">
                  <Zap className="w-12 h-12 mx-auto mb-6 text-muted" />
                  <p className="text-[12px] font-bold uppercase tracking-widest">Synchronizing winner ledger...</p>
               </div>
            ) : (
                winners.map((w) => {
                  const name = w.profile?.username || w.profile?.full_name || 'Operator';
                  const initial = name.charAt(0).toUpperCase();
                  
                  return (
                    <div key={w.id} className="card-elite p-6 flex flex-col gap-8 group hover:-translate-y-2 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-xl font-black text-gold italic">
                          {initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-bold text-white uppercase tracking-tight truncate">{name}</div>
                          <div className="flex items-center gap-2 opacity-50">
                             <ShieldCheck className="w-3.5 h-3.5 text-success" />
                             <span className="text-[9px] font-bold text-muted uppercase tracking-widest">VERIFIED</span>
                          </div>
                        </div>
                      </div>

                      <div className="card-elite !p-5 bg-white/[0.02] flex items-center justify-between border-white/5">
                        <div className="flex flex-col gap-1">
                          <div className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-20">SETTLEMENT</div>
                          <div className="text-2xl font-bold text-white font-mono tracking-tighter">₦{w.payout_amount.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-20">CYCLE</div>
                          <div className="text-xl font-bold text-success font-mono">3/3</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted opacity-30">
                        <span>Round #{w.round?.round_number || 'X'}</span>
                        <span className="font-mono">{new Date(w.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 container">
        <div className="card-elite p-12 md:p-20 text-center relative overflow-hidden bg-grad-glow border-gold/10">
           <div className="absolute top-0 right-0 p-16 opacity-[0.03] -rotate-12"><Globe className="w-48 h-48" /></div>
           <div className="max-w-xl mx-auto relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase mb-8 leading-tight">
                Establish Your <br /> <span className="text-gradient-gold">Winning Streak.</span>
              </h2>
              <p className="text-secondary text-sm font-medium opacity-60 mb-12 uppercase tracking-wide leading-relaxed">
                Connect your account protocol and compete for verified daily settlements.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/accounts" className="btn btn-primary px-12 py-4 rounded-2xl font-bold uppercase text-[11px] tracking-widest group">
                  Connect Node <ArrowUpRight className="w-4 h-4 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
                <Link href="/how-it-works" className="btn btn-ghost px-10 py-4 rounded-2xl font-bold uppercase text-[11px] tracking-widest border-white/10">How it Works</Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
