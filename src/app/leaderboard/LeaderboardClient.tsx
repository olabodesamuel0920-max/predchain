'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
    (r.profile?.username || r.profile?.full_name || 'Player')
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

      <div className="container-tight relative z-10 px-4 sm:px-0">
        {/* Header */}
        <div className="text-center mb-24 sm:mb-40 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="badge-luxury mb-10 px-8 py-2.5 bg-white/[0.02] border-white/10 italic font-black"
          >
            ARENA PERFORMANCE LEDGER
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 uppercase italic font-black leading-none tracking-tighter text-5xl sm:text-8xl text-white"
          >
            Elite <span className="text-gradient-gold">Performers.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-base sm:text-xl font-medium opacity-60 leading-relaxed italic max-w-2xl mx-auto"
          >
            The verified hierarchy of challengers ranked by circuit consistency and high-precision prediction accuracy.
          </motion.p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 mb-32 sm:mb-48 items-end max-w-6xl mx-auto relative">
          <div className="absolute inset-0 bg-gold/[0.02] blur-[150px] pointer-events-none" />
          
          {top3.map((player, i) => {
            const name = player.profile?.username || player.profile?.full_name || 'ANONYMOUS_PLAYER';
            const isFirst = i === 0;
            const rankLabel = i === 0 ? 'Arena Master' : i === 1 ? 'High Tier' : 'Elite Player';
            
            return (
              <motion.div 
                key={player.id} 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`card-luxury !p-12 sm:!p-16 text-center relative transition-all duration-700 bg-[#07090e] depth-card shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)] ${isFirst ? 'md:py-24 border-gold/30 z-20 scale-105' : 'md:opacity-60 scale-95 border-white/10 order-last md:order-none'}`}
              >
                {isFirst && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-gold rounded-2xl flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(242,201,76,0.5)] z-30 animate-bounce">
                    <Trophy className="w-7 h-7 text-black" />
                  </div>
                )}
                
                <div className={`text-[10px] font-black uppercase tracking-[0.4em] mb-10 italic ${isFirst ? 'text-gold' : 'text-text-dim opacity-30'}`}>
                  {rankLabel}
                </div>

                <div className={`w-20 h-20 mx-auto mb-10 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center relative group overflow-hidden shadow-inner ${isFirst ? 'text-gold' : 'text-text-dim/30'}`}>
                   {isFirst ? <Gem className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
                   <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="text-xl sm:text-2xl font-black text-white mb-4 tracking-tighter truncate italic uppercase font-display group-hover:text-gold transition-colors">
                  @{name}
                </div>

                <div className="text-5xl sm:text-6xl font-black text-white italic tracking-tighter mb-12 leading-none font-display">
                  <span className={isFirst ? 'text-gold' : 'text-white'}>{player.streak_count}</span><span className="text-text-dim/20 text-2xl ml-2 tracking-widest">/ 3</span> 
                </div>

                <div className="inline-flex px-6 py-2 rounded-2xl bg-white/[0.03] border border-white/5 text-[9px] font-black text-text-dim uppercase tracking-[0.3em] italic shadow-inner">
                  {player.tier?.name || 'STANDARD'} CIRCUIT
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-8 max-w-6xl mx-auto">
           <div className="flex bg-[#07090e] border border-white/10 rounded-[2rem] p-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar shadow-inner">
              {(['weekly', 'monthly', 'alltime'] as const).map(t => (
                <button
                  key={t}
                  className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 italic whitespace-nowrap flex-1 sm:flex-none ${tab === t ? 'bg-white/[0.05] text-white shadow-lg' : 'text-text-dim opacity-30 hover:opacity-100'}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
           </div>
           
           <div className="relative group w-full sm:w-80">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/30 group-focus-within:text-gold transition-all duration-500" />
              <input
                type="search"
                placeholder="SEARCH_CHALLENGERS..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#07090e] border border-white/10 rounded-[2rem] py-5 pl-14 pr-8 text-[11px] font-black text-white focus:outline-none focus:border-gold/30 transition-all uppercase tracking-[0.2em] placeholder:opacity-20 italic shadow-inner"
              />
           </div>
        </div>

        {/* Ranking Table */}
        <div className="card-luxury !p-0 overflow-hidden mb-32 bg-[#07090e] border-white/10 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)] max-w-6xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          <div className="overflow-x-auto no-scrollbar relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-12 py-8 text-[10px] font-black text-text-dim uppercase tracking-[0.4em] italic opacity-40">RANK</th>
                  <th className="px-12 py-8 text-[10px] font-black text-text-dim uppercase tracking-[0.4em] italic opacity-40">CHALLENGER</th>
                  <th className="px-12 py-8 text-[10px] font-black text-text-dim uppercase tracking-[0.4em] italic opacity-40">STREAK_VELOCITY</th>
                  <th className="px-12 py-8 text-[10px] font-black text-text-dim uppercase tracking-[0.4em] italic opacity-40">CIRCUIT</th>
                  <th className="px-12 py-8 text-[10px] font-black text-text-dim uppercase tracking-[0.4em] italic opacity-40 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((row, i) => (
                  <tr key={row.id} className="hover:bg-white/[0.01] transition-all group/row duration-500">
                    <td className="px-12 py-8 text-[11px] font-black text-text-dim group-hover/row:text-gold transition-colors italic tracking-widest opacity-30 group-hover/row:opacity-100">
                      #{String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="px-12 py-8">
                      <span className="text-lg font-black text-white uppercase tracking-tighter italic font-display group-hover/row:text-gold transition-colors">@{row.profile?.username || 'GUEST_CHALLENGER'}</span>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-6">
                         <div className="text-2xl font-black italic tracking-tighter font-display transition-transform group-hover/row:scale-110 duration-500" style={{ color: row.streak_count === 3 ? 'var(--success)' : 'white' }}>{row.streak_count}/3</div>
                         <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden shrink-0 shadow-inner">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(row.streak_count / 3) * 100}%` }}
                              transition={{ duration: 1, delay: i * 0.05 }}
                              className="h-full bg-current shadow-[0_0_10px_rgba(242,201,76,0.3)]" 
                              style={{ color: row.streak_count === 3 ? 'var(--success)' : 'var(--gold)' }} 
                            />
                         </div>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                       <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em] italic opacity-30 group-hover/row:opacity-100 transition-opacity">{row.tier?.name || 'STANDARD'}</span>
                    </td>
                    <td className="px-12 py-8 text-right">
                      {row.is_winner
                        ? <div className="badge-luxury !py-2 !px-6 italic font-black text-[9px] !bg-emerald-500/5 !text-emerald-500 border-emerald-500/10 tracking-[0.2em] shadow-inner">CONFIRMED</div>
                        : <div className="badge-luxury !py-2 !px-6 italic font-black text-[9px] !bg-gold/5 !text-gold border-gold/10 tracking-[0.2em] shadow-inner">ACTIVE</div>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="card-luxury-gold !p-20 md:!p-32 text-center border-gold/15 max-w-5xl mx-auto mb-40 group relative rounded-[4rem] shadow-[0_60px_120px_-40px_rgba(242,201,76,0.15)]"
        >
           <div className="absolute inset-0 bg-[#05070a]" />
           <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.05] to-transparent opacity-50" />
           <div className="max-w-3xl mx-auto relative z-10">
              <h2 className="mb-12 text-6xl md:text-9xl uppercase italic font-black leading-none text-white tracking-tighter">Join the <br /><span className="text-gradient-gold">Elite Hub.</span></h2>
              <p className="text-text-secondary text-lg font-medium mb-20 leading-relaxed italic opacity-60">
                Ready to validate your accuracy on the global stage? Start your circuit activation and command the rankings today.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Link href="/accounts" className="btn-luxury btn-gold btn-premium-depth !px-20 !py-6 !text-[12px] font-black italic tracking-[0.2em] shadow-2xl uppercase">
                  INITIALIZE ACCESS <ArrowUpRight className="w-5 h-5 ml-3" />
                </Link>
                <Link href="/arena" className="btn-luxury btn-outline btn-premium-depth !px-20 !py-6 !text-[12px] font-black italic tracking-[0.2em] border-white/10 bg-white/[0.02] uppercase">VIEW ARENA</Link>
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
