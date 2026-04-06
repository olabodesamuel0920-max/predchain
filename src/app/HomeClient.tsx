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
  { label: 'Pick a Tier', desc: 'Select an entry amount that fits your goals.' },
  { label: 'Join Challenge', desc: 'Enter the active 3-day prediction window instantly.' },
  { label: 'Daily Prediction', desc: 'Predict exactly 1 live outcome per day, perfectly.' },
  { label: 'Track Real-Time', desc: 'Watch leaderboard rankings shift live as games end.' },
  { label: '10X Reward', desc: 'Complete 3/3 daily predictions to unlock the cash drop.' },
];

export default function HomeClient({ stats }: { stats: PlatformStats }) {
  const [matches] = useState<HomeMatch[]>([
    { id: 1, day: 'Day 1', match: 'ARS vs CHE', status: 'correct', time: 'Completed', pick: 'ARS' },
    { id: 2, day: 'Day 2', match: 'MCI vs LIV', status: 'open', time: 'Awaiting Pick', pick: null },
    { id: 3, day: 'Day 3', match: 'PSG vs RMA', status: 'locked', time: 'Scheduled', pick: null },
  ]);

  return (
    <div className="pt-20 relative overflow-hidden">
      {/* ──────────────────────── HERO ──────────────────────── */}
      <section className="relative py-12 md:py-24 bg-primary overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-grad-aurora opacity-40 blur-[160px] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-blue-electric/5 blur-[100px] opacity-60 pointer-events-none z-0" />
        <div className="absolute inset-0 opacity-40 z-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:32px_32px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]" />

        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-full text-[13px] font-black text-white mb-8 backdrop-blur-xl uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Round {stats.roundsCompleted + 1} is Now Live
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tighter mb-8 uppercase italic">
              Precision <br />
              <span className="text-gold">Perfection.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted font-bold leading-relaxed mb-10 max-w-xl uppercase tracking-widest italic opacity-60">
              The elite 3-day football prediction challenge. Secure your account, follow the protocol, and unlock the guaranteed 10X reward.
            </p>

            <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
              <Link href="/accounts" className="btn btn-primary btn-pulse px-10 py-5 text-sm font-black uppercase tracking-widest flex items-center gap-2">
                Join Challenge
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/how-it-works" className="btn btn-ghost px-10 py-5 text-sm font-black uppercase tracking-widest">
                Protocol
              </Link>
            </div>
            
            <div className="mt-14 flex items-center gap-8 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {['M','A','C','J'].map((l, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-secondary border-2 border-primary flex items-center justify-center text-xs font-black text-white shadow-xl italic">{l}</div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex gap-1 text-gold text-xs">★ ★ ★ ★ ★</div>
                <div className="text-[11px] text-muted font-black uppercase tracking-widest opacity-60">
                  <span className="text-white">{stats.activeChallengers.toLocaleString()}</span> Active Operatives
                </div>
              </div>
            </div>
          </div>

          {/* Right Simulation */}
          <div className="relative w-full max-w-[500px] mx-auto lg:max-w-none">
            <div className="absolute inset-0 bg-grad-aurora filter blur-[90px] opacity-40 z-0" />
            
            <div className="flex flex-col gap-6 relative z-10 animate-slide-up">
              <div className="card p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-electric/10 flex items-center justify-center text-blue-electric">⚽</div>
                    <span className="font-display text-lg font-black uppercase italic tracking-tighter text-white">Live Prediction</span>
                  </div>
                  <span className="badge badge-blue px-3 py-1 text-[10px] font-black uppercase tracking-widest">Round {stats.roundsCompleted + 1}</span>
                </div>
                
                <div className="flex flex-col gap-4 mb-8">
                  {matches.map((m, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${
                      m.status === 'open' ? 'bg-blue-electric/[0.03] border-blue-electric/30' : 
                      m.status === 'pending' ? 'bg-gold/[0.03] border-gold/30' : 
                      'bg-white/[0.02] border-white/5'
                    }`}>
                      <div className="flex items-center gap-3 truncate">
                        <span className={`badge px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${m.status === 'correct' ? 'badge-success' : m.status === 'open' ? 'badge-blue' : m.status === 'pending' ? 'badge-gold' : 'badge-muted'}`}>{m.day}</span>
                        <span className={`font-display font-black text-sm uppercase italic truncate ${m.status === 'locked' ? 'text-muted' : 'text-white'}`}>{m.match}</span>
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                        {m.status === 'correct' && <span className="text-success flex items-center gap-1"><Check className="w-3 h-3" /> Verified</span>}
                        {m.status === 'open' && (
                          <Link href="/login" className="bg-blue-electric text-black px-4 py-1.5 rounded-full text-[9px] font-black hover:scale-105 transition-transform">
                            Predict
                          </Link>
                        )}
                        {m.status === 'pending' && <span className="text-gold">Picked: {m.pick}</span>}
                        {m.status === 'locked' && <span className="text-muted opacity-40">Locked</span>}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                    <span className="text-muted italic">Streak Progress</span>
                    <span className="text-gold italic">1 / 3 Completed</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-grad-gold" style={{ width: '33.33%' }} />
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-black/80 border border-gold/40 rounded-2xl p-6 backdrop-blur-2xl shadow-2xl flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center text-2xl">💰</div>
                <div>
                  <div className="text-[10px] text-gold font-black uppercase tracking-widest mb-1 italic">Reward Multiplier</div>
                  <div className="font-display text-2xl font-black text-white italic tracking-tighter uppercase leading-none">10X UNLOCK</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────── TRUST METRICS ──────────────────────── */}
      <section className="py-12 md:py-20 bg-secondary border-b border-white/5">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center lg:text-left">
            {[
              { label: 'Verified Members', value: stats.activeChallengers, suffix: '' },
              { label: 'Rounds Settled', value: stats.roundsCompleted, suffix: '' },
              { label: 'Winning Streaks', value: stats.perfectStreaks, suffix: '' },
              { label: 'Guaranteed Payouts', prefix: '₦', value: stats.totalCashPaid, suffix: '' },
            ].map((m, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="font-display text-3xl md:text-5xl font-black text-white italic tracking-tighter">
                  <Counter end={m.value} prefix={m.prefix} suffix={m.suffix} />
                </div>
                <div className="text-[11px] text-muted font-black uppercase tracking-widest opacity-60 italic">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────── THE PROTOCOL ──────────────────────── */}
      <section className="section py-20 md:py-32">
        <div className="container">
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-blue-electric/10 border border-blue-electric/20 rounded-full text-[10px] font-black text-blue-electric uppercase tracking-[0.3em] mb-4">THE PROTOCOL</div>
            <h2 className="section-title text-4xl md:text-6xl max-w-2xl mx-auto uppercase italic font-black leading-tight mb-6">A clear path to <span className="text-gold">Guaranteed Reward.</span></h2>
            <p className="section-subtitle text-muted font-black uppercase tracking-widest italic opacity-40 max-w-xl mx-auto">Follow the synchronization steps to secure your 10X payout.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="card p-8 flex flex-col items-center text-center group hover:border-gold/30 transition-all">
                <div className="w-14 h-14 mb-6 rounded-xl bg-secondary border border-white/5 flex items-center justify-center font-display text-xl font-black text-gold italic group-hover:scale-110 transition-transform">
                  0{i + 1}
                </div>
                <h3 className="font-display text-lg font-black text-white uppercase italic mb-4 tracking-tighter">{step.label}</h3>
                <p className="text-[11px] text-muted font-black uppercase tracking-widest italic opacity-40 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────── FINAL CTA ──────────────────────── */}
      <section className="section text-center relative py-32 md:py-48 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-grad-aurora opacity-30 filter blur-[120px] pointer-events-none" />
        
        <div className="container relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-gold/10 border border-gold/20 rounded-full text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-8">SECURE ACCESS</div>
          <h2 className="section-title text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-12">Build your <span className="text-gold">Streak.</span></h2>
          <div className="flex justify-center">
            <Link href="/accounts" className="btn btn-primary btn-pulse px-16 py-6 text-lg font-black uppercase tracking-widest shadow-2xl shadow-gold/20">
              Start Challenge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
