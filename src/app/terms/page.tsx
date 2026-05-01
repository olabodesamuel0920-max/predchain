import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — PredChain',
  description: 'Elite participation rules and terms for the PredChain football challenge platform.',
};

export default function TermsPage() {
  return (
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen bg-primary px-6">
      <div className="container max-w-3xl">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest italic opacity-40">Legal Framework</span>
          </div>
          <h1 className="font-display text-4xl md:text-7xl font-bold text-white italic uppercase tracking-tighter mb-4 leading-none">
            Terms of <span className="text-gradient-blue italic">Service</span>
          </h1>
          <p className="text-[11px] font-bold text-secondary uppercase tracking-widest max-w-lg mx-auto leading-relaxed italic opacity-40">
            Elite participation rules and terms for the PredChain football challenge platform.
          </p>
        </div>
        
        <div className="flex flex-col gap-12">
          {[
            { 
              title: '1. Participation Protocol', 
              text: 'PredChain is an elite prediction challenge platform. Participation requires a valid account tier. Users must be 18+ years of age.' 
            },
            { 
              title: '2. Sequence Mechanics', 
              text: 'A challenge round consists of 3 consecutive matches. A user must correctly predict the outcome (1, X, or 2) of one match per day. Failing to predict or an incorrect prediction resets the sequence instantly.' 
            },
            { 
              title: '3. Reward Verification', 
              text: 'A perfect 3/3 streak unlocks a 10X reward based on the account tier price. Payouts are verified by the admin protocol and processed within 24-48 hours via the user wallet hub.' 
            },
            { 
              title: '4. Integrity System', 
              text: 'Any attempt to manipulate prediction data, use automated scripts, or engage in suspicious network activity will result in an immediate permanent ban and forfeiture of all balances.' 
            },
            { 
              title: '5. Liability Disclosure', 
              text: 'PredChain is a skill-based performance challenge. Rewards are based on accuracy and platform engagement metrics. We are not liable for external match-day results or cancellations.' 
            },
          ].map((item, i) => (
             <section key={i} className="card p-8 md:p-10 bg-white/[0.015] border-white/5 hover:border-white/10 transition-all shadow-xl group">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-1.5 bg-blue-electric rounded-full opacity-40 group-hover:bg-gold transition-colors" />
                  <h2 className="text-white font-bold text-sm md:text-lg uppercase italic tracking-tighter">{item.title}</h2>
               </div>
               <p className="text-xs md:text-sm font-medium text-secondary uppercase tracking-wide leading-relaxed opacity-60">
                 {item.text}
               </p>
             </section>
          ))}
        </div>
      </div>
    </div>
  );
}
