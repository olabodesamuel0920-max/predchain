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
      <section className="relative z-10 pt-24 pb-12 sm:pt-48 sm:pb-24 overflow-hidden">
        <div className="container-tight">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            
            {/* Left: Value Prop */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 badge-luxury mb-8 px-4 py-1.5 backdrop-blur-3xl">
                 <Radio className="w-3 h-3 text-gold animate-pulse" /> 
                 <span className="font-display tracking-[0.15em] font-extrabold pb-px">LIVE TOURNAMENT ACTIVE</span>
              </div>

              <h1 className="mb-6 tracking-tight leading-[1.1] font-display font-black italic uppercase">
                Master the <br />
                <span className="text-gradient-gold">Winning Streak.</span>
              </h1>

              <p className="max-w-xl mx-auto lg:mx-0 text-text-secondary text-base font-normal leading-relaxed mb-10">
                The high-performance arena for elite sports predictions. 
                Maintain a 3-day sequence to unlock <span className="text-white font-bold italic">10X reward multipliers</span> per matchday.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/accounts" className="btn-luxury btn-gold !py-4.5 !px-10 group shadow-md">
                  <span className="pb-px">START YOUR STREAK</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/how-it-works" className="btn-luxury btn-outline !py-4.5 !px-10 group">
                  <PlayCircle className="w-4 h-4 mr-2 text-gold/60" /> 
                  <span className="pb-px">VIEW GUIDE</span>
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 opacity-80 border-t border-border-subtle pt-8 max-w-lg mx-auto lg:mx-0">
                <div className="flex flex-col gap-1">
                   <div className="text-xl font-black font-display text-white italic tracking-tighter uppercase">₦5,000</div>
                   <div className="text-[9px] font-extrabold text-text-muted uppercase tracking-[0.3em] italic">Entry Tier</div>
                </div>
                <div className="flex flex-col gap-1">
                   <div className="text-xl font-black font-display text-white italic tracking-tighter uppercase">10X</div>
                   <div className="text-[9px] font-extrabold text-text-muted uppercase tracking-[0.3em] italic">Multiplier</div>
                </div>
                <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                   <div className="text-xl font-black font-display text-white italic tracking-tighter uppercase">Instant</div>
                   <div className="text-[9px] font-extrabold text-text-muted uppercase tracking-[0.3em] italic">Settlement</div>
                </div>
              </div>
            </div>

            {/* Right: High Fidelity UI Visual */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-xl scale-95 lg:scale-100">
              <div className="absolute inset-0 bg-gold/5 blur-[120px] opacity-30" />
              
              <div className="card-luxury !bg-bg-darker border-border-main shadow-md relative z-10 p-0 overflow-hidden">
                <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-white/[0.01]">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gold/5 flex items-center justify-center border border-gold/10">
                        <Activity className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">Tournament_01</div>
                        <div className="text-[8px] text-text-muted uppercase tracking-[0.3em] font-extrabold italic">Status: Live Pool</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                     <span className="text-[9px] font-black text-emerald-500 tracking-widest italic">SECURE</span>
                   </div>
                </div>

                <div className="p-6 space-y-3">
                  {matches.map((m, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-500 ${
                      m.status === 'open' ? 'bg-bg-secondary border-gold/20 shadow-sm' : 'bg-transparent border-border-subtle opacity-30'
                    }`}>
                      <div className="flex items-center gap-5">
                        <span className="text-[9px] font-black text-text-muted uppercase w-8 italic">{m.day}</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white tracking-tight font-display">{m.match}</span>
                          <span className="text-[7px] font-extrabold text-text-dim uppercase tracking-[0.2em] mt-1 italic">H2H Verified</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {m.status === 'correct' ? <Check className="w-4 h-4 text-emerald-500" /> : m.status === 'open' ? <div className="px-2 py-0.5 rounded bg-gold/10 text-[8px] font-black text-gold border border-gold/20">LIVE</div> : <Clock className="w-3.5 h-3.5 text-text-dim" />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 pt-0">
                  <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5 relative overflow-hidden">
                     <div className="flex justify-between items-end mb-4 relative z-10">
                        <div>
                          <div className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-1 italic">Current Multiplier</div>
                          <div className="text-xl font-black font-display text-white italic tracking-tighter uppercase">10.00x</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] font-black text-gold uppercase tracking-[0.2em] mb-2 italic">Sequence</div>
                          <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                              <div key={i} className={`w-2.5 h-1 rounded-full ${i <= 2 ? 'bg-gold' : 'bg-white/10'}`} />
                            ))}
                          </div>
                        </div>
                     </div>
                     <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gold w-2/3 transition-all duration-1000" />
                     </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="relative z-10 py-16 sm:py-24 border-y border-border-subtle bg-bg-secondary/30 backdrop-blur-3xl">
        <div className="container-tight">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {[
              { label: 'Platform Challengers', value: stats.activeChallengers, icon: <Users className="w-4 h-4" /> },
              { label: 'Tournament Cycles', value: stats.roundsCompleted, icon: <Zap className="w-4 h-4" /> },
              { label: 'Verified Streaks', value: stats.perfectStreaks, icon: <Check className="w-4 h-4" /> },
              { label: 'Reserve Payouts', prefix: '₦', value: stats.totalCashPaid, icon: <Shield className="w-4 h-4" /> },
            ].map((m, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-text-dim">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-border-subtle flex items-center justify-center">{m.icon}</div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{m.label}</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black font-display text-white italic tracking-tighter uppercase">
                  <Counter end={m.value} prefix={m.prefix} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative z-10 section-padding container-tight">
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <div className="badge-luxury mb-6 px-5 py-1.5">OUR PROTOCOL</div>
          <h2 className="mb-6 uppercase italic font-black">How to Command the <br /><span className="text-gradient-gold">Prediction Pool.</span></h2>
          <p className="text-text-secondary max-w-xl font-normal leading-relaxed">A systematic approach to performance. Build consistency, analyze the field, and secure your rewards.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STEPS.map((step, i) => (
            <div key={i} className="card-luxury group hover:border-gold/20 transition-all duration-500">
               <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-border-subtle flex items-center justify-center text-gold/40 mb-6 group-hover:bg-gold group-hover:text-black transition-all">
                  <Star className="w-5 h-5" />
               </div>
               <h3 className="text-[11px] font-black text-white uppercase tracking-[0.1em] mb-3 font-display italic">Step 0{i + 1} — {step.label}</h3>
               <p className="text-[11px] text-text-muted font-normal leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 section-padding container-tight">
        <div className="card-luxury-gold rounded-3xl p-12 sm:p-24 text-center border-gold/10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-5 transition-all duration-1000 rotate-12"><Globe className="w-64 h-64" /></div>
           <div className="absolute bottom-0 left-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-5 transition-all duration-1000 -rotate-12"><Shield className="w-48 h-48" /></div>
           
           <div className="max-w-xl mx-auto relative z-10">
              <h2 className="mb-6 text-4xl sm:text-5xl uppercase italic font-black leading-tight tracking-tight">Access the Elite <br /><span className="text-gradient-gold">Arena Pool.</span></h2>
              <p className="text-text-secondary mb-10 text-base font-normal leading-relaxed">Secure your membership today and gain access to the premier sports performance arena.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup" className="btn-luxury btn-gold !py-4.5 !px-12 !text-xs shadow-md">INITIALIZE ACCOUNT</Link>
                <Link href="/arena" className="btn-luxury btn-outline !py-4.5 !px-12 !text-xs">EXPLORE FIXTURES</Link>
              </div>
           </div>
        </div>
      </section>

      <div className="h-20" />
    </div>
  );
}
