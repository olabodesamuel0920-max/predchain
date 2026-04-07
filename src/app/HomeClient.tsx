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
  { label: 'Secure Access', desc: 'Activate your premium prediction profile.' },
  { label: 'Enter Arena', desc: 'Synchronize with the active 72-hour cycle.' },
  { label: 'Make Predictions', desc: 'Execute picks based on verified analytics.' },
  { label: 'Maintain Streak', desc: 'Keep your sequence intact through live matches.' },
  { label: 'Claim Rewards', desc: 'Unlock and secure your 10X reward multiplier.' },
];

export default function HomeClient({ stats }: { stats: PlatformStats }) {
  const [matches] = useState<HomeMatch[]>([
    { id: 1, day: 'Cycle-01', match: 'ARS vs CHE', status: 'correct', time: 'Completed', pick: 'ARS' },
    { id: 2, day: 'Cycle-02', match: 'MCI vs LIV', status: 'open', time: 'Awaiting Pick', pick: null },
    { id: 3, day: 'Cycle-03', match: 'PSG vs RMA', status: 'locked', time: 'Scheduled', pick: null },
  ]);

  return (
    <div className="relative min-h-screen bg-primary">
      {/* Background Cinematic Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-blue-electric/5 blur-[100px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-28 pb-16 md:pt-44 md:pb-24 overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="badge-elite !text-gold mb-10 animate-slide-up border-gold/10 !px-5 !py-1 !text-[9px] italic">
                 <Radio className="w-3 h-3 text-gold animate-pulse mr-2.5" /> 
                 <span>ARENA SESSION 0{stats.roundsCompleted + 1} // LIVE</span>
              </div>

              <h1 className="text-5xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase mb-10 animate-slide-up italic italic">
                Predict. <br />
                <span className="text-gradient-gold">Perform.</span> <br />
                Prevail.
              </h1>

              <p className="max-w-md text-muted text-[11px] md:text-xs font-black opacity-30 leading-relaxed mb-12 tracking-[0.3em] uppercase italic animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Build high-integrity 3-day sequences to unlock verified 10X reward settlement protocols.
              </p>

              <div className="flex flex-wrap gap-5 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <Link href="/accounts" className="btn btn-primary !px-12 !py-4.5 !rounded-xl italic font-black text-[13px] tracking-widest shadow-2xl transition-all hover:-translate-y-1">
                  Initiate Protocol <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/how-it-works" className="btn btn-ghost !px-10 !py-4.5 !rounded-xl italic font-black text-[12px] border-white/5">How it Works</Link>
              </div>

              <div className="mt-16 flex flex-wrap items-center justify-center lg:justify-start gap-10 md:gap-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex flex-col gap-1.5 group">
                   <div className="text-2xl font-black text-white italic tracking-tighter transition-colors group-hover:text-gold">₦1,000</div>
                   <div className="text-[8px] text-muted font-black uppercase tracking-[0.4em] opacity-20 italic">Entry authorization</div>
                </div>
                <div className="w-px h-10 bg-white/5 hidden md:block" />
                <div className="flex flex-col gap-1.5 group">
                   <div className="text-2xl font-black text-white italic tracking-tighter transition-colors group-hover:text-gold">10X</div>
                   <div className="text-[8px] text-muted font-black uppercase tracking-[0.4em] opacity-20 italic">Reward Multiplier</div>
                </div>
                <div className="w-px h-10 bg-white/5 hidden md:block" />
                <div className="flex flex-col gap-1.5 group">
                   <div className="text-2xl font-black text-white italic tracking-tighter transition-colors group-hover:text-gold">Instant</div>
                   <div className="text-[8px] text-muted font-black uppercase tracking-[0.4em] opacity-20 italic">Node Settlement</div>
                </div>
              </div>
            </div>

            {/* Right Console Preview */}
            <div className="lg:col-span-5 relative group animate-fade-in order-first lg:order-last" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0 bg-gold/5 blur-[120px] pointer-events-none group-hover:opacity-60 transition-opacity duration-1000" />
              
              <div className="card-elite !p-8 md:p-10 !bg-black/80 border-white/5 shadow-2xl scale-95 lg:scale-100 group-hover:scale-[1.03] transition-all duration-700">
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-8">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-gold shadow-inner">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">ARENA MONITOR</span>
                        <span className="text-[8px] font-black text-muted uppercase tracking-[0.3em] opacity-20 italic">Real-time Node Status</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-success/5 border border-success/10">
                      <div className="w-1 h-1 bg-success rounded-full animate-pulse shadow-glow-gold" />
                      <span className="text-[8px] font-black text-success uppercase tracking-widest">LIVE</span>
                   </div>
                </div>

                <div className="flex flex-col gap-3.5 mb-10">
                  {matches.map((m, i) => (
                    <div key={i} className={`p-4 rounded-xl border transition-all duration-500 flex items-center justify-between group/match ${
                      m.status === 'open' ? 'bg-white/[0.03] border-white/5' : 'bg-transparent border-transparent opacity-30 shadow-inner'
                    }`}>
                      <div className="flex items-center gap-5">
                        <span className="text-[8px] font-black text-muted/30 italic uppercase tracking-widest w-12">{m.day}</span>
                        <span className="text-[11px] font-black text-white uppercase tracking-tighter italic">{m.match}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {m.status === 'correct' ? (
                          <div className="w-5 h-5 rounded-lg bg-success/5 border border-success/20 flex items-center justify-center shadow-inner">
                            <Check className="w-3 h-3 text-success" />
                          </div>
                        ) : m.status === 'open' ? (
                          <div className="px-2 py-0.5 rounded-md bg-gold text-[7px] font-black text-black italic tracking-widest animate-pulse shadow-glow-gold">NODE ACTIVE</div>
                        ) : (
                          <Clock className="w-3 h-3 opacity-20" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/[0.02] rounded-xl p-6 border border-white/5 relative overflow-hidden shadow-inner">
                   <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.4em] mb-4 opacity-30 italic">
                      <span>INTEGRITY PROGRESS</span>
                      <span className="text-gold">33% SECURED</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-grad-gold shadow-glow-gold transition-all duration-1000" style={{ width: '33%' }} />
                   </div>
                </div>

                {/* Floating Multiplier Badge */}
                <div className="absolute -bottom-5 -right-5 card-elite !p-6 border-gold/10 bg-black shadow-3xl animate-slide-up group-hover:-translate-y-2 transition-transform duration-700" style={{ animationDelay: '0.8s' }}>
                   <div className="flex flex-col items-center gap-1.5">
                     <div className="w-8 h-8 rounded-lg bg-gold/5 flex items-center justify-center text-gold mb-1 shadow-inner"><Trophy className="w-4 h-4" /></div>
                     <span className="text-[7px] font-black text-muted uppercase tracking-[0.4em] opacity-30 italic">MULTIPLIER</span>
                     <span className="text-3xl font-black text-white italic tracking-tighter leading-none">10X</span>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Global Trust Metrics */}
      <section className="relative z-10 py-20 md:py-32 border-y border-white/5 backdrop-blur-3xl">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 text-center lg:text-left">
            {[
              { label: 'Active Operators', value: stats.activeChallengers, icon: <Users className="w-3.5 h-3.5" /> },
              { label: 'Network Cycles', value: stats.roundsCompleted, icon: <Activity className="w-3.5 h-3.5" /> },
              { label: 'High Integrity', value: stats.perfectStreaks, icon: <ShieldCheck className="w-3.5 h-3.5" /> },
              { label: 'Settled Yield', prefix: '₦', value: stats.totalCashPaid, icon: <Wallet className="w-3.5 h-3.5" /> },
            ].map((m, i) => (
              <div key={i} className="flex flex-col gap-4 group">
                <div className="flex items-center justify-center lg:justify-start gap-3 text-muted/20 group-hover:text-gold/40 transition-colors italic">
                  {m.icon}
                  <span className="text-[9px] font-black uppercase tracking-[0.4em]">{m.label}</span>
                </div>
                <div className="text-3xl md:text-6xl font-black text-white tracking-tighter italic leading-none transition-all group-hover:scale-105 origin-left">
                  <Counter end={m.value} prefix={m.prefix} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="relative z-10 py-24 md:py-32 container">
        <div className="text-center mb-16 md:mb-24">
          <div className="badge-elite !text-gold mb-8 italic">PLATFORM PROTOCOL</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 italic">Build Your <span className="text-gradient-gold">Sequence.</span></h2>
          <p className="text-muted text-[10px] md:text-[11px] font-black opacity-30 max-w-sm mx-auto uppercase tracking-[0.3em] leading-relaxed italic">Verification protocol for high-yield sports-tech settlement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {STEPS.map((step, i) => (
            <div key={i} className="card-elite !p-8 group hover:border-gold/30 hover:-translate-y-2 transition-all duration-500 bg-white/[0.01]">
               <div className="text-4xl font-black text-white italic opacity-[0.02] absolute top-4 right-6 group-hover:opacity-[0.05] transition-opacity pointer-events-none">{i + 1}</div>
               <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold mb-10 shadow-glow-gold group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
               </div>
               <h3 className="text-xs font-black text-white uppercase tracking-tight mb-3 italic">{step.label}</h3>
               <p className="text-[9px] text-muted font-black uppercase tracking-[0.2em] leading-relaxed opacity-30 italic">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Global Settlement CTA */}
      <section className="relative z-10 py-24 md:py-40 container">
        <div className="card-elite !p-16 md:p-32 text-center relative overflow-hidden bg-black border-white/5 shadow-3xl group">
           <div className="absolute top-0 right-0 p-16 opacity-[0.01] group-hover:opacity-[0.03] transition-opacity -rotate-12 pointer-events-none -translate-y-8"><Globe className="w-96 h-96" /></div>
           <div className="absolute bottom-0 left-0 p-16 opacity-[0.01] group-hover:opacity-[0.03] transition-opacity rotate-12 pointer-events-none translate-y-8"><ShieldCheck className="w-72 h-72" /></div>
           
           <div className="max-w-2xl mx-auto relative z-10">
              <div className="badge-elite !text-gold mb-10 border-gold/10 !px-6 !py-1 !text-[9px] italic uppercase">SECURE PROTOCOL</div>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-10 leading-[0.85] italic italic">Deploy Your <br /><span className="text-gradient-gold">Sequence.</span></h2>
              <p className="text-muted text-[11px] md:text-xs font-black opacity-30 mb-16 tracking-[0.4em] leading-relaxed max-w-sm mx-auto uppercase italic">Analyze the arena, Establish your consensus, and claim your verified settlement.</p>
              <div className="flex flex-wrap gap-5 justify-center">
                <Link href="/accounts" className="btn btn-primary !px-16 !py-5 !rounded-xl italic font-black text-[14px] tracking-widest shadow-2xl">Initialize Now</Link>
                <Link href="/live-challenges" className="btn btn-ghost !px-12 !py-5 !rounded-xl italic font-black text-[13px] border-white/5">View Arena Status</Link>
              </div>
           </div>
        </div>
      </section>

      {/* Footer utility spacer */}
      <div className="h-24" />
    </div>
  );
}
