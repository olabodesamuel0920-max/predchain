'use client';

import Link from 'next/link';

interface WinnersClientProps {
  winners: Array<{
    id: string;
    payout_amount: number;
    created_at: string;
    profile?: { username?: string; full_name?: string };
    round?: { round_number: number };
  }>;
}

const tierColors: Record<string, string> = {
  Premium: '#D4AF37',
  Standard: '#00C2FF',
  Starter: '#22C55E',
};

export default function WinnersClient({ winners }: WinnersClientProps) {
  const totalPaid = winners.reduce((sum, w) => sum + w.payout_amount, 0);

  return (
    <div style={{ paddingTop: '80px' }}>

      {/* Hero */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#0D1321] to-[#070B14] border-b border-white/5 relative overflow-hidden">
        <div className="absolute -top-20 right-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.1)_0%,transparent_70%)] pointer-events-none" aria-hidden="true" />
        <div className="container relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div>
              <div className="text-gold font-black text-[10px] uppercase tracking-[0.2em] mb-4 italic">Verified Winners</div>
              <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-6">
                Real Challengers.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-[#F6D365]">Verified Rewards.</span>
              </h1>
              <p className="text-muted text-lg max-w-lg">
                Every winner listed here completed a perfect 3/3 streak, passed anti-fraud verification, and received their confirmed cash reward payout.
              </p>
            </div>
            <div className="p-8 bg-gold/5 border border-gold/20 rounded-2xl text-center flex-shrink-0">
              <div className="text-[10px] text-muted font-black uppercase tracking-widest mb-2">
                Total Cash Paid
              </div>
              <div className="font-display text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gold to-[#F6D365] tracking-tighter">
                ₦{totalPaid.toLocaleString()}
              </div>
              <div className="text-[10px] text-muted mt-2 uppercase tracking-widest font-black">Across all rounds</div>
            </div>
          </div>
        </div>
      </section>

      {/* Winners grid */}
      <section className="py-12 md:py-20 lg:py-32">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <h2 className="font-display text-2xl font-black text-white uppercase italic tracking-tighter">
              Verified Operatives
            </h2>
            <span className="badge badge-success px-4 py-1.5 text-[10px] items-center gap-2 flex w-fit">
              <div className="live-dot" /> Live Synchronization
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {winners.length === 0 ? (
               <div className="card p-12 text-center col-span-full border-white/5 opacity-40">
                  <p className="font-black uppercase tracking-widest text-xs italic">Gathering winner data for the current protocol...</p>
               </div>
            ) : (
                winners.map((w) => {
                  const name = w.profile?.username || w.profile?.full_name || 'Operative';
                  const initial = name.charAt(0).toUpperCase();
                  const tier = 'Starter';
                  
                  return (
                    <div key={w.id} className="card p-6 flex flex-col gap-5 group hover:border-gold/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary border border-white/10 flex items-center justify-center font-display text-xl font-black text-gold italic group-hover:scale-110 transition-transform">
                          {initial}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="font-display text-base font-black text-white truncate uppercase italic">{name}</div>
                          <div className="text-[10px] font-black text-muted uppercase tracking-widest italic opacity-60">Verified</div>
                        </div>
                      </div>

                      <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-muted font-black uppercase tracking-widest mb-1 italic">Reward</div>
                          <div className="font-display text-2xl font-black text-white italic tracking-tighter">₦{w.payout_amount.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-muted font-black uppercase tracking-widest mb-1 italic">Streak</div>
                          <div className="text-xl font-black text-success italic">3/3 ✓</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-muted italic opacity-40">
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
      <section className="section-sm" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '12px' }}>
            Your Name Could Be Here
          </h2>
          <p style={{ color: '#A7B0C0', marginBottom: '32px', maxWidth: '460px', margin: '0 auto 32px' }}>
            Buy an account, build the perfect streak, and join the verified winners list.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/accounts" className="btn btn-primary btn-lg">Buy Account</Link>
            <Link href="/how-it-works" className="btn btn-ghost btn-lg">How It Works</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
