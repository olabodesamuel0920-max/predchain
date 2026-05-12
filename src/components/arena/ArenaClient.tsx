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
  Users,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

      <div className="container-tight relative z-10">
        {/* Arena Header */}
        <div className="max-w-4xl mb-12 sm:mb-24 px-4 sm:px-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap items-center gap-4 mb-10"
          >
            <div className="badge-luxury px-5 py-2 flex items-center gap-3 bg-gold/5 border-gold/15 shadow-inner">
               <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
               <span className="pb-px font-display tracking-[0.2em] font-black uppercase text-[9px] italic">LIVE ARENA</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 uppercase italic font-black leading-[1] tracking-tighter text-5xl sm:text-7xl"
          >
            The <span className="text-gradient-gold">Match Arena.</span><br />
            Where Streaks are <span className="text-white">Forged.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary text-sm sm:text-[15px] font-medium leading-relaxed max-w-2xl mb-12 opacity-60 italic"
          >
            Enter the elite program of football analysis. Build a verified 3-day winning streak on premier fixtures and command the board with <span className="text-white font-black">10X reward multipliers</span>.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-10"
          >
            <Link href="/accounts" className="btn-luxury btn-gold btn-premium-depth !py-5 !px-16 w-full sm:w-auto shadow-2xl group text-[11px] font-black italic tracking-widest">
               Join the Arena <ArrowUpRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-2xl border-2 border-[#05070a] bg-[#0a0d14] flex items-center justify-center text-[10px] font-black text-gold italic shadow-2xl transform hover:z-10 transition-transform hover:-translate-y-1 cursor-default">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[12px] font-black text-white uppercase italic leading-none">{stats.activeChallengers.toLocaleString()}+ Active Challengers</span>
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] font-black text-emerald-500/80 uppercase tracking-[0.3em] italic">Verified Operational</span>
                  </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Global Stats Banner */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.4 }}
           className="card-luxury !p-10 sm:!p-14 mb-16 bg-[#07090e] border-white/10 relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] depth-card"
        >
           <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:opacity-[0.08] transition-all duration-1000 rotate-12 pointer-events-none"><Trophy className="w-64 h-64" /></div>
           <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
              <div className="flex items-center gap-8">
                 <div className="w-20 h-20 rounded-[2.5rem] bg-gold/5 flex items-center justify-center border border-gold/15 group-hover:bg-gold/10 group-hover:rotate-12 transition-all duration-700 shadow-inner">
                    <Radio className="w-10 h-10 text-gold animate-pulse" />
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em] italic">Active Match Day</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(242,201,76,0.6)]" />
                       <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em] italic opacity-40">Match Data</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter font-display text-white leading-none">Match Cycle #{activeRound?.round_number?.toString().padStart(2, '0') || '01'}</h2>
                 </div>
              </div>
              
              <div className="flex items-center gap-12 bg-black/60 border border-white/5 rounded-3xl px-12 py-8 shadow-inner w-full lg:w-auto glass-layered">
                  <div className="text-center flex-1 lg:flex-none space-y-2">
                     <span className="text-[9px] font-black text-text-dim uppercase tracking-[0.4em] block italic opacity-40">Cumulative Payout</span>
                     <span className="text-2xl sm:text-3xl font-black text-white font-display italic tracking-tight leading-none transition-colors group-hover:text-gold">₦{stats.totalCashPaid.toLocaleString()}</span>
                  </div>
                  <div className="w-px h-12 bg-white/5 hidden sm:block" />
                  <div className="text-center flex-1 lg:flex-none space-y-2">
                     <span className="text-[9px] font-black text-text-dim uppercase tracking-[0.4em] block italic opacity-40">Data Integrity</span>
                     <div className="flex items-center justify-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-2xl sm:text-3xl font-black text-emerald-500 font-display italic tracking-tight uppercase leading-none">SECURE</span>
                     </div>
                  </div>
              </div>
           </div>
        </motion.div>

        {/* Arena Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-32">
          {/* Match Feed */}
          <div className="lg:col-span-8 space-y-8">
            <div className="card-luxury !p-0 overflow-hidden bg-[#07090e] border-white/10 shadow-2xl group/fixtures">
              <div className="px-10 py-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                 <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center"><Activity className="w-5 h-5 text-gold/40 group-hover/fixtures:text-gold transition-colors" /></div>
                    <span className="text-[13px] font-black text-white uppercase tracking-[0.25em] italic font-display">Upcoming Matches</span>
                 </div>
                 {!activeRound && (
                     <div className="flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="w-2 h-2 bg-gold/40 rounded-full animate-ping shadow-[0_0_10px_rgba(242,201,76,0.3)]" />
                        <span className="text-[9px] font-black text-gold/40 uppercase tracking-[0.3em] italic">Loading Match Data</span>
                     </div>
                 )}
              </div>

              <div className="p-8 sm:p-12 space-y-6">
                {matches.length === 0 ? (
                  <div className="py-40 px-12 text-center border border-white/5 bg-white/[0.01] rounded-[3rem] flex flex-col items-center relative overflow-hidden group/empty">
                    <div className="absolute inset-0 bg-gold/5 blur-[120px] opacity-0 group-hover/empty:opacity-100 transition-opacity duration-1000" />
                    <div className="w-24 h-24 rounded-[2rem] bg-gold/5 border border-gold/10 flex items-center justify-center mb-12 relative z-10 group-hover/empty:scale-110 transition-transform duration-700 shadow-inner">
                       <Zap className="w-10 h-10 text-gold animate-pulse" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-5 italic relative z-10 leading-none">UPCOMING MATCH <span className="text-gradient-gold">CYCLES.</span></h3>
                    <p className="text-[11px] font-black text-text-dim uppercase tracking-[0.4em] max-w-sm mx-auto leading-relaxed italic opacity-40 relative z-10 group-hover/empty:opacity-80 transition-opacity">
                       Our analysts are finalizing the next match cycle. Matches will be live shortly.
                    </p>
                  </div>
                ) : (
                  matches.map((match, i) => (
                    <motion.div 
                      key={match.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group p-6 sm:p-10 bg-[#0a0d14] border border-white/5 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between hover:border-gold/30 transition-all duration-700 gap-8 sm:gap-0 relative overflow-hidden shadow-2xl depth-card"
                    >
                       <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/[0.03] to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                       
                       <div className="flex items-center gap-10 w-full sm:w-auto relative z-10">
                          <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex flex-col items-center justify-center text-[11px] font-black text-text-dim group-hover:text-gold group-hover:border-gold/30 transition-all duration-500 shrink-0 shadow-inner group-hover:shadow-[0_0_20px_rgba(242,201,76,0.1)] group-hover:rotate-6">
                             <span className="opacity-30 uppercase tracking-tighter">Day</span>
                             <span className="text-2xl font-display font-black leading-none italic mt-1.5 transition-colors origin-bottom">0{i+1}</span>
                          </div>
                          <div className="flex flex-col gap-2">
                             <div className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter font-display italic flex items-center gap-5 transition-transform group-hover:translate-x-1 duration-500">
                                <span className="group-hover:text-gold transition-colors">{match.home_team}</span>
                                <span className="text-[12px] text-text-dim lowercase tracking-normal italic opacity-20 group-hover:opacity-40 transition-opacity">vs</span>
                                <span className="group-hover:text-gold transition-colors">{match.away_team}</span>
                             </div>
                             <div className="flex items-center gap-4">
                                <div className="w-1 h-1 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                                <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em] italic opacity-40 group-hover:opacity-100 transition-all">
                                   {new Date(match.kickoff_time).toLocaleDateString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                                </span>
                             </div>
                          </div>
                       </div>
                       
                       <Link href="/accounts" className="btn-luxury btn-gold btn-premium-depth !py-4.5 !px-12 !text-[11px] w-full sm:w-auto group/btn relative z-10 font-black italic tracking-widest shadow-2xl">
                          Make Prediction <ArrowUpRight className="w-4 h-4 ml-3 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                       </Link>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Rules Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            <div className="card-luxury !p-12 border-gold/10 bg-[#07090e] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.02] rotate-45 pointer-events-none"><Shield className="w-32 h-32" /></div>
               <div className="flex items-center gap-5 mb-12 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-gold/5 flex items-center justify-center border border-gold/10"><ShieldCheck className="w-5 h-5 text-gold" /></div>
                  <h3 className="text-xl font-black italic uppercase tracking-tighter font-display text-white">Match <span className="text-gradient-gold">Rules.</span></h3>
               </div>
               <ul className="space-y-10 relative z-10">
                  {[
                    { title: 'Access', desc: 'Secure an entry tier to join the active arena program.', icon: Shield },
                    { title: 'Predict', desc: 'Submit one locked prediction for every match day.', icon: Target },
                    { title: 'Confirm', desc: 'Outcomes are verified in real-time by official match data.', icon: ShieldCheck },
                    { title: 'Harvest', desc: 'Maintain a 3-day winning streak to command 10X rewards.', icon: Award }
                  ].map((rule, i) => (
                    <li key={i} className="flex gap-6 items-start group">
                       <div className="shrink-0 w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/30 transition-all duration-700 shadow-inner group-hover:rotate-12">
                          <rule.icon className="w-5 h-5 text-gold/30 group-hover:text-gold transition-colors" />
                       </div>
                       <div className="space-y-2.5">
                          <div className="text-[12px] font-black text-white uppercase tracking-[0.2em] font-display italic group-hover:text-gold transition-colors leading-none">{rule.title}</div>
                          <p className="text-[10px] font-bold text-text-dim leading-relaxed italic opacity-40 group-hover:opacity-70 transition-opacity uppercase tracking-widest">{rule.desc}</p>
                       </div>
                    </li>
                  ))}
               </ul>
            </div>

            <div className="card-luxury !p-10 border-white/5 bg-transparent flex items-center gap-6 shadow-2xl group hover:bg-white/[0.02] transition-all duration-700 rounded-[2rem]">
               <div className="w-14 h-14 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-inner">
                  <Activity className="w-7 h-7 text-emerald-500/40 group-hover:text-emerald-500 transition-colors" />
               </div>
               <div className="space-y-2">
                  <h4 className="text-[12px] font-black text-white font-display uppercase italic tracking-widest leading-none">Outcome Verification</h4>
                  <p className="text-[9px] font-black text-text-dim italic leading-relaxed uppercase tracking-[0.3em] opacity-30 group-hover:opacity-60 transition-opacity">
                     Outcomes verified via official global match data.
                  </p>
               </div>
            </div>

            <motion.div 
               whileHover={{ y: -5 }}
               className="p-10 rounded-[2.5rem] bg-gold/5 border border-gold/15 text-center shadow-2xl relative overflow-hidden group/cta"
            >
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-700" />
                <p className="text-[11px] font-black text-gold uppercase tracking-[0.3em] mb-8 italic relative z-10 leading-none">Ready to Prove Mastery?</p>
                <Link href="/accounts" className="btn-luxury btn-gold btn-premium-depth w-full !py-5 font-black italic tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(242,201,76,0.3)] relative z-10 text-[11px]">START STREAK</Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
