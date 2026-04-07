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
  Radio
} from 'lucide-react';
import Link from 'next/link';

interface ArenaClientProps {
  activeRound: ChallengeRound | null;
  matches: ChallengeMatch[];
  stats: { activePlayers: number };
}

export default function ArenaClient({ activeRound, matches, stats }: ArenaClientProps) {
  return (
    <div className="min-h-screen bg-primary pt-24 pb-16 md:pt-36">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full h-[600px] bg-blue-glow blur-[140px] opacity-10" />
        <div className="absolute bottom-0 left-0 w-full h-[600px] bg-gold-glow blur-[140px] opacity-10" />
      </div>

      <div className="container relative z-10">
        {/* Hero Section */}
        <div className="max-w-4xl mb-16 md:mb-20 animate-slide-up">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="badge-elite !text-gold bg-white/[0.03] border-gold/10 px-4 py-1 flex items-center gap-2.5">
               <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_var(--success)]" />
               <span className="text-[10px] font-black tracking-widest leading-none">LIVE ARENA ACTIVE</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <span className="text-[9px] font-black text-muted uppercase tracking-[0.2em] opacity-30 italic">Sequence Integrity Alpha</span>
          </div>
          
          <h1 className="mb-6 md:mb-8 leading-[0.9] italic text-4xl md:text-6xl lg:text-7xl">
            Command the <span className="text-gradient-gold">Sequence.</span><br />
            Dominate the <span className="text-gradient-blue">Arena.</span>
          </h1>
          
          <p className="text-muted text-[11px] md:text-sm font-black uppercase tracking-[0.25em] leading-loose max-w-xl opacity-40 mb-10 md:mb-12">
            The high-integrity arena for elite sports analytics. Build a verified 3-day sequence and unlock global rewards.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/signup" className="btn btn-primary !px-10 !py-4.5 shadow-2xl text-[11px] tracking-widest font-black">
              JOIN THE CHALLENGE <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <div className="flex -space-x-2.5 items-center ml-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-primary bg-[#080a0f] flex items-center justify-center text-[10px] font-black text-gold italic shadow-xl">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <span className="ml-6 text-[10px] font-black text-white/20 uppercase tracking-widest italic">+{stats.activePlayers.toLocaleString()} ACTIVES</span>
            </div>
          </div>
        </div>

        {/* Live Sequence Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start mb-20 md:mb-24">
          <div className="lg:col-span-8 space-y-6 md:space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="card-elite !p-6 md:!p-10 border-white/5 bg-[#030508] relative overflow-hidden group shadow-3xl">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity"><Radio className="w-64 h-64 text-blue-electric" /></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 relative z-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-2 uppercase">Sequence <span className="text-gradient-gold">Schedule.</span></h2>
                  <p className="text-[9px] font-black text-muted uppercase tracking-[0.4em] opacity-40 italic">Global Match Resolution Node Alpha</p>
                </div>
                <div className="px-6 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-center shadow-inner shrink-0">
                   <div className="text-[8px] font-black text-gold uppercase mb-1 tracking-widest italic opacity-40">Status</div>
                   <div className="text-xl md:text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{activeRound?.status || 'PENDING'}</div>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                {matches.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-2xl opacity-10">
                    <Zap className="w-10 h-10 mx-auto mb-4" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] italic">Awaiting Sequence...</span>
                  </div>
                ) : (
                  matches.map((match, i) => (
                    <div key={match.id} className="p-5 md:p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/[0.04] transition-all group/match">
                       <div className="flex items-center gap-6 md:gap-10">
                          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[10px] font-black text-muted group-hover/match:text-gold group-hover/match:border-gold/20 transition-all italic shrink-0">D{i+1}</div>
                          <div className="flex flex-col min-w-0">
                             <div className="text-sm md:text-base font-black text-white uppercase italic tracking-tight truncate">{match.home_team} <span className="text-muted/20 mx-2 text-xs">vs</span> {match.away_team}</div>
                             <div className="text-[9px] font-black text-muted uppercase tracking-widest opacity-30 mt-1 italic">{new Date(match.kickoff_time).toLocaleDateString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-6 shrink-0">
                          <div className="hidden sm:flex items-center gap-2">
                             <div className="w-1 h-1 rounded-full bg-blue-electric/20" />
                             <span className="text-[8px] font-black text-muted uppercase tracking-widest opacity-20 italic">Verified Node</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white opacity-10 group-hover/match:opacity-100 group-hover/match:translate-x-1 transition-all" />
                       </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Rules */}
          <div className="lg:col-span-4 space-y-6 md:space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="card-elite !p-6 md:!p-8 border-blue-electric/10 bg-blue-electric/[0.02] shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-electric/10 blur-[60px] rounded-full" />
               <h3 className="text-lg font-black italic tracking-tight mb-8 uppercase">The <span className="text-blue-electric">Integrity</span> Hub.</h3>
               <ul className="space-y-6 md:space-y-8">
                  {[
                    { title: 'Activation', desc: 'Secure an entry tier to join the active round sequence.', icon: Zap },
                    { title: 'Predictions', desc: 'Submit choices for all matches before kickoff times.', icon: Target },
                    { title: 'Verification', desc: 'Outcomes are verified atomically via global score nodes.', icon: ShieldCheck },
                    { title: 'Settlement', desc: '3/3 correct predictions trigger a 10X reward yield.', icon: Trophy }
                  ].map((rule, i) => (
                    <li key={i} className="flex gap-5 group/item">
                       <div className="shrink-0 w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover/item:border-blue-electric/30 transition-all">
                          <rule.icon className="w-3.5 h-3.5 text-blue-electric opacity-30 group-hover/item:opacity-100 transition-opacity" />
                       </div>
                       <div className="space-y-1 mt-0.5">
                          <div className="text-[10px] font-black text-white uppercase italic tracking-widest">{rule.title}</div>
                          <p className="text-[9px] font-black text-muted uppercase tracking-widest leading-relaxed opacity-20 italic">{rule.desc}</p>
                       </div>
                    </li>
                  ))}
               </ul>
            </div>

            <div className="card-elite !p-6 md:!p-8 border-white/5 bg-white/[0.01]">
               <Activity className="w-6 h-6 text-gold opacity-20 mb-6" />
               <h4 className="text-[11px] font-black text-white italic tracking-tight mb-3 uppercase">Dynamic Yield Active</h4>
               <p className="text-[9px] font-black text-muted uppercase tracking-widest italic leading-relaxed opacity-20">
                  Global pool integrity is currently optimal. All verified sequences are eligible for payout.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
