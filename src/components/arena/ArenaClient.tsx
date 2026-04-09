'use client';

import { ChallengeRound, ChallengeMatch } from '@/types';
import { 
  Zap,
  ShieldCheck, 
  Target, 
  ArrowRight,
  Activity,
  Radio,
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
    <div className="min-h-screen pt-24 sm:pt-32 pb-24">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-muted/5 blur-[120px]" />
      </div>

      <div className="container-tight relative z-10">
        {/* Global Strategy Header */}
        <div className="max-w-4xl mb-16 sm:mb-24">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="badge-luxury px-4 py-1.5 flex items-center gap-2.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               <span className="pb-px font-display tracking-[0.15em] font-extrabold">LIVE PERFORMANCE ARENA</span>
            </div>
          </div>
          
          <h1 className="mb-6 uppercase italic font-black leading-[1.1] tracking-tight">
            Master the <span className="text-gradient-gold">Sequence.</span><br />
            Dominate the <span className="text-white">Professional Arena.</span>
          </h1>
          
          <p className="text-text-secondary text-base font-normal leading-relaxed max-w-2xl mb-12">
            The high-precision platform for elite football prediction. Build a perfect 3-day sequence to unlock verified <span className="text-white font-bold italic">10X multipliers</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <Link href="/signup" className="btn-luxury btn-gold !py-4.5 !px-12 w-full sm:w-auto shadow-md group">
               INITIALIZE ACCESS <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <div className="flex items-center gap-5">
              <div className="flex -space-x-2.5">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border border-bg-darker bg-bg-secondary flex items-center justify-center text-[10px] font-black text-gold italic shadow-md">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                 <span className="text-[11px] font-black text-white uppercase italic leading-none">+{stats.activePlayers.toLocaleString()} Active Nodes</span>
                 <span className="text-[9px] font-extrabold text-text-dim uppercase tracking-widest mt-1 italic">Real-time sync</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Status Banner */}
        <div className="card-luxury !p-6 mb-8 bg-[#11161D] border-gold/10 relative overflow-hidden group">
           <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-xl bg-gold/5 flex items-center justify-center border border-gold/10 group-hover:bg-gold/10 transition-all">
                    <Radio className="w-6 h-6 text-gold animate-pulse" />
                 </div>
                 <div className="space-y-1 text-center md:text-left">
                    <div className="flex items-center gap-2.5 justify-center md:justify-start">
                       <span className="text-[9px] font-black text-gold uppercase tracking-[0.2em] italic">Cycle {activeRound?.round_number || '01'}</span>
                       <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tight font-display">{activeRound?.status === 'active' ? 'Arena Operational' : 'Awaiting Deployment'}</h2>
                 </div>
              </div>
              <div className="flex items-center gap-8 bg-bg-primary/50 border border-border-subtle rounded-xl px-8 py-4 shadow-sm">
                 <div className="text-center">
                    <span className="text-[8px] font-black text-text-dim uppercase tracking-widest block mb-1 italic">Current Pool</span>
                    <span className="text-lg font-black text-white font-display italic tracking-tight">₦{(stats.activePlayers * 5000).toLocaleString()}</span>
                 </div>
                 <div className="w-px h-8 bg-border-subtle" />
                 <div className="text-center">
                    <span className="text-[8px] font-black text-text-dim uppercase tracking-widest block mb-1 italic">Network Risk</span>
                    <span className="text-lg font-black text-emerald-500 font-display italic tracking-tight uppercase">Optimal</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Content Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="card-luxury !p-0 overflow-hidden bg-bg-card">
              <div className="px-8 py-6 border-b border-border-subtle flex justify-between items-center bg-white/[0.01]">
                 <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-gold/40" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">Global Match Feed</span>
                 </div>
                 {!activeRound && (
                   <span className="text-[8px] font-black text-gold/30 uppercase tracking-[0.2em] italic animate-pulse">Synchronizing...</span>
                 )}
              </div>

              <div className="p-4 sm:p-6 space-y-3">
                {matches.length === 0 ? (
                  <div className="py-24 text-center border border-dashed border-border-subtle rounded-xl flex flex-col items-center">
                    <Zap className="w-8 h-8 mb-4 text-text-dim/20" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-text-dim italic">Waiting for Round Start...</span>
                  </div>
                ) : (
                  matches.map((match, i) => (
                    <div key={match.id} className="p-5 bg-bg-secondary/50 border border-border-subtle rounded-xl flex flex-col sm:flex-row items-center justify-between hover:bg-bg-secondary hover:border-border-highlight transition-all gap-6 sm:gap-0">
                       <div className="flex items-center gap-6 w-full sm:w-auto">
                          <div className="w-10 h-10 rounded-lg bg-bg-primary border border-border-subtle flex flex-col items-center justify-center text-[8px] font-black text-text-muted group-hover:text-gold transition-all shrink-0">
                             <span className="opacity-50">DAY</span>
                             <span className="text-base font-display font-black leading-none italic mt-0.5">0{i+1}</span>
                          </div>
                          <div className="flex flex-col">
                             <div className="text-base font-black text-white uppercase tracking-tight font-display italic flex items-center gap-3">
                                <span>{match.home_team}</span>
                                <span className="text-[8px] text-text-dim lowercase tracking-normal italic opacity-50">vs</span>
                                <span>{match.away_team}</span>
                             </div>
                             <div className="flex items-center gap-2 mt-2">
                                <Clock className="w-3 h-3 text-text-dim opacity-50" />
                                <span className="text-[9px] font-black text-text-muted uppercase tracking-widest italic opacity-40">
                                   {new Date(match.kickoff_time).toLocaleDateString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                                </span>
                             </div>
                          </div>
                       </div>
                       <Link href="/accounts" className="btn-luxury btn-outline !py-2.5 !px-8 !text-[9px] w-full sm:w-auto">
                          SECURE PICK <ArrowRight className="w-3 h-3" />
                       </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Rules / Protocol Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card-luxury !p-8 border-gold/5 bg-[#11161D]">
               <div className="flex items-center gap-3 mb-8">
                  <ShieldCheck className="w-4 h-4 text-gold/40" />
                  <h3 className="text-base font-black italic uppercase tracking-tight font-display">Arena <span className="text-gold">Protocol</span></h3>
               </div>
               <ul className="space-y-6">
                  {[
                    { title: 'Activation', desc: 'Secure an entry tier to join the challenge.', icon: Shield },
                    { title: 'Selection', desc: 'Submit one pick each 24-hour cycle.', icon: Target },
                    { title: 'Verification', desc: 'Results verified by official data feeds.', icon: ShieldCheck },
                    { title: 'Settlement', desc: 'Achieve 3/3 for 10X reward release.', icon: Award }
                  ].map((rule, i) => (
                    <li key={i} className="flex gap-4 items-start">
                       <div className="shrink-0 w-8 h-8 rounded-lg bg-white/[0.02] border border-border-subtle flex items-center justify-center">
                          <rule.icon className="w-3.5 h-3.5 text-gold/30" />
                       </div>
                       <div className="space-y-1">
                          <div className="text-[10px] font-black text-white uppercase tracking-widest font-display italic">{rule.title}</div>
                          <p className="text-[9px] font-normal text-text-dim leading-relaxed italic">{rule.desc}</p>
                       </div>
                    </li>
                  ))}
               </ul>
            </div>

            <div className="card-luxury !p-6 border-border-subtle bg-transparent flex items-center gap-4">
               <Activity className="w-6 h-6 text-emerald-500/20 shrink-0" />
               <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-white font-display uppercase italic tracking-tight">Full Integrity Pool</h4>
                  <p className="text-[9px] font-normal text-text-dim italic leading-relaxed">
                     Global strategy is synchronized and optimal. Settlement is automated.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
