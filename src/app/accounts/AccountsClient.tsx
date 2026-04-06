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
// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getTierIcon(name: string) {
  switch (name) {
    case 'Premium': return <Gem className="w-4 h-4 text-gold" />;
    case 'Standard': return <Star className="w-4 h-4 text-blue-electric" />;
    default: return <Shield className="w-4 h-4 text-muted" />;
  }
}

function buildDisplayTiers(tiers: AccountTier[]): DisplayTier[] {
  return tiers.map(t => {
    const isStandard = t.name === 'Standard';
    const isPremium  = t.name === 'Premium';
    const priceRaw = t.price_ngn;
    const rewardVal = priceRaw * 10;
    
    return {
      id: t.id,
      name: t.name,
      price: `₦${priceRaw.toLocaleString()}`,
      reward: `₦${rewardVal.toLocaleString()}`,
      multiplier: '10X Rewards',
      badge: isStandard ? 'POPULAR' : isPremium ? 'ELITE' : null,
      featured: isStandard,
      accentColor: isStandard ? 'text-blue-electric' : isPremium ? 'text-gold' : 'text-muted',
      accentBg: isStandard ? 'bg-blue-electric/5' : isPremium ? 'bg-gold/5' : 'bg-white/[0.02]',
      accentBorder: isStandard ? 'border-blue-electric/20' : isPremium ? 'border-gold/20' : 'border-white/10',
      features: [
        { label: '3-Day Challenge Access' },
        { label: '1 Daily Prediction' },
        { label: 'Live Leaderboard' },
        { label: `₦${(t.perks?.referral_bonus ?? 1000).toLocaleString()} Reward (Network)` },
        { label: 'Verified Member Badge' },
        ...(isPremium ? [
          { label: 'Priority Verification' },
          { label: 'Elite Rank Badge' },
        ] : []),
      ],
      cta: isPremium ? 'Get Premium' : 'Select Plan',
    };
  });
}

// ─── TIER CARD ────────────────────────────────────────────────────────────────
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

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative flex flex-col gap-5 p-5 rounded-xl border ${displayTier.accentBorder} ${displayTier.accentBg} shrink-0 w-[280px] shadow-lg transition-all group`}
    >
      {/* Badge */}
      {displayTier.badge && (
        <span className={`absolute top-4 right-4 px-2 py-0.5 rounded text-[9px] font-extrabold tracking-widest ${displayTier.accentColor} bg-white/5 border ${displayTier.accentBorder}`}>
          {displayTier.badge}
        </span>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-white/5 flex items-center justify-center">
            {getTierIcon(displayTier.name)}
          </div>
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider opacity-60">
            {displayTier.name} Plan
          </span>
        </div>

        <div className="font-display text-3xl font-extrabold text-white italic tracking-tighter leading-none">
          {displayTier.price}
        </div>
      </div>

      {/* Yield box */}
      <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 flex flex-col gap-2 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-muted uppercase tracking-wide opacity-50">
            Estimated Return
          </span>
          <div className="badge badge-success !text-[8px] !py-0.5">
            {displayTier.multiplier}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-lg font-bold text-white">
            {displayTier.reward}
          </span>
          <Trophy className="w-3.5 h-3.5 text-gold opacity-30" />
        </div>
      </div>

      {/* Feature list */}
      <ul className="flex flex-col gap-2.5 flex-1 pt-2">
        {displayTier.features.map((f, i) => (
          <li key={i} className="flex flex-start gap-2 items-center">
            <Check className="w-3 h-3 text-success shrink-0 opacity-70" />
            <span className="text-[11px] font-medium text-secondary tracking-tight">
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      {/* Action area */}
      <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
        {!isLoggedIn ? (
          <button
            onClick={() => onPurchase(tier.id, 'paystack')}
            className="btn btn-blue w-full font-bold uppercase tracking-wide"
          >
            Sign In
          </button>
        ) : (
          <>
            {!isWalletEnough && (
              <div className="flex flex-col items-center gap-1.5 mb-2 p-2 bg-danger/5 border border-danger/10 rounded-lg animate-fade-in">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3 text-danger" />
                  <span className="text-[9px] font-bold text-danger uppercase tracking-wide">Insufficient Funds</span>
                </div>
                <Link href="/dashboard?tab=wallet" className="text-[9px] font-bold text-blue-electric uppercase tracking-widest hover:underline">
                  Add Funds
                </Link>
              </div>
            )}
            <button
              disabled={isPending || !isWalletEnough}
              onClick={() => onPurchase(tier.id, 'wallet')}
              className={`btn w-full font-bold uppercase tracking-wide gap-2 ${displayTier.featured ? 'btn-blue' : 'btn-ghost'}`}
            >
              {isPending ? <Activity className="animate-spin w-3.5 h-3.5" /> : (
                <>
                  <Wallet className="w-3.5 h-3.5" />
                  Wallet Entry
                </>
              )}
            </button>
            <div className="relative h-6 flex items-center justify-center">
               <div className="h-[1px] w-full bg-white/5" />
               <span className="absolute px-2 bg-transparent text-[8px] text-muted font-bold uppercase tracking-[0.2em] opacity-30">OR</span>
            </div>
            <button
              disabled={isPending}
              onClick={() => onPurchase(tier.id, 'paystack')}
              className="btn btn-ghost w-full py-2.5 text-[10px] font-bold uppercase tracking-wide gap-2 border-white/5 hover:bg-white/[0.04]"
            >
              {isPending ? <Activity className="animate-spin w-3.5 h-3.5" /> : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-success/60" />
                  Direct Pay
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
      <div className="card border-dashed py-16 flex flex-col items-center gap-4 text-center opacity-30">
        <Activity className="w-8 h-8 animate-pulse text-muted" />
        <p className="text-xs font-bold uppercase tracking-widest">Awaiting nodes...</p>
      </div>
    );
  }

  return (
    <div className="relative group/carousel">
      {/* Horizontal Scroll Track */}
      <div
        ref={constraintsRef}
        className="overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing px-6 md:px-0"
      >
        <motion.div
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          className="flex gap-5 pb-8 pt-4 w-max px-4 md:px-12"
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

      {/* Drag Indicator */}
      <div className="flex justify-center items-center gap-8 mt-4 opacity-30 group-hover/carousel:opacity-100 transition-opacity">
        <div className="h-[1px] w-12 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full w-full bg-gold"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-[9px] font-bold text-muted uppercase tracking-[0.2em] italic">Slide to View Plans</span>
        <div className="h-[1px] w-12 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full w-full bg-blue-electric"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
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
    <div className="min-h-screen bg-primary pt-24 flex flex-col animate-fade-in">

      {/* ─── HERO ─── */}
      <section className="relative py-12 md:py-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-grad-aurora opacity-10 filter blur-[100px]" />
        
        <div className="container relative z-10 text-center">
          <div className="flex flex-col items-center max-w-2xl mx-auto gap-4 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/5 border border-gold/15 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span className="text-[10px] font-bold text-gold uppercase tracking-widest">
                Tier Verification Active
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight uppercase italic tracking-tight">
              Choose Your <span className="text-gradient-gold">Account Plan</span>
            </h1>

            <p className="text-sm font-medium text-secondary uppercase tracking-wide opacity-50 max-w-md italic">
              Select a challenge tier to begin. Win 10X rewards by maintaining your prediction streak.
            </p>

            {error && (
              <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-danger/5 border border-danger/20 text-danger animate-slide-up">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{error}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── CAROUSEL ─── */}
      <section className="py-12 bg-primary relative overflow-hidden">
        <TierCarousel 
          tiers={tiers} 
          displayTiers={displayTiers}
          isPending={isPending} 
          onPurchase={handlePurchase} 
          isLoggedIn={!!userId}
          walletBalance={walletBalance}
        />
      </section>

      {/* ─── STATS GRID ─── */}
      <section className="py-16 border-t border-white/5 bg-white/[0.01]">
        <div className="container text-center">
          <h2 className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] mb-12 opacity-30">
            Platform Protocol Metrics
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: 'Active Challenges', val: `${stats.roundsCompleted}`,   icon: <Activity className="w-3.5 h-3.5" /> },
              { label: 'Verified Members', val: `${stats.activeChallengers.toLocaleString()}`,   icon: <Users    className="w-3.5 h-3.5" /> },
              { label: 'Winning Streaks', val: `${stats.perfectStreaks}`,   icon: <Shield   className="w-3.5 h-3.5" /> },
              { label: 'Total Payouts', val: `₦${(stats.totalCashPaid / 1000).toLocaleString()}K`, icon: <Wallet   className="w-3.5 h-3.5" /> },
            ].map((s, i) => (
              <div key={i} className="card bg-white/[0.01] flex flex-col items-center gap-2 py-6 border-white/5">
                <div className="p-2 bg-blue-electric/10 rounded-lg text-blue-electric">{s.icon}</div>
                <div className="font-display text-2xl font-extrabold text-white italic tracking-tighter uppercase">{s.val}</div>
                <div className="text-[9px] font-bold text-muted uppercase tracking-wider opacity-40 italic">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center gap-4 animate-slide-up opacity-40">
            <div className="flex items-center gap-2 text-[9px] font-bold text-muted uppercase tracking-[0.2em] italic">
              <ShieldCheck className="w-4 h-4" />
              Automated Financial Settlement
            </div>
            <p className="text-[10px] font-medium text-muted uppercase tracking-wide max-w-md italic">
              All rewards are atomically credited to member wallets upon round completion. 
              Secure encryption protocols active.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

