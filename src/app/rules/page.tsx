import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Challenge Rules & Fair Play — PredChain',
  description: 'Understand the elite 3-day streak mechanics and our anti-fraud commitment.',
};

export default function RulesPage() {
  return (
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen bg-primary">
      <div className="container max-w-3xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest italic opacity-40">Official Rules</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white italic uppercase tracking-tighter mb-4 leading-none lowercase">
            Challenge Rules & <span className="text-gradient-gold">Fair Play</span>
          </h1>
          <p className="text-[11px] font-bold text-secondary uppercase tracking-widest max-w-lg mx-auto leading-relaxed italic opacity-40">
            Understand the 3-day sequence mechanics and our commitment to absolute platform integrity.
          </p>
        </div>
        
        <div className="flex flex-col gap-6">
          <section className="card p-8 md:p-10 bg-white/[0.015] border-white/5 shadow-2xl">
            <h2 className="font-display text-xl font-bold text-white uppercase italic tracking-tight mb-8">The 3-Day Protocol</h2>
            <ul className="flex flex-col gap-6 text-xs font-medium text-secondary uppercase tracking-wide leading-relaxed list-none">
              <li className="flex gap-4 items-start opacity-60">
                <span className="text-gold font-bold">01.</span>
                <span>A "Challenge Round" consists of a 3-day window with active football matches.</span>
              </li>
              <li className="flex gap-4 items-start opacity-60">
                <span className="text-gold font-bold">02.</span>
                <span>You must submit exactly <strong className="text-white">one</strong> correct prediction each day.</span>
              </li>
              <li className="flex gap-4 items-start opacity-60">
                <span className="text-gold font-bold">03.</span>
                <span>Predictions are outcome-based (1X2): 
                   <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="p-3 bg-black/40 border border-white/5 rounded-lg text-center"><span className="text-gold font-bold">1</span> Home</div>
                      <div className="p-3 bg-black/40 border border-white/5 rounded-lg text-center"><span className="text-gold font-bold">X</span> Draw</div>
                      <div className="p-3 bg-black/40 border border-white/5 rounded-lg text-center"><span className="text-gold font-bold">2</span> Away</div>
                   </div>
                </span>
              </li>
              <li className="flex gap-4 items-start opacity-60">
                <span className="text-gold font-bold">04.</span>
                <span>A successful 3/3 sequence earns the verified 10X yield payout.</span>
              </li>
              <li className="flex gap-4 items-start opacity-60">
                <span className="text-gold font-bold">05.</span>
                <span>Incorrect predictions reset your streak for that round instantly.</span>
              </li>
            </ul>
          </section>

          <section className="card p-8 bg-white/[0.01] border-white/5 shadow-inner">
             <h2 className="font-display text-lg font-bold text-white uppercase italic tracking-tight mb-4">Match Lock-in</h2>
             <p className="text-[10px] font-bold text-secondary uppercase tracking-widest leading-relaxed opacity-40 italic">
               All predictions must be submitted BEFORE the official match kickoff time. Once a match starts, the verification window is locked permanently.
             </p>
          </section>

          <section className="card p-8 md:p-10 bg-white/[0.015] border-white/5 shadow-2xl">
             <h2 className="font-display text-lg font-bold text-white uppercase italic tracking-tight mb-6">Platform Integrity</h2>
             <p className="text-[11px] font-bold text-secondary uppercase tracking-widest leading-relaxed mb-8 opacity-40 italic">
               To maintain elite trust levels, we employ advanced verification protocols:
             </p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Multi-account verification check',
                  'Bot detection on submissions',
                  'Manual audit for rewards',
                  'Zero tolerance for fraud'
                ].map((rule, i) => (
                  <div key={i} className="p-4 bg-black/40 border border-white/5 rounded-xl flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-electric rounded-full opacity-40" />
                    <span className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-60">{rule}</span>
                  </div>
                ))}
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
