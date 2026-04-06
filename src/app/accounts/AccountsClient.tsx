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
import { AccountTier, PlatformStats } from '@/types';

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
  stats: PlatformStats;
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
      badge: isStandard ? 'POPULAR' : isPremium ? 'ELITE' : null,
      featured: isStandard,
      accentColor: isStandard ? 'var(--blue-electric)' : isPremium ? 'var(--gold)' : 'var(--text-muted)',
      accentBg: isStandard ? 'rgba(0,229,255,0.06)' : isPremium ? 'rgba(242,201,76,0.04)' : 'rgba(255,255,255,0.015)',
      accentBorder: isStandard ? 'rgba(0,229,255,0.25)' : isPremium ? 'rgba(242,201,76,0.25)' : 'rgba(255,255,255,0.07)',
      features: [
        { label: '3-Day Challenge Access' },
        { label: '1 Prediction Per Day' },
        { label: `${t.perks?.predictions_per_round ?? 3} Predictions Per Round` },
        { label: 'Leaderboard Access' },
        { label: `₦${(t.perks?.referral_bonus ?? 1000).toLocaleString()} Referral Bonus` },
        { label: 'Verified Member Badge' },
        { label: 'History Tracking' },
        ...(t.perks?.priority ? [{ label: 'Priority Verification' }] : []),
        ...(isPremium ? [
          { label: 'Premium Profile' },
          { label: 'Winner Spotlight' },
          { label: 'Elite Rank Badge' },
        ] : []),
      ],
      cta: isPremium ? 'BUY PREMIUM' : isStandard ? 'BUY STANDARD' : 'GET STARTED',
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
    gap: 16,
    padding: 20,
    borderRadius: 12,
    border: `1px solid ${displayTier.accentBorder}`,
    background: displayTier.accentBg,
    flexShrink: 0,
    width: 260,
    cursor: 'default',
    boxShadow: displayTier.featured ? `0 12px 40px rgba(0,229,255,0.04)` : '0 4px 24px rgba(0,0,0,0.4)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: '3px 8px',
    borderRadius: 4,
    fontSize: '0.55rem',
    fontWeight: 900,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: displayTier.accentColor,
    background: `${displayTier.accentColor}12`,
    border: `1px solid ${displayTier.accentBorder}`,
  };

  return (
    <motion.div
      style={cardStyle}
      whileHover={{ y: -4, borderColor: `${displayTier.accentColor}50` }}
    >
      {/* Badge */}
      {displayTier.badge && <span style={badgeStyle}>{displayTier.badge}</span>}

      {/* Header: Icon + name + price */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            padding: 6,
            borderRadius: 6,
            background: `${displayTier.accentColor}10`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {getTierIcon(displayTier.name)}
          </div>
          <span style={{
            fontSize: '0.55rem',
            fontWeight: 900,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            opacity: 0.6
          }}>
            {displayTier.name} Plan
          </span>
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.75rem',
          fontWeight: 900,
          color: '#fff',
          letterSpacing: '-0.02em',
          fontStyle: 'italic',
          lineHeight: 1,
        }}>
          {displayTier.price}
        </div>
      </div>

      {/* Yield box */}
      <div style={{
        padding: '10px 12px',
        borderRadius: 8,
        background: 'rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.55rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>
            Total Reward
          </span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '2px 6px', borderRadius: 4,
            background: 'rgba(0,230,118,0.06)',
            border: '1px solid rgba(0,230,118,0.15)',
          }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--success)' }} />
            <span style={{ fontSize: '0.5rem', fontWeight: 900, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {displayTier.multiplier}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 900, color: '#fff' }}>
            {displayTier.reward}
          </span>
          <Trophy style={{ width: 12, height: 12, color: 'var(--gold)', opacity: 0.3 }} />
        </div>
      </div>

      {/* Feature list */}
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {displayTier.features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <Check style={{ width: 10, height: 10, color: 'var(--success)', flexShrink: 0, marginTop: 2, opacity: 0.6 }} />
            <span style={{
              fontSize: '0.6rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              lineHeight: 1.3,
            }}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      {/* Action area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {!isLoggedIn ? (
          <button
            onClick={() => onPurchase(tier.id, 'paystack')}
            className="btn btn-blue"
            style={{ width: '100%', padding: '10px', fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', justifyContent: 'center' }}
          >
            SIGN IN
          </button>
        ) : (
          <>
            {!isWalletEnough && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginBottom: 8, padding: '8px', background: 'rgba(255,23,68,0.03)', border: '1px solid rgba(255,23,68,0.08)', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertCircle style={{ width: 10, height: 10, color: 'var(--danger)' }} />
                  <span style={{ fontSize: '0.55rem', fontWeight: 900, color: 'var(--danger)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Low Balance
                  </span>
                </div>
                <Link 
                  href="/dashboard?tab=wallet" 
                  style={{ fontSize: '0.5rem', fontWeight: 900, color: 'var(--blue-electric)', letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Top up wallet
                </Link>
              </div>
            )}
            <button
              disabled={isPending || !isWalletEnough}
              onClick={() => onPurchase(tier.id, 'wallet')}
              className={displayTier.featured ? 'btn btn-blue' : 'btn btn-outline'}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '0.6rem',
                fontWeight: 900,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                justifyContent: 'center',
                gap: 6,
                opacity: isWalletEnough ? 1 : 0.3,
              }}
            >
              {isPending ? <Activity className="animate-spin w-3 h-3" /> : (
                <>
                  <Wallet style={{ width: 11, height: 11 }} />
                  USE WALLET
                </>
              )}
            </button>
            <div style={{ position: 'relative', height: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ height: 1, width: '100%', background: 'rgba(255,255,255,0.03)' }} />
               <span style={{ position: 'absolute', padding: '0 6px', background: displayTier.accentBg, fontSize: '7px', color: 'rgba(255,255,255,0.1)', fontWeight: 900 }}>OR</span>
            </div>
            <button
              disabled={isPending}
              onClick={() => onPurchase(tier.id, 'paystack')}
              className="btn btn-ghost"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '0.6rem',
                fontWeight: 900,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                justifyContent: 'center',
                gap: 6,
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {isPending ? <Activity className="animate-spin w-3 h-3" /> : (
                <>
                  <Activity style={{ width: 11, height: 11, color: 'var(--success)' }} />
                  PAY NOW
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
      <div className="card" style={{ padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, borderStyle: 'dashed' }}>
        <Activity style={{ width: 32, height: 32, color: 'var(--text-muted)', opacity: 0.1 }} className="animate-pulse" />
        <p style={{ fontSize: '0.55rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', fontStyle: 'italic', opacity: 0.4 }}>
          Loading accounts...
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Left & right fade masks */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 40, zIndex: 10,
        pointerEvents: 'none',
        background: 'linear-gradient(to right, #030508 0%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 40, zIndex: 10,
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
            gap: 16,
            padding: '8px 48px 24px',
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 12 }}>
        <div style={{ height: 1, width: 32, background: 'rgba(255,255,255,0.03)', borderRadius: 99, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', width: '50%', background: 'rgba(242,201,76,0.3)', borderRadius: 99 }}
            animate={{ x: ['0%', '200%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <span style={{ fontSize: '0.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase', letterSpacing: '0.25em' }}>
          Drag to explore
        </span>
        <div style={{ height: 1, width: 32, background: 'rgba(255,255,255,0.03)', borderRadius: 99, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', width: '50%', background: 'rgba(242,201,76,0.3)', borderRadius: 99 }}
            animate={{ x: ['0%', '200%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 1.25 }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN CLIENT ─────────────────────────────────────────────────────────────
export default function AccountsClient({ tiers, userId, walletBalance = 0, stats }: AccountsClientProps) {
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
          router.push('/dashboard?success=Plan+purchased+successfully');
        } else {
          const result = await initializePayment(tierId);
          if (result.authorization_url) {
            window.location.href = result.authorization_url;
          }
        }
      } catch (err: unknown) {
        const e = err as Error;
        setError(e.message || 'Transaction failed. Please try again.');
      }
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 64, display: 'flex', flexDirection: 'column' }} className="animate-fade-in">

      {/* ─── HERO ─── */}
      <section style={{ position: 'relative', padding: '32px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#0D1321', opacity: 0.5 }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 600, margin: '0 auto', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', background: 'rgba(242,201,76,0.06)',
              border: '1px solid rgba(242,201,76,0.15)', borderRadius: 99,
            }}>
              <ShieldCheck style={{ width: 11, height: 11, color: 'var(--gold)' }} />
              <span style={{ fontSize: '0.55rem', fontWeight: 900, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                Official Membership
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0,
              textTransform: 'uppercase',
              fontStyle: 'italic'
            }}>
              Choose Your <span className="text-gradient-gold">Account Plan</span>
            </h1>

            <p style={{ fontSize: '0.65rem', fontWeight: 500, color: 'var(--text-muted)', maxWidth: 400, lineHeight: 1.6, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>
              Select a plan to start earning rewards. All transactions are 
              processed through our secure payment gateway.
            </p>

            {error && (
              <div className="animate-slide-up" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 12px', borderRadius: 8,
                background: 'rgba(255,23,68,0.05)', border: '1px solid rgba(255,23,68,0.2)',
                color: 'var(--danger)',
              }}>
                <AlertCircle style={{ width: 11, height: 11 }} />
                <span style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{error}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={{ padding: '24px 0', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
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
      <section style={{ padding: '32px 0', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.005)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '0.65rem', fontWeight: 900,
            color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: 24,
          }}>
            Platform Performance
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {[
              { label: 'Challenges',     val: `${stats.roundsCompleted}+`,   icon: <Activity style={{ width: 11, height: 11 }} /> },
              { label: 'Members',       val: `${(stats.activeChallengers / 1000).toFixed(1)}K`,   icon: <Users    style={{ width: 11, height: 11 }} /> },
              { label: 'Successful Streaks',     val: `${stats.perfectStreaks}+`,   icon: <Shield   style={{ width: 11, height: 11 }} /> },
              { label: 'Total Paid Out', val: `₦${(stats.totalCashPaid / 1000000).toFixed(1)}M`, icon: <Wallet   style={{ width: 11, height: 11 }} /> },
            ].map((s, i) => (
              <div key={i} className="card" style={{
                padding: '16px 12px', background: 'rgba(255,255,255,0.01)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)'
              }}>
                <div style={{ padding: 6, background: 'rgba(0,229,255,0.05)', borderRadius: 6, color: 'var(--blue-electric)' }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', fontStyle: 'italic' }}>{s.val}</div>
                <div style={{ fontSize: '0.55rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.5 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="animate-slide-up" style={{ marginTop: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.55rem', fontWeight: 900, color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              <ShieldCheck style={{ width: 11, height: 11 }} />
              Secure Payouts
            </div>
            <p style={{ fontSize: '0.55rem', fontWeight: 500, color: 'rgba(160,171,192,0.4)', maxWidth: 400, lineHeight: 1.6, textTransform: 'uppercase', letterSpacing: '0.08em', fontStyle: 'italic' }}>
              PredChain ensures secure and fast payouts to all members. All transactions 
              are encrypted and verified for security.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

