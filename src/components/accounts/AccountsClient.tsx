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
    <div className="relative min-h-screen pt-32 pb-24">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-muted/5 blur-[120px]" />
      </div>

      <div className="container-tight relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto px-4">
          <div className="badge-luxury mb-6 px-5 py-1.5">ELITE PROTOCOLS</div>
          <h1 className="mb-4 uppercase italic font-black tracking-tight">Select Your <span className="text-gradient-gold">Arena Entry.</span></h1>
          <p className="text-text-secondary text-sm font-normal leading-relaxed">
            Choose a performance tier that aligns with your strategy. Each tier unlocks verified <span className="text-white font-bold italic">10X multipliers</span>.
          </p>

          {errorMsg && (
            <div className="mt-8 flex items-center justify-center gap-3 text-rose-500 bg-rose-500/5 p-4 rounded-xl border border-rose-500/10 max-w-md mx-auto">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {tiers.sort((a,b) => a.price_ngn - b.price_ngn).map((tier, i) => {
            const isMidTier = i === 1;
            const rewardVal = tier.price_ngn * 10;
            const isWalletEnough = walletBalance >= tier.price_ngn;
            const isLoading = isPending && activeTierId === tier.id;

            return (
              <div 
                key={tier.id}
                className={`card-luxury flex flex-col transition-all duration-500 ${
                  isMidTier ? 'border-gold/30 bg-[#11161D]' : 'bg-bg-card'
                }`}
              >
                {isMidTier && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-luxury !bg-gold !text-black !px-4 !py-1 shadow-md font-black text-[9px] tracking-widest uppercase italic">
                    MOST DEPLOYED
                  </div>
                )}

                <div className="mb-8">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border transition-all ${
                     isMidTier ? 'bg-gold/10 border-gold/20 text-gold' : 'bg-white/[0.02] border-border-subtle text-text-dim'
                   }`}>
                      {i === 2 ? <Crown className="w-5 h-5" /> : isMidTier ? <Star className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                   </div>
                   <h3 className="text-lg font-black text-white mb-2 font-display uppercase italic tracking-[0.05em]">{tier.name}</h3>
                   <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-white font-display italic tracking-tighter">₦{tier.price_ngn.toLocaleString()}</span>
                      <span className="text-[8px] font-black text-text-muted uppercase tracking-widest italic opacity-40">/ entry</span>
                   </div>
                </div>

                <div className="space-y-3.5 mb-10 flex-1">
                   {[
                      '3-Day Streak Eligibility',
                      'verified match data-feeds',
                      `₦${(tier.perks?.referral_bonus ?? 1000).toLocaleString()} referral share`,
                      'automated Payout settlement'
                   ].map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                         <div className="w-4 h-4 rounded-md bg-white/[0.02] border border-border-subtle flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-text-muted" />
                         </div>
                         <span className="text-[10px] font-black text-text-secondary uppercase tracking-wider italic opacity-70">{feat}</span>
                      </div>
                   ))}
                </div>

                <div className="pt-8 border-t border-border-subtle space-y-6">
                   <div className="bg-bg-secondary p-5 rounded-xl border border-border-subtle text-center">
                      <span className="text-[8px] font-black text-text-dim uppercase tracking-[0.2em] block mb-2 italic">Max Reward Settlement</span>
                      <div className="flex items-center justify-center gap-2">
                         <span className="text-2xl font-black text-white font-display italic tracking-tight">₦{rewardVal.toLocaleString()}</span>
                         <span className="text-[8px] font-extrabold text-emerald-500/60 uppercase tracking-tighter">Verified</span>
                      </div>
                   </div>

                   <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handlePurchase(tier.id, 'wallet')}
                        disabled={!!(isLoading || (userId && !isWalletEnough))}
                        className={`btn-luxury !py-4 w-full shadow-sm ${
                          isMidTier ? 'btn-gold' : 'btn-outline'
                        }`}
                      >
                         {isLoading ? <Activity className="w-4 h-4 animate-spin" /> : 
                          (userId && !isWalletEnough) ? 'Low Wallet Reserve' : 'Purchase with Wallet'}
                      </button>
                      
                      <button
                        onClick={() => handlePurchase(tier.id, 'paystack')}
                        disabled={isLoading}
                        className="text-[9px] font-black text-text-dim hover:text-gold transition-all text-center uppercase tracking-[0.2em] italic"
                      >
                         Secure External Gateway
                      </button>
                   </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Performance Standards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto py-20 border-t border-border-subtle">
           {[
              { icon: ShieldCheck, title: 'Asset Protection', desc: 'Fees are securely held until match verification is finalized.' },
              { icon: Globe, title: 'Official Feeds', desc: 'Results are synchronized directly with official sports networks.' },
              { icon: Crown, title: 'Instant Liquidity', desc: 'Winning sequences trigger automated, high-priority reward transfers.' }
           ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 group">
                 <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-border-subtle flex items-center justify-center text-gold/30 transition-all group-hover:bg-gold group-hover:text-black">
                    <item.icon className="w-5 h-5" />
                 </div>
                 <h4 className="text-[11px] font-black text-white uppercase tracking-widest font-display italic">{item.title}</h4>
                 <p className="text-[10px] font-normal text-text-muted leading-relaxed max-w-[200px]">{item.desc}</p>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}
