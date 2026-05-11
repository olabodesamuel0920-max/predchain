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
import { motion } from 'framer-motion';
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
          router.push('/dashboard?success=Tier+activated+successfully');
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

      <div className="container-tight relative z-10 px-4 sm:px-0">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-24 max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="badge-luxury mb-8 px-6 py-2 bg-white/[0.02] border-white/10 italic font-black"
          >
            MEMBERSHIP TIER
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 uppercase italic font-black tracking-tighter text-5xl sm:text-7xl leading-none"
          >
            Select Your <span className="text-gradient-gold">Arena.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-sm sm:text-base font-medium leading-relaxed italic opacity-60"
          >
            Enter the arena by securing a membership tier. Each level unlocks verified <span className="text-white font-black">10X multipliers</span> upon streak completion.
          </motion.p>

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-10 flex items-center justify-center gap-3 text-rose-500 bg-rose-500/5 p-5 rounded-2xl border border-rose-500/10 max-w-md mx-auto shadow-2xl"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">{errorMsg}</span>
            </motion.div>
          )}
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {tiers.sort((a,b) => a.price_ngn - b.price_ngn).map((tier, i) => {
            const isMidTier = i === 1;
            const rewardVal = tier.price_ngn * 10;
            const isWalletEnough = walletBalance >= tier.price_ngn;
            const isLoading = isPending && activeTierId === tier.id;

            return (
              <motion.div 
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className={`card-luxury flex flex-col transition-all duration-700 transform preserve-3d depth-card relative group p-0 overflow-hidden ${
                  isMidTier ? 'border-gold/30 bg-[#07090e] shadow-[0_50px_100px_-30px_rgba(242,201,76,0.15)]' : 'bg-[#0a0d14] border-white/5'
                }`}
              >
                {isMidTier && (
                  <div className="absolute top-6 right-6 badge-luxury !bg-gold !text-black !px-4 !py-1 shadow-2xl font-black text-[9px] tracking-widest uppercase italic z-20">
                    POPULAR
                  </div>
                )}

                <div className="p-10 pb-0 relative z-10">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 border transition-all duration-700 shadow-inner group-hover:rotate-12 ${
                     isMidTier ? 'bg-gold/10 border-gold/20 text-gold' : 'bg-white/[0.03] border-white/10 text-text-dim/60 group-hover:text-gold group-hover:border-gold/30'
                   }`}>
                      {i === 2 ? <Crown className="w-7 h-7" /> : isMidTier ? <Star className="w-7 h-7" /> : <Zap className="w-7 h-7" />}
                   </div>
                   <h3 className="text-xl font-black text-white mb-3 font-display uppercase italic tracking-tighter leading-none">{tier.name}</h3>
                   <div className="flex items-baseline gap-2 mb-10">
                      <span className="text-4xl font-black text-white font-display italic tracking-tighter transition-colors group-hover:text-gold">₦{tier.price_ngn.toLocaleString()}</span>
                      <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em] italic opacity-40">Entry</span>
                   </div>
                </div>

                <div className="px-10 space-y-5 mb-12 flex-1 relative z-10">
                   {[
                      '3-Day Streak Eligibility',
                      'Official Match Data',
                      `₦${(tier.perks?.referral_bonus ?? 1000).toLocaleString()} Partner Credit`,
                      'Instant Reward Distribution'
                   ].map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-4 group/item">
                         <div className="w-5 h-5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center shrink-0 group-hover/item:border-gold/30 transition-all">
                            <Check className="w-3 h-3 text-gold/40 group-hover/item:text-gold transition-colors" />
                         </div>
                         <span className="text-[11px] font-black text-text-secondary uppercase tracking-widest italic opacity-40 group-hover/item:opacity-100 transition-opacity">{feat}</span>
                      </div>
                   ))}
                </div>

                <div className="p-10 pt-0 relative z-10 mt-auto">
                   <div className="bg-black/60 border border-white/5 rounded-2xl p-6 text-center glass-layered mb-8 shadow-inner group-hover:border-gold/10 transition-all duration-700">
                      <span className="text-[9px] font-black text-text-dim uppercase tracking-[0.4em] block mb-3 italic opacity-30">STREAK PAYOUT</span>
                      <div className="flex items-center justify-center gap-3">
                         <span className="text-3xl font-black text-white font-display italic tracking-tighter transition-transform group-hover:scale-105 duration-700">₦{rewardVal.toLocaleString()}</span>
                         <ShieldCheck className="w-4 h-4 text-emerald-500 opacity-40" />
                      </div>
                   </div>

                   <div className="flex flex-col gap-4">
                      <button
                        onClick={() => handlePurchase(tier.id, 'wallet')}
                        disabled={!!(isLoading || (userId && !isWalletEnough))}
                        className={`btn-luxury btn-premium-depth !py-5 w-full shadow-2xl font-black italic tracking-widest text-[11px] ${
                          isMidTier ? 'btn-gold' : 'btn-outline border-white/10 bg-white/[0.02]'
                        }`}
                      >
                         {isLoading ? <Activity className="w-4 h-4 animate-spin" /> : 
                          (userId && !isWalletEnough) ? 'INSUFFICIENT FUNDS' : 'ACTIVATE WITH WALLET'}
                      </button>
                      
                      <button
                        onClick={() => handlePurchase(tier.id, 'paystack')}
                        disabled={isLoading}
                        className="text-[9px] font-black text-text-dim hover:text-white transition-all text-center uppercase tracking-[0.3em] italic opacity-40 hover:opacity-100"
                      >
                         DIRECT CARD ENTRY
                      </button>
                   </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Platform Integrity Standards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto py-24 border-t border-white/5">
           {[
              { icon: ShieldCheck, title: 'SECURE ENTRY', desc: 'Membership fees are locked in reserve until match outcomes are verified.' },
              { icon: Globe, title: 'LIVE MATCH DATA', desc: 'Arena fixtures and results are synchronized with global sports intelligence.' },
              { icon: Crown, title: 'INSTANT PAYOUTS', desc: 'Elite streak winners receive high-priority, automated reward distributions.' }
           ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center space-y-6 group"
              >
                 <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gold/20 transition-all duration-700 group-hover:bg-gold group-hover:text-black group-hover:rotate-12 shadow-inner">
                    <item.icon className="w-6 h-6" />
                 </div>
                 <h4 className="text-[13px] font-black text-white uppercase tracking-[0.2em] font-display italic group-hover:text-gold transition-colors">{item.title}</h4>
                 <p className="text-[11px] font-bold text-text-dim leading-relaxed max-w-[240px] uppercase tracking-widest italic opacity-40 group-hover:opacity-100 transition-opacity">{item.desc}</p>
              </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
}
