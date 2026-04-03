import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — PredChain',
  description: 'Elite participation rules and terms for the PredChain football challenge platform.',
};

export default function TermsPage() {
  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="font-display text-4xl font-extrabold mb-32">Terms of Service</h1>
        
        <div className="flex flex-col gap-32 text-secondary leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-xl mb-12">1. Participation</h2>
            <p>PredChain is an elite prediction challenge platform. Participation requires a valid account tier. Users must be 18+ years of age.</p>
          </section>

          <section>
             <h2 className="text-white font-bold text-xl mb-12">2. The 3-Day Challenge</h2>
             <p>A challenge round consists of 3 consecutive matches. A user must correctly predict the outcome (1, X, or 2) of one match per day. Failing to predict or an incorrect prediction resets the streak.</p>
          </section>

          <section>
             <h2 className="text-white font-bold text-xl mb-12">3. Rewards & Payouts</h2>
             <p>A perfect 3/3 streak unlocks a 10X reward based on the account tier price. Payouts are verified by the admin team and processed within 24-48 hours via the user wallet.</p>
          </section>

          <section>
             <h2 className="text-white font-bold text-xl mb-12">4. Fair Play</h2>
             <p>Any attempt to manipulate prediction data, use automated bots, or engage in suspicious activity will result in an immediate permanent ban and forfeiture of all balances.</p>
          </section>

          <section>
             <h2 className="text-white font-bold text-xl mb-12">5. Liability</h2>
             <p>PredChain is not a gambling platform but a skill-based challenge. Rewards are based on accuracy and platform engagement metrics. We are not liable for match-day delays or cancellations.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
