import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Challenge Rules & Fair Play — PredChain',
  description: 'Understand the elite 3-day streak mechanics and our anti-fraud commitment.',
};

export default function RulesPage() {
  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="font-display text-4xl font-extrabold mb-32">Challenge Rules & <span className="text-gradient-gold">Fair Play</span></h1>
        
        <div className="flex flex-col gap-32 text-secondary leading-relaxed">
          <section className="card" style={{ padding: '32px' }}>
            <h2 className="text-white font-bold text-xl mb-16">The 3-Day Perfect Streak</h2>
            <ul className="flex flex-col gap-12 list-disc pl-20">
              <li>A &quot;Round&quot; consists of a 3-day window with active football matches.</li>
              <li>You must submit exactly <strong>one</strong> correct prediction each day.</li>
              <li>Predictions are outcome-based (1X2):
                <ul className="pl-20 mt-8">
                  <li><strong>1</strong>: Home Win</li>
                  <li><strong>X</strong>: Draw</li>
                  <li><strong>2</strong>: Away Win</li>
                </ul>
              </li>
              <li>A successful 3/3 streak automatically triggers the 10X reward payout.</li>
              <li>If any of your predictions are incorrect, your streak resets for that round.</li>
            </ul>
          </section>

          <section className="card" style={{ padding: '32px' }}>
             <h2 className="text-white font-bold text-xl mb-16">Match Lock-in</h2>
             <p>All predictions must be submitted <strong>before</strong> the official match kickoff time. Once a match starts, the prediction window is locked permanently.</p>
          </section>

          <section className="card" style={{ padding: '32px' }}>
             <h2 className="text-white font-bold text-xl mb-16">Fair Play Commitment</h2>
             <p>To maintain the elite integrity of PredChain, we employ advanced anti-fraud algorithms:</p>
             <ul className="flex flex-col gap-12 list-disc pl-20 mt-12">
               <li>Multi-account verification check.</li>
               <li>Bot detection on prediction submission.</li>
               <li>Manual audit for high-value payouts.</li>
               <li>Zero tolerance for spoofing or unauthorized API access.</li>
             </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
