'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PlatformStats, HomeMatch } from '@/types';
import { 
  Users, 
  Zap, 
  Wallet, 
  Trophy, 
  PlayCircle, 
  ArrowUpRight, 
  ChevronRight, 
  Activity, 
  Star, 
  Clock, 
  Globe,
  CheckCircle2,
  Shield
} from 'lucide-react';
import HeroMoment from './HeroMoment';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ── Animated Counter ── */
function Counter({ end, prefix = '', suffix = '', duration = 2000 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isVisible = useRef(false);

  useEffect(() => {
    let animationFrame: number;
    const startAnimation = () => {
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * end));
        if (progress < 1) animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible.current) {
          isVisible.current = true;
          startAnimation();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
      // Fallback: check if already in viewport
      const rect = ref.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        isVisible.current = true;
        startAnimation();
      }
    }
    
    // If end value changes and we are already visible, restart animation
    if (isVisible.current && end > 0) {
      startAnimation();
    }
    
    return () => {
      observer.disconnect();
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [end, duration]);

  return <span ref={ref}>{prefix}{count === 0 && end > 0 ? end.toLocaleString() : count.toLocaleString()}{suffix}</span>;
}

const STEPS = [
  { label: 'Join', desc: 'Secure your membership and enter the high-performance match arena.' },
  { label: 'Analyze', desc: 'Study the upcoming fixtures with real-time match data.' },
  { label: 'Predict', desc: 'Lock in one precise match outcome every 24 hours. Precision is the key to maintaining your position in the winning arena.' },
  { label: 'Hold', desc: 'Maintain your perfect accuracy across consecutive matchdays.' },
  { label: 'Win', desc: 'Unlock and instantly withdraw your 10X reward multipliers.' },
];

export default function HomeClient({ stats }: { stats: PlatformStats }) {
  const [matches] = useState<HomeMatch[]>([
    { id: 1, day: 'Day 1', match: 'ARS vs MUN', status: 'correct', time: 'FT', pick: 'ARS' },
    { id: 2, day: 'Day 2', match: 'LIV vs MCI', status: 'open', time: 'Live', pick: null },
    { id: 3, day: 'Day 3', match: 'RMA vs FCB', status: 'locked', time: 'Tomorrow', pick: null },
  ]);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -50]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const y3 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <div className="relative min-h-screen">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-blue-glow blur-[120px] rounded-full opacity-20" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-gold-glow blur-[120px] rounded-full opacity-10" />
      </div>
            {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-12 sm:pt-36 sm:pb-24 overflow-x-hidden">
        <div className="container-tight">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            
            {/* Left: Value Prop */}
            <div className="flex-1 text-center lg:text-left relative z-20">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 badge-luxury mb-8 px-5 py-2 backdrop-blur-3xl bg-gold/5 border-gold/20 shadow-inner"
              >
                 <div className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_10px_rgba(242,201,76,0.8)]" /> 
                 <span className="font-display tracking-[0.2em] font-black pb-px text-[9px] italic text-gold">Live Arena Feed</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-8 tracking-tighter leading-[1] font-display font-black italic uppercase text-white text-4xl xs:text-5xl sm:text-8xl"
              >
                Command the <br />
                <span className="text-gradient-gold">Match Arena.</span>
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-6 mb-10 opacity-60 hover:opacity-100 transition-opacity"
              >
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-lg bg-[#0a0d14] border border-white/10 flex items-center justify-center text-[8px] font-black text-gold italic shadow-xl">
                        {String.fromCharCode(64+i)}
                      </div>
                    ))}
                 </div>
                 <span className="text-[10px] font-black text-white uppercase italic tracking-widest">{stats.activeChallengers.toLocaleString()}+ Players Active</span>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-xl mx-auto lg:mx-0 text-text-secondary text-base sm:text-lg font-medium leading-relaxed mb-10 opacity-40 italic"
              >
                The high-performance arena for elite football predictions. 
                Build consistency, hold your streak, and unlock verified <span className="text-white font-black">10X rewards</span>.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
              >
                <Link href="/accounts" className="btn-luxury btn-gold btn-premium-depth !py-5 !px-16 group shadow-2xl">
                  <span className="pb-px font-black italic tracking-widest text-[11px] uppercase">Join Now</span>
                  <ArrowUpRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
                <Link href="/how-it-works" className="btn-luxury btn-outline btn-premium-depth !py-5 !px-16 group border-white/10 bg-white/[0.02]">
                  <PlayCircle className="w-4.5 h-4.5 mr-3 text-gold/60" /> 
                  <span className="pb-px font-black italic tracking-widest text-[11px] uppercase">How it Works</span>
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 border-t border-white/5 pt-8 sm:pt-10 max-w-lg mx-auto lg:mx-0"
              >
                <div className="flex flex-col gap-2 group cursor-default">
                   <div className="text-2xl font-black font-display text-white italic tracking-tighter uppercase transition-colors group-hover:text-gold leading-none">₦5k—20k</div>
                   <div className="text-[8px] font-black text-text-dim uppercase tracking-[0.4em] italic opacity-40">Entry Fee</div>
                </div>
                <div className="flex flex-col gap-2 group cursor-default">
                   <div className="text-2xl font-black font-display text-white italic tracking-tighter uppercase transition-colors group-hover:text-gold leading-none">₦50k—200k</div>
                   <div className="text-[8px] font-black text-text-dim uppercase tracking-[0.4em] italic opacity-40">Streak Reward</div>
                </div>
                <div className="flex flex-col gap-2 col-span-2 md:col-span-1 group cursor-default">
                   <div className="text-2xl font-black font-display text-white italic tracking-tighter uppercase transition-colors group-hover:text-gold leading-none">INSTANT</div>
                   <div className="text-[8px] font-black text-text-dim uppercase tracking-[0.4em] italic opacity-40">Direct Payouts</div>
                </div>
              </motion.div>
            </div>

            {/* Right: High Fidelity UI Visual */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 relative w-full perspective-container py-10 lg:py-20"
            >
              <div className="relative w-full max-w-2xl mx-auto lg:ml-auto">
                {/* Hero Moment Animation */}
                <div className="relative z-10">
                   <HeroMoment />
                </div>

                {/* Floating Data Layer (Match Card) - Hidden on smallest mobile, simplified on tablets */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 2.8, duration: 1 }}
                  className="absolute -bottom-10 -left-10 md:-left-20 w-[280px] md:w-[320px] z-20 pointer-events-none hidden md:block"
                >
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="card-luxury !bg-[#07090e]/90 backdrop-blur-2xl border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] p-0 overflow-hidden depth-card"
                  >
                    <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
                             <Activity className="w-4 h-4 text-gold" />
                          </div>
                          <span className="text-[8px] font-black text-gold/60 uppercase tracking-[0.2em] italic">Arena Data Stream</span>
                       </div>
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="p-6 space-y-3">
                       {matches.slice(0, 2).map((m, i) => (
                         <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-black/40">
                            <span className="text-[8px] font-black text-text-dim uppercase italic opacity-40">{m.day}</span>
                            <span className="text-[10px] font-black text-white italic uppercase tracking-tight">{m.match}</span>
                            <div className="w-2 h-2 rounded-full bg-gold/20 border border-gold/40" />
                         </div>
                       ))}
                    </div>
                  </motion.div>
                </motion.div>

                {/* Secondary Detail Layer */}
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 3.2 }}
                   className="absolute -top-10 -right-10 w-40 h-40 bg-[#07090e]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl z-0 hidden md:block lg:hidden xl:block preserve-3d"
                >
                   <div className="space-y-4 opacity-40">
                      <div className="flex items-center gap-3">
                         <Star className="w-4 h-4 text-gold" />
                         <span className="text-[8px] font-black text-white uppercase italic tracking-widest">Live Sync</span>
                      </div>
                      <div className="h-px bg-white/5" />
                      <div className="space-y-2">
                         <div className="h-1 bg-white/10 rounded-full w-full" />
                         <div className="h-1 bg-white/10 rounded-full w-2/3" />
                      </div>
                   </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="relative z-10 py-12 sm:py-24 border-y border-white/5 bg-[#030508]/50 backdrop-blur-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/[0.02] via-transparent to-gold/[0.02] pointer-events-none" />
        <div className="container-tight">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16">
            {[
              { label: 'Active Challengers', value: stats.activeChallengers, icon: <Users className="w-4 h-4" /> },
              { label: 'Verified Victories', value: stats.perfectStreaks, icon: <Trophy className="w-4 h-4" /> },
              { label: 'Platform Payouts', prefix: '₦', value: stats.totalCashPaid, icon: <Wallet className="w-4 h-4" /> },
              { label: 'Match Cycles', value: stats.roundsCompleted, icon: <Zap className="w-4 h-4" /> },
            ].map((m, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-5 group"
              >
                <div className="flex items-center gap-4 text-text-dim group-hover:text-gold transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/20 transition-all shadow-inner">{m.icon}</div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] italic opacity-40 group-hover:opacity-100">{m.label}</span>
                </div>
                 <div className="text-4xl sm:text-6xl font-black font-display text-white italic tracking-tighter uppercase leading-none group-hover:scale-105 transition-transform origin-left">
                   <Counter end={m.value} prefix={m.prefix} />
                 </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative z-10 py-24 sm:py-32 container-tight">
        <div className="flex flex-col items-center text-center mb-20 sm:mb-24">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="badge-luxury mb-10 px-8 py-2 bg-white/[0.02] border-white/10 italic font-black uppercase tracking-[0.4em] text-[9px] text-gold"
          >
            How it Works
          </motion.div>
          <h2 className="mb-8 uppercase italic font-black text-5xl sm:text-8xl leading-none tracking-tighter text-white">How to Command <br />the <span className="text-gradient-gold">Elite Arena.</span></h2>
          <p className="text-text-secondary max-w-2xl font-medium leading-relaxed italic opacity-40 text-lg sm:text-xl">
            PredChain is designed for the high-performance analyst. Leverage real-time data, hold your streak, and secure your place among the elite.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {STEPS.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-luxury !p-12 group hover:border-gold/30 transition-all duration-700 bg-[#07090e] shadow-2xl relative overflow-hidden flex flex-col justify-between h-full depth-card"
            >
               <div className="absolute top-0 right-0 p-10 text-[50px] font-black text-white/[0.01] italic leading-none pointer-events-none group-hover:text-gold/[0.04] transition-all duration-1000 uppercase">0{i + 1}</div>
               <div>
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gold/20 mb-12 group-hover:bg-gold group-hover:text-black transition-all duration-700 shadow-inner group-hover:rotate-12">
                    <Star className="w-7 h-7" />
                  </div>
                  <h3 className="text-[14px] font-black text-white uppercase tracking-[0.15em] mb-6 font-display italic leading-none group-hover:text-gold transition-colors">{step.label}</h3>
                  <p className="text-[11px] text-text-dim font-black leading-loose uppercase tracking-widest opacity-30 group-hover:opacity-100 transition-opacity italic">{step.desc}</p>
               </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 sm:py-32 container-tight">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-luxury-gold !p-10 xs:!p-16 sm:!p-32 text-center border-gold/10 relative overflow-hidden group rounded-[3rem] shadow-[0_50px_100px_-30px_rgba(242,201,76,0.15)]"
        >
           <div className="absolute inset-0 bg-[#05070a]" />
           <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.05] to-transparent opacity-50" />
           <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none group-hover:opacity-10 transition-all duration-1000 rotate-12"><Globe className="w-96 h-96" /></div>
           <div className="absolute bottom-0 left-0 p-32 opacity-[0.03] pointer-events-none group-hover:opacity-10 transition-all duration-1000 -rotate-12"><Shield className="w-64 h-64" /></div>
           
           <div className="max-w-2xl mx-auto relative z-10">
              <h2 className="mb-8 text-4xl xs:text-5xl sm:text-7xl uppercase italic font-black leading-none tracking-tighter">Enter the <br /><span className="text-gradient-gold">Match Arena.</span></h2>
              <p className="text-text-secondary mb-12 text-base font-medium leading-relaxed italic opacity-60">Gain instant access to the world&apos;s premier high-performance sports arena. Secure your membership and start your first streak today.</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/signup" className="btn-luxury btn-gold btn-premium-depth !py-5 !px-16 !text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl italic">CREATE ACCOUNT</Link>
                <Link href="/arena" className="btn-luxury btn-outline btn-premium-depth !py-5 !px-16 !text-[11px] font-black uppercase tracking-[0.2em] border-white/10 bg-white/[0.02] italic">EXPLORE ARENA</Link>
              </div>
           </div>
        </motion.div>
      </section>

      <div className="h-32" />
    </div>
  );
}
