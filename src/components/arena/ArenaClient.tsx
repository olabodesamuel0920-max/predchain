'use client';

import { ChallengeRound, ChallengeMatch } from '@/types';
import { 
  Trophy, 
  Zap, 
  ShieldCheck, 
  Target, 
  ChevronRight, 
  ArrowRight,
  Activity,
  Globe,
  Radio,
  Star,
  Shield,
  Clock,
  Award
} from 'lucide-react';
import Link from 'next/link';

interface ArenaClientProps {
  activeRound: ChallengeRound | null;
  matches: ChallengeMatch[];
  stats: { activePlayers: number };
}

export default function ArenaClient({ activeRound, matches, stats }: ArenaClientProps) {
  return (
    <div className="min-h-screen pt-40 pb-24">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full h-[800px] bg-gold-glow blur-[140px] opacity-10" />
      </div>

      <div className="container relative z-10 px-6">
        {/* Global Strategy Header */}
        <div className="max-w-4xl mb-24 animate-slide-up">
          <div className="flex flex-wrap items-center gap-6 mb-10">
            <div className="badge-premium !text-gold bg-gold/10 px-6 py-2 flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               <span className="text-[10px] font-bold tracking-widest leading-none">LIVE PERFORMANCE ARENA</span>
            </div>
            <div className="w-px h-4 bg-white/10 hidden sm:block" />
            <span className="text-[11px] font-medium text-secondary opacity-40 uppercase tracking-[0.2em] italic">Standardized 3-Day Sequences</span>
          </div>
          
          <h1 className="mb-10 leading-[1.05] tracking-tight">
            Master the <span className="text-gradient-gold">Sequence.</span><br />
            Dominate the <span className="text-white">Professional Arena.</span>
          </h1>
          
          <p className="text-secondary text-lg font-medium opacity-60 leading-relaxed max-w-2xl mb-16">
            The high-precision platform for elite football prediction. Build a perfect 3-day sequence to unlock verified reward multipliers in the global pool.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-10">
            <Link href="/signup" className="btn btn-primary !px-16 !py-6 text-base shadow-2xl group w-full sm:w-auto">
               Join Upcoming Challenge <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-2" />
            </Link>
            <div className="flex -space-x-3 items-center">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-11 h-11 rounded-full border-2 border-[#030508] bg-[#0a0d14] flex items-center justify-center text-xs font-bold text-gold italic shadow-xl">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="ml-8 flex flex-col">
                 <span className="text-sm font-bold text-white leading-none">+{stats.activePlayers.toLocaleString()} Total Players</span>
                 <span className="text-[10px] font-medium text-secondary opacity-40 uppercase tracking-widest mt-1">Actively participating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Status Banner */}
        <div className="card-premium !p-8 mb-12 bg-grad-dark border-gold/10 relative overflow-hidden group animate-slide-up">
           <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
           <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/10 group-hover:scale-105 transition-transform">
                    <Radio className="w-7 h-7 text-gold animate-pulse" />
                 </div>
                 <div className="space-y-2 text-center md:text-left">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                       <span className="text-[10px] font-bold text-gold uppercase tracking-[0.3em] font-display">Challenge Cycle {activeRound?.round_number || '01'}</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <h2 className="text-3xl font-display uppercase italic tracking-tight">Status: <span className="text-white">{activeRound?.status === 'active' ? 'Arena Operational' : 'Awaiting Deployment'}</span></h2>
                 </div>
              </div>
              <div className="flex items-center gap-8 bg-white/[0.02] border border-white/5 rounded-2xl px-8 py-5 shadow-inner">
                 <div className="text-center">
                    <span className="text-[9px] font-bold text-muted uppercase tracking-widest block mb-1 opacity-40">Active Pool</span>
                    <span className="text-xl font-bold text-white font-display">₦{(stats.activePlayers * 5000).toLocaleString()}</span>
                 </div>
                 <div className="w-px h-8 bg-white/5" />
                 <div className="text-center">
                    <span className="text-[9px] font-bold text-muted uppercase tracking-widest block mb-1 opacity-40">Calculated Risk</span>
                    <span className="text-xl font-bold text-emerald-500 font-display">Optimized</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Participation Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <div className="lg:col-span-8 space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="card-premium !p-0 overflow-hidden group">
              <div className="p-10 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center"><Activity className="w-4 h-4 text-gold opacity-50" /></div>
                    <span className="text-[11px] font-bold text-white uppercase tracking-[0.3em] font-display italic">Global Fixtures Timeline</span>
                 </div>
                 {!activeRound && (
                   <div className="text-[9px] font-bold text-gold/40 uppercase tracking-widest italic animate-pulse">Synchronizing Data Feeds...</div>
                 )}
              </div>

              <div className="p-6 md:p-8 space-y-4">
                {matches.length === 0 ? (
                  <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-20 flex flex-col items-center">
                    <Zap className="w-12 h-12 mb-6" />
                    <span className="text-xs font-bold uppercase tracking-[0.4em]">Awaiting Final Round Sync...</span>
                  </div>
                ) : (
                  matches.map((match, i) => (
                    <div key={match.id} className="p-8 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between hover:bg-white/[0.03] transition-all group/match shadow-lg gap-8 sm:gap-0">
                       <div className="flex items-center gap-8 lg:gap-12 w-full sm:w-auto">
                          <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-[10px] font-bold text-secondary group-hover/match:text-gold group-hover/match:border-gold/20 transition-all font-display shrink-0">
                             <span>DAY</span>
                             <span className="text-base leading-none mt-1">0{i+1}</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                             <div className="text-lg md:text-xl font-bold text-white uppercase tracking-tighter font-display leading-none flex items-center gap-4">
                                <span>{match.home_team}</span>
                                <span className="text-[10px] text-muted opacity-20 lowercase font-medium tracking-normal italic">vs</span>
                                <span>{match.away_team}</span>
                             </div>
                             <div className="flex items-center gap-3 mt-3">
                                <Clock className="w-3.5 h-3.5 text-muted opacity-30" />
                                <div className="text-[10px] font-bold text-secondary opacity-30 uppercase tracking-[0.2em] italic">
                                   {new Date(match.kickoff_time).toLocaleDateString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                                </div>
                             </div>
                          </div>
                       </div>
                       <Link href="/signup" className="btn btn-secondary !py-3 !px-10 !text-[10px] !rounded-xl group/btn opacity-40 group-hover/match:opacity-100 group-hover/match:bg-white/10 transition-all w-full sm:w-auto">
                          SECURE PICK <ArrowRight className="w-3 h-3 ml-3 transition-transform group-hover/btn:translate-x-2" />
                       </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Rules Section */}
          <div className="lg:col-span-4 space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="card-premium !p-10 relative overflow-hidden group border-gold/5 bg-[#0a0d14]">
               <div className="flex items-center gap-4 mb-10">
                  <ShieldCheck className="w-5 h-5 text-gold opacity-50" />
                  <h3 className="text-xl font-bold tracking-tight font-display uppercase italic">Arena <span className="text-gold">Protocol.</span></h3>
               </div>
               <ul className="space-y-8">
                  {[
                    { title: 'Activation', desc: 'Secure an entry tier to join the active challenge.', icon: Shield },
                    { title: 'Selection', desc: 'Submit one precise outcome per 24 hours.', icon: Target },
                    { title: 'Verification', desc: 'Results verified by elite sports data feeds.', icon: ShieldCheck },
                    { title: 'Settlement', desc: 'Achieve 3/3 to unlock 10X reward multipliers.', icon: Award }
                  ].map((rule, i) => (
                    <li key={i} className="flex gap-5 group/item">
                       <div className="shrink-0 w-10 h-10 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center group-hover/item:border-gold/30 transition-all">
                          <rule.icon className="w-4 h-4 text-gold opacity-30 group-hover/item:opacity-100 transition-opacity" />
                       </div>
                       <div className="space-y-1 mt-0.5">
                          <div className="text-[10px] font-bold text-white uppercase tracking-widest font-display">{rule.title}</div>
                          <p className="text-[10px] font-medium text-secondary opacity-30 leading-relaxed italic">{rule.desc}</p>
                       </div>
                    </li>
                  ))}
               </ul>
            </div>

            <div className="card-premium !p-8 border-white/5 bg-white/[0.01] flex items-center gap-6">
               <Activity className="w-8 h-8 text-emerald-500 opacity-20 shrink-0" />
               <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-white font-display uppercase italic tracking-tight">Pool Integrity</h4>
                  <p className="text-[10px] font-medium text-secondary opacity-30 italic leading-relaxed">
                     Global strategy synchronization is optimal. All verified sequences are eligible for settlement.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
