'use client';

import { ChallengeRound, ChallengeMatch, PlatformStats } from '@/types';
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
  Award,
  PlayCircle,
  Users
} from 'lucide-react';
import Link from 'next/link';

interface ArenaClientProps {
  activeRound: ChallengeRound | null;
  matches: ChallengeMatch[];
  stats: PlatformStats;
}

export default function ArenaClient({ activeRound, matches, stats }: ArenaClientProps) {
  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 bg-primary">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-glow blur-[140px] opacity-[0.05]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-glow blur-[120px] opacity-[0.03]" />
      </div>

      <div className="container-tight relative z-10 px-6">
        {/* Product Hero */}
        <div className="max-w-4xl mb-12 sm:mb-20">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="badge-luxury px-4 py-1.5 flex items-center gap-2.5 bg-gold/5 border-gold/10">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               <span className="pb-px font-display tracking-[0.15em] font-extrabold uppercase">Arena Active</span>
            </div>
          </div>
          
          <h1 className="mb-6 uppercase italic font-black leading-[1.1] tracking-tight">
            The <span className="text-gradient-gold">Match Arena.</span><br />
            Where Streaks are <span className="text-white">Forged.</span>
          </h1>
          
          <p className="text-text-secondary text-sm sm:text-base font-medium leading-relaxed max-w-2xl mb-12 opacity-70">
            Build a perfect 3-day winning streak on elite football fixtures. 
            Join thousands of players competing for 10X reward multipliers in the most transparent prediction arena.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <Link href="/accounts" className="btn-luxury btn-gold !py-4.5 !px-12 w-full sm:w-auto shadow-2xl group">
               START YOUR CHALLENGE <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <div className="flex items-center gap-5">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-bg-primary bg-bg-secondary flex items-center justify-center text-[10px] font-black text-gold italic shadow-xl">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                 <span className="text-[11px] font-black text-white uppercase italic leading-none">{stats.activeChallengers.toLocaleString()}+ Active Players</span>
                 <span className="text-[9px] font-extrabold text-emerald-500/60 uppercase tracking-widest mt-1.5 italic">Live status</span>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Overview Banner */}
        <div className="card-luxury !p-8 sm:!p-10 mb-12 bg-[#0a0d12] border-white/5 relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700 rotate-12"><Trophy className="w-48 h-48" /></div>
           <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-gold/5 flex items-center justify-center border border-gold/10 group-hover:bg-gold/10 transition-all duration-500 shadow-inner">
                    <Radio className="w-8 h-8 text-gold animate-pulse" />
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em] italic">Current Cycle</span>
                       <div className="w-1 h-1 rounded-full bg-emerald-500" />
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] italic">Live Feed</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter font-display text-white">Match Cycle {activeRound?.round_number || '01'}</h2>
                 </div>
              </div>
              
              <div className="flex items-center gap-10 bg-black/40 border border-white/5 rounded-2xl px-10 py-6 shadow-inner w-full lg:w-auto">
                  <div className="text-center flex-1 lg:flex-none">
                     <span className="text-[9px] font-black text-text-dim uppercase tracking-widest block mb-2 italic">Payout Pool</span>
                     <span className="text-xl font-black text-white font-display italic tracking-tight">₦{stats.totalCashPaid.toLocaleString()}</span>
                  </div>
                  <div className="w-px h-10 bg-white/5 hidden sm:block" />
                  <div className="text-center flex-1 lg:flex-none">
                     <span className="text-[9px] font-black text-text-dim uppercase tracking-widest block mb-2 italic">Official Audit</span>
                     <span className="text-xl font-black text-emerald-500 font-display italic tracking-tight uppercase">Confirmed</span>
                  </div>
              </div>
           </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Match Feed */}
          <div className="lg:col-span-8 space-y-6">
            <div className="card-luxury !p-0 overflow-hidden bg-[#080a0f] border-white/5 shadow-2xl">
              <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                 <div className="flex items-center gap-4">
                    <Activity className="w-5 h-5 text-gold/60" />
                    <span className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic font-display">Elite Arena Fixtures</span>
                 </div>
                 {!activeRound && (
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gold/40 rounded-full animate-ping" />
                      <span className="text-[9px] font-black text-gold/40 uppercase tracking-[0.2em] italic">Updating Arena...</span>
                   </div>
                 )}
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                {matches.length === 0 ? (
                  <div className="py-32 px-10 text-center border border-white/5 bg-white/[0.01] rounded-[2rem] flex flex-col items-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gold/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="w-20 h-20 rounded-2xl bg-gold/5 border border-gold/10 flex items-center justify-center mb-10 relative z-10">
                       <Zap className="w-8 h-8 text-gold animate-pulse" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 italic relative z-10">Preparing Next <span className="text-gradient-gold">Arena Cycle.</span></h3>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] max-w-sm mx-auto leading-loose italic opacity-40 relative z-10">
                       Synchronizing official match feeds and establishing elite prediction liquidity. The next match cycle will be accessible shortly.
                    </p>
                  </div>
                ) : (
                  matches.map((match, i) => (
                    <div key={match.id} className="group p-6 sm:p-8 bg-[#0a0d14] border border-white/5 rounded-3xl flex flex-col sm:flex-row items-center justify-between hover:bg-[#0d1018] hover:border-gold/20 transition-all duration-500 gap-8 sm:gap-0 relative overflow-hidden shadow-xl">
                       <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/[0.02] to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                       
                       <div className="flex items-center gap-8 w-full sm:w-auto relative z-10">
                          <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex flex-col items-center justify-center text-[10px] font-black text-text-muted group-hover:text-gold group-hover:border-gold/20 transition-all shrink-0 shadow-inner group-hover:shadow-gold/5">
                             <span className="opacity-40 uppercase">Day</span>
                             <span className="text-lg font-display font-black leading-none italic mt-1">0{i+1}</span>
                          </div>
                          <div className="flex flex-col">
                             <div className="text-lg sm:text-xl font-black text-white uppercase tracking-tight font-display italic flex items-center gap-4">
                                <span>{match.home_team}</span>
                                <span className="text-[10px] text-text-dim lowercase tracking-normal italic opacity-40">vs</span>
                                <span>{match.away_team}</span>
                             </div>
                             <div className="flex items-center gap-3 mt-3">
                                <Clock className="w-3.5 h-3.5 text-gold/40" />
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] italic opacity-60">
                                   {new Date(match.kickoff_time).toLocaleDateString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                                </span>
                             </div>
                          </div>
                       </div>
                       
                       <Link href="/accounts" className="btn-luxury btn-outline !py-3 !px-10 !text-[10px] w-full sm:w-auto group/btn relative z-10">
                          SECURE PICK <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                       </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Rules Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="card-luxury !p-10 border-gold/10 bg-[#0a0d12] shadow-2xl">
               <div className="flex items-center gap-4 mb-10">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                  <h3 className="text-lg font-black italic uppercase tracking-tight font-display text-white">Match <span className="text-gradient-gold">Rules.</span></h3>
               </div>
               <ul className="space-y-8">
                  {[
                    { title: 'Access', desc: 'Select an entry tier to join the current arena pool.', icon: Shield },
                    { title: 'Predict', desc: 'Submit one prediction for every 24-hour cycle.', icon: Target },
                    { title: 'Confirm', desc: 'Results are confirmed in real-time by official feeds.', icon: ShieldCheck },
                    { title: 'Collect', desc: 'Achieve a 3-day winning streak for 10X rewards.', icon: Award }
                  ].map((rule, i) => (
                    <li key={i} className="flex gap-5 items-start group">
                       <div className="shrink-0 w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/20 transition-all duration-500">
                          <rule.icon className="w-4 h-4 text-gold/40 group-hover:text-gold transition-colors" />
                       </div>
                       <div className="space-y-2">
                          <div className="text-[11px] font-black text-white uppercase tracking-widest font-display italic group-hover:text-gold transition-colors">{rule.title}</div>
                          <p className="text-[10px] font-medium text-text-secondary leading-relaxed italic opacity-70">{rule.desc}</p>
                       </div>
                    </li>
                  ))}
               </ul>
            </div>

            <div className="card-luxury !p-8 border-white/5 bg-transparent flex items-center gap-6 shadow-xl group hover:bg-white/[0.02] transition-colors">
               <Activity className="w-8 h-8 text-emerald-500/30 shrink-0 group-hover:scale-110 transition-transform" />
               <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-white font-display uppercase italic tracking-wider">Integrity Confirmed</h4>
                  <p className="text-[10px] font-medium text-text-dim italic leading-relaxed uppercase tracking-widest opacity-60">
                     Match outcomes are verified via official real-time feeds.
                  </p>
               </div>
            </div>

            <div className="p-8 rounded-3xl bg-gold/5 border border-gold/10 text-center">
                <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-6 italic">Ready to Start?</p>
                <Link href="/accounts" className="btn-luxury btn-gold w-full !py-4 font-black shadow-lg">JOIN CHALLENGE</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
