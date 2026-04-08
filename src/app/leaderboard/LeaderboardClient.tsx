'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Gem, Search, ChevronRight, Globe, TrendingUp, ShieldCheck, ArrowUpRight } from 'lucide-react';

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
    (r.profile?.username || r.profile?.full_name || 'Participant')
    .toLowerCase()
    .includes(search.toLowerCase())
  );

  const top3 = filtered.slice(0, 3);

  return (
    <div className="relative min-h-screen pt-24 sm:pt-32 pb-24">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-muted/5 blur-[120px]" />
      </div>

      <div className="container-tight relative z-10">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-24 max-w-2xl mx-auto">
          <div className="badge-luxury mb-6 px-4 py-1.5 uppercase italic font-black tracking-widest">ARENA RANKINGS</div>
          <h1 className="mb-4 uppercase italic font-black leading-tight tracking-tight">Top <span className="text-gradient-gold">Performers.</span></h1>
          <p className="text-text-secondary text-sm font-normal leading-relaxed italic opacity-80">
            A verified record of participants ranked by sequence strength and node prediction accuracy.
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-24 items-end max-w-5xl mx-auto">
          {top3.map((player, i) => {
            const name = player.profile?.username || player.profile?.full_name || 'Anonymous Node';
            const isFirst = i === 0;
            const rankLabel = i === 0 ? 'Arena Master' : i === 1 ? 'High Tier' : 'Elite Node';
            
            return (
              <div 
                key={player.id} 
                className={`card-luxury !p-8 sm:!p-10 text-center relative transition-all duration-500 bg-[#11161D] ${isFirst ? 'md:py-14 border-gold/20 shadow-lg z-10' : 'md:opacity-70 scale-95 border-border-subtle order-last md:order-none'}`}
              >
                {isFirst && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-gold rounded-lg flex items-center justify-center shadow-lg z-20">
                    <Trophy className="w-5 h-5 text-black" />
                  </div>
                )}
                
                <div className={`text-[9px] font-black uppercase tracking-widest mb-6 italic ${isFirst ? 'text-gold' : 'text-text-dim'}`}>
                  {rankLabel}
                </div>

                <div className={`w-14 h-14 mx-auto mb-5 rounded-xl bg-white/[0.02] border border-border-subtle flex items-center justify-center relative group overflow-hidden ${isFirst ? 'text-gold' : 'text-text-dim/30'}`}>
                   {isFirst ? <Gem className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
                </div>

                <div className="text-lg font-black text-white mb-1.5 tracking-tight truncate italic uppercase font-display">
                  {name}
                </div>

                <div className="text-3xl font-black text-white italic tracking-tighter mb-8 leading-none font-display">
                  <span className="text-gold">{player.streak_count}</span><span className="text-text-dim/20 text-lg ml-1">/ 3</span> 
                </div>

                <div className="inline-flex px-3 py-1 rounded-md bg-white/[0.03] border border-border-subtle text-[8px] font-black text-text-dim uppercase tracking-widest italic">
                  {player.tier?.name || 'Standard'} PROTOCOL
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 max-w-5xl mx-auto">
           <div className="flex bg-bg-darker border border-border-subtle rounded-xl p-1 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {(['weekly', 'monthly', 'alltime'] as const).map(t => (
                <button
                  key={t}
                  className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all italic whitespace-nowrap flex-1 sm:flex-none ${tab === t ? 'bg-white/[0.05] text-white shadow-sm' : 'text-text-dim hover:text-white/60'}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
           </div>
           
           <div className="relative group w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-dim opacity-30 group-focus-within:text-gold transition-colors" />
              <input
                type="search"
                placeholder="Search node..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-bg-primary/50 border border-border-subtle rounded-xl py-3 pl-11 pr-5 text-[10px] font-black text-white focus:outline-none focus:border-gold/30 transition-all uppercase tracking-widest placeholder:opacity-30 italic"
              />
           </div>
        </div>

        {/* Ranking Table */}
        <div className="card-luxury !p-0 overflow-hidden mb-24 bg-bg-card border-border-subtle shadow-md max-w-5xl mx-auto">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.01] border-b border-border-subtle">
                  <th className="px-8 py-4 text-[9px] font-black text-text-dim uppercase tracking-widest italic opacity-40">Rank</th>
                  <th className="px-8 py-4 text-[9px] font-black text-text-dim uppercase tracking-widest italic opacity-40">Node User</th>
                  <th className="px-8 py-4 text-[9px] font-black text-text-dim uppercase tracking-widest italic opacity-40">Streak</th>
                  <th className="px-8 py-4 text-[9px] font-black text-text-dim uppercase tracking-widest italic opacity-40">Protocol</th>
                  <th className="px-8 py-4 text-[9px] font-black text-text-dim uppercase tracking-widest italic opacity-40 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filtered.map((row, i) => (
                  <tr key={row.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-5 text-[10px] font-black text-text-dim group-hover:text-gold transition-colors italic">
                      #{String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[11px] font-black text-white uppercase tracking-tight italic font-display">{row.profile?.username || 'Guest Node'}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                         <div className="text-xl font-black italic tracking-tighter font-display" style={{ color: row.streak_count === 3 ? 'var(--success)' : 'var(--gold)' }}>{row.streak_count}/3</div>
                         <div className="w-20 h-0.5 bg-white/5 rounded-full overflow-hidden shrink-0">
                            <div className="h-full bg-current" style={{ width: `${(row.streak_count / 3) * 100}%`, color: row.streak_count === 3 ? 'var(--success)' : 'var(--gold)' }} />
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-[8px] font-black text-text-dim uppercase tracking-widest italic opacity-40">{row.tier?.name || 'Standard'}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {row.is_winner
                        ? <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 italic">SETTLED</span>
                        : <span className="text-[8px] font-black text-gold uppercase tracking-widest bg-gold/5 px-2 py-0.5 rounded border border-gold/10 italic">IN-FLOW</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Final CTA */}
        <div className="card-luxury-gold !p-12 sm:!p-20 text-center border-gold/10 max-w-3xl mx-auto mb-24 group relative">
           <div className="max-w-xl mx-auto relative z-10">
              <h2 className="mb-4 text-4xl uppercase italic font-black">Join the <span className="text-gradient-gold">Best.</span></h2>
              <p className="text-text-secondary text-[10px] font-normal mb-10 uppercase tracking-widest italic">
                Ready to prove your accuracy? Initialize your node and start climbing the ranks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/accounts" className="btn-luxury btn-gold !px-12 !py-4 shadow-sm">
                  GET STARTED <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
                <Link href="/arena" className="btn-luxury btn-outline !px-10 !py-4">VIEW ARENA</Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
