'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PlatformStats, HomeMatch } from '@/types';
import { ArrowRight, Check, ShieldCheck, Trophy, Zap, Users, Wallet, Globe, ArrowUpRight, Activity, Target, Radio, Clock } from 'lucide-react';

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
  { label: 'Node Setup', desc: 'Initialize your operational tier protocol.' },
  { label: 'Arena Access', desc: 'Connect to the live 72-hour challenge cycle.' },
  { label: 'Analyze Data', desc: 'Review match analytics and submit predictions.' },
  { label: 'Verify Streak', desc: 'Maintain sequence integrity through live updates.' },
  { label: 'Settlement', desc: 'Unlock and claim your verified 10X yield.' },
];

export default function HomeClient({ stats }: { stats: PlatformStats }) {
  const [matches] = useState<HomeMatch[]>([
    { id: 1, day: 'Cycle 01', match: 'ARS vs CHE', status: 'correct', time: 'Completed', pick: 'ARS' },
    { id: 2, day: 'Cycle 02', match: 'MCI vs LIV', status: 'open', time: 'Awaiting Pick', pick: null },
    { id: 3, day: 'Cycle 03', match: 'PSG vs RMA', status: 'locked', time: 'Scheduled', pick: null },
  ]);

  return (
    <div className="relative min-h-screen bg-primary">
      {/* Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full h-[800px] bg-grad-glow opacity-30 blur-[120px]" />
        <div className="absolute -bottom-[200px] -left-[100px] w-[600px] h-[600px] bg-blue-electric/5 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(255,255,255,0.01)_1.5px,transparent_1.5px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)] opacity-20" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-48 pb-32 overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="badge-elite mb-10 !px-4 !py-1.5 animate-slide-up">
                 <Radio className="w-1.5 h-1.5 text-success animate-pulse mr-2" /> 
                 ARENA CYCLE R-{stats.roundsCompleted + 1} LIVE
              </div>

              <h1 className="text-5xl md:text-8xl font-bold tracking-tight uppercase leading-[0.9] mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Predict. <br />
                <span className="text-gradient-gold italic">Perform.</span> <br />
                Scale.
              </h1>

              <p className="text-secondary text-sm md:text-base font-medium opacity-60 leading-relaxed mb-12 max-w-lg uppercase tracking-wide animate-slide-up" style={{ animationDelay: '0.2s' }}>
                The network's high-integrity prediction arena. <br className="hidden md:block" /> Connect your node, maintain streak protocols, and secure verified 10X settlements.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <Link href="/accounts" className="btn btn-primary px-10 py-4 rounded-2xl group shadow-[0_0_50px_rgba(197,160,89,0.15)]">
                  Initialize Node <ArrowUpRight className="w-4 h-4 ml-3 group-hover:translate-y--1 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/how-it-works" className="btn btn-ghost px-10 py-4 rounded-2xl border-white/5">Operational Guide</Link>
              </div>

              <div className="mt-16 flex items-center gap-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-4 text-left">
                   <div className="text-2xl font-bold text-white font-mono tracking-tighter italic">100%</div>
                   <div className="text-[9px] text-muted font-bold uppercase tracking-[0.2em] opacity-40 leading-tight">
                      Protocol <br /> Verification
                   </div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex items-center gap-4 text-left">
                   <div className="text-2xl font-bold text-white font-mono tracking-tighter italic">₦1,000</div>
                   <div className="text-[9px] text-muted font-bold uppercase tracking-[0.2em] opacity-40 leading-tight">
                      Referral <br /> Settlement
                   </div>
                </div>
              </div>
            </div>

            {/* Console Preview */}
            <div className="relative group animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0 bg-blue-electric/10 blur-[160px] opacity-20 pointer-events-none" />
              <div className="card-elite p-12 bg-grad-glow border-gold/10 transform rotate-2 hover:rotate-0 transition-all duration-700 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold"><Activity className="w-5 h-5" /></div>
                      <div className="text-xs font-bold text-white uppercase tracking-widest">Arena Monitor</div>
                   </div>
                   <div className="badge-elite !text-success !bg-success/5 border-success/20">OPERATIONAL</div>
                </div>

                <div className="flex flex-col gap-4 mb-10 text-left">
                  {matches.map((m, i) => (
                    <div key={i} className={`p-5 rounded-2xl border flex items-center justify-between group/match ${
                      m.status === 'open' ? 'bg-blue-electric/5 border-blue-electric/20' : 'bg-white/[0.02] border-white/5 opacity-50'
                    }`}>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-muted uppercase font-mono">{m.day}</span>
                        <span className="text-xs font-bold text-white uppercase tracking-tight">{m.match}</span>
                      </div>
                      <div className="text-[9px] font-bold text-muted uppercase tracking-widest">
                        {m.status === 'correct' ? <Check className="w-3.5 h-3.5 text-success" /> : m.status === 'open' ? <span className="text-blue-electric">PENDING</span> : <Clock className="w-3.5 h-3.5 opacity-20" />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card-elite !p-6 !bg-black/60 border-white/5 mb-4">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] mb-4 opacity-40">
                      <span>STREAK INTEGRITY</span>
                      <span className="text-gold">33.3% COMPLETED</span>
                   </div>
                   <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-grad-gold shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all duration-1000" style={{ width: '33.3%' }} />
                   </div>
                </div>
              </div>

              {/* Float Widget */}
              <div className="absolute -bottom-8 -right-8 card-elite p-8 border-gold/20 bg-black/80 shadow-2xl animate-slide-up" style={{ animationDelay: '0.8s' }}>
                 <div className="flex flex-col items-center gap-3">
                    <Trophy className="w-6 h-6 text-gold" />
                    <div className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-40">TARGET REWARD</div>
                    <div className="text-3xl font-bold text-white tracking-tighter italic font-mono">10X YIELD</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network Metrics */}
      <section className="relative z-10 py-16 border-y border-white/5 bg-black/20 backdrop-blur-3xl">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 text-center lg:text-left">
            {[
              { label: 'Active Operators', value: stats.activeChallengers, icon: <Users className="w-4 h-4" /> },
              { label: 'Arena Cycles', value: stats.roundsCompleted, icon: <Activity className="w-4 h-4" /> },
              { label: 'Integrity High', value: stats.perfectStreaks, icon: <ShieldCheck className="w-4 h-4" /> },
              { label: 'Total Settled', prefix: '₦', value: stats.totalCashPaid, icon: <Wallet className="w-4 h-4" /> },
            ].map((m, i) => (
              <div key={i} className="flex flex-col gap-3 group">
                <div className="flex items-center justify-center lg:justify-start gap-3 text-muted/30 group-hover:text-gold/40 transition-colors">
                  {m.icon}
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{m.label}</span>
                </div>
                <div className="text-3xl md:text-5xl font-bold text-white tracking-tighter italic font-mono">
                  <Counter end={m.value} prefix={m.prefix} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Procedural Sequence */}
      <section className="relative z-10 py-32 container">
        <div className="text-center mb-24">
          <div className="badge-elite !text-gold mb-8 opacity-40">METHODOLOGY</div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight uppercase mb-8">Establish Your <span className="text-gradient-gold">Record.</span></h2>
          <p className="text-secondary text-sm font-medium opacity-40 max-w-lg mx-auto uppercase tracking-wide leading-relaxed">Systematic protocol for node initialization and reward settlement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {STEPS.map((step, i) => (
            <div key={i} className="card-elite !p-10 group hover:border-gold/30 hover:-translate-y-2 transition-all duration-500">
               <div className="text-4xl font-black text-white italic opacity-[0.03] group-hover:opacity-10 transition-opacity absolute top-2 right-4 pointer-events-none">{i + 1}</div>
               <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold mb-12 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
               </div>
               <h3 className="text-base font-bold text-white uppercase tracking-tight mb-4">{step.label}</h3>
               <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-relaxed opacity-40 italic">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Global CTA */}
      <section className="relative z-10 pt-16 pb-48 container">
        <div className="card-elite p-16 md:p-32 text-center relative overflow-hidden bg-grad-glow border-gold/10">
           <div className="absolute top-0 right-0 p-16 opacity-[0.03] -rotate-12"><Globe className="w-64 h-64" /></div>
           <div className="max-w-2xl mx-auto relative z-10">
              <h2 className="text-5xl md:text-9xl font-bold tracking-tight uppercase mb-12 leading-none italic pb-2">Ready to <br /><span className="text-gradient-gold">Scale?</span></h2>
              <p className="text-secondary text-sm font-medium opacity-40 mb-16 uppercase tracking-widest leading-relaxed max-w-sm mx-auto">Analyze the arena, build your sequence, and join the verified settlement ledger.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/accounts" className="btn btn-primary px-16 py-5 rounded-3xl font-bold text-[13px]">Initialize Connection</Link>
                <Link href="/live-challenges" className="btn btn-ghost px-12 py-5 rounded-3xl border-white/10 font-bold text-[13px]">Explore Arena</Link>
              </div>
           </div>
        </div>
      </section>

      {/* Footer Utility Spacer */}
      <div className="h-24" />
    </div>
  );
}
