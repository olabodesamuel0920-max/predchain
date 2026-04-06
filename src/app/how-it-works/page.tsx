import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — PredChain',
  description: 'Learn how the 3-day football prediction challenge works, how to buy an account, submit predictions, and unlock the 10X cash reward.',
};

const STEPS = [
  {
    number: '01',
    icon: '💳',
    title: 'Buy an Account',
    description: 'Choose your challenge account tier — Starter (₦5,000), Standard (₦10,000), or Premium (₦20,000). Your account unlocks full access to the prediction challenge round and determines your cash reward multiplier.',
    detail: 'Account purchase is secure and instant. Once confirmed, you are automatically assigned to the current or next active challenge round.',
  },
  {
    number: '02',
    icon: '🏟️',
    title: 'Enter a 3-Day Challenge Round',
    description: 'Each challenge round runs for exactly 3 days. You are placed into the active round immediately after your account is confirmed. Rounds run continuously — a new round begins as soon as the previous one ends.',
    detail: 'The round dashboard shows your 3 scheduled prediction matches — one per day — along with kickoff times, live status, and current leaderboard position.',
  },
  {
    number: '03',
    icon: '⚽',
    title: 'Predict 1 Live Match Per Day',
    description: 'Each day of the challenge, one live football match opens for prediction. You have a defined window to submit your prediction before the match kicks off. Predictions lock automatically at match start.',
    detail: 'You predict the match outcome: Home Win, Draw, or Away Win. You submit one prediction per day for 3 consecutive days. Missing a prediction means your streak resets.',
  },
  {
    number: '04',
    icon: '📊',
    title: 'Track Your Results Live',
    description: 'Watch match results in real time on the Live Challenge page. Your dashboard updates live as each match resolves. Correct predictions advance your streak. Incorrect predictions reset it.',
    detail: 'The live leaderboard reflects your position against all active challengers in real time. Track your streak progress and see who you need to beat.',
  },
  {
    number: '05',
    icon: '🏆',
    title: 'Complete 3/3 to Unlock the 10X Cash Reward',
    description: 'If you predict all 3 matches correctly within the same round — a perfect 3/3 streak — you unlock the 10X cash reward for your account tier.',
    detail: 'Your win is reviewed and verified by the PredChain admin team. Once verified, the cash reward is processed and paid out. All verified winners are publicly displayed on the Winners page.',
  },
];

const REWARD_TABLE = [
  { tier: 'Starter', entry: '₦5,000', reward: '₦50,000', multiplier: '10X' },
  { tier: 'Standard', entry: '₦10,000', reward: '₦100,000', multiplier: '10X' },
  { tier: 'Premium', entry: '₦20,000', reward: '₦200,000', multiplier: '10X' },
];

export default function HowItWorksPage() {
  return (
    <div style={{ paddingTop: '60px' }}>

      {/* Hero */}
      <section style={{
        padding: '40px 0 24px',
        background: 'linear-gradient(180deg, #0D1321 0%, #070B14 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-100px', right: '10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,194,255,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} aria-hidden="true" />
        <div className="container text-center">
          <div className="section-label" style={{ justifyContent: 'center' }}>Platform Guide</div>
          <h1 className="font-display text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-4">
            How PredChain Works
          </h1>
          <p className="text-[11px] font-black text-muted/40 uppercase tracking-[0.2em] max-w-lg mx-auto leading-relaxed italic">
            A structured, transparent performance challenge. Five steps from account purchase to verified cash reward unlock.
          </p>
          <div className="flex gap-3 justify-center mt-8">
            <Link href="/accounts" className="btn btn-primary px-6 py-2.5 text-[10px] font-black uppercase tracking-widest">Buy Account</Link>
            <Link href="/live-challenges" className="btn btn-ghost px-6 py-2.5 text-[10px] font-black uppercase tracking-widest border-white/5">View Challenges</Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 border-b border-white/5 bg-white/[0.01]">
        <div className="container max-w-3xl">
          <div className="flex flex-col gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="group relative">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '20px',
                  padding: '20px',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Left: Step number */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: 'rgba(212,175,55,0.05)',
                      border: '1px solid rgba(212,175,55,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.25rem', flexShrink: 0,
                    }}>
                      {step.icon}
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[9px] font-black text-gold uppercase tracking-[0.2em] italic">STEP {step.number}</span>
                    </div>
                    <h2 className="font-display text-lg font-black text-white uppercase italic tracking-tight mb-2">
                      {step.title}
                    </h2>
                    <p className="text-[11px] font-medium text-muted/60 leading-relaxed uppercase tracking-wide mb-4">
                      {step.description}
                    </p>
                    <div className="p-4 bg-white/[0.02] border-l-2 border-blue-electric/40 rounded-r-lg text-[10px] font-black text-muted/30 uppercase tracking-widest leading-relaxed italic">
                      {step.detail}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reward mapping */}
      <section className="py-16 bg-white/[0.02] border-b border-white/5">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <div className="section-label" style={{ justifyContent: 'center' }}>Reward Logic</div>
            <h2 className="font-display text-2xl font-black text-white uppercase italic tracking-tighter">Account Tier → Cash Reward</h2>
          </div>
          <div className="card p-0 overflow-hidden border-white/5 bg-white/[0.01]">
            <table className="w-full text-left">
              <thead className="bg-white/[0.03] border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Account Tier</th>
                  <th className="px-6 py-4 text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Entry Price</th>
                  <th className="px-6 py-4 text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Multiplier</th>
                  <th className="px-6 py-4 text-[9px] font-black text-white/40 uppercase tracking-[0.2em] text-right">Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {REWARD_TABLE.map((r, i) => (
                  <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 font-display text-[11px] font-black text-white uppercase italic">{r.tier}</td>
                    <td className="px-6 py-4 text-[11px] font-black text-muted uppercase tracking-widest">{r.entry}</td>
                    <td className="px-6 py-4">
                      <span className="badge badge-gold px-2 py-0.5 text-[8px]">{r.multiplier}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-display text-sm font-black text-gold italic">{r.reward}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Referral explanation */}
      <section className="py-20">
        <div className="container max-w-4xl">
          <div className="card p-8 md:p-12 border-blue-electric/10 bg-blue-electric/[0.01] grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-label">Referral Bonus</div>
              <h2 className="font-display text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                Earn ₦1,000 Per<br />Successful Referral
              </h2>
              <p className="text-[11px] font-black text-muted/40 uppercase tracking-widest leading-relaxed mb-8 italic">
                Share your unique referral code with friends. Every friend who purchases a PredChain account using your code earns you a ₦1,000 cash bonus.
              </p>
              <Link href="/referral" className="btn btn-primary px-8 py-3 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-electric/20 inline-flex items-center gap-2 group">
                Program Details <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { step: '1', icon: '🔗', text: 'Get your unique referral code from your dashboard' },
                { step: '2', icon: '👥', text: 'Share your link with friends or on social media' },
                { step: '3', icon: '✅', text: 'Friend purchases an account using your code' },
                { step: '4', icon: '💰', text: 'You instantly earn ₦1,000 in your wallet' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-[9px] font-black text-muted/40 uppercase tracking-widest italic">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white/[0.01] border-t border-white/5 text-center">
        <div className="container">
          <h2 className="font-display text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4">
            Ready to Start?
          </h2>
          <p className="text-[11px] font-black text-muted/40 uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed mb-10 italic">
            Buy an account, enter the live round, and build the perfect 3-match streak.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/accounts" className="btn btn-primary px-10 py-4 text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-gold/20">Buy Account</Link>
            <Link href="/live-challenges" className="btn btn-ghost px-10 py-4 text-[11px] font-black uppercase tracking-widest border-white/10">See Live List</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

