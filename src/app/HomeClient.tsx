'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PlatformStats, HomeMatch } from '@/types';

/* ── Animated Counter ── */
function Counter({ end, prefix = '', suffix = '', duration = 2000 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

const STEPS = [
  { label: 'Pick a Tier', desc: 'Select an entry amount that fits your goals.' },
  { label: 'Join Challenge', desc: 'Enter the active 3-day prediction window instantly.' },
  { label: 'Daily Prediction', desc: 'Predict exactly 1 live outcome per day, perfectly.' },
  { label: 'Track Real-Time', desc: 'Watch leaderboard rankings shift live as games end.' },
  { label: '10X Reward', desc: 'Complete 3/3 daily predictions to unlock the cash drop.' },
];

export default function HomeClient({ stats }: { stats: PlatformStats }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<HomeMatch | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [matches, setMatches] = useState<HomeMatch[]>([
    { id: 1, day: 'Day 1', match: 'ARS vs CHE', status: 'correct', time: 'Completed', pick: 'ARS' },
    { id: 2, day: 'Day 2', match: 'MCI vs LIV', status: 'open', time: 'Awaiting Pick', pick: null },
    { id: 3, day: 'Day 3', match: 'PSG vs RMA', status: 'locked', time: 'Scheduled', pick: null },
  ]);

  const handlePredictClick = (m: HomeMatch) => {
    setSelectedMatch(m);
    setPrediction(null);
    setIsModalOpen(true);
  };

  const handleSubmitPrediction = () => {
    if (!prediction || !selectedMatch) return;
    setIsSubmitting(true);
    
    setMatches(prev => prev.map(m => {
      if (m.id === selectedMatch.id) {
        return { ...m, status: 'pending', pick: prediction };
      }
      return m;
    }));
    
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  return (
    <div style={{ paddingTop: '80px', position: 'relative' }}>
        
      {/* ──────────────────────── PREDICTION MODAL ──────────────────────── */}
      {isModalOpen && selectedMatch && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div 
            style={{ position: 'absolute', inset: 0, background: 'rgba(3, 5, 8, 0.85)', backdropFilter: 'blur(16px)' }} 
            onClick={() => !isSubmitting && setIsModalOpen(false)} 
          />
          
          <div className="card" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', padding: '40px' }}>
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '100px', background: 'var(--blue-electric)', filter: 'blur(80px)', opacity: 0.3, pointerEvents: 'none' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <span className="badge badge-blue">{selectedMatch.day}</span>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}
                disabled={isSubmitting}
              >×</button>
            </div>
            
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: '1.75rem', fontWeight: 700, color: '#FFF', marginBottom: '8px', textAlign: 'center' }}>
              {selectedMatch.match}
            </h3>
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Select the final outcome of the match.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
              {selectedMatch.match.split(' vs ').map((team, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrediction(team)}
                  style={{
                    padding: '16px 24px', borderRadius: '12px',
                    background: prediction === team ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${prediction === team ? 'var(--blue-electric)' : 'var(--border)'}`,
                    color: prediction === team ? '#FFF' : 'var(--text-secondary)',
                    fontFamily: "var(--font-sans)", fontSize: '1rem', fontWeight: 600,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'all 0.2s ease', cursor: 'pointer'
                  }}
                >
                  <span>{team} Win</span>
                  {prediction === team && <span style={{ color: 'var(--blue-electric)' }}>✓</span>}
                </button>
              ))}
              <button
                onClick={() => setPrediction('Draw')}
                style={{
                  padding: '16px 24px', borderRadius: '12px',
                  background: prediction === 'Draw' ? 'rgba(242, 201, 76, 0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${prediction === 'Draw' ? 'var(--gold)' : 'var(--border)'}`,
                  color: prediction === 'Draw' ? '#FFF' : 'var(--text-secondary)',
                  fontFamily: "var(--font-sans)", fontSize: '1rem', fontWeight: 600,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'all 0.2s ease', cursor: 'pointer'
                }}
              >
                <span>Draw</span>
                {prediction === 'Draw' && <span style={{ color: 'var(--gold)' }}>✓</span>}
              </button>
            </div>
            
            <button 
              className="btn btn-blue w-full" 
              style={{ padding: '16px', opacity: prediction ? 1 : 0.5, pointerEvents: prediction ? 'auto' : 'none' }}
              onClick={handleSubmitPrediction}
              disabled={isSubmitting || !prediction}
            >
              {isSubmitting ? 'Locking Prediction...' : 'Confirm Prediction'}
            </button>
          </div>
        </div>
      )}

      {/* ──────────────────────── HERO ──────────────────────── */}
      <section style={{
        padding: '80px 0 100px',
        background: 'var(--bg-primary)',
        position: 'relative', overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '800px', height: '800px', background: 'var(--grad-aurora)', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.6, pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '40%', right: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,229,255,0.1), transparent 70%)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.8, pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '32px 32px', maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', opacity: 0.5, zIndex: 0 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '64px', alignItems: 'center' }}>
          
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '32px', backdropFilter: 'blur(12px)' }}>
              <div className="live-dot" />
              Round {stats.roundsCompleted + 1} is Now Live
            </div>

            <h1 className="section-title" style={{ fontSize: 'clamp(3.5rem, 6vw, 5rem)', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '24px' }}>
              Precision meets <br />
              <span className="text-gradient-gold">Perfection.</span>
            </h1>

            <p style={{ fontFamily: "var(--font-sans)", fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '40px', maxWidth: '520px', fontWeight: 400 }}>
              The elite 3-day football prediction challenge. Secure your account, predict 1 match daily, complete a perfect 3/3 streak, and instantly unlock the guaranteed 10X cash reward.
            </p>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Link href="/accounts" className="btn btn-primary btn-pulse">
                Join Challenge
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/how-it-works" className="btn btn-ghost">
                How it Works
              </Link>
            </div>
            
            <div style={{ marginTop: '56px', display: 'flex', gap: '32px', alignItems: 'center' }}>
              <div style={{ display: 'flex' }}>
                {['M','A','C','J'].map((l, i) => (
                  <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #1E283C, #0A0E17)', border: '2px solid var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, marginLeft: i > 0 ? '-12px' : 0, boxShadow: '0 4px 12px rgba(0,0,0,0.4)', fontFamily: "var(--font-display)" }}>{l}</div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: '4px', color: 'var(--gold)', marginBottom: '4px' }}>
                  ★ ★ ★ ★ ★
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{stats.activeChallengers.toLocaleString()}</strong> Active Challengers
                </div>
              </div>
            </div>
          </div>

          {/* Right Simulation */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '10%', right: '0%', width: '100%', height: '80%', background: 'var(--grad-aurora)', filter: 'blur(90px)', zIndex: 0, opacity: 0.7 }} />
            
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚽</div>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: '1.125rem', fontWeight: 700 }}>Live Prediction</span>
                  </div>
                  <span className="badge badge-blue">Round {stats.roundsCompleted + 1}</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                  {matches.map((m, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px', borderRadius: '16px',
                      background: m.status === 'open' ? 'rgba(0,229,255,0.06)' : m.status === 'pending' ? 'rgba(242,201,76,0.06)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${m.status === 'correct' ? 'rgba(0,230,118,0.3)' : m.status === 'open' ? 'rgba(0,229,255,0.4)' : m.status === 'pending' ? 'rgba(242,201,76,0.4)' : 'rgba(255,255,255,0.05)'}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span className={`badge ${m.status === 'correct' ? 'badge-success' : m.status === 'open' ? 'badge-blue' : m.status === 'pending' ? 'badge-gold' : 'badge-muted'}`} style={{ padding: '4px 8px', fontSize: '0.625rem' }}>{m.day}</span>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: '1rem', fontWeight: 600, color: m.status === 'locked' ? 'var(--text-muted)' : '#FFF' }}>{m.match}</span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                        {m.status === 'correct' && <span style={{ color: 'var(--success)' }}>✓ Verified</span>}
                        {m.status === 'open' && (
                          <button 
                            onClick={() => handlePredictClick(m)}
                            style={{ background: 'var(--blue-electric)', color: '#000', padding: '6px 16px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Predict
                          </button>
                        )}
                        {m.status === 'pending' && <span style={{ color: 'var(--gold)' }}>Picked: {m.pick}</span>}
                        {m.status === 'locked' && <span style={{ color: 'var(--text-muted)' }}>Locked</span>}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    <span>Streak Progress</span>
                    <span style={{ color: 'var(--gold)' }}>1 / 3 Complete</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: '33%', height: '100%', background: 'var(--grad-gold)', borderRadius: '999px' }} />
                  </div>
                </div>
              </div>

              <div style={{
                position: 'absolute', bottom: '-20px', right: '-20px',
                background: 'linear-gradient(135deg, rgba(20,26,38,0.9), rgba(5,10,15,0.95))',
                border: '1px solid var(--border-gold)', borderRadius: '24px', padding: '24px',
                backdropFilter: 'blur(32px)', boxShadow: 'var(--shadow-lg), 0 0 40px rgba(242,201,76,0.15)',
                display: 'flex', alignItems: 'center', gap: '20px'
              }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(242,201,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>💰</div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Reward Multiplier</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: '1.75rem', fontWeight: 800, color: '#FFF', lineHeight: 1 }}>10X Unlock</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────── TRUST METRICS ──────────────────────── */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '32px' }}>
            {[
              { label: 'Active Challengers', value: stats.activeChallengers, suffix: '' },
              { label: 'Rounds Completed', value: stats.roundsCompleted, suffix: '' },
              { label: 'Perfect Streaks', value: stats.perfectStreaks, suffix: '' },
              { label: 'Cash Paid Out', prefix: '₦', value: stats.totalCashPaid, suffix: '' },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: '2.5rem', fontWeight: 800, color: '#FFF' }}>
                  <Counter end={m.value} prefix={m.prefix} suffix={m.suffix} duration={2000 + i * 200} />
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────── THE PROTOCOL ──────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '80px' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>How It Works</div>
            <h2 className="section-title" style={{ margin: '0 auto', maxWidth: '700px' }}>A clear path to reward.</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>Select your tier, predict precisely, and hit a 3/3 streak.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px' }}>
            {STEPS.map((step, i) => (
              <div key={i} className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', margin: '0 auto 20px', borderRadius: '12px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-mono)", fontSize: '1rem', fontWeight: 700, color: 'var(--blue-electric)', border: '1px solid rgba(0,229,255,0.2)' }}>
                  0{i + 1}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: '1.25rem', fontWeight: 700, color: '#FFF', marginBottom: '12px' }}>{step.label}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────── FINAL CTA ──────────────────────── */}
      <section className="section text-center" style={{ padding: '160px 0' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '500px', background: 'var(--grad-aurora)', opacity: 0.3, filter: 'blur(120px)', zIndex: 0, pointerEvents: 'none' }} />
        
        <div className="container relative">
          <div className="section-label" style={{ justifyContent: 'center' }}>Take Control</div>
          <h2 className="section-title" style={{ fontSize: 'clamp(3.5rem, 6vw, 4.5rem)', marginBottom: '32px' }}>Build your <span className="text-gradient-gold">Streak.</span></h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
            <Link href="/accounts" className="btn btn-primary btn-pulse">Get Started Now</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
