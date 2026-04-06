'use client';

import { useState, useTransition, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Gem,
  Shield,
  Star,
  Check,
  Users,
  Trophy,
  Activity,
  Wallet,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { initializePayment } from '@/app/actions/paystack';
import { purchaseTierWithWallet } from '@/app/actions/wallet';
import { AccountTier } from '@/types';

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface TierFeature {
  label: string;
}

interface DisplayTier {
  id: string;
  name: string;
  price: string;
  reward: string;
  multiplier: string;
  badge: string | null;
  featured: boolean;
  features: TierFeature[];
  cta: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
}

interface AccountsClientProps {
  tiers: AccountTier[];
  userId?: string;
  walletBalance?: number;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getTierIcon(name: string) {
  switch (name) {
    case 'Premium': return <Gem style={{ width: 18, height: 18, color: 'var(--gold)' }} />;
    case 'Standard': return <Star style={{ width: 18, height: 18, color: 'var(--blue-electric)' }} />;
    default: return <Shield style={{ width: 18, height: 18, color: 'var(--text-muted)' }} />;
  }
}

function buildDisplayTiers(tiers: AccountTier[]): DisplayTier[] {
  return tiers.map(t => {
    const isStandard = t.name === 'Standard';
    const isPremium  = t.name === 'Premium';
    return {
      id: t.id,
      name: t.name,
      price: `₦${t.price_ngn.toLocaleString()}`,
      reward: t.perks?.reward || '₦0',
      multiplier: '10X',
      badge: isStandard ? 'MOST POPULAR' : isPremium ? 'ELITE STATUS' : null,
      featured: isStandard,
      accentColor: isStandard ? 'var(--blue-electric)' : isPremium ? 'var(--gold)' : 'var(--text-muted)',
      accentBg: isStandard ? 'rgba(0,229,255,0.06)' : isPremium ? 'rgba(242,201,76,0.04)' : 'rgba(255,255,255,0.015)',
      accentBorder: isStandard ? 'rgba(0,229,255,0.25)' : isPremium ? 'rgba(242,201,76,0.25)' : 'rgba(255,255,255,0.07)',
      features: [
        { label: '3-Day Challenge Round Access' },
        { label: '1 Live Prediction Per Day' },
        { label: `${t.perks?.predictions_per_round ?? 3} Predictions Per Round` },
        { label: 'Full Leaderboard Access' },
        { label: `₦${(t.perks?.referral_bonus ?? 1000).toLocaleString()} Per Referral` },
        { label: 'Verified Winner Badge' },
        { label: 'Challenge History Tracking' },
        ...(t.perks?.priority ? [{ label: 'Priority Winner Verification' }] : []),
        ...(isPremium ? [
          { label: 'Elite Dashboard Profile' },
          { label: 'Premium Winner Spotlight' },
          { label: 'Elite Rank Badge' },
        ] : []),
      ],
      cta: isPremium ? 'INITIALIZE PREMIUM' : isStandard ? 'SELECT STANDARD' : 'GET STARTED',
    };
  });
}

// ─── TIER CARD ────────────────────────────────────────────────────────────────
// NOTE: ALL spacing uses inline `style` to avoid conflict between the codebase's
// custom px-based class names (globals.css) and Tailwind's 4px-scale utilities.
interface TierCardProps {
  tier: AccountTier;
  displayTier: DisplayTier;
  isPending: boolean;
  onPurchase: (id: string, method: 'wallet' | 'paystack') => void;
  isLoggedIn: boolean;
  walletBalance: number;
}

function TierCard({ tier, displayTier, isPending, onPurchase, isLoggedIn, walletBalance }: TierCardProps) {
  const isWalletEnough = walletBalance >= tier.price_ngn;

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    padding: 24,
    borderRadius: 16,
    border: `1px solid ${displayTier.accentBorder}`,
    background: displayTier.accentBg,
    flexShrink: 0,
    width: 280,
    cursor: 'default',
    boxShadow: displayTier.featured ? `0 24px 60px rgba(0,229,255,0.06)` : '0 8px 32px rgba(0,0,0,0.4)',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: '4px 10px',
    borderRadius: 6,
    fontSize: '0.6rem',
    fontWeight: 900,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: displayTier.accentColor,
    background: `${displayTier.accentColor}15`,
    border: `1px solid ${displayTier.accentBorder}`,
  };

  return (
    <motion.div
      style={cardStyle}
      whileHover={{ y: -6, borderColor: displayTier.accentColor }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      {/* Badge */}
      {displayTier.badge && <span style={badgeStyle}>{displayTier.badge}</span>}

      {/* Header: Icon + name + price */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            padding: 8,
            borderRadius: 8,
            background: `${displayTier.accentColor}12`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {getTierIcon(displayTier.name)}
          </div>
          <span style={{
            fontSize: '0.6rem',
            fontWeight: 900,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
          }}>
            {displayTier.name} Logic
          </span>
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 900,
          color: '#fff',
          letterSpacing: '-0.03em',
          fontStyle: 'italic',
          lineHeight: 1,
        }}>
          {displayTier.price}
        </div>
      </div>

      {/* Yield box */}
      <div style={{
        padding: '12px 14px',
        borderRadius: 10,
        background: 'rgba(0,0,0,0.35)',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Guaranteed Yield
          </span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '2px 8px', borderRadius: 99,
            background: 'rgba(0,230,118,0.09)',
            border: '1px solid rgba(0,230,118,0.2)',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)' }} />
            <span style={{ fontSize: '0.55rem', fontWeight: 900, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {displayTier.multiplier}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>
            {displayTier.reward}
          </span>
          <Trophy style={{ width: 14, height: 14, color: 'var(--gold)', opacity: 0.4 }} />
        </div>
      </div>

      {/* Feature list */}
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {displayTier.features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Check style={{ width: 11, height: 11, color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'rgba(160,171,192,0.8)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              lineHeight: 1.4,
            }}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      {/* Action area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {!isLoggedIn ? (
          <button
            onClick={() => onPurchase(tier.id, 'paystack')}
            className="btn btn-blue"
            style={{ width: '100%', padding: '11px 16px', fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', justifyContent: 'center' }}
          >
            SIGN IN TO BUY
          </button>
        ) : (
          <>
            {!isWalletEnough && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 12, padding: '10px', background: 'rgba(255,23,68,0.05)', border: '1px solid rgba(255,23,68,0.1)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertCircle style={{ width: 12, height: 12, color: 'var(--danger)' }} />
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--danger)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Insufficient Balance
                  </span>
                </div>
                <Link 
                  href="/dashboard?tab=wallet" 
                  style={{ fontSize: '0.55rem', fontWeight: 900, color: 'var(--blue-electric)', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Top up in Wallet Hub
                </Link>
              </div>
            )}
            <button
              disabled={isPending || !isWalletEnough}
              onClick={() => onPurchase(tier.id, 'wallet')}
              className={displayTier.featured ? 'btn btn-blue' : 'btn btn-outline'}
              style={{
                width: '100%',
                padding: '11px 16px',
                fontSize: '0.6rem',
                fontWeight: 900,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                justifyContent: 'center',
                gap: 6,
                opacity: isWalletEnough ? 1 : 0.4,
              }}
            >
              {isPending ? <Activity className="animate-spin w-3 h-3" /> : (
                <>
                  <Wallet style={{ width: 12, height: 12 }} />
                  PAY WITH WALLET
                </>
              )}
            </button>
            <div style={{ position: 'relative', height: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ height: 1, width: '100%', background: 'rgba(255,255,255,0.05)' }} />
               <span style={{ position: 'absolute', padding: '0 8px', background: displayTier.accentBg, fontSize: '8px', color: 'rgba(255,255,255,0.15)', fontWeight: 900 }}>OR</span>
            </div>
            <button
              disabled={isPending}
              onClick={() => onPurchase(tier.id, 'paystack')}
              className="btn btn-ghost"
              style={{
                width: '100%',
                padding: '11px 16px',
                fontSize: '0.6rem',
                fontWeight: 900,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                justifyContent: 'center',
                gap: 6,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {isPending ? <Activity className="animate-spin w-3 h-3" /> : (
                <>
                  <Activity style={{ width: 12, height: 12, color: 'var(--success)' }} />
                  INSTANT PAYSTACK
                </>
              )}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── TIER CAROUSEL ────────────────────────────────────────────────────────────
interface TierCarouselProps {
  tiers: AccountTier[];
  displayTiers: DisplayTier[];
  isPending: boolean;
  onPurchase: (id: string, method: 'wallet' | 'paystack') => void;
  isLoggedIn: boolean;
  walletBalance: number;
}

function TierCarousel({ tiers, displayTiers, isPending, onPurchase, isLoggedIn, walletBalance }: TierCarouselProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);

  if (tiers.length === 0) {
    return (
      <div className="card" style={{ padding: 64, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, borderStyle: 'dashed' }}>
        <Activity style={{ width: 40, height: 40, color: 'var(--text-muted)', opacity: 0.2 }} className="animate-pulse" />
        <p style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Synchronizing Governance Nodes...
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Left & right fade masks */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 48, zIndex: 10,
        pointerEvents: 'none',
        background: 'linear-gradient(to right, #030508 0%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 48, zIndex: 10,
        pointerEvents: 'none',
        background: 'linear-gradient(to left, #030508 0%, transparent 100%)',
      }} />

      {/* Overflow track */}
      <div
        ref={constraintsRef}
        className="no-scrollbar"
        style={{ overflowX: 'auto', overflowY: 'hidden', cursor: 'grab' }}
      >
        <motion.div
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.06}
          dragMomentum
          whileDrag={{ cursor: 'grabbing' }}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          style={{
            display: 'flex',
            gap: 20,
            padding: '8px 60px 32px',
            width: 'max-content',
            userSelect: 'none',
          }}
        >
          {displayTiers.map((displayTier, idx) => (
            <TierCard
              key={displayTier.id}
              tier={tiers[idx]}
              displayTier={displayTier}
              isPending={isPending}
              onPurchase={onPurchase}
              isLoggedIn={isLoggedIn}
              walletBalance={walletBalance}
            />
          ))}
        </motion.div>
      </div>

      {/* Slide indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, marginTop: 20 }}>
        <div style={{ height: 1, width: 40, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', width: '50%', background: 'rgba(242,201,76,0.5)', borderRadius: 99 }}
            animate={{ x: ['0%', '200%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <span style={{ fontSize: '0.55rem', fontWeight: 900, color: 'rgba(160,171,192,0.35)', textTransform: 'uppercase', letterSpacing: '0.35em' }}>
          Drag to explore
        </span>
        <div style={{ height: 1, width: 40, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', width: '50%', background: 'rgba(242,201,76,0.5)', borderRadius: 99 }}
            animate={{ x: ['0%', '200%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 1.25 }}
          />
        </div>
      </div>

      {/* Dot nav */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
        {displayTiers.map((t) => (
          <div key={t.id} style={{
            height: 3,
            width: t.featured ? 20 : 6,
            borderRadius: 99,
            background: t.featured ? t.accentColor : 'rgba(255,255,255,0.15)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── MAIN CLIENT ─────────────────────────────────────────────────────────────
export default function AccountsClient({ tiers, userId, walletBalance = 0 }: AccountsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const displayTiers = buildDisplayTiers(tiers);

  const handlePurchase = async (tierId: string, method: 'wallet' | 'paystack') => {
    if (!userId) {
      router.push(`/login?returnTo=/accounts`);
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        if (method === 'wallet') {
          await purchaseTierWithWallet(tierId);
          router.push('/dashboard?success=Tier+purchased+successfully+from+wallet');
        } else {
          const result = await initializePayment(tierId);
          if (result.authorization_url) {
            window.location.href = result.authorization_url;
          }
        }
      } catch (err: unknown) {
        const e = err as Error;
        setError(e.message || 'Transaction failed. Connectivity interrupted.');
      }
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 80, display: 'flex', flexDirection: 'column' }} className="animate-fade-in">

      {/* ─── HERO ─── */}
      <section style={{ position: 'relative', padding: '48px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#0D1321', opacity: 0.5 }} />
        <div style={{
          position: 'absolute', inset: '0 0 auto 0', height: 200, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, transparent 70%)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 600, margin: '0 auto', gap: 16 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', background: 'rgba(242,201,76,0.08)',
              border: '1px solid rgba(242,201,76,0.2)', borderRadius: 99,
            }}>
              <ShieldCheck style={{ width: 12, height: 12, color: 'var(--gold)' }} />
              <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                Verified Membership Node
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              margin: 0,
            }}>
              Scale Your <span className="text-gradient-gold">Capital Reach</span>
            </h1>

            <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', maxWidth: 440, lineHeight: 1.7, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.8 }}>
              Initialize your operational tier to unlock the 10X reward sequence.
              All accounts are backed by our automated payout protocol.
            </p>

            {error && (
              <div className="animate-slide-up" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 16px', borderRadius: 10,
                background: 'rgba(255,23,68,0.08)', border: '1px solid rgba(255,23,68,0.25)',
                color: 'var(--danger)',
              }}>
                <AlertCircle style={{ width: 13, height: 13 }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{error}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={{ padding: '56px 0', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
        <TierCarousel 
          tiers={tiers} 
          displayTiers={displayTiers}
          isPending={isPending} 
          onPurchase={handlePurchase} 
          isLoggedIn={!!userId}
          walletBalance={walletBalance}
        />
      </section>

      {/* ─── INFRASTRUCTURE STATS ─── */}
      <section style={{ padding: '48px 0', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.005)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontWeight: 900,
            color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 36,
          }}>
            Verified Network Statistics
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {[
              { label: 'Network Cycles',     val: '142+',   icon: <Activity style={{ width: 13, height: 13 }} /> },
              { label: 'Active Nodes',       val: '1.2K',   icon: <Users    style={{ width: 13, height: 13 }} /> },
              { label: 'Security Queue',     val: '4.8K',   icon: <Shield   style={{ width: 13, height: 13 }} /> },
              { label: 'Value Disseminated', val: '₦5.2M', icon: <Wallet   style={{ width: 13, height: 13 }} /> },
            ].map((s, i) => (
              <div key={i} className="card" style={{
                padding: '20px 16px', background: 'rgba(255,255,255,0.015)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                transition: 'background 0.2s',
              }}>
                <div style={{ padding: 7, background: 'rgba(0,229,255,0.08)', borderRadius: 8, color: 'var(--blue-electric)' }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', fontStyle: 'italic' }}>{s.val}</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="animate-slide-up" style={{ marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.6rem', fontWeight: 900, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
              <ShieldCheck style={{ width: 12, height: 12 }} />
              Infrastructure Powered by PredChain Secure Nodes
            </div>
            <p style={{ fontSize: '0.6rem', fontWeight: 500, color: 'rgba(160,171,192,0.5)', maxWidth: 500, lineHeight: 1.8, textTransform: 'uppercase', letterSpacing: '0.1em', fontStyle: 'italic' }}>
              PredChain employs high-frequency settlement algorithms to ensure liquidity disseminates
              instantly across our verified challenger network. Tier connections are encrypted and
              finalized via the Paystack gateway.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
