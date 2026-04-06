'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PlatformStats, HomeMatch } from '@/types';
import { ArrowRight, Check } from 'lucide-react';

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
      { threshold: 0.5 }
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
  { label: 'Account Plan', desc: 'Select an entry amount that fits your goals.' },
  { label: 'Join Live', desc: 'Enter the active 3-day prediction window instantly.' },
  { label: 'Daily Prediction', desc: 'Predict exactly 1 live outcome per day, perfectly.' },
  { label: 'Watch Live', desc: 'Watch leaderboard rankings shift live as games end.' },
  { label: '10X Reward', desc: 'Complete 3/3 daily predictions to unlock the rewards.' },
];

export default function HomeClient({ stats }: { stats: PlatformStats }) {
  const [matches] = useState<HomeMatch[]>([
    { id: 1, day: 'Day 1', match: 'ARS vs CHE', status: 'correct', time: 'Completed', pick: 'ARS' },
    { id: 2, day: 'Day 2', match: 'MCI vs LIV', status: 'open', time: 'Awaiting Pick', pick: null },
    { id: 3, day: 'Day 3', match: 'PSG vs RMA', status: 'locked', time: 'Scheduled', pick: null },
  ]);

  return (
    <div className="pt-16 relative overflow-hidden">
      {/* ──────────────────────── HERO ──────────────────────── */}
      <section className="relative py-10 md:py-20 bg-primary overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-grad-aurora opacity-30 blur-[140px] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-blue-electric/5 blur-[80px] opacity-40 pointer-events-none z-0" />
        <div className="absolute inset-0 opacity-20 z-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:24px_24px]" />

        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.02] border border-white/10 rounded-full text-[11px] font-black text-white mb-6 backdrop-blur-xl uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Round {stats.roundsCompleted + 1} LIVE
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tighter mb-6 uppercase italic">
              Precision <br />
              <span className="text-gradient-gold">Perfection.</span>
            </h1>

            <p className="text-base md:text-lg text-muted font-bold leading-relaxed mb-8 max-w-lg uppercase tracking-widest italic opacity-50">
              The premier 3-day football prediction challenge. Choose an account, 
              submit your picks, and earn 10X rewards.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link href="/accounts" className="btn btn-primary px-8 py-4 text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                Join Challenge
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/how-it-works" className="btn btn-ghost px-8 py-4 text-[11px] font-black uppercase tracking-widest">
                How it Works
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
              <div className="flex -space-x-2.5">
                {['M','A','C','J'].map((l, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-secondary border-2 border-primary flex items-center justify-center text-[10px] font-black text-white shadow-xl italic">{l}</div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex gap-0.5 text-gold text-[10px]">★ ★ ★ ★ ★</div>
                <div className="text-[10px] text-muted font-black uppercase tracking-widest opacity-40">
                  <span className="text-white">{stats.activeChallengers.toLocaleString()}</span> Active Members
                </div>
              </div>
            </div>
          </div>

          {/* Right Simulation */}
          <div className="relative w-full max-w-[440px] mx-auto lg:max-w-none">
            <div className="absolute inset-0 bg-grad-aurora filter blur-[100px] opacity-20 z-0" />
            
            <div className="flex flex-col gap-4 relative z-10 animate-slide-up">
              <div className="card p-5 md:p-6">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-electric/10 flex items-center justify-center text-blue-electric text-xs">⚽</div>
                    <span className="font-display text-base font-black uppercase italic tracking-tighter text-white">Prediction Hub</span>
                  </div>
                  <span className="badge badge-blue px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest opacity-60">Round {stats.roundsCompleted + 1}</span>
                </div>
                
                <div className="flex flex-col gap-3 mb-6">
                  {matches.map((m, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${
                      m.status === 'open' ? 'bg-blue-electric/[0.02] border-blue-electric/20' : 
                      m.status === 'pending' ? 'bg-gold/[0.02] border-gold/20' : 
                      'bg-white/[0.01] border-white/5'
                    }`}>
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={`badge px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest ${m.status === 'correct' ? 'badge-success' : m.status === 'open' ? 'badge-blue' : m.status === 'pending' ? 'badge-gold' : 'badge-muted'}`}>{m.day}</span>
                        <span className={`font-display font-black text-xs uppercase italic truncate ${m.status === 'locked' ? 'text-muted' : 'text-white'}`}>{m.match}</span>
                      </div>
                      <div className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                        {m.status === 'correct' && <span className="text-success flex items-center gap-1 opacity-60"><Check className="w-2.5 h-2.5" /> Completed</span>}
                        {m.status === 'open' && (
                          <Link href="/login" className="bg-blue-electric text-black px-3 py-1 rounded-md text-[8px] font-black hover:scale-105 transition-transform uppercase">
                            Predict
                          </Link>
                        )}
                        {m.status === 'pending' && <span className="text-gold opacity-60">Picked: {m.pick}</span>}
                        {m.status === 'locked' && <span className="text-muted opacity-30">Locked</span>}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white/[0.01] p-3.5 rounded-lg border border-white/5">
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest mb-2.5">
                    <span className="text-muted italic opacity-40">Progress</span>
                    <span className="text-gold italic opacity-60">1 / 3 Tasks</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-grad-gold" style={{ width: '33.33%' }} />
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-black/90 border border-gold/20 rounded-xl p-4 backdrop-blur-2xl shadow-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-lg">💰</div>
                <div>
                  <div className="text-[8px] text-gold font-black uppercase tracking-widest mb-0.5 italic opacity-60">Multiplier</div>
                  <div className="font-display text-xl font-black text-white italic tracking-tighter uppercase leading-none">10X REWARD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────── TRUST METRICS ──────────────────────── */}
      <section className="py-10 md:py-16 bg-secondary border-b border-white/5">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center lg:text-left">
            {[
              { label: 'Members', value: stats.activeChallengers, suffix: '' },
              { label: 'Rounds', value: stats.roundsCompleted, suffix: '' },
              { label: 'Streaks', value: stats.perfectStreaks, suffix: '' },
              { label: 'Total Paid', prefix: '₦', value: stats.totalCashPaid, suffix: '' },
            ].map((m, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="font-display text-2xl md:text-4xl font-black text-white italic tracking-tighter">
                  <Counter end={m.value} prefix={m.prefix} suffix={m.suffix} />
                </div>
                <div className="text-[9px] text-muted font-black uppercase tracking-widest opacity-35 italic">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────── THE PROCESS ──────────────────────── */}
      <section className="section py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-electric/5 border border-blue-electric/15 rounded-full text-[9px] font-black text-blue-electric uppercase tracking-[0.2em] mb-4">THE PROCESS</div>
            <h2 className="section-title text-3xl md:text-5xl max-w-2xl mx-auto uppercase italic font-black leading-tight mb-4">A clear path to <span className="text-gradient-gold">Winning Rewards.</span></h2>
            <p className="section-subtitle text-[10px] text-muted font-black uppercase tracking-widest italic opacity-35 max-w-lg mx-auto">Follow these simple steps to start earning 10X payouts.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {STEPS.map((step, i) => (
              <div key={i} className="card p-6 flex flex-col items-center text-center group hover:border-gold/20 transition-all">
                <div className="w-11 h-11 mb-5 rounded-lg bg-secondary border border-white/5 flex items-center justify-center font-display text-base font-black text-gold italic group-hover:scale-105 transition-transform">
                  0{i + 1}
                </div>
                <h3 className="font-display text-base font-black text-white uppercase italic mb-3 tracking-tighter">{step.label}</h3>
                <p className="text-[10px] text-muted font-black uppercase tracking-widest italic opacity-30 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────── FINAL CTA ──────────────────────── */}
      <section className="section text-center relative py-24 md:py-36 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-grad-aurora opacity-20 filter blur-[120px] pointer-events-none" />
        
        <div className="container relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/5 border border-gold/15 rounded-full text-[9px] font-black text-gold uppercase tracking-[0.2em] mb-6">GET STARTED</div>
          <h2 className="section-title text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-10">Build your <span className="text-gradient-gold">Streak.</span></h2>
          <div className="flex justify-center">
            <Link href="/accounts" className="btn btn-primary px-12 py-5 text-base font-black uppercase tracking-widest shadow-2xl shadow-gold/20">
              Start Challenge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
