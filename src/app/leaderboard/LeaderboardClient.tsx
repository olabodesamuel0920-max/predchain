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
          <div className="badge-elite !text-gold mb-8 !px-5 !py-1 !text-[9px] border-gold/10 italic">NETWORK RANKINGS</div>
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 italic italic">
            Elite <span className="text-gradient-gold">Protocol.</span>
          </h1>
          <p className="text-muted text-[11px] md:text-xs font-black opacity-30 max-w-sm uppercase tracking-[0.3em] leading-relaxed italic">
            World-class operators ranked by sequence integrity and verified settlement accuracy.
          </p>
        </div>

        {/* Top 3 Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20 items-end">
          {top3.map((player, i) => {
            const name = player.profile?.username || player.profile?.full_name || 'Operator';
            const isFirst = i === 0;
            return (
              <div key={player.id} className={`card-elite !p-10 text-center relative transition-all duration-500 hover:-translate-y-2 border-white/5 bg-black/40 ${isFirst ? 'md:scale-105 border-gold/20 shadow-glow-gold/10 z-10' : 'md:opacity-60 scale-95'}`}>
                {isFirst && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 p-4 bg-gold rounded-2xl shadow-glow-gold z-20">
                    <Trophy className="w-5 h-5 text-black" />
                  </div>
                )}
                
                <div className={`text-[9px] font-black uppercase tracking-[0.3em] mb-8 italic ${isFirst ? 'text-gold' : 'text-muted'}`}>
                  {isFirst ? 'NETWORK MASTER' : `PROTOCOL RANK #${i + 1}`}
                </div>

                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-2xl relative group overflow-hidden ${isFirst ? 'text-gold' : 'text-white/20'}`}>
                   {isFirst ? <Gem className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                   <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="text-xl font-black text-white mb-2 tracking-tighter truncate italic uppercase">
                  {name}
                </div>

                <div className="text-3xl font-black text-white italic tracking-tighter mb-8 leading-none">
                  <span className="text-gold">{player.streak_count}/3</span> 
                </div>

                <div className="badge-elite !py-1 !px-4 !bg-white/5 !text-muted opacity-40 border-white/5 !text-[9px] italic">
                  {player.tier?.name || 'NODE'} CLUSTER
                </div>
              </div>
            );
          })}
        </div>

        {/* List Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 px-4">
           <div className="flex bg-black/40 border border-white/5 rounded-xl p-1 gap-1 shadow-inner">
              {(['weekly', 'monthly', 'alltime'] as const).map(t => (
                <button
                  key={t}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all italic ${tab === t ? 'bg-white/10 text-white' : 'text-muted/40 hover:text-white'}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
           </div>
           <div className="relative group min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted opacity-20 group-focus-within:text-gold transition-colors" />
              <input
                type="search"
                placeholder="PROBE OPERATOR ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-5 text-[10px] font-black text-white focus:outline-none focus:border-gold/30 transition-all uppercase tracking-widest placeholder:opacity-20 italic shadow-inner"
              />
           </div>
        </div>

        {/* Ledger Table */}
        <div className="card-elite !p-0 overflow-hidden mb-24 border-white/5 bg-black/40">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-10 py-5 text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-40 italic">RANK</th>
                  <th className="px-10 py-5 text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-40 italic">IDENTIFICATION</th>
                  <th className="px-10 py-5 text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-40 italic">INTEGRITY</th>
                  <th className="px-10 py-5 text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-40 italic">CLUSTER</th>
                  <th className="px-10 py-5 text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-40 italic text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((row, i) => (
                  <tr key={row.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-10 py-6 text-[10px] font-black text-white/10 group-hover:text-gold transition-colors italic">
                      {String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-[11px] font-black text-white uppercase tracking-tight italic">{row.profile?.username || 'GUEST'}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                         <div className="text-xl font-black italic tracking-tighter" style={{ color: row.streak_count === 3 ? 'var(--success)' : 'var(--gold)' }}>{row.streak_count}/3</div>
                         <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden shrink-0">
                            <div className="h-full bg-current opacity-40" style={{ width: `${(row.streak_count / 3) * 100}%`, color: row.streak_count === 3 ? 'var(--success)' : 'var(--gold)' }} />
                         </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <span className="badge-elite !text-[8px] !bg-white/5 !text-muted opacity-30 border-white/5 italic">{row.tier?.name || 'BASIC'}</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      {row.is_winner
                        ? <div className="badge-elite !text-[9px] !text-success !bg-success/5 border-success/10 italic">VERIFIED</div>
                        : <div className="badge-elite !text-[9px] !text-blue-electric !bg-blue-electric/5 border-blue-electric/10 italic">SEQ ACTIVE</div>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global CTA */}
        <div className="card-elite !p-12 md:p-24 text-center relative overflow-hidden bg-black/40 border-white/5">
           <div className="absolute top-0 right-0 p-16 opacity-[0.01] rotate-12 -translate-y-8"><Globe className="w-64 h-64" /></div>
           <div className="max-w-xl mx-auto relative z-10">
              <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 italic">
                Achieve <span className="text-gradient-gold">Superiority.</span>
              </h2>
              <p className="text-muted text-[11px] md:text-xs font-black opacity-30 mb-12 uppercase tracking-[0.3em] leading-relaxed italic">
                Establish your identification protocol and join the elite operators in the daily arena.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/accounts" className="btn btn-primary !px-12 !py-4 !rounded-xl font-black uppercase text-[11px] tracking-widest group italic shadow-2xl">
                  Initiate Protocol <TrendingUp className="w-4 h-4 ml-3 group-hover:-translate-y-1 transition-transform" />
                </Link>
                <Link href="/how-it-works" className="btn btn-ghost !px-10 !py-4 !rounded-xl font-black uppercase text-[11px] tracking-widest border-white/5 italic">How it Works</Link>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
