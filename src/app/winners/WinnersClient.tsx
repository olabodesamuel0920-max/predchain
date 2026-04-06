'use client';

import Link from 'next/link';
import { CheckCircle2, TrendingUp, Trophy } from 'lucide-react';

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
    <div style={{ paddingTop: '60px' }}>

      {/* Hero */}
      <section className="py-10 md:py-16 bg-gradient-to-b from-[#0D1321] to-[#070B14] border-b border-white/5 relative overflow-hidden">
        <div className="absolute -top-10 right-[10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" aria-hidden="true" />
        <div className="container relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-10">
            <div className="animate-slide-right">
              <div className="text-gold font-black text-[9px] uppercase tracking-[0.2em] mb-3 italic">Verified Winners</div>
              <h1 className="font-display text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-4 leading-tight">
                Top Challengers.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-[#F6D365]">Verified Rewards.</span>
              </h1>
              <p className="text-[11px] font-black text-muted/40 uppercase tracking-widest max-w-sm leading-relaxed italic">
                Every winner listed here completed a perfect 3/3 streak and received their confirmed cash reward payout.
              </p>
            </div>
            <div className="p-6 bg-gold/5 border border-gold/10 rounded-xl text-center flex-shrink-0 animate-slide-left">
              <div className="text-[9px] text-muted/40 font-black uppercase tracking-widest mb-1 italic">
                Total Cash Paid
              </div>
              <div className="font-display text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gold to-[#F6D365] tracking-tighter italic">
                ₦{totalPaid.toLocaleString()}
              </div>
              <div className="text-[8px] text-muted/20 mt-1 uppercase tracking-widest font-black italic">Across all challenges</div>
            </div>
          </div>
        </div>
      </section>

      {/* Winners grid */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
            <div className="flex items-center gap-3">
               <Trophy className="w-4 h-4 text-gold opacity-40" />
               <h2 className="font-display text-base font-black text-white uppercase italic tracking-tighter">
                 Verified Winners
               </h2>
            </div>
            <span className="badge badge-success px-4 py-1.5 text-[9px] items-center gap-2 flex w-fit italic">
              <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" /> Real-time Payouts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {winners.length === 0 ? (
               <div className="card p-20 text-center col-span-full border-dashed border-white/5 opacity-20">
                  <p className="font-black uppercase tracking-widest text-[10px] italic">Loading verified winners...</p>
               </div>
            ) : (
                winners.map((w) => {
                  const name = w.profile?.username || w.profile?.full_name || 'Challenger';
                  const initial = name.charAt(0).toUpperCase();
                  
                  return (
                    <div key={w.id} className="card p-4 flex flex-col gap-4 group hover:border-gold/20 transition-all bg-white/[0.01]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center font-display text-lg font-black text-gold italic group-hover:scale-105 transition-transform">
                          {initial}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="font-display text-sm font-black text-white truncate uppercase italic">{name}</div>
                          <div className="flex items-center gap-2">
                             <CheckCircle2 className="w-2.5 h-2.5 text-success" />
                             <span className="text-[9px] font-black text-muted/30 uppercase tracking-widest italic">Confirmed</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg flex items-center justify-between">
                        <div>
                          <div className="text-[8px] text-muted/20 font-black uppercase tracking-widest mb-1 italic">Reward</div>
                          <div className="font-display text-xl font-black text-white italic tracking-tighter">₦{w.payout_amount.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[8px] text-muted/20 font-black uppercase tracking-widest mb-1 italic">Streak</div>
                          <div className="text-lg font-black text-success italic">3/3 <CheckCircle2 className="w-3 h-3 inline ml-1 opacity-40" /></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-muted/20 italic">
                        <span>Round {w.round?.round_number || 'N/A'}</span>
                        <span>{new Date(w.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-white/[0.01] border-t border-white/5 text-center">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-4">
            Your Name Could Be Here
          </h2>
          <p className="text-[11px] font-black text-muted/40 uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed mb-10 italic">
            Buy an account, build the perfect streak, and join the verified winners list.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/accounts" className="btn btn-primary px-10 py-4 text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-gold/20">Buy Account Plan</Link>
            <Link href="/how-it-works" className="btn btn-ghost px-10 py-4 text-[11px] font-black uppercase tracking-widest border-white/10">Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
