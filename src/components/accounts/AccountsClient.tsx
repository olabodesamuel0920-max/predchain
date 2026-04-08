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
  CreditCard,
  Crown
} from 'lucide-react';
import { initializePayment } from '@/app/actions/paystack';
import { purchaseTierWithWallet } from '@/app/actions/wallet';
import { AccountTier, PlatformStats } from '@/types';
import { useFeedback } from '@/hooks/useFeedback';

export default function AccountsClient({ tiers, userId, walletBalance = 0, stats }: { tiers: AccountTier[]; userId?: string; walletBalance?: number; stats: PlatformStats }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { error: errorMsg, showError } = useFeedback(5000);
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
    <div className="relative min-h-screen pt-40 pb-32">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-glow blur-[140px] opacity-10" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-glow blur-[140px] opacity-10" />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <div className="badge-premium !text-gold mb-8 px-6 py-2">Elite Performance Plans</div>
          <h1 className="mb-8 tracking-tight">Choose Your <span className="text-gradient-gold">Arena Entry.</span></h1>
          <p className="text-secondary text-lg font-medium opacity-70 leading-relaxed">
            Select an account tier that fits your performance goals. Each tier synchronizes with the live arena to unlock verified 10X reward multipliers.
          </p>

          {errorMsg && (
            <div className="mt-10 flex items-center justify-center gap-3 text-rose-500 bg-rose-500/5 p-5 rounded-2xl border border-rose-500/10 max-w-lg mx-auto">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-bold uppercase tracking-widest">{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40">
          {tiers.sort((a,b) => a.price_ngn - b.price_ngn).map((tier, i) => {
            const isMidTier = i === 1;
            const isPremium = i === 2;
            const rewardVal = tier.price_ngn * 10;
            const isWalletEnough = walletBalance >= tier.price_ngn;
            const isLoading = isPending && activeTierId === tier.id;

            return (
              <div 
                key={tier.id}
                className={`card-premium flex flex-col transition-all duration-700 hover:-translate-y-4 ${
                  isMidTier ? 'border-gold shadow-[0_20px_60px_-15px_rgba(240,196,25,0.1)] scale-105 z-10 bg-[#0a0d14]' : 'bg-[#06080e]'
                }`}
              >
                {isMidTier && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 badge-premium !bg-gold !text-black !px-6 !py-2 shadow-xl font-bold text-[10px] tracking-widest uppercase">
                    Most Popular
                  </div>
                )}

                <div className="mb-12">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-transform duration-700 ${
                     isMidTier ? 'bg-gold/10 border-gold/20 text-gold shadow-[0_0_20px_rgba(240,196,25,0.2)]' : 'bg-white/[0.03] border-white/10 text-white/40'
                   }`}>
                      {isPremium ? <Gem className="w-7 h-7" /> : isMidTier ? <Star className="w-7 h-7" /> : <Zap className="w-7 h-7" />}
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2 font-display uppercase">{tier.name}</h3>
                   <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-white font-display">₦{tier.price_ngn.toLocaleString()}</span>
                      <span className="text-xs font-bold text-muted uppercase tracking-widest opacity-40">/ Entry</span>
                   </div>
                </div>

                <div className="space-y-5 mb-12 flex-1">
                   {[
                      '3-Day Sequence Access',
                      'High-Performance Arena Monitor',
                      `₦${(tier.perks?.referral_bonus ?? 1000).toLocaleString()} Affirmative Bonus`,
                      'Automated Reward Settlement'
                   ].map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                         <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center border border-gold/10 shrink-0">
                            <Check className="w-3 h-3 text-gold" />
                         </div>
                         <span className="text-[11px] font-bold text-secondary uppercase tracking-wider opacity-60 italic">{feat}</span>
                      </div>
                   ))}
                </div>

                <div className="pt-10 border-t border-white/5 space-y-8">
                   <div className="text-center bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] opacity-50 block mb-3 italic">Maximum Settlement</span>
                      <div className="flex items-center justify-center gap-4">
                         <span className="text-4xl font-bold text-white font-display">₦{rewardVal.toLocaleString()}</span>
                         <div className="badge-premium !py-1 !px-3 font-bold !bg-emerald-500/10 !text-emerald-500 border-emerald-500/10 text-[9px] tracking-tighter">PER STREAK</div>
                      </div>
                   </div>

                   <div className="flex flex-col gap-4">
                      <button
                        onClick={() => handlePurchase(tier.id, 'wallet')}
                        disabled={!!(isLoading || (userId && !isWalletEnough))}
                        className={`btn w-full py-5 rounded-2xl font-bold shadow-2xl transition-all ${
                          isMidTier ? 'btn-primary' : 'btn-secondary border-white/10 hover:bg-white/5'
                        }`}
                      >
                         {isLoading ? <Activity className="w-5 h-5 animate-spin" /> : 
                          (userId && !isWalletEnough) ? 'Insufficient Wallet Balance' : 'Activate with Wallet'}
                      </button>
                      
                      <button
                        onClick={() => handlePurchase(tier.id, 'paystack')}
                        disabled={isLoading}
                        className="text-[11px] font-bold text-gold/40 hover:text-gold transition-all text-center uppercase tracking-[0.2em] italic underline underline-offset-8 decoration-gold/10"
                      >
                         Secure Online Transaction
                      </button>
                   </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Performance Standards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto py-32 border-t border-white/5">
           {[
              { icon: ShieldCheck, title: 'Asset Protection', desc: 'All arena fees are securely held until match verification is finalized.' },
              { icon: Globe, title: 'Official Feeds', desc: 'Results are synchronized directly with official sports performance networks.' },
              { icon: Crown, title: 'Instant Liquidity', desc: 'Winning sequences trigger automated, high-priority reward transfers.' }
           ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-6 group">
                 <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold shadow-lg group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7 opacity-50 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <h4 className="text-sm font-bold text-white uppercase tracking-widest font-display">{item.title}</h4>
                 <p className="text-xs font-medium text-secondary opacity-50 leading-loose tracking-wide">{item.desc}</p>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}
