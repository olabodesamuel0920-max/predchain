'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Gem, Search, ChevronRight, Layout, Globe, TrendingUp, ShieldCheck } from 'lucide-react';

interface LeaderboardClientProps {
  rankings: Array<{
    id: string;
    streak_count: number;
    is_winner: boolean;
    profile?: { username?: string; full_name?: string };
    tier?: { name: string };
  }>;
}

export default function LeaderboardClient({ rankings }: LeaderboardClientProps) {
  const [tab, setTab] = useState<'weekly' | 'monthly' | 'alltime'>('alltime');
  const [search, setSearch] = useState('');

  const filtered = rankings.filter(r => 
    (r.profile?.username || r.profile?.full_name || 'Anonymous')
    .toLowerCase()
    .includes(search.toLowerCase())
  );

  const top3 = filtered.slice(0, 3);

  return (
    <div className="relative min-h-screen bg-primary pt-32 pb-24">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-grad-glow opacity-30 pointer-events-none z-0" />

      <main className="relative z-10 container">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto flex flex-col items-center">
          <div className="badge-elite mb-8 !px-4">GLOBAL NETWORK RANKINGS</div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase mb-6 leading-tight">
            The Elite <span className="text-gradient-gold">Protocol.</span>
          </h1>
          <p className="text-secondary text-sm font-medium opacity-60 max-w-md">
            World-class operators ranked by prediction integrity and verified settlement accuracy.
          </p>
        </div>

        {/* Top 3 Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-end">
          {top3.map((player, i) => {
            const name = player.profile?.username || player.profile?.full_name || 'Operator';
            const isFirst = i === 0;
            return (
              <div key={player.id} className={`card-elite p-8 text-center relative transition-all hover:-translate-y-2 border-white/5 bg-white/[0.015] ${isFirst ? 'md:scale-105 border-gold/30 shadow-[0_0_40px_rgba(197,160,89,0.1)] z-10 bg-grad-glow opacity-90' : 'md:opacity-80'}`}>
                {isFirst && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 bg-gold rounded-xl border-4 border-primary z-20">
                    <Trophy className="w-5 h-5 text-black" />
                  </div>
                )}
                
                <div className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-6 ${isFirst ? 'text-gold' : 'text-muted opacity-40'}`}>
                  {isFirst ? 'NETWORK MASTER' : `PROTOCOL RANK #${i + 1}`}
                </div>

                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-bg-primary/60 border border-white/5 flex items-center justify-center text-2xl relative group overflow-hidden">
                   {isFirst ? <Gem className="w-10 h-10 text-gold" /> : <ShieldCheck className="w-8 h-8 text-blue-electric opacity-40" />}
                   <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="text-xl font-bold text-white mb-2 tracking-tight truncate">
                  {name}
                </div>

                <div className="text-3xl font-bold text-white font-mono tracking-tighter mb-6">
                  <span className="text-gold">{player.streak_count}/3</span> 
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-20 ml-3">STREAK</span>
                </div>

                <div className="badge-elite !bg-white/5 !text-muted opacity-40 border-white/5">
                  {player.tier?.name || 'NODE'} PROTOCOL
                </div>
              </div>
            );
          })}
        </div>

        {/* List Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 px-4">
           <div className="flex bg-black/40 border border-white/10 rounded-xl p-1.5 gap-1">
              {(['weekly', 'monthly', 'alltime'] as const).map(t => (
                <button
                  key={t}
                  className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${tab === t ? 'bg-white/10 text-white border border-white/10' : 'text-muted hover:text-white'}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
           </div>
           <div className="relative group min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted opacity-40 group-focus-within:text-gold transition-colors" />
              <input
                type="search"
                placeholder="PROBE OPERATOR ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-6 text-[10px] font-bold text-white focus:outline-none focus:border-gold/30 transition-all uppercase tracking-widest placeholder:opacity-30"
              />
           </div>
        </div>

        {/* Ledger Table */}
        <div className="card-elite !p-0 overflow-hidden mb-24">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-8 py-5 text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-40">RANK</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-40">IDENTIFICATION</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-40">INTEGRITY</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-40">PROTOCOL</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-40 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((row, i) => (
                  <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6 font-mono text-sm font-bold text-white/20 group-hover:text-gold/60 transition-colors">
                      {String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-white uppercase tracking-tight">{row.profile?.username || 'Guest Challenger'}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="text-base font-bold font-mono tracking-tighter" style={{ color: row.streak_count === 3 ? 'var(--success)' : 'var(--gold)' }}>{row.streak_count}/3</div>
                         <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-current opacity-60" style={{ width: `${(row.streak_count / 3) * 100}%`, color: row.streak_count === 3 ? 'var(--success)' : 'var(--gold)' }} />
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="badge-elite !text-[9px] !bg-white/5 !text-muted opacity-40 border-white/5">{row.tier?.name || 'BASIC'}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {row.is_winner
                        ? <div className="badge-elite !text-success !bg-success/5 border-success/20">VERIFIED</div>
                        : <div className="badge-elite !text-blue-electric !bg-blue-electric/5 border-blue-electric/20">IN SEQUENCE</div>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global CTA */}
        <div className="card-elite p-12 md:p-20 text-center relative overflow-hidden bg-grad-glow border-gold/10">
           <div className="absolute top-0 right-0 p-16 opacity-[0.03] rotate-12"><Globe className="w-48 h-48" /></div>
           <div className="max-w-2xl mx-auto relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase mb-8 leading-tight">
                Achieve Network <br /> <span className="text-gradient-gold">Superiority.</span>
              </h2>
              <p className="text-secondary text-sm font-medium opacity-60 mb-12 max-w-sm mx-auto uppercase tracking-wide leading-relaxed">
                Establish your identification protocol and join the elite operators in the daily arena.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/accounts" className="btn btn-primary px-12 py-4 rounded-2xl font-bold uppercase text-[11px] tracking-widest group">
                  Initiate Protocol <TrendingUp className="w-4 h-4 ml-3 group-hover:translate-y--1 transition-transform" />
                </Link>
                <Link href="/how-it-works" className="btn btn-ghost px-10 py-4 rounded-2xl font-bold uppercase text-[11px] tracking-widest border-white/10">How it Works</Link>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
