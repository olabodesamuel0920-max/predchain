'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Gem, Search, ChevronRight, Globe, TrendingUp, ShieldCheck } from 'lucide-react';

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
    <div className="relative min-h-screen bg-primary pt-32 pb-24 md:pt-44">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gold-glow blur-[140px] opacity-20" />
      </div>

      <div className="container relative z-10 px-6">
        {/* Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <div className="badge-elite !text-gold mb-8 px-5 py-1">HALL OF FAME</div>
          <h1 className="mb-6">Top <span className="text-gradient-gold">Performers.</span></h1>
          <p className="text-muted text-sm md:text-base font-medium opacity-60">
            A real-time list of participants ranked by their sequence strength and match accuracy.
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-24 items-end max-w-5xl mx-auto">
          {top3.map((player, i) => {
            const name = player.profile?.username || player.profile?.full_name || 'Participant';
            const isFirst = i === 0;
            return (
              <div key={player.id} className={`card-elite !p-10 text-center relative transition-all duration-700 hover:-translate-y-2 bg-[#080a0f] border-white/5 ${isFirst ? 'md:py-16 border-gold/20 shadow-2xl z-10' : 'md:opacity-60 scale-95 shadow-xl'}`}>
                {isFirst && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 p-3 bg-gold rounded-xl shadow-lg z-20">
                    <Trophy className="w-5 h-5 text-black" />
                  </div>
                )}
                
                <div className={`text-[10px] font-black uppercase tracking-widest mb-8 italic ${isFirst ? 'text-gold' : 'text-muted'}`}>
                  {isFirst ? 'Arena Master' : `Rank #${i + 1}`}
                </div>

                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/[0.03] flex items-center justify-center text-2xl relative group overflow-hidden ${isFirst ? 'text-gold' : 'text-white/20'}`}>
                   {isFirst ? <Gem className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                </div>

                <div className="text-xl font-black text-white mb-2 tracking-tighter truncate italic uppercase">
                  {name}
                </div>

                <div className="text-3xl font-black text-white italic tracking-tighter mb-8 leading-none">
                  <span className="text-gold">{player.streak_count}</span><span className="text-muted opacity-20 text-xl ml-1">/ 3</span> 
                </div>

                <div className="badge-elite !py-1 !px-4 !bg-white/5 !text-muted opacity-30 border-white/5 !text-[9px] italic">
                  {player.tier?.name || 'Standard'} PLAN
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 max-w-5xl mx-auto px-4">
           <div className="flex bg-black shadow-inner border border-white/5 rounded-xl p-1 gap-1">
              {(['weekly', 'monthly', 'alltime'] as const).map(t => (
                <button
                  key={t}
                  className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all italic ${tab === t ? 'bg-white/10 text-white' : 'text-muted hover:text-white/60'}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
           </div>
           
           <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted opacity-30 group-focus-within:text-gold transition-colors" />
              <input
                type="search"
                placeholder="Search participant..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-5 text-[11px] font-bold text-white focus:outline-none focus:border-gold/30 transition-all uppercase tracking-widest placeholder:opacity-30 italic shadow-inner"
              />
           </div>
        </div>

        {/* Dense Table */}
        <div className="card-elite !p-0 overflow-hidden mb-24 bg-[#080a0f] border-white/5 shadow-2xl max-w-5xl mx-auto">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-10 py-5 text-[10px] font-black text-muted uppercase tracking-widest opacity-40">Rank</th>
                  <th className="px-10 py-5 text-[10px] font-black text-muted uppercase tracking-widest opacity-40">Participant</th>
                  <th className="px-10 py-5 text-[10px] font-black text-muted uppercase tracking-widest opacity-40">Streak</th>
                  <th className="px-10 py-5 text-[10px] font-black text-muted uppercase tracking-widest opacity-40">Plan</th>
                  <th className="px-10 py-5 text-[10px] font-black text-muted uppercase tracking-widest opacity-40 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((row, i) => (
                  <tr key={row.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-10 py-6 text-[11px] font-black text-white/20 group-hover:text-gold transition-colors italic">
                      #{String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-[11px] font-bold text-white uppercase tracking-tight italic">{row.profile?.username || 'Guest User'}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                         <div className="text-xl font-black italic tracking-tighter" style={{ color: row.streak_count === 3 ? 'var(--success)' : 'var(--gold)' }}>{row.streak_count}/3</div>
                         <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden shrink-0 border border-white/[0.03]">
                            <div className="h-full bg-current opacity-40" style={{ width: `${(row.streak_count / 3) * 100}%`, color: row.streak_count === 3 ? 'var(--success)' : 'var(--gold)' }} />
                         </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <span className="badge-elite !text-[8px] !bg-white/5 !text-muted opacity-30 border-white/5 italic">{row.tier?.name || 'Standard'}</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      {row.is_winner
                        ? <div className="badge-elite !text-[9px] !text-success !bg-success/10 border-success/20 italic">COMPLETED</div>
                        : <div className="badge-elite !text-[9px] !text-blue-electric !bg-blue-electric/10 border-blue-electric/20 italic">ACTIVE</div>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Final CTA */}
        <div className="card-elite !p-20 text-center bg-black/40 border-white/5 max-w-4xl mx-auto mb-24 group overflow-hidden">
           <div className="absolute top-0 right-0 p-16 opacity-[0.01] group-hover:opacity-[0.05] transition-opacity -rotate-12 pointer-events-none translate-x-12 translate-y-12 shrink-0">
             <TrendingUp className="w-72 h-72" />
           </div>
           <div className="max-w-xl mx-auto relative z-10">
              <h2 className="mb-8">Join the <span className="text-gradient-gold">Best.</span></h2>
              <p className="text-muted text-xs font-bold opacity-30 mb-12 uppercase tracking-widest leading-loose">
                Ready to prove your accuracy? Sign up and start climbing the ranks today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/accounts" className="btn btn-primary !px-12 !py-4 rounded-xl font-black italic shadow-2xl transition-all hover:scale-105">
                  Get Started <ArrowUpRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/arena" className="btn btn-ghost !px-10 !py-4 rounded-xl border-white/5 font-black italic">View Arena</Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
