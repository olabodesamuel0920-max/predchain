'use client';

import { useState } from 'react';
import Link from 'next/link';

interface LeaderboardClientProps {
  rankings: Array<{
    id: string;
    streak_count: number;
    is_winner: boolean;
    profile?: { username?: string; full_name?: string };
    tier?: { name: string };
  }>;
}

const BADGE_COLORS: Record<string, string> = {
  gold: '#D4AF37', silver: '#A7B0C0', bronze: '#CD7F32',
};

export default function LeaderboardClient({ rankings }: LeaderboardClientProps) {
  const [tab, setTab] = useState<'weekly' | 'monthly' | 'alltime'>('alltime');
  const [search, setSearch] = useState('');

  const filtered = rankings.filter(r => 
    (r.profile?.username || r.profile?.full_name || 'Guest')
    .toLowerCase()
    .includes(search.toLowerCase())
  );

  const top3 = filtered.slice(0, 3);

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-[#0D1321] to-[#070B14] border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" aria-hidden="true" />
        <div className="container relative z-10 text-center">
          <div className="text-gold font-black text-[10px] uppercase tracking-[0.3em] mb-4 italic">Rankings</div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-4">
            Global Leaderboard
          </h1>
          <p className="text-muted text-lg max-w-lg mx-auto italic font-bold opacity-60 uppercase tracking-widest text-[11px]">
            Top challengers ranked by streak performance and verified wins.
          </p>
        </div>
      </section>

      {/* Top 3 Spotlight */}
      <section className="py-12 md:py-20 bg-primary">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {top3.map((player, i) => {
              const badge = i === 0 ? 'gold' : i === 1 ? 'silver' : 'bronze';
              const name = player.profile?.username || player.profile?.full_name || 'Challenger';
              const colorClass = i === 0 ? 'text-gold' : i === 1 ? 'text-slate-400' : 'text-orange-700';
              return (
                <div key={player.id} className={`card p-8 text-center relative overflow-hidden transition-all hover:scale-[1.02] border-white/5 ${i === 0 ? 'md:scale-110 shadow-2xl shadow-gold/10 z-10 border-gold/40' : ''}`}>
                  {i === 0 && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-grad-gold" aria-hidden="true" />
                  )}
                  <div className="text-4xl mb-4">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                  </div>
                  <div className={`font-black text-[10px] uppercase tracking-widest mb-1 ${colorClass}`}>#{i + 1} Rank</div>
                  <div className="font-display text-xl font-black text-white italic mb-4 uppercase tracking-tighter">
                    {name}
                  </div>
                  <div className="font-display text-3xl font-black text-white italic tracking-tighter mb-4">
                    <span className="text-gold">{player.streak_count}/3</span> Streak
                  </div>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
            <div className="tabs-list">
              {(['weekly', 'monthly', 'alltime'] as const).map(t => (
                <button
                  key={t}
                  className={`tab-trigger ${tab === t ? 'active' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t === 'weekly' ? 'Weekly' : t === 'monthly' ? 'Monthly' : 'All Time'}
                </button>
              ))}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="search"
                placeholder="Search username..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input"
                style={{ paddingLeft: '16px', width: '220px' }}
                aria-label="Search leaderboard"
              />
            </div>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table className="table" aria-label="Leaderboard rankings">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Username</th>
                  <th>Current Streak</th>
                  <th>Tier</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={row.id}>
                    <td>
                      <span style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 800,
                        fontSize: i < 3 ? '1.375rem' : '1rem',
                        color: i === 0 ? BADGE_COLORS.gold : i === 1 ? BADGE_COLORS.silver : i === 2 ? BADGE_COLORS.bronze : '#6E7A91',
                      }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                      </span>
                    </td>
                    <td>
                      <span className="font-display font-bold text-white">
                        {row.profile?.username || row.profile?.full_name || 'Guest Challenger'}
                      </span>
                    </td>
                    <td>
                      <span className="font-display font-black" style={{ color: row.streak_count === 3 ? '#22C55E' : '#D4AF37' }}>{row.streak_count}/3</span>
                    </td>
                    <td className="font-display font-bold text-slate-400">{row.tier?.name || 'Starter'}</td>
                    <td>
                      {row.is_winner
                        ? <span className="badge badge-success">Verified</span>
                        : <span className="badge badge-blue">In Progress</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 md:py-32 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-grad-aurora opacity-20 filter blur-[120px] pointer-events-none" />
        <div className="container relative z-10">
          <h2 className="font-display text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-8 leading-tight">
            Your Name <br /> Could Be Here
          </h2>
          <p className="text-muted font-bold uppercase tracking-widest italic opacity-60 text-xs mb-10 max-w-sm mx-auto">
            Buy an account, build the perfect streak, and join the verified winners protocol.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link href="/accounts" className="btn btn-primary px-12 py-5 text-sm font-black uppercase tracking-widest">Buy Account</Link>
            <Link href="/how-it-works" className="btn btn-ghost px-12 py-5 text-sm font-black uppercase tracking-widest">Protocol</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
