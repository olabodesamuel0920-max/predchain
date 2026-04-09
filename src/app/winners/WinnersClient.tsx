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
      <section style={{
        padding: '72px 0 56px',
        background: 'linear-gradient(180deg, #0D1321 0%, #070B14 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-80px', right: '10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} aria-hidden="true" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px' }}>
            <div>
              <div className="section-label">Verified Winners</div>
              <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '12px' }}>
                Real Challengers.<br />
                <span style={{
                  background: 'linear-gradient(135deg, #D4AF37, #F6D365)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Verified Rewards.</span>
              </h1>
              <p className="section-subtitle">
                Every winner listed here completed a perfect 3/3 streak, passed anti-fraud verification, and received their confirmed cash reward payout.
              </p>
            </div>
            <div style={{
              padding: '32px 40px',
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.25)',
              borderRadius: '20px',
              textAlign: 'center',
              flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.8125rem', color: '#6E7A91', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Total Cash Paid
              </div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '2.5rem', fontWeight: 900,
                background: 'linear-gradient(135deg, #D4AF37, #F6D365)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                letterSpacing: '-0.03em',
              }}>₦{totalPaid.toLocaleString()}</div>
              <div style={{ fontSize: '0.8125rem', color: '#6E7A91', marginTop: '8px' }}>Across all rounds</div>
            </div>
          </div>
        </div>
      </section>

      {/* Winners grid */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#F8FAFC' }}>
              Recent Verified Winners
            </h2>
            <span className="badge badge-success"><div className="live-dot" /> Updated Live</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {winners.length === 0 ? (
               <div className="card text-center" style={{ padding: '48px', gridColumn: '1/-1' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>Gathering winner data for the current season...</p>
               </div>
            ) : (
                winners.map((w) => {
                  const name = w.profile?.username || w.profile?.full_name || 'Challenger';
                  const initial = name.charAt(0).toUpperCase();
                  const tier = 'Starter'; // Defaulting for UI display
                  
                  return (
                    <div key={w.id} style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '20px',
                      padding: '24px',
                      boxShadow: 'var(--shadow-card)',
                      display: 'flex', flexDirection: 'column', gap: '16px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                          background: `linear-gradient(135deg, ${tierColors[tier]}20, rgba(0,194,255,0.1))`,
                          border: `1px solid ${tierColors[tier]}30`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: '1.25rem', fontWeight: 800,
                          color: tierColors[tier],
                        }}>{initial}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>{name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6E7A91', marginTop: '2px' }}>
                            <span style={{ color: tierColors[tier], fontWeight: 600 }}>Verified Challenger</span>
                          </div>
                        </div>
                        <span className="badge badge-success">✓ Verified</span>
                      </div>

                      <div style={{
                        padding: '16px',
                        background: 'rgba(212,175,55,0.06)',
                        border: '1px solid rgba(212,175,55,0.15)',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6E7A91', marginBottom: '4px' }}>Cash Reward Unlocked</div>
                          <div style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: '1.625rem', fontWeight: 800,
                            background: 'linear-gradient(135deg, #D4AF37, #F6D365)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            letterSpacing: '-0.02em',
                          }}>₦{w.payout_amount.toLocaleString()}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.75rem', color: '#6E7A91', marginBottom: '4px' }}>Perfect Streak</div>
                          <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#22C55E' }}>3/3 ✓</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#6E7A91' }}>
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
