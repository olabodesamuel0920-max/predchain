'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Trophy, ArrowUpRight, Globe, ShieldCheck, Zap, DollarSign } from 'lucide-react';
import { PlatformStats } from '@/types';

interface WinnersClientProps {
  winners: Array<{
    id: string;
    payout_amount: number;
    created_at: string;
    profile?: { username?: string; full_name?: string };
    round?: { round_number: number };
  }>;
  stats: PlatformStats;
}

export default function WinnersClient({ winners, stats }: WinnersClientProps) {

  return (
    <div className="relative min-h-screen pt-24 sm:pt-32 pb-24">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-muted/5 blur-[120px]" />
      </div>

      <div className="container-tight relative z-10 px-4 sm:px-0">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 sm:mb-32 items-stretch">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 card-luxury !p-12 sm:!p-20 bg-[#07090e] border-white/10 flex flex-col justify-center relative overflow-hidden group depth-card shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)]"
          >
             <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:opacity-[0.05] transition-all duration-1000 rotate-12 pointer-events-none"><Trophy className="w-64 h-64" /></div>
             <div className="badge-luxury mb-10 px-6 py-2 bg-white/[0.03] uppercase italic font-black tracking-[0.4em] w-fit text-[9px]">ARENA_REWARDS</div>
             <h1 className="mb-6 uppercase italic font-black leading-none tracking-tighter text-5xl sm:text-7xl text-white">Verified <span className="text-gradient-gold">Winners.</span></h1>
             <p className="text-text-dim text-base sm:text-lg font-medium opacity-40 max-w-lg leading-relaxed italic group-hover:opacity-100 transition-opacity duration-700">
                A cryptographically transparent record of challengers who successfully forged their streaks and secured automated rewards.
             </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 card-luxury !p-12 bg-black border-gold/15 flex flex-col items-center justify-center text-center shadow-[0_40px_80px_-20px_rgba(242,201,76,0.1)] relative overflow-hidden group depth-card"
          >
             <div className="absolute inset-0 bg-gold/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
             <div className="text-[10px] font-black text-gold uppercase tracking-[0.4em] mb-8 italic opacity-40">Cumulative Payouts</div>
              <div className="text-5xl sm:text-6xl font-black text-white italic tracking-tighter leading-none mb-10 font-display transition-transform group-hover:scale-110 duration-700">
                 ₦{stats.totalCashPaid.toLocaleString()}
              </div>
             <div className="flex items-center gap-3 text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-5 py-2.5 rounded-2xl border border-emerald-500/10 italic glass-layered shadow-inner">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                Live Network Ledger
             </div>
          </motion.div>
        </div>

        {/* Winners Grid */}
        <div className="space-y-10 mb-32">
          <div className="flex items-center gap-5 px-4 opacity-30">
             <Trophy className="w-5 h-5 text-gold/60" />
             <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-white italic">Recent Reward Distributions</h2>
             <div className="flex-1 h-px bg-white/5 ml-8" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {winners.length === 0 ? (
               <div className="card-luxury !p-40 text-center col-span-full border border-white/5 bg-[#07090e] rounded-[3rem] shadow-inner opacity-20 group">
                  <Zap className="w-12 h-12 mx-auto mb-8 text-gold/20 animate-pulse group-hover:text-gold/40 transition-colors" />
                  <p className="text-[12px] font-black uppercase tracking-[0.5em] italic opacity-40 leading-none">Awaiting next streak confirmation...</p>
               </div>
            ) : (
                  winners.map((w, i) => {
                    const name = w.profile?.username || w.profile?.full_name || 'ANONYMOUS_CHALLENGER';
                    
                    return (
                      <motion.div 
                        key={w.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="card-luxury !p-10 bg-[#07090e] border-white/10 flex flex-col gap-10 group hover:border-gold/30 transition-all duration-700 shadow-2xl depth-card"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[13px] font-black text-gold italic shadow-inner group-hover:rotate-12 transition-transform duration-500 group-hover:bg-gold group-hover:text-black">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="text-lg font-black text-white uppercase tracking-tighter truncate italic font-display group-hover:text-gold transition-colors">@{name}</div>
                            <div className="flex items-center gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
                               <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                               <span className="text-[8px] font-black text-text-dim uppercase tracking-[0.3em] italic">Network Verified</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-black/60 p-7 rounded-[2rem] flex items-center justify-between border border-white/5 shadow-inner group-hover:border-gold/10 transition-all duration-700 glass-layered">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-text-dim uppercase tracking-[0.3em] italic opacity-30 mb-1">REWARD</span>
                            <span className="text-3xl font-black text-white italic tracking-tighter font-display group-hover:text-gold transition-colors duration-700 leading-none">₦{w.payout_amount.toLocaleString()}</span>
                          </div>
                          <div className="text-right flex flex-col gap-1">
                            <span className="text-[9px] font-black text-text-dim uppercase tracking-[0.3em] italic opacity-30 mb-1">STREAK</span>
                            <span className="text-2xl font-black text-emerald-500 italic leading-none transition-transform group-hover:scale-110 duration-700">3/3</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-text-dim italic opacity-20 group-hover:opacity-40 transition-opacity">
                          <span>CYCLE {(w.round?.round_number || 0).toString().padStart(2, '0')}</span>
                          <span>{new Date(w.created_at).toLocaleDateString()}</span>
                        </div>
                      </motion.div>
                    );
                  })
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="card-luxury-gold !p-16 sm:!p-24 text-center border-gold/15 max-w-4xl mx-auto mb-32 group relative shadow-[0_60px_120px_-40px_rgba(242,201,76,0.15)] rounded-[4rem]"
        >
           <div className="absolute inset-0 bg-[#05070a]" />
           <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.05] to-transparent opacity-50" />
           <div className="max-w-2xl mx-auto relative z-10">
              <h2 className="mb-8 text-5xl md:text-7xl uppercase italic font-black leading-none text-white tracking-tighter">Claim Your <br /><span className="text-gradient-gold">Position.</span></h2>
              <p className="text-text-secondary text-sm font-medium mb-16 leading-relaxed italic opacity-60">
                The record is set. Successful streaks trigger instant payouts. Start your prediction circuit today and command the arena.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Link href="/accounts" className="btn-luxury btn-gold btn-premium-depth !py-5 !px-16 !text-[12px] font-black italic tracking-[0.2em] shadow-2xl uppercase">
                  START STREAK <ArrowUpRight className="w-5 h-5 ml-3" />
                </Link>
                <Link href="/arena" className="btn-luxury btn-outline btn-premium-depth !py-5 !px-16 !text-[12px] font-black italic tracking-[0.2em] border-white/10 bg-white/[0.02] uppercase">LIVE FIXTURES</Link>
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
