import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Challenge Rules & Fair Play — PredChain',
  description: 'Understand the elite 3-day streak mechanics and our anti-fraud commitment.',
};

export default function RulesPage() {
  return (
    <div style={{ paddingTop: '60px', paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ padding: '60px 0 40px', textAlign: 'center' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Official Rules</div>
          <h1 className="font-display text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-4">
            Challenge Rules & <span className="text-gold">Fair Play</span>
          </h1>
          <p className="text-[11px] font-black text-muted/40 uppercase tracking-[0.2em] max-w-lg mx-auto leading-relaxed italic">
            Understand the 3-day streak mechanics and our commitment to platform integrity.
          </p>
        </div>
        
        <div className="flex flex-col gap-6 text-muted leading-relaxed">
          <section className="card p-6 md:p-8 bg-white/[0.01] border-white/5">
            <h2 className="font-display text-lg font-black text-white uppercase italic tracking-tight mb-6">The 3-Day Perfect Streak</h2>
            <ul className="flex flex-col gap-4 list-disc pl-5 text-[11px] font-medium uppercase tracking-wide">
              <li>A "Challenge Round" consists of a 3-day window with active football matches.</li>
              <li>You must submit exactly <strong>one</strong> correct prediction each day.</li>
              <li>Predictions are outcome-based (1X2):
                <ul className="pl-6 mt-3 flex flex-col gap-2">
                  <li><strong className="text-gold">1</strong>: Home Win</li>
                  <li><strong className="text-gold">X</strong>: Draw</li>
                  <li><strong className="text-gold">2</strong>: Away Win</li>
                </ul>
              </li>
              <li>A successful 3/3 streak earns the verified cash reward payout.</li>
              <li>If any prediction is incorrect, your streak resets for that round.</li>
            </ul>
          </section>

          <section className="card p-6 md:p-8 bg-white/[0.01] border-white/5">
             <h2 className="font-display text-lg font-black text-white uppercase italic tracking-tight mb-4">Match Lock-in</h2>
             <p className="text-[11px] font-medium uppercase tracking-wide leading-relaxed">
               All predictions must be submitted <strong className="text-white">before</strong> the official match kickoff time. Once a match starts, the prediction window is locked permanently.
             </p>
          </section>

          <section className="card p-6 md:p-8 bg-white/[0.01] border-white/5">
             <h2 className="font-display text-lg font-black text-white uppercase italic tracking-tight mb-4">Platform Integrity</h2>
             <p className="text-[11px] font-medium uppercase tracking-wide leading-relaxed mb-6">
               To maintain high trust levels, we employ advanced verification and anti-fraud checks:
             </p>
             <ul className="flex flex-col gap-3 list-disc pl-5 text-[11px] font-medium uppercase tracking-wide">
               <li>Multi-account verification check.</li>
               <li>Bot detection on prediction submission.</li>
               <li>Manual audit for all cash reward payouts.</li>
               <li>Zero tolerance for unauthorized system access.</li>
             </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

