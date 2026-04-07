'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Target, Zap, Check, ShieldCheck, Activity, Wallet, Globe, ArrowUpRight, AlertCircle, Trophy, Star, Gem } from 'lucide-react';
import { initializePayment } from '@/app/actions/paystack';
import { purchaseTierWithWallet } from '@/app/actions/wallet';
import { AccountTier, PlatformStats } from '@/types';

interface AccountsClientProps {
  tiers: AccountTier[];
  userId?: string;
  walletBalance?: number;
  stats: PlatformStats;
}

export default function AccountsClient({ tiers, userId, walletBalance = 0, stats }: AccountsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [activeTierId, setActiveTierId] = useState<string | null>(null);

  const handlePurchase = async (tierId: string, method: 'wallet' | 'paystack') => {
    if (!userId) {
      router.push(`/login?returnTo=/accounts`);
      return;
    }

    setError(null);
    setActiveTierId(tierId);
    
    startTransition(async () => {
      try {
        if (method === 'wallet') {
          await purchaseTierWithWallet(tierId);
          router.push('/dashboard?success=Node+activated+successfully');
        } else {
          const result = await initializePayment(tierId);
          if (result.authorization_url) {
            window.location.href = result.authorization_url;
          }
        }
      } catch (err: any) {
        setError(err.message || 'Transmission failed. Please try again.');
        setActiveTierId(null);
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-primary pt-32 pb-24 md:pt-48">
      {/* Cinematic Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[700px] bg-grad-glow opacity-30 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-electric/5 blur-[120px]" />
      </div>

      <div className="container relative z-10">
        {/* Elite Header */}
        <div className="text-center mb-24 animate-slide-up">
          <div className="badge-elite !text-gold !px-5 !py-1.5 mb-10 border-gold/10 !text-[9px]">PLAN CONFIGURATION</div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-10 leading-[0.9] italic">
            Elite <br /><span className="text-gradient-gold">Clusters.</span>
          </h1>
          <p className="text-muted text-[11px] md:text-xs font-black opacity-30 max-w-xl mx-auto uppercase tracking-[0.3em] leading-relaxed italic">
            Select your operational cluster. <br /> Maintain 3-day integrity to secure verified 10X yield settlement.
          </p>

          {error && (
            <div className="mt-12 flex items-center justify-center gap-3 text-danger animate-slide-up italic">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
            </div>
          )}
        </div>

        {/* High-Density Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-32 max-w-6xl mx-auto">
          {tiers.map((tier, i) => {
            const isStandard = tier.name === 'Standard';
            const isPremium = tier.name === 'Premium';
            const rewardVal = tier.price_ngn * 10;
            const isWalletEnough = walletBalance >= tier.price_ngn;
            const isLoading = isPending && activeTierId === tier.id;

            return (
              <div 
                key={tier.id}
                className={`card-elite group flex flex-col p-10 md:p-12 transition-all duration-700 hover:-translate-y-3 !bg-black/60 relative ${
                  isStandard ? 'border-gold/20 shadow-glow-gold/5' : 'border-white/5 shadow-2xl'
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {isStandard && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 badge-elite !bg-gold !text-black !px-5 !py-1 !text-[9px] font-black italic shadow-2xl">
                    MOST ACTIVE
                  </div>
                )}

                <div className="flex flex-col items-center text-center mb-10">
                  <div className={`w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform ${isPremium ? 'text-gold' : isStandard ? 'text-blue-electric' : 'text-white/40'}`}>
                    {isPremium ? <Gem className="w-8 h-8" /> : isStandard ? <Star className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-4 italic leading-tight">{tier.name} Plan</h2>
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-black text-white italic tracking-tighter leading-none">₦{tier.price_ngn.toLocaleString()}</span>
                    <span className="text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-20 italic">Activation Fee</span>
                  </div>
                </div>

                <div className="w-full h-px bg-white/5 mb-10" />

                <ul className="flex flex-col gap-4 mb-12 flex-1">
                  {[
                    '3-Day Arena Cycle Access',
                    '1 Precision Daily Pick',
                    `₦${(tier.perks?.referral_bonus ?? 1000).toLocaleString()} Reward Yield`
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-4 group/item">
                      <div className="w-4 h-4 rounded-full bg-success/5 border border-success/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-success" />
                      </div>
                      <span className="text-[10px] font-black text-muted uppercase tracking-widest leading-none opacity-40 group-hover/item:opacity-100 group-hover/item:text-white transition-all italic">{feat}</span>
                    </li>
                  ))}
                  {isPremium && (
                    <li className="flex items-center gap-4 group/item border-t border-white/5 pt-4">
                      <div className="w-4 h-4 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center shrink-0">
                        <Star className="w-3 h-3 text-gold" />
                      </div>
                      <span className="text-[10px] font-black text-gold uppercase tracking-widest leading-none italic">Priority Settlement</span>
                    </li>
                  )}
                </ul>

                <div className="mt-auto flex flex-col gap-8 w-full pt-10 border-t border-white/5">
                  <div className="flex flex-col items-center gap-3">
                     <span className="text-[8px] font-black text-gold uppercase tracking-[0.4em] opacity-30 italic">Cycle Target Recovery</span>
                     <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white tracking-tighter italic">₦{rewardVal.toLocaleString()}</span>
                        <div className="badge-elite !px-2 !py-0.5 !text-[8px] !bg-success/5 !text-success !border-success/10 italic">10X YIELD</div>
                     </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handlePurchase(tier.id, 'wallet')}
                      disabled={!!(isLoading || (userId && !isWalletEnough))}
                      className={`btn w-full py-4 !rounded-xl italic font-black text-[12px] tracking-widest shadow-2xl transition-all ${
                        isStandard ? 'btn-primary' : 'btn-ghost'
                      }`}
                    >
                      {isLoading ? <Activity className="w-4 h-4 animate-spin" /> : 
                       (userId && !isWalletEnough) ? 'INSUFFICIENT FUNDS' : 'WALLET ACTIVATION'}
                    </button>
                    
                    <button
                      onClick={() => handlePurchase(tier.id, 'paystack')}
                      disabled={isLoading}
                      className="text-[9px] font-black text-muted hover:text-white transition-all py-2 uppercase tracking-[0.3em] opacity-30 hover:opacity-100 italic"
                    >
                      Direct Secure Settlement
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Premium Trust Footnote */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-white/5 pt-24 mb-32">
          {[
            { 
              icon: <ShieldCheck className="w-6 h-6 text-success" />, 
              title: 'NODE INTEGRITY', 
              desc: 'Every arena prediction is logged on the permanent settlement layer for full verification.' 
            },
            { 
              icon: <Activity className="w-6 h-6 text-blue-electric" />, 
              title: 'MATCH ACCURACY', 
              desc: 'Real-time synchronization with global oddsmakers ensures 1:1 outcome precision.' 
            },
            { 
              icon: <Globe className="w-6 h-6 text-gold" />, 
              title: 'GLOBAL ACCESS', 
              desc: 'Deploy authorized nodes from any network node and settle rewards instantly.' 
            }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 shadow-inner">{item.icon}</div>
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">{item.title}</h3>
              <p className="text-[11px] font-bold text-muted uppercase leading-relaxed tracking-wider opacity-30">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* High-Impact CTA */}
        <div className="card-elite !p-12 md:p-32 text-center !bg-black/40 border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-24 opacity-[0.01] group-hover:opacity-[0.03] transition-opacity -rotate-12 pointer-events-none">
              <Trophy className="w-72 h-72" />
           </div>
           <div className="max-w-2xl mx-auto relative z-10">
              <div className="badge-elite !text-gold mb-10 border-gold/10 !px-5 !py-1 italic">OPERATIONAL PIPELINE</div>
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-10 leading-[0.9] italic">The Arena <br /><span className="text-gradient-gold">Awaits.</span></h2>
              <p className="text-muted text-[11px] md:text-xs font-black opacity-30 mb-16 uppercase tracking-[0.3em] leading-relaxed max-w-sm mx-auto italic">Build your legacy on the permanent ledger.</p>
              <div className="flex flex-wrap gap-5 justify-center">
                 <Link href="/live-challenges" className="btn btn-primary !px-12 !rounded-xl !py-4 font-black italic shadow-2xl">Arena Status</Link>
                 <Link href="/dashboard" className="btn btn-ghost !px-10 !rounded-xl !py-4 border-white/5 font-black italic">Operator Console</Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
