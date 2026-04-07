'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, 
  Target, 
  Zap, 
  Check, 
  ShieldCheck, 
  Activity, 
  Wallet, 
  Globe, 
  ArrowUpRight, 
  AlertCircle, 
  Trophy, 
  Star, 
  Gem, 
  ArrowRight, 
  CreditCard 
} from 'lucide-react';
import { initializePayment } from '@/app/actions/paystack';
import { purchaseTierWithWallet } from '@/app/actions/wallet';
import { AccountTier, PlatformStats } from '@/types';
import { useFeedback } from '@/hooks/useFeedback';

// Unified icons
const StarIcon = Star;
const GemIcon = Gem;
const ZapIcon = Zap;
const TrophyIcon = Trophy;
const CheckIcon = Check;
const AlertIcon = AlertCircle;
const ShieldIcon = ShieldCheck;
const ActivityIcon = Activity;

interface AccountsClientProps {
  tiers: AccountTier[];
  userId?: string;
  walletBalance?: number;
  stats: PlatformStats;
}

export default function AccountsClient({ tiers, userId, walletBalance = 0, stats }: AccountsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { success: successMsg, error: errorMsg, showSuccess, showError, clear } = useFeedback(5000);
  const [activeTierId, setActiveTierId] = useState<string | null>(null);

  const handlePurchase = async (tierId: string, method: 'wallet' | 'paystack') => {
    if (!userId) {
      router.push(`/login?returnTo=/accounts`);
      return;
    }

    setActiveTierId(tierId);
    
    startTransition(async () => {
      try {
        if (method === 'wallet') {
          await purchaseTierWithWallet(tierId);
          router.push('/dashboard?success=Account+activated+successfully');
        } else {
          const result = await initializePayment(tierId);
          if (result.authorization_url) {
            window.location.href = result.authorization_url;
          }
        }
      } catch (err: any) {
        showError(err.message || 'Transaction failed. Please try again.');
        setActiveTierId(null);
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-primary pt-32 pb-24 md:pt-48">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full h-[600px] bg-gold-glow blur-[140px] opacity-20" />
      </div>

      <div className="container relative z-10 px-6">
        {/* Section Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <div className="badge-elite !text-gold mb-8 px-5 py-1 bg-white/[0.03] border-gold/10 italic">ELITE PLANS</div>
          <h1 className="mb-6 leading-tight">Choose Your <span className="text-gradient-gold">Tier.</span></h1>
          <p className="text-muted text-sm md:text-base font-medium opacity-60 max-w-lg mx-auto uppercase tracking-widest leading-relaxed">
            Select an account tier to synchronize with the live arena and secure your 10X reward sequence.
          </p>

          {errorMsg && (
            <div className="mt-8 flex items-center justify-center gap-2 text-danger animate-slide-up bg-danger/10 p-3 rounded-xl border border-danger/10">
              <AlertIcon className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32 max-w-6xl mx-auto">
          {tiers.map((tier, i) => {
            const isStandard = i === 0;
            const isMidTier = i === 1;
            const isPremium = i === 2;
            const rewardVal = tier.price_ngn * 10;
            const isWalletEnough = walletBalance >= tier.price_ngn;
            const isLoading = isPending && activeTierId === tier.id;

            return (
              <div 
                key={tier.id}
                className={`card-elite !p-10 bg-[#080a0f] border-white/5 transition-all duration-700 hover:-translate-y-2 relative shadow-2xl group flex flex-col ${
                  isMidTier ? 'border-gold/30 shadow-glow-gold/5' : 'border-white/5'
                }`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {isMidTier && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-elite !bg-gold !text-black !px-4 !py-1.5 italic shadow-lg font-black text-[9px]">
                    PLATFORM CHOICE
                  </div>
                )}

                <div className="flex flex-col items-center text-center mb-10">
                   <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-6 text-gold shadow-inner group-hover:scale-110 transition-transform duration-700">
                      {isPremium ? <GemIcon className="w-7 h-7" /> : isMidTier ? <StarIcon className="w-7 h-7" /> : <ZapIcon className="w-7 h-7" />}
                   </div>
                   <h3 className="text-xl font-black text-white italic tracking-tight mb-2 uppercase">{tier.name} Account</h3>
                   <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-white italic tracking-tighter leading-none">₦{tier.price_ngn.toLocaleString()}</span>
                      <span className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-20">/ entry</span>
                   </div>
                </div>

                <div className="w-full h-px bg-white/5 mb-10" />

                <div className="space-y-4 mb-12 flex-1">
                   {[
                      '3-Day Sequence Access',
                      'Full Arena Monitor',
                      `₦${(tier.perks?.referral_bonus ?? 1000).toLocaleString()} Associate Reward`,
                      '24/7 Verified Settlement'
                   ].map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0">
                            <CheckIcon className="w-3 h-3 text-gold opacity-60" />
                         </div>
                         <span className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none opacity-40 group-hover:opacity-100 transition-all italic">{feat}</span>
                      </div>
                   ))}
                </div>

                <div className="pt-10 border-t border-white/5 space-y-6">
                   <div className="text-center">
                      <span className="text-[10px] font-black text-gold uppercase tracking-widest opacity-30 italic block mb-2">Verified Yield</span>
                      <div className="flex items-center justify-center gap-2">
                         <span className="text-3xl font-black text-white italic tracking-tighter leading-none">₦{rewardVal.toLocaleString()}</span>
                         <div className="badge-elite !py-0.5 !px-3 font-bold !bg-success/10 !text-success border-success/10 italic text-[8px]">10X MULTIPLIER</div>
                      </div>
                   </div>

                   <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handlePurchase(tier.id, 'wallet')}
                        disabled={!!(isLoading || (userId && !isWalletEnough))}
                        className={`btn w-full py-4 rounded-xl italic font-black shadow-2xl transition-all hover:scale-105 ${
                          isMidTier ? 'btn-primary' : 'bg-white/[0.03] text-white border-white/10 hover:bg-white/[0.06]'
                        }`}
                      >
                         {isLoading ? <ActivityIcon className="w-4 h-4 animate-spin" /> : 
                          (userId && !isWalletEnough) ? 'INSUFFICIENT BALANCE' : 'PAY FROM WALLET'}
                      </button>
                      
                      <button
                        onClick={() => handlePurchase(tier.id, 'paystack')}
                        disabled={isLoading}
                        className="text-[10px] font-black text-gold/40 hover:text-gold transition-all text-center uppercase tracking-widest italic pt-2"
                      >
                         Online Transaction
                      </button>
                   </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto py-24 border-t border-white/5 mb-24">
           {[
              { icon: ShieldIcon, title: 'Network Security', desc: 'All arena fees are secured until match verification is completed.' },
              { icon: Globe, title: 'Verified Feeds', desc: 'Match results are synchronized with official high-integrity data nodes.' },
              { icon: ActivityIcon, title: 'Instant Yield', desc: 'Success sequences trigger automated reward distributions instantly.' }
           ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 group">
                 <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gold shadow-inner group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 opacity-40 group-hover:opacity-100" />
                 </div>
                 <h4 className="text-[11px] font-black text-white uppercase tracking-widest italic">{item.title}</h4>
                 <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-loose opacity-30 italic">{item.desc}</p>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}
