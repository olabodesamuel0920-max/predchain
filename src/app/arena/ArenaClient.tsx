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

        {/* Challenge Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          <div className="lg:col-span-8 space-y-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="card-premium !p-12 md:!p-16 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><Radio className="w-80 h-80 text-gold" /></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-16 relative z-10">
                <div>
                   <div className="badge-premium !text-gold mb-6 px-4 py-1.5 uppercase font-bold text-[10px] tracking-widest">Global Fixtures</div>
                   <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-display italic uppercase">Match <span className="text-gradient-gold">Schedule.</span></h2>
                </div>
                <div className="px-8 py-5 bg-white/[0.02] border border-white/5 rounded-3xl text-center shadow-inner shrink-0 min-w-[160px]">
                   <div className="text-[10px] font-bold text-gold uppercase mb-2 tracking-widest opacity-40 italic">Arena Status</div>
                   <div className="text-2xl font-bold text-white font-display tracking-tight uppercase leading-none">{activeRound?.status || 'PREPARING'}</div>
                </div>
              </div>

              <div className="space-y-4">
                {matches.length === 0 ? (
                  <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-20 flex flex-col items-center">
                    <Zap className="w-12 h-12 mb-6" />
                    <span className="text-xs font-bold uppercase tracking-[0.4em]">Awaiting Match Fixtures...</span>
                  </div>
                ) : (
                  matches.slice(0, 3).map((match, i) => (
                    <div key={match.id} className="p-8 md:p-10 bg-white/[0.01] border border-white/5 rounded-3xl flex items-center justify-between hover:bg-white/[0.03] transition-all group/match shadow-lg">
                       <div className="flex items-center gap-8 md:gap-12">
                          <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-[11px] font-bold text-secondary group-hover/match:text-gold group-hover/match:border-gold/20 transition-all font-display">
                             <span>DAY</span>
                             <span className="text-lg leading-none mt-1">0{i+1}</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                             <div className="text-lg md:text-xl font-bold text-white uppercase tracking-tight font-display truncate">{match.home_team} <span className="text-muted/30 mx-3 text-sm italic font-medium tracking-normal lowercase">vs</span> {match.away_team}</div>
                             <div className="flex items-center gap-3 mt-2">
                                <Clock className="w-3.5 h-3.5 text-muted opacity-30" />
                                <div className="text-[11px] font-medium text-secondary opacity-40 uppercase tracking-widest italic">{new Date(match.kickoff_time).toLocaleDateString(undefined, { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                             </div>
                          </div>
                       </div>
                       <ChevronRight className="w-6 h-6 text-white opacity-10 group-hover/match:opacity-100 group-hover/match:translate-x-2 transition-all shrink-0" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Rules Section */}
          <div className="lg:col-span-4 space-y-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="card-premium !p-12 relative overflow-hidden group border-gold/10">
               <h3 className="text-2xl font-bold tracking-tight mb-12 font-display uppercase italic">Rules of the <span className="text-gold">Arena.</span></h3>
               <ul className="space-y-10">
                  {[
                    { title: 'Activation', desc: 'Secure an entry tier to participate in the active challenge.', icon: Shield },
                    { title: 'Selection', desc: 'Submit predictions for official fixtures before kickoff times.', icon: Target },
                    { title: 'Verification', desc: 'Match results are verified by professional sports data feeds.', icon: ShieldCheck },
                    { title: 'Settlement', desc: 'Finalize a 3/3 sequence to unlock 10X reward multipliers.', icon: Award }
                  ].map((rule, i) => (
                    <li key={i} className="flex gap-6 group/item">
                       <div className="shrink-0 w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover/item:border-gold/30 transition-all">
                          <rule.icon className="w-5 h-5 text-gold opacity-30 group-hover/item:opacity-100 transition-opacity" />
                       </div>
                       <div className="space-y-1.5 mt-1">
                          <div className="text-xs font-bold text-white uppercase tracking-widest font-display">{rule.title}</div>
                          <p className="text-[11px] font-medium text-secondary opacity-40 leading-relaxed italic">{rule.desc}</p>
                       </div>
                    </li>
                  ))}
               </ul>
            </div>

            <div className="card-premium !p-10 border-white/5 bg-white/[0.01] flex items-center gap-8">
               <Activity className="w-10 h-10 text-emerald-500 opacity-20 shrink-0" />
               <div className="space-y-2">
                  <h4 className="text-[13px] font-bold text-white font-display uppercase italic tracking-tight">Active Pool Stability</h4>
                  <p className="text-[11px] font-medium text-secondary opacity-40 italic leading-relaxed">
                     Global strategy integrity is currently optimal. All verified sequences are eligible for payout verification.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
