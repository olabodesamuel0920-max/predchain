import Link from 'next/link';
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
    <div style={{ paddingTop: '80px' }}>

      {/* Hero */}
      <section style={{
        padding: '80px 0 64px',
        background: 'linear-gradient(180deg, #0D1321 0%, #070B14 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-100px', right: '10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,194,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} aria-hidden="true" />
        <div className="container text-center">
          <div className="section-label" style={{ justifyContent: 'center' }}>Platform Guide</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', margin: '0 auto 20px' }}>
            How PredChain Works
          </h1>
          <p className="section-subtitle" style={{ margin: '0 auto 40px', maxWidth: '580px' }}>
            A structured, transparent performance challenge. Five steps from account purchase to verified cash reward unlock.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/accounts" className="btn btn-primary btn-lg">Buy Account</Link>
            <Link href="/live-challenges" className="btn btn-ghost btn-lg">View Live Challenges</Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="section">
        <div className="container-sm">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '32px',
                padding: '36px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Left: Step number + connector */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '16px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.75rem', flexShrink: 0,
                  }}>
                    {step.icon}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{
                      width: '1px', flex: 1,
                      background: 'linear-gradient(180deg, rgba(212,175,55,0.3), transparent)',
                      minHeight: '40px',
                    }} aria-hidden="true" />
                  )}
                </div>

                {/* Right: Content */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.75rem', fontWeight: 700,
                      color: 'var(--gold)', letterSpacing: '0.1em',
                    }}>STEP {step.number}</span>
                  </div>
                  <h2 style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '1.375rem', fontWeight: 700,
                    color: '#F8FAFC', marginBottom: '12px',
                  }}>
                    {step.title}
                  </h2>
                  <p style={{ color: '#A7B0C0', lineHeight: 1.75, marginBottom: '14px' }}>
                    {step.description}
                  </p>
                  <div style={{
                    padding: '14px 18px',
                    background: 'rgba(255,255,255,0.03)',
                    borderLeft: '2px solid rgba(0,194,255,0.4)',
                    borderRadius: '0 8px 8px 0',
                    fontSize: '0.875rem',
                    color: '#6E7A91',
                    lineHeight: 1.7,
                  }}>
                    {step.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reward mapping */}
      <section className="section-sm" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="container-sm">
          <div className="text-center" style={{ marginBottom: '40px' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Reward Logic</div>
            <h2 className="section-title" style={{ margin: '0 auto' }}>Account Tier → Cash Reward</h2>
          </div>
          <div className="table-wrapper">
            <table className="table" aria-label="Account tier reward mapping">
              <thead>
                <tr>
                  <th>Account Tier</th>
                  <th>Entry Price</th>
                  <th>Multiplier</th>
                  <th>Perfect Streak Reward</th>
                </tr>
              </thead>
              <tbody>
                {REWARD_TABLE.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#F8FAFC' }}>{r.tier}</td>
                    <td>{r.entry}</td>
                    <td>
                      <span className="badge badge-gold">{r.multiplier}</span>
                    </td>
                    <td style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 800,
                      fontSize: '1.125rem',
                      background: 'linear-gradient(135deg, #D4AF37, #F6D365)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>{r.reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Referral explanation */}
      <section className="section">
        <div className="container-sm">
          <div style={{
            padding: '48px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center',
          }}>
            <div>
              <div className="section-label">Referral Bonus</div>
              <h2 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.75rem', fontWeight: 700,
                color: '#F8FAFC', lineHeight: 1.2, marginBottom: '16px',
              }}>
                Earn ₦1,000 Per Successful Referral
              </h2>
              <p style={{ color: '#A7B0C0', lineHeight: 1.75, marginBottom: '24px' }}>
                Share your unique referral code with friends. Every friend who purchases a PredChain account using your code earns you a ₦1,000 cash bonus — deposited directly to your earnings wallet. No limit on referrals.
              </p>
              <Link href="/referral" className="btn btn-primary">View Referral Program</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { step: '1', icon: '🔗', text: 'Get your unique referral code from your dashboard' },
                { step: '2', icon: '👥', text: 'Share your link with friends, family, or followers' },
                { step: '3', icon: '✅', text: 'Friend purchases an account using your code' },
                { step: '4', icon: '💰', text: 'You instantly earn ₦1,000 in your earnings wallet' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '16px', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                  <span style={{ fontSize: '0.875rem', color: '#A7B0C0' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 800, letterSpacing: '-0.03em',
            marginBottom: '16px', color: '#F8FAFC',
          }}>
            Ready to Start Your Challenge?
          </h2>
          <p style={{ color: '#A7B0C0', marginBottom: '32px', fontSize: '1.0625rem', maxWidth: '480px', margin: '0 auto 32px' }}>
            Buy an account, enter the live round, and build the perfect 3-match streak.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/accounts" className="btn btn-primary btn-lg">Buy Account</Link>
            <Link href="/live-challenges" className="btn btn-ghost btn-lg">See Live Round</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
