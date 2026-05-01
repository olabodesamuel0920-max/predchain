'use client';

import { useState } from 'react';
import Link from 'next/link';
import { submitSupportTicket } from '@/app/actions/support';

const HELP_CATEGORIES = [
  { icon: '⚽', label: 'Challenge Rules', desc: 'Questions about predictions, rounds, and streak rules.' },
  { icon: '💰', label: 'Cash Rewards', desc: 'How rewards are unlocked, verified, and paid.' },
  { icon: '👥', label: 'Referral Program', desc: 'How referrals work and how to earn bonuses.' },
  { icon: '💳', label: 'Account & Billing', desc: 'Account tiers, purchases, and account access.' },
  { icon: '🏆', label: 'Leaderboard & Rankings', desc: 'How rankings are determined and updated.' },
  { icon: '🔒', label: 'Security & Fraud', desc: 'Anti-fraud policy, verification, and fair play.' },
];

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await submitSupportTicket({
      subject: form.subject,
      message: `${form.message}\n\nFrom: ${form.name} (${form.email})`
    });

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div style={{ paddingTop: '60px' }}>
      {/* Hero - Compact & Premium */}
      <section style={{
        padding: '56px 0 40px',
        background: 'rgba(3, 5, 8, 0.4)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'relative', overflow: 'hidden',
        backdropFilter: 'blur(32px)'
      }}>
        <div style={{
          position: 'absolute', top: '-120px', right: '5%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} aria-hidden="true" />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 420px', gap: '64px', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--blue-electric)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>Global Network Support</div>
              <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                Support Center
              </h1>
              <p className="text-secondary" style={{ fontSize: '1rem', marginBottom: '32px', maxWidth: '480px', lineHeight: 1.6 }}>
                Technical inquiries, account recovery, and platform verification. Our specialists are on standby.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Priority Email</div>
                  <div style={{ fontWeight: 800, color: '#FFF', fontSize: '13px' }}>hq@predchain.io</div>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Response Time</div>
                  <div style={{ fontWeight: 800, color: 'var(--success)', fontSize: '13px' }}>&lt; 24 Hours</div>
                </div>
              </div>
            </div>

            {/* Contact Form - Professional Card */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px', padding: '32px',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(16px)'
            }}>
              {!submitted ? (
                <>
                  <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', marginBottom: '24px', letterSpacing: '-0.01em' }}>Submit Ticket</h2>
                  {error && <div style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '0.75rem', fontWeight: 700 }}>{error}</div>}
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Identity</label>
                        <input
                          type="text"
                          className="w-full bg-white/5 border border-white/10 p-12 rounded-lg text-white outline-none focus:border-blue-electric text-sm"
                          placeholder="Full Name"
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Direct Email</label>
                        <input
                          type="email"
                          className="w-full bg-white/5 border border-white/10 p-12 rounded-lg text-white outline-none focus:border-blue-electric text-sm"
                          placeholder="you@email.com"
                          value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Subject Header</label>
                      <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 p-12 rounded-lg text-white outline-none focus:border-blue-electric text-sm"
                        placeholder="Inquiry Subject"
                        value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Statement / Issue</label>
                      <textarea
                        className="w-full bg-white/5 border border-white/10 p-12 rounded-lg text-white outline-none focus:border-blue-electric text-sm"
                        placeholder="Detailed description..."
                        rows={4}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        required
                        style={{ resize: 'none' }}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm w-full" disabled={loading} style={{ padding: '14px', marginTop: '8px' }}>
                      {loading ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0, 230, 118, 0.1)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '24px' }}>✓</div>
                  <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>Message Received</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    We've received your inquiry and will contact you at <strong>{form.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="btn btn-ghost btn-sm w-full"
                  >Submit Another Ticket</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Help topics - Dense Cloud */}
      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {HELP_CATEGORIES.map((cat, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '20px',
                padding: '20px 24px',
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.015)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem',
                }}>{cat.icon}</div>
                <div>
                  <h3 className="font-display" style={{ fontSize: '0.875rem', fontWeight: 800, color: '#FFF', marginBottom: '2px' }}>
                    {cat.label}
                  </h3>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
