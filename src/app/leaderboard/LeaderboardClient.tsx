'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Gem } from 'lucide-react';

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
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-primary border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-grad-aurora opacity-10 blur-[100px] pointer-events-none" />
        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/5 border border-gold/15 rounded-full text-[10px] font-bold text-gold uppercase tracking-widest mb-6">
            Global Rankings
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white italic uppercase tracking-tight mb-4">
            Platform <span className="text-gradient-gold">Leaderboard</span>
          </h1>
          <p className="text-secondary text-sm max-w-md mx-auto italic font-medium opacity-60 uppercase tracking-wide">
            Top challengers ranked by performance protocol and verified win streaks.
          </p>
        </div>
      </section>

      {/* Top 3 Spotlight */}
      <section className="py-12 md:py-16 bg-primary">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {top3.map((player, i) => {
              const name = player.profile?.username || player.profile?.full_name || 'Challenger';
              const isFirst = i === 0;
              return (
                <div key={player.id} className={`card p-6 text-center relative overflow-hidden transition-all hover:scale-[1.02] border-white/5 bg-white/[0.015] ${isFirst ? 'md:scale-105 shadow-2xl shadow-gold/10 z-10 border-gold/30' : ''}`}>
                  {isFirst && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-grad-gold" aria-hidden="true" />
                  )}
                  
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isFirst ? 'text-gold' : 'text-muted opacity-60'}`}>
                    {isFirst ? 'Elite Champion' : `Rank #${i + 1}`}
                  </div>

                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary border-2 border-white/5 flex items-center justify-center text-2xl relative">
                    {isFirst ? <Trophy className="w-8 h-8 text-gold" /> : <Gem className="w-6 h-6 text-blue-electric opacity-60" />}
                    {isFirst && <div className="absolute -top-1 -right-1 w-6 h-6 bg-gold text-black text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-primary">#1</div>}
                  </div>

                  <div className="font-display text-lg font-bold text-white mb-2 uppercase tracking-tight truncate px-2">
                    {name}
                  </div>

                  <div className="font-display text-2xl font-extrabold text-white italic tracking-tighter mb-4">
                    <span className="text-gold">{player.streak_count}/3</span> <span className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-40 ml-1">Daily Streak</span>
                  </div>

                  <div className="badge badge-muted !text-[8px] opacity-40">
                    {player.tier?.name || 'Standard'} Tier
                  </div>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div className="tabs-list bg-white/[0.02] p-1 border border-white/5 rounded-lg flex gap-1">
              {(['weekly', 'monthly', 'alltime'] as const).map(t => (
                <button
                  key={t}
                  className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${tab === t ? 'bg-white/5 text-white shadow-sm border border-white/10' : 'text-muted/40 hover:text-white/60'}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="search"
                placeholder="Search Protocol..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input text-xs font-bold uppercase tracking-wider py-2 pl-4 pr-10 border-white/5 !bg-white/[0.02] w-64"
                aria-label="Search protocol"
              />
            </div>
          </div>

          {/* Table */}
          <div className="table-wrapper border border-white/5 rounded-xl bg-white/[0.01]">
            <table className="table" aria-label="Ranking protocols">
              <thead>
                <tr>
                  <th className="!text-[9px] uppercase tracking-widest opacity-40 py-4">Protocol Rank</th>
                  <th className="!text-[9px] uppercase tracking-widest opacity-40 py-4">Identification</th>
                  <th className="!text-[9px] uppercase tracking-widest opacity-40 py-4">Performance</th>
                  <th className="!text-[9px] uppercase tracking-widest opacity-40 py-4">Tier</th>
                  <th className="!text-[9px] uppercase tracking-widest opacity-40 py-4 text-right">Settlement</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={row.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-4">
                       <span className={`font-display font-extrabold text-sm ${i === 0 ? 'text-gold' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-orange-700/60' : 'text-white/20'}`}>
                         #{i + 1}
                       </span>
                    </td>
                    <td className="py-4">
                      <span className="font-display font-bold text-white text-xs uppercase tracking-tight">
                        {row.profile?.username || row.profile?.full_name || 'Guest Challenger'}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="font-display font-extrabold text-sm" style={{ color: row.streak_count === 3 ? 'var(--success)' : 'var(--gold)' }}>{row.streak_count}/3</span>
                    </td>
                    <td className="py-4">
                       <span className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-40">{row.tier?.name || 'Standard'}</span>
                    </td>
                    <td className="py-4 text-right">
                      {row.is_winner
                        ? <span className="badge badge-success !text-[8px] uppercase tracking-widest">Verified</span>
                        : <span className="badge badge-blue !text-[8px] uppercase tracking-widest">In Sequence</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 text-center relative overflow-hidden bg-primary">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-grad-aurora opacity-10 filter blur-[100px] pointer-events-none" />
        <div className="container relative z-10">
          <h2 className="font-display text-4xl md:text-6xl font-extrabold text-white italic uppercase tracking-tight mb-8 leading-[1.1]">
            Build Your <br /> <span className="text-gradient-gold">Winning Record.</span>
          </h2>
          <p className="text-secondary font-medium uppercase tracking-wide italic opacity-40 text-[11px] mb-10 max-w-sm mx-auto">
            Acquire an entry protocol, establish your prediction record, and join the elite winners list.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/accounts" className="btn btn-primary px-10 py-3.5 text-xs font-bold uppercase tracking-wide">Buy Account</Link>
            <Link href="/how-it-works" className="btn btn-ghost px-10 py-3.5 text-xs font-bold uppercase tracking-wide border-white/10">Protocol</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
