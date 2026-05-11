'use client';

import Link from 'next/link';
import { 
  ArrowRight, 
  Wallet, 
  Target, 
  Activity, 
  Trophy, 
  Globe, 
  TrendingUp, 
  Users,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ChevronRight,
  ShieldAlert,
  Star,
  Shield,
  Search,
  Award,
  CreditCard,
  Radio
} from 'lucide-react';
import { motion } from 'framer-motion';

const STEPS = [
  {
    number: '01',
    icon: CreditCard,
    title: 'Select Entry',
    description: 'Choose a membership level that matches your prediction power. Each tier defines your match entry capacity and potential rewards.',
    detail: 'Instant account verification upon activation.',
  },
  {
    number: '02',
    icon: Search,
    title: 'Study Fixtures',
    description: 'Study the upcoming match schedule. Our live match feeds provide real-time intelligence for all elite league fixtures.',
    detail: 'Professional match data updated every 60 seconds.',
  },
  {
    number: '03',
    icon: Target,
    title: 'Make Your Pick',
    description: 'Lock in one precise match outcome every 24 hours. Precision is the key to maintaining your position in the winning arena.',
    detail: 'Single-outcome integrity enforced across the arena.',
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Hold The Streak',
    description: 'Track your winning progress live. To unlock the 10X multiplier, you must maintain a perfect 3-day winning streak.',
    detail: 'Live performance indicators synced to your hub.',
  },
  {
    number: '05',
    icon: Award,
    title: 'Claim Rewards',
    description: 'Hit the 3/3 target and trigger your reward payout. Winnings are distributed instantly to your secure wallet.',
    detail: 'Automated 10X payout on final whistle.',
  },
];

const REWARD_TABLE = [
  { tier: 'Starter', entry: '5,000', reward: '50,000', multiplier: '10X' },
  { tier: 'Standard', entry: '10,000', reward: '100,000', multiplier: '10X' },
  { tier: 'Premium', entry: '20,000', reward: '200,000', multiplier: '10X' },
];

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full h-[1000px] bg-gold-glow blur-[180px] opacity-[0.08]" />
        <div className="absolute bottom-0 left-0 w-full h-[1000px] bg-blue-glow blur-[150px] opacity-[0.03]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 mb-32 text-center px-6">
        <div className="container-tight max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="badge-luxury mb-10 px-8 py-2 bg-white/[0.02] border-white/10 italic font-black uppercase tracking-[0.4em] text-[9px]"
          >
            ARENA GUIDE
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-10 leading-[1] uppercase italic font-black tracking-tighter text-5xl sm:text-8xl text-white"
          >
            Dominate the <br /><span className="text-gradient-gold">Elite Arena.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary text-lg sm:text-xl font-medium opacity-60 max-w-2xl mx-auto mb-16 leading-relaxed italic"
          >
            PredChain is the world&apos;s most elite football prediction arena. Master the 3-day streak to unlock verified <span className="text-white font-black">10X rewards</span>. 
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/accounts" className="btn-luxury btn-gold btn-premium-depth !px-16 !py-6 text-[11px] font-black italic tracking-[0.2em] shadow-2xl group uppercase">
               START WINNING STREAK <ArrowUpRight className="w-5 h-5 ml-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
            <Link href="/arena" className="btn-luxury btn-outline btn-premium-depth !px-16 !py-6 text-[11px] font-black italic tracking-[0.2em] border-white/10 bg-white/[0.02] uppercase">BROWSE MATCHES</Link>
          </div>
        </div>
      </section>

      {/* Vertical Timeline */}
      <section className="relative z-10 mb-40 px-6">
        <div className="container-tight max-w-4xl space-y-12">
          {STEPS.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="card-luxury !p-8 sm:!p-16 flex flex-col md:flex-row items-center md:items-start gap-10 sm:gap-20 group bg-[#07090e] border-white/10 hover:border-gold/30 transition-all duration-700 shadow-2xl relative overflow-hidden depth-card"
            >
              <div className="absolute top-0 right-0 p-16 text-8xl font-black text-white/[0.01] italic leading-none pointer-events-none group-hover:text-gold/[0.04] transition-all duration-1000 uppercase select-none">{step.number}</div>
              
              {/* Icon Section */}
              <div className="relative shrink-0 flex flex-col items-center gap-10">
                 <div className="w-28 h-28 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center text-gold/20 shadow-inner group-hover:scale-110 group-hover:bg-gold group-hover:text-black transition-all duration-700 group-hover:rotate-12">
                    <step.icon className="w-12 h-12" />
                 </div>
                 <div className="w-px h-24 bg-gradient-to-b from-white/10 to-transparent group-last:hidden" />
              </div>

              {/* Content Section */}
              <div className="flex-1 text-center md:text-left">
                 <div className="badge-luxury !text-gold mb-8 px-6 py-1.5 font-black text-[10px] italic bg-white/[0.02] border-white/10 w-fit mx-auto md:mx-0">STEP {step.number}</div>
                 <h2 className="text-4xl md:text-6xl mb-8 tracking-tighter font-black italic uppercase leading-none text-white">{step.title}</h2>
                 <p className="text-text-secondary text-lg md:text-xl font-medium opacity-40 leading-relaxed mb-12 italic group-hover:opacity-100 transition-opacity duration-700">
                    {step.description}
                 </p>
                 <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center gap-8 group-hover:bg-white/[0.04] transition-all shadow-inner">
                    <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 opacity-20 group-hover:opacity-100 transition-all duration-700" />
                    <span className="text-[9px] font-black text-gold/40 uppercase tracking-[0.3em] italic">MATCH FEED ACTIVE</span>
                    <span className="text-[11px] font-black text-text-dim uppercase tracking-[0.3em] italic opacity-30 group-hover:opacity-100 transition-all duration-700">{step.detail}</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reward Matrix */}
      <section className="relative z-10 mb-40 px-6">
        <div className="container-tight max-w-5xl">
          <div className="text-center mb-24">
             <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="badge-luxury mb-8 px-6 py-2 italic font-black uppercase tracking-[0.4em] text-[9px] text-gold"
            >
              PRIZE MATRIX
            </motion.div>
            <h2 className="mb-6 uppercase italic font-black text-5xl sm:text-7xl tracking-tighter leading-none text-white">Winning <span className="text-gradient-gold">Tiers.</span></h2>
            <p className="text-text-secondary opacity-60 font-medium tracking-wide italic text-lg">Standardized 10X reward multipliers at every match level.</p>
          </div>
          
          <div className="card-luxury !p-0 overflow-hidden bg-[#07090e] border-white/10 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)] relative group depth-card">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="overflow-x-auto no-scrollbar relative z-10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-10 py-10 text-[10px] font-black text-text-dim uppercase tracking-[0.5em] italic opacity-30">MEMBERSHIP LEVEL</th>
                    <th className="px-10 py-10 text-[10px] font-black text-text-dim uppercase tracking-[0.5em] italic opacity-30">ENTRY FEE</th>
                    <th className="px-10 py-10 text-[10px] font-black text-text-dim uppercase tracking-[0.5em] italic opacity-30 text-right">WINNER REWARD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {REWARD_TABLE.map((r, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-all duration-700 group/row">
                      <td className="px-10 py-10 text-3xl sm:text-5xl font-black text-white font-display uppercase italic tracking-tighter group-hover/row:text-gold transition-all duration-700">{r.tier}</td>
                      <td className="px-10 py-10 text-lg font-black text-text-dim group-hover/row:text-white transition-colors uppercase tracking-widest italic opacity-20 group-hover/row:opacity-100">₦{r.entry}</td>
                      <td className="px-10 py-10 text-right">
                        <div className="flex flex-col items-end gap-4 transition-transform group-hover/row:scale-105 origin-right duration-700">
                           <span className="text-4xl md:text-7xl font-black font-display text-white tracking-tighter italic leading-none">₦{r.reward}</span>
                           <div className="badge-luxury !py-2 !px-8 font-black !bg-emerald-500/5 !text-emerald-500 border-emerald-500/10 italic text-[10px] tracking-[0.3em]">10X STREAK PAYOUT</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Program */}
      <section className="relative z-10 mb-40 px-6">
        <div className="container-tight">
          <div className="card-luxury !p-20 md:!p-32 bg-[#07090e] border-white/10 relative overflow-hidden flex flex-col xl:flex-row items-center gap-24 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)] rounded-[4rem] group depth-card">
             <div className="absolute top-0 right-0 p-32 opacity-[0.01] group-hover:opacity-[0.05] transition-all duration-1000 pointer-events-none select-none rotate-12"><Globe className="w-[500px] h-[500px]" /></div>
             
             <div className="flex-1 text-center xl:text-left relative z-10">
                <div className="badge-luxury !text-gold mb-10 px-8 py-2.5 bg-white/[0.02] border-white/10 italic font-black uppercase tracking-[0.4em] text-[9px] w-fit mx-auto xl:mx-0">PARTNER NETWORK</div>
                <h2 className="mb-10 text-5xl md:text-9xl leading-none italic font-black uppercase tracking-tighter text-white">Expand Your <br /><span className="text-gradient-gold">Squad.</span></h2>
                <p className="text-text-secondary text-xl font-medium opacity-40 mb-16 max-w-xl mx-auto xl:mx-0 leading-relaxed italic group-hover:opacity-100 transition-opacity duration-1000">
                  Recruit elite predictors to the arena. Earn <span className="text-white font-black italic">₦1,000</span> for every successful player registration in your professional scout network.
                </p>
                <Link href="/referral" className="btn-luxury btn-gold btn-premium-depth !px-16 !py-6 text-[11px] font-black italic tracking-[0.3em] shadow-2xl group uppercase">
                   ARENA PARTNERS <ArrowUpRight className="w-5 h-5 ml-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full xl:w-auto relative z-10">
                {[
                  { icon: Shield, text: 'SECURE' },
                  { icon: Globe, text: 'INVITE LINK' },
                  { icon: Radio, text: 'LIVE TRACK' },
                  { icon: Wallet, text: 'EARN REWARDS' },
                ].map((item, i) => (
                  <div key={i} className="card-luxury !p-12 bg-black/40 border-white/5 flex items-center gap-10 shadow-inner group/icon hover:border-gold/30 transition-all duration-700 rounded-[2rem]">
                     <div className="w-16 h-16 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center justify-center text-gold/20 group-hover/icon:bg-gold group-hover/icon:text-black group-hover/icon:rotate-12 transition-all duration-700 shadow-inner">
                        <item.icon className="w-7 h-7" />
                     </div>
                     <div className="text-[8px] font-black text-text-dim uppercase tracking-[0.4em] italic opacity-40">INSTANT PAYOUTS</div>
                     <span className="text-[11px] font-black text-text-dim uppercase tracking-[0.4em] italic opacity-30 group-hover/icon:opacity-100 transition-opacity">{item.text}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container pb-24 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="card-luxury-gold !p-24 md:!p-48 text-center relative overflow-hidden group rounded-[5rem] shadow-[0_50px_100px_-30px_rgba(242,201,76,0.2)]"
        >
           <div className="absolute inset-0 bg-[#05070a]" />
           <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.1] to-transparent opacity-30" />
           <div className="max-w-4xl mx-auto relative z-10">
              <h2 className="mb-12 text-6xl md:text-9xl leading-none italic font-black uppercase tracking-tighter text-white">Ready to <br /><span className="text-gradient-gold">Command?</span></h2>
              <p className="text-text-secondary text-xl font-medium opacity-40 mb-20 max-w-xl mx-auto leading-relaxed italic group-hover:opacity-100 transition-opacity duration-1000">
                 Secure your arena membership, analyze the fixtures, and claim your first 3-day winning streak today.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Link href="/accounts" className="btn-luxury btn-gold btn-premium-depth !px-20 !py-7 text-[13px] font-black italic tracking-[0.3em] shadow-2xl uppercase">JOIN THE ARENA</Link>
                <Link href="/arena" className="btn-luxury btn-outline btn-premium-depth !px-20 !py-7 text-[13px] font-black italic tracking-[0.3em] border-white/10 bg-white/[0.02] uppercase">LIVE ARENA</Link>
              </div>
           </div>
        </motion.div>
      </section>
    </div>
  );
}
