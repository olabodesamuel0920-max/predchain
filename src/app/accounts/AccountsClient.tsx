'use client';

import { useState, useTransition, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Gem,
  Star,
  Check,
  Users,
  Trophy,
  Activity,
  Wallet,
  ShieldCheck,
  ArrowUpRight,
  AlertCircle,
  Zap,
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
    default: return <Zap className="w-4 h-4 text-muted" />;
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
      multiplier: '10X Multiplier',
      badge: isStandard ? 'POPULAR' : isPremium ? 'ELITE' : null,
      featured: isStandard,
      accentColor: isStandard ? 'text-blue-electric' : isPremium ? 'text-gold' : 'text-muted',
      accentBg: isStandard ? 'bg-blue-electric/5' : isPremium ? 'bg-gold/5' : 'bg-white/[0.02]',
      accentBorder: isStandard ? 'border-blue-electric/20' : isPremium ? 'border-gold/20' : 'border-white/10',
      features: [
        { label: '3-Day Arena Cycle Access' },
        { label: '1 Precision Daily Pick' },
        { label: 'Live Ranking Console' },
        { label: `₦${(t.perks?.referral_bonus ?? 1000).toLocaleString()} Referral Reward` },
        { label: 'Verified Operator Badge' },
        ...(isPremium ? [
          { label: 'Priority Verification' },
          { label: 'Elite Node Status' },
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
      className={`relative flex flex-col gap-6 p-6 rounded-2xl border ${displayTier.accentBorder} ${displayTier.accentBg} shrink-0 w-[290px] shadow-2xl transition-all group backdrop-blur-md`}
    >
      {/* Badge */}
      {displayTier.badge && (
        <span className={`absolute top-4 right-4 px-2 py-0.5 rounded text-[8px] font-bold tracking-widest ${displayTier.accentColor} bg-white/5 border ${displayTier.accentBorder}`}>
          {displayTier.badge}
        </span>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
            {getTierIcon(displayTier.name)}
          </div>
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-60">
            {displayTier.name} Node
          </span>
        </div>

        <div className="text-3xl font-bold text-white tracking-tight">
          {displayTier.price}
        </div>
      </div>

      {/* Yield box */}
      <div className="p-4 rounded-xl bg-bg-primary/60 border border-white/5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-50">
            Node Potential
          </span>
          <div className="badge-elite !text-success !border-success/20">
            {displayTier.multiplier}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-white tracking-tight">
            {displayTier.reward}
          </span>
          <Trophy className="w-4 h-4 text-gold opacity-30" />
        </div>
      </div>

      {/* Feature list */}
      <ul className="flex flex-col gap-3 flex-1 pt-2">
        {displayTier.features.map((f, i) => (
          <li key={i} className="flex gap-3 items-center">
            <Check className="w-3.5 h-3.5 text-success/60 shrink-0" />
            <span className="text-[11px] font-medium text-secondary leading-tight">
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      {/* Action area */}
      <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
        {!isLoggedIn ? (
          <Link
            href="/login"
            className="btn btn-blue w-full rounded-full"
          >
            Authenticate
          </Link>
        ) : (
          <>
            {!isWalletEnough && (
              <div className="flex flex-col items-center gap-1.5 mb-2 p-2.5 bg-danger/5 border border-danger/10 rounded-xl animate-fade-in">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-danger" />
                  <span className="text-[9px] font-bold text-danger uppercase tracking-widest leading-none">Incomplete Balance</span>
                </div>
                <Link href="/dashboard?tab=wallet" className="text-[9px] font-bold text-blue-electric uppercase tracking-widest hover:underline">
                  Top-up Dashboard
                </Link>
              </div>
            )}
            <button
              disabled={isPending || !isWalletEnough}
              onClick={() => onPurchase(tier.id, 'wallet')}
              className={`btn w-full rounded-full gap-2 ${displayTier.featured ? 'btn-blue' : 'btn-ghost'}`}
            >
              {isPending ? <Activity className="animate-spin w-4 h-4" /> : (
                <>
                  <Wallet className="w-4 h-4" />
                  Wallet Entry
                </>
              )}
            </button>
            <div className="relative h-6 flex items-center justify-center">
               <div className="h-[1px] w-full bg-white/5" />
               <span className="absolute px-3 bg-bg-secondary text-[8px] text-muted font-bold uppercase tracking-[0.3em] opacity-30">ALTERNATIVE</span>
            </div>
            <button
              disabled={isPending}
              onClick={() => onPurchase(tier.id, 'paystack')}
              className="btn btn-ghost w-full rounded-full text-xs gap-2 border-white/5"
            >
              {isPending ? <Activity className="animate-spin w-4 h-4" /> : (
                <>
                  <ShieldCheck className="w-4 h-4 text-success/50" />
                  Direct Settlement
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
      <div className="card-elite border-dashed py-20 flex flex-col items-center gap-6 text-center opacity-30 mx-6">
        <Zap className="w-10 h-10 animate-pulse text-muted" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Awaiting node response...</p>
      </div>
    );
  }

  return (
    <div className="relative group/carousel">
      <div
        ref={constraintsRef}
        className="overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing px-6"
      >
        <motion.div
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          className="flex gap-6 pb-12 pt-6 w-max px-4 md:px-12"
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

      <div className="flex justify-center items-center gap-10 mt-4 opacity-40 group-hover/carousel:opacity-100 transition-opacity">
        <div className="h-[1px] w-16 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full w-full bg-gold"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-[9px] font-bold text-muted uppercase tracking-[0.3em]">Swipe to Navigate Node Protocols</span>
        <div className="h-[1px] w-16 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full w-full bg-blue-electric"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
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
      <section className="relative py-16 md:py-24 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-grad-glow opacity-20 pointer-events-none" />
        
        <div className="container relative z-10 text-center">
          <div className="flex flex-col items-center max-w-2xl mx-auto gap-6 animate-slide-up">
            <div className="glass-pill px-4 py-1.5 border-gold/15">
              <span className="flex items-center gap-2 text-[10px] font-bold text-gold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                Network Validation Protocol Active
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Activate Your <span className="text-gradient-gold">Operator Node</span>
            </h1>

            <p className="text-sm font-medium text-secondary max-w-md">
              Synchronize with the arena network. Win 10X multiplier rewards 
              by maintaining peak prediction streak performance.
            </p>

            {error && (
              <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-danger/5 border border-danger/20 text-danger animate-slide-up">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">{error}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── CAROUSEL ─── */}
      <section className="py-16 bg-primary relative overflow-hidden">
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
      <section className="py-20 border-t border-white/5 bg-bg-secondary/50">
        <div className="container text-center">
          <span className="section-label mb-16 opacity-40">NETWORK INTEGRITY METRICS</span>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { label: 'Network Cycles', val: `${stats.roundsCompleted}`,   icon: <Activity className="w-4 h-4" /> },
              { label: 'Active Operators', val: `${stats.activeChallengers.toLocaleString()}`,   icon: <Users    className="w-4 h-4" /> },
              { label: 'Streak Performance', val: `${stats.perfectStreaks}`,   icon: <Zap      className="w-4 h-4" /> },
              { label: 'Total Distributed', val: `₦${(stats.totalCashPaid / 1000).toLocaleString()}K`, icon: <Wallet   className="w-4 h-4" /> },
            ].map((s, i) => (
              <div key={i} className="card-elite bg-bg-primary/40 flex flex-col items-center gap-4 py-8 border-white/5">
                <div className="p-3 bg-blue-electric/10 rounded-xl text-blue-electric border border-blue-electric/10">{s.icon}</div>
                <div className="text-3xl font-bold text-white tracking-tight">{s.val}</div>
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-40">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-col items-center gap-6 animate-slide-up opacity-50">
            <div className="flex items-center gap-3 text-[10px] font-bold text-muted uppercase tracking-[0.3em]">
              <ShieldCheck className="w-4 h-4 text-success/60" />
              Automated Reward Settlement Engine
            </div>
            <p className="text-[11px] font-medium text-muted max-w-md leading-relaxed">
              All node returns are atomically credited to certified operator wallets upon cycle completion. 
              Enterprise-grade encryption active across all transmission layers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

