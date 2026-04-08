'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PlatformStats, HomeMatch } from '@/types';
import { ArrowRight, Check, Trophy, Zap, Users, Wallet, Globe, Activity, Radio, Clock, Shield, Star, PlayCircle } from 'lucide-react';

/* ── Animated Counter ── */
function Counter({ end, prefix = '', suffix = '', duration = 2000 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

const STEPS = [
  { label: 'Register', desc: 'Secure your elite account and join the prediction pool.' },
  { label: 'Analyze', desc: 'Leverage data-driven insights for upcoming match fixtures.' },
  { label: 'Predict', desc: 'Submit your 3-day winning sequence of calculated picks.' },
  { label: 'Consistency', desc: 'Maintain your winning streak across consecutive matchdays.' },
  { label: 'Harvest', desc: 'Unlock and instantly withdraw your 10X reward multipliers.' },
];

export default function HomeClient({ stats }: { stats: PlatformStats }) {
  const [matches] = useState<HomeMatch[]>([
    { id: 1, day: 'Day 1', match: 'ARS vs MUN', status: 'correct', time: 'FT', pick: 'ARS' },
    { id: 2, day: 'Day 2', match: 'LIV vs MCI', status: 'open', time: 'Live', pick: null },
    { id: 3, day: 'Day 3', match: 'RMA vs FCB', status: 'locked', time: 'Tomorrow', pick: null },
  ]);

  return (
    <div className="relative min-h-screen">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-blue-glow blur-[120px] rounded-full opacity-20" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-gold-glow blur-[120px] rounded-full opacity-10" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 md:pt-60 md:pb-40 overflow-hidden">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            
            {/* Left: Value Prop */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 badge-premium !text-gold mb-10 px-5 py-2 backdrop-blur-md">
                 <Radio className="w-3 h-3 text-gold animate-pulse" /> 
                 <span className="font-display">Live Tournament Arena Active</span>
              </div>

              <h1 className="mb-10 tracking-tight leading-[1.05]">
                Master the <br />
                <span className="text-gradient-gold">Winning Streak.</span>
              </h1>

              <p className="max-w-xl mx-auto lg:mx-0 text-secondary text-base md:text-lg font-medium leading-relaxed mb-12 opacity-80">
                The premier platform for high-performance sports predictions. 
                Build a 3-day winning sequence to unlock elite 10X reward multipliers per matchday.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Link href="/accounts" className="btn btn-primary !px-12 !py-5 shadow-2xl group">
                  Start Your Streak <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/how-it-works" className="btn btn-secondary !px-12 !py-5 group">
                  <PlayCircle className="w-4 h-4 mr-2 text-gold/60" /> Watch the Guide
                </Link>
              </div>

              <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-10 opacity-70">
                <div className="flex flex-col gap-2">
                   <div className="text-2xl font-bold font-display text-white">₦5,000</div>
                   <div className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Tier Activation</div>
                </div>
                <div className="flex flex-col gap-2">
                   <div className="text-2xl font-bold font-display text-white">10X</div>
                   <div className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Reward Multiplier</div>
                </div>
                <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                   <div className="text-2xl font-bold font-display text-white">Instant</div>
                   <div className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Secure Withdrawals</div>
                </div>
              </div>
            </div>

            {/* Right: High Fidelity UI Visual */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-xl">
              <div className="absolute inset-0 bg-gold/10 blur-[100px] opacity-40 translate-y-10" />
              
              <div className="card-premium !bg-[#0a0c14] border-white/5 shadow-2xl relative z-10 p-0 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/10">
                        <Activity className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white uppercase tracking-wider">Tournament_01</div>
                        <div className="text-[10px] text-muted opacity-50 uppercase tracking-widest font-bold">Sequence Status: Active</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[10px] font-bold text-emerald-500 tracking-wider">SECURE</span>
                   </div>
                </div>

                <div className="p-8 space-y-4">
                  {matches.map((m, i) => (
                    <div key={i} className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 ${
                      m.status === 'open' ? 'bg-white/[0.04] border-gold/20' : 'bg-transparent border-white/5 opacity-40'
                    }`}>
                      <div className="flex items-center gap-6">
                        <span className="text-[10px] font-bold text-muted uppercase w-10">{m.day}</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white tracking-tight">{m.match}</span>
                          <span className="text-[8px] font-bold text-muted uppercase tracking-widest mt-1">H2H Verified</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {m.status === 'correct' ? <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center"><Check className="w-4 h-4 text-emerald-500" /></div> : m.status === 'open' ? <div className="px-3 py-1 rounded-lg bg-gold/10 text-[9px] font-bold text-gold border border-gold/20 animate-pulse">LIVE</div> : <Clock className="w-4 h-4 opacity-20" />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 pt-0">
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                     <div className="flex justify-between items-end mb-4 relative z-10">
                        <div>
                          <div className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-1">Current Reward Cap</div>
                          <div className="text-2xl font-bold font-display text-white">10.00x</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-2">Streak Progress</div>
                          <div className="flex gap-1.5">
                            {[1, 2, 3].map(i => (
                              <div key={i} className={`w-3 h-1.5 rounded-full ${i <= 2 ? 'bg-gold' : 'bg-white/10'}`} />
                            ))}
                          </div>
                        </div>
                     </div>
                     <div className="h-1.5 bg-white/5 rounded-full relative z-10">
                        <div className="h-full bg-grad-premium w-2/3 shadow-[0_0_15px_rgba(240,196,25,0.3)] transition-all duration-1000" />
                     </div>
                  </div>
                </div>

                {/* Floating Reward Card */}
                <div className="absolute -bottom-10 -right-10 bg-gold p-8 rounded-3xl shadow-2xl shadow-gold/30 hover:-translate-y-2 transition-transform duration-500 animate-float hidden md:block">
                   <div className="flex flex-col items-center gap-1 text-black">
                     <Star className="w-8 h-8 fill-current mb-2" />
                     <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Payout Multiplier</span>
                     <span className="text-5xl font-bold font-display leading-none">10X</span>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="relative z-10 py-32 border-y border-white/5 bg-white/[0.01] backdrop-blur-3xl overflow-hidden">
        <div className="container relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 text-center lg:text-left">
            {[
              { label: 'Active Challengers', value: stats.activeChallengers, icon: <Users className="w-5 h-5" /> },
              { label: 'Tournament Cycles', value: stats.roundsCompleted, icon: <Zap className="w-5 h-5" /> },
              { label: 'Verified Streaks', value: stats.perfectStreaks, icon: <Check className="w-5 h-5" /> },
              { label: 'Total Payouts', prefix: '₦', value: stats.totalCashPaid, icon: <Wallet className="w-5 h-5" /> },
            ].map((m, i) => (
              <div key={i} className="flex flex-col gap-4 group">
                <div className="flex items-center justify-center lg:justify-start gap-4 text-muted group-hover:text-gold transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">{m.icon}</div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{m.label}</span>
                </div>
                <div className="text-4xl md:text-6xl font-bold font-display text-white tracking-tighter">
                  <Counter end={m.value} prefix={m.prefix} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative z-10 py-40 container">
        <div className="flex flex-col items-center text-center mb-24">
          <div className="badge-premium !text-gold mb-8 px-6 py-2 uppercase tracking-widest">Our Methodology</div>
          <h2 className="mb-8">How to Command the <br /><span className="text-gradient-gold">Prediction Pool.</span></h2>
          <p className="text-secondary opacity-60 max-w-2xl font-medium leading-relaxed">A systematic approach to winning. Build consistency, analyze the field, and secure your rewards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {STEPS.map((step, i) => (
            <div key={i} className="card-premium !p-10 group hover:border-gold/40 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center md:items-start md:text-left">
               <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gold mb-10 group-hover:bg-gold group-hover:text-black transition-all">
                  <Star className="w-6 h-6" />
               </div>
               <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 font-display">Step {i + 1}: {step.label}</h3>
               <p className="text-xs text-muted font-medium opacity-60 leading-relaxed tracking-wide">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-40 container">
        <div className="card-premium !p-24 md:!p-40 text-center bg-[#07090e] border-gold/10 shadow-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none group-hover:opacity-10 transition-all duration-1000 rotate-12"><Globe className="w-96 h-96" /></div>
           <div className="absolute bottom-0 left-0 p-16 opacity-[0.03] pointer-events-none group-hover:opacity-10 transition-all duration-1000 -rotate-12"><Shield className="w-64 h-64" /></div>
           
           <div className="max-w-2xl mx-auto relative z-10">
              <h2 className="mb-10 text-5xl md:text-7xl leading-tight">Join the Elite <br /><span className="text-gradient-gold">Arena Pool.</span></h2>
              <p className="text-secondary opacity-60 mb-16 text-lg font-medium leading-relaxed">Create your account today and gain access to the premier sports performance arena.</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/signup" className="btn btn-primary !px-16 !py-6 text-base shadow-2xl">Create Account</Link>
                <Link href="/arena" className="btn btn-secondary !px-16 !py-6 text-base border-white/10">Explore Arena</Link>
              </div>
           </div>
        </div>
      </section>

      <div className="h-20" />
    </div>
  );
}
