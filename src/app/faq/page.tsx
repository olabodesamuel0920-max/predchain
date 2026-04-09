'use client';

import { useState } from 'react';
import Link from 'next/link';

const FAQ_SECTIONS = [
  {
    category: 'Platform Basics',
    items: [
      {
        q: 'What is PredChain?',
        a: 'PredChain is a premium performance-based football prediction challenge platform. You buy an account, enter a 3-day live challenge round, predict 1 live football match per day for 3 consecutive days, and unlock a 10X cash reward with a perfect 3/3 streak.',
      },
      {
        q: 'Is this a betting or gambling platform?',
        a: 'No. PredChain is a performance challenge platform — not a betting site, sportsbook, or casino. You are not wagering against an opponent or placing bets. You are purchasing a challenge account to compete in a structured prediction round against verified live match outcomes.',
      },
      {
        q: 'Who can participate?',
        a: 'Anyone who purchases a valid PredChain account can participate. Accounts are personal, non-transferable, and subject to identity verification at the point of cash reward payout.',
      },
    ],
  },
  {
    category: 'Challenge Rules',
    items: [
      {
        q: 'How does the 3-day challenge work?',
        a: 'Each challenge round runs for 3 consecutive days. One live football match opens for prediction each day. You must predict the outcome (Home Win, Draw, or Away Win) before the match kicks off. All 3 predictions must be correct in the same round to qualify for the cash reward.',
      },
      {
        q: 'How many predictions are in each round?',
        a: 'Exactly 3 — one per day for 3 days. Day 1, Day 2, and Day 3 each feature one live match. All 3 must be predicted correctly in sequence.',
      },
      {
        q: 'What happens if I miss one prediction?',
        a: 'If you fail to submit a prediction before the match kicks off, your streak is broken. A missed prediction counts as an automatic failure for that round. You must wait for the next round to re-enter.',
      },
      {
        q: 'What happens if I get one prediction wrong?',
        a: 'Your streak ends immediately. You do not qualify for the cash reward in that round. You can re-purchase an account and enter the next challenge round.',
      },
      {
        q: 'Can I change my prediction after submitting?',
        a: 'No. Once submitted, predictions are locked and cannot be changed. Predictions also lock automatically when the match kicks off, regardless of submission.',
      },
    ],
  },
  {
    category: 'Cash Rewards',
    items: [
      {
        q: 'How does the 10X cash reward work?',
        a: 'Each account tier has a fixed 10X reward multiplier applied to the entry price: Starter (₦5,000 → ₦50,000), Standard (₦10,000 → ₦100,000), Premium (₦20,000 → ₦200,000). Completing a perfect 3/3 streak in a single round unlocks your tier\'s reward.',
      },
      {
        q: 'When is the cash reward paid?',
        a: 'After completing a perfect 3/3 streak, your result is submitted for admin review and verification. Verified rewards are typically processed within 24–48 hours. All verified winners are displayed publicly on the Winners page.',
      },
      {
        q: 'Is the reward guaranteed?',
        a: 'The reward is guaranteed upon completion of a verified perfect 3/3 streak. It is not guaranteed for incomplete, failed, or fraudulent attempts. Anti-fraud verification is required before any payout.',
      },
    ],
  },
  {
    category: 'Referrals',
    items: [
      {
        q: 'How does the referral program work?',
        a: 'You earn ₦1,000 for every friend who purchases a PredChain account using your unique referral code or link. There is no cap on referrals. Earnings are deposited instantly to your wallet upon confirmed purchase.',
      },
      {
        q: 'How do I get my referral code?',
        a: 'Your referral code and link are automatically generated once you purchase an account. You can find them on your dashboard under the Referrals tab.',
      },
      {
        q: 'Can I earn referral bonuses without completing a streak?',
        a: 'Yes. Referral earnings are independent of your challenge performance. You earn ₦1,000 per successful referral regardless of your streak status.',
      },
    ],
  },
  {
    category: 'Account & Verification',
    items: [
      {
        q: 'How are winners verified?',
        a: 'Every winning streak is reviewed by the PredChain anti-fraud and moderation team. This includes checking for duplicate accounts, IP consistency, and identity confirmation. Only verified winners receive cash rewards.',
      },
      {
        q: 'Can I have multiple accounts?',
        a: 'No. Multiple accounts are strictly prohibited and result in permanent disqualification. Our system performs automated duplicate detection and manual review for all cash reward claims.',
      },
      {
        q: 'How are rankings determined?',
        a: 'Leaderboard rankings are based on total verified wins, cash rewards unlocked, current streak status, and referral performance — weighted in that order.',
      },
      {
        q: 'When do live challenge rounds start?',
        a: 'New rounds begin as soon as the previous round concludes. There is always an active round running. When you purchase your account, you are automatically enrolled in the current or next round.',
      },
    ],
  },
  {
    category: 'Support',
    items: [
      {
        q: 'How do I get support?',
        a: 'You can reach our support team via the Contact page, by emailing support@predchain.io, or through our live chat (when available). We aim to respond within 24 hours.',
      },
      {
        q: 'What if I believe there was an error in my result?',
        a: 'Contact support within 24 hours of the match result with your account details and the disputed prediction. Our team will review the result against the official match record.',
      },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`accordion-item ${open ? 'open' : ''}`}>
      <button
        className="accordion-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {q}
        <svg className="accordion-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="accordion-content">{a}</div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('Platform Basics');

  return (
    <div style={{ paddingTop: '80px' }}>

      {/* Hero */}
      <section style={{
        padding: '72px 0 56px',
        background: 'linear-gradient(180deg, #0D1321 0%, #070B14 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,194,255,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} aria-hidden="true" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Help Center</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', margin: '0 auto 16px' }}>
            Frequently Asked Questions
          </h1>
          <p className="section-subtitle" style={{ margin: '0 auto 32px' }}>
            Everything you need to know about the platform, challenge rules, cash rewards, and referral program.
          </p>
          <Link href="/contact" className="btn btn-ghost">Still have questions? Contact Support →</Link>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '48px', alignItems: 'start' }}>

            {/* Category nav */}
            <div style={{
              position: 'sticky', top: '100px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px', padding: '8px',
            }}>
              {FAQ_SECTIONS.map((section) => (
                <button
                  key={section.category}
                  onClick={() => setActiveCategory(section.category)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '12px 16px', borderRadius: '10px',
                    fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                    background: activeCategory === section.category ? 'rgba(0,194,255,0.1)' : 'transparent',
                    color: activeCategory === section.category ? '#00C2FF' : '#6E7A91',
                    border: activeCategory === section.category ? '1px solid rgba(0,194,255,0.2)' : '1px solid transparent',
                    transition: 'all 0.2s ease', marginBottom: '4px',
                  }}
                >
                  {section.category}
                </button>
              ))}
            </div>

            {/* Accordion content */}
            <div>
              {FAQ_SECTIONS
                .filter(s => s.category === activeCategory)
                .map((section) => (
                  <div key={section.category}>
                    <h2 style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '1.375rem', fontWeight: 700,
                      color: '#F8FAFC', marginBottom: '24px',
                    }}>{section.category}</h2>
                    {section.items.map((item, i) => (
                      <AccordionItem key={i} q={item.q} a={item.a} />
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still need help */}
      <section className="section-sm" style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '12px' }}>
            Still Have Questions?
          </h2>
          <p style={{ color: '#A7B0C0', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
            Our support team is ready to help. Reach out and we&apos;ll respond within 24 hours.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary">Contact Support</Link>
            <Link href="/accounts" className="btn btn-ghost">Buy Account</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
