'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PlatformStats, HomeMatch } from '@/types';
import { ArrowRight, Check, Trophy, Zap, Users, Wallet, Globe, Activity, Radio, Clock, Shield } from 'lucide-react';

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
  { label: 'Register', desc: 'Create your elite account and join the arena.' },
  { label: 'Analyze', desc: 'Study upcoming matches and expert insights.' },
  { label: 'Predict', desc: 'Submit your 3-day sequence of calculated picks.' },
  { label: 'Maintain', desc: 'Secure your streak across consecutive matchdays.' },
  { label: 'Collect', desc: 'Unlock and withdraw your 10X reward multiplier.' },
];

export default function HomeClient({ stats }: { stats: PlatformStats }) {
  const [matches] = useState<HomeMatch[]>([
    { id: 1, day: 'Day 1', match: 'ARS vs CHE', status: 'correct', time: 'FT', pick: 'ARS' },
    { id: 2, day: 'Day 2', match: 'MCI vs LIV', status: 'open', time: 'Live', pick: null },
    { id: 3, day: 'Day 3', match: 'PSG vs RMA', status: 'locked', time: 'Tomorrow', pick: null },
  ]);

  return (
    <div className="relative min-h-screen bg-primary">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[15%] right-[10%] w-[400px] h-[400px] bg-gold-glow blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[25%] left-[5%] w-[300px] h-[300px] bg-blue-glow blur-[100px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left: Value Prop */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="badge-elite !text-gold mb-8 animate-slide-up bg-white/[0.03]">
                 <Radio className="w-3 h-3 text-gold animate-pulse mr-2" /> 
                 <span>Season 0{stats.roundsCompleted + 1} Arena Live</span>
              </div>

              <h1 className="mb-8 animate-slide-up">
                Predict. <br />
                <span className="text-gradient-gold">Perform.</span> <br />
                Prevail.
              </h1>

              <p className="max-w-lg text-muted text-sm md:text-base font-medium opacity-60 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                The premier platform for elite sports analytics. Build a high-integrity 3-day sequence to unlock verified 10X reward multipliers.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link href="/accounts" className="btn btn-primary !px-10 !py-4 shadow-2xl">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link href="/how-it-works" className="btn btn-ghost !px-10 !py-4">How It Works</Link>
              </div>

              <div className="mt-16 flex flex-wrap items-center justify-center lg:justify-start gap-12 animate-slide-up opacity-40" style={{ animationDelay: '0.3s' }}>
                <div className="flex flex-col gap-1">
                   <div className="text-xl font-bold text-white tracking-tight">₦1,000</div>
                   <div className="text-[10px] font-black uppercase tracking-widest italic">Entry</div>
                </div>
                <div className="w-px h-8 bg-white/10 hidden md:block" />
                <div className="flex flex-col gap-1">
                   <div className="text-xl font-bold text-white tracking-tight">10X</div>
                   <div className="text-[10px] font-black uppercase tracking-widest italic">Payout Cap</div>
                </div>
                <div className="w-px h-8 bg-white/10 hidden md:block" />
                <div className="flex flex-col gap-1">
                   <div className="text-xl font-bold text-white tracking-tight">Instant</div>
                   <div className="text-[10px] font-black uppercase tracking-widest italic">Withdrawal</div>
                </div>
              </div>
            </div>

            {/* Right: Premium Visual */}
            <div className="lg:col-span-5 relative group animate-fade-in order-first lg:order-last">
              <div className="absolute inset-0 bg-gold/10 blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />
              
              <div className="card-elite !p-8 !bg-[#080a0f] border-white/5 shadow-3xl scale-95 md:scale-100 transition-all duration-700">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center text-gold">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white tracking-widest">ARENA_LIVE</span>
                        <span className="text-[8px] font-bold text-muted opacity-40 tracking-wider">SEQUENCE ACTIVE</span>
                      </div>
                   </div>
                   <div className="badge-elite !px-2 !py-1 !text-success bg-success/5 border-success/10 italic">
                     SYNCED
                   </div>
                </div>

                <div className="space-y-3 mb-8">
                  {matches.map((m, i) => (
                    <div key={i} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                      m.status === 'open' ? 'bg-white/[0.04] border-white/10' : 'bg-transparent border-transparent opacity-30'
                    }`}>
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] font-black text-muted italic w-8">{m.day}</span>
                        <span className="text-xs font-bold text-white tracking-tight">{m.match}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {m.status === 'correct' ? <Check className="w-4 h-4 text-success" /> : m.status === 'open' ? <div className="px-2 py-0.5 rounded-full bg-blue-electric/10 text-[8px] font-bold text-blue-electric animate-pulse tracking-widest">LIVE</div> : <Clock className="w-4 h-4 opacity-20" />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/[0.02] rounded-xl p-6 border border-white/5 relative overflow-hidden">
                   <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.3em] mb-3 opacity-30">
                      <span>Streak Integrity</span>
                      <span className="text-gold">Unlocked</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-grad-premium shadow-glow-gold transition-all duration-1000" style={{ width: '100%' }} />
                   </div>
                </div>

                {/* Floating Reward Badge */}
                <div className="absolute -bottom-6 -right-6 card-elite !p-6 !bg-black border-gold/20 shadow-3xl group-hover:-translate-y-2 transition-transform duration-700 animate-float">
                   <div className="flex flex-col items-center gap-1">
                     <Trophy className="w-6 h-6 text-gold mb-1" />
                     <span className="text-[8px] font-black text-muted uppercase tracking-widest opacity-40">Multiplier</span>
                     <span className="text-3xl font-black text-white italic tracking-tighter">10X</span>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Proof/Metrics Section */}
      <section className="relative z-10 py-24 bg-black/20 border-y border-white/5 backdrop-blur-3xl">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center lg:text-left">
            {[
              { label: 'Active Seats', value: stats.activeChallengers, icon: <Users className="w-4 h-4" /> },
              { label: 'Completed Series', value: stats.roundsCompleted, icon: <Zap className="w-4 h-4" /> },
              { label: 'Perfect Sequences', value: stats.perfectStreaks, icon: <Check className="w-4 h-4" /> },
              { label: 'Total Payout', prefix: '₦', value: stats.totalCashPaid, icon: <Wallet className="w-4 h-4" /> },
            ].map((m, i) => (
              <div key={i} className="flex flex-col gap-3 group">
                <div className="flex items-center justify-center lg:justify-start gap-2.5 text-muted/30 group-hover:text-gold/50 transition-colors">
                  {m.icon}
                  <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                </div>
                <div className="text-3xl md:text-5xl font-black text-white tracking-tighter italic">
                  <Counter end={m.value} prefix={m.prefix} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="relative z-10 py-32 container">
        <div className="text-center mb-20">
          <div className="badge-elite !text-gold mb-6 italic">How It Works</div>
          <h2 className="mb-6">The Sequence <span className="text-gradient-gold">Protocol.</span></h2>
          <p className="text-muted text-xs font-bold opacity-30 max-w-sm mx-auto uppercase tracking-widest leading-loose">Build 3-day winning sequences to multiply your entry 10X.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {STEPS.map((step, i) => (
            <div key={i} className="card-elite !p-8 group hover:border-gold/30 hover:-translate-y-1 transition-all duration-500">
               <div className="text-4xl font-black text-white italic opacity-[0.02] absolute top-4 right-6 group-hover:opacity-[0.08] transition-opacity pointer-events-none">{i + 1}</div>
               <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold mb-10 shadow-glow-gold group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
               </div>
               <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">{step.label}</h3>
               <p className="text-[10px] text-muted font-bold opacity-40 leading-relaxed uppercase tracking-widest">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 container">
        <div className="card-elite !p-20 md:!p-32 text-center bg-[#05070a] border-gold/10 shadow-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-16 opacity-[0.01] pointer-events-none group-hover:opacity-10 transition-all duration-1000"><Globe className="w-96 h-96" /></div>
           <div className="absolute bottom-0 left-0 p-16 opacity-[0.01] pointer-events-none group-hover:opacity-10 transition-all duration-1000"><Shield className="w-64 h-64" /></div>
           
           <div className="max-w-xl mx-auto relative z-10">
              <h2 className="mb-8">Start Your <br /><span className="text-gradient-gold">Winning Streak.</span></h2>
              <p className="text-muted text-xs font-bold opacity-30 mb-12 tracking-widest leading-loose uppercase">Join the arena today and claim your verified sports-tech rewards.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/accounts" className="btn btn-primary !px-12 !py-5 shadow-2xl">Create Account</Link>
                <Link href="/arena" className="btn btn-ghost !px-12 !py-5">View Live Arena</Link>
              </div>
           </div>
        </div>
      </section>

      <div className="h-10" />
    </div>
  );
}
