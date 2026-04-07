import Link from 'next/link';
import { 
  ArrowRight, 
  Wallet, 
  Layout, 
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
  ShieldAlert
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How it Works — PredChain',
  description: 'Learn how to participate in the PredChain arena and earn rewards.',
};

const STEPS = [
  {
    number: '01',
    icon: Wallet,
    title: 'Select a Plan',
    description: 'Choose your entry tier — Standard, Premium, or Executive. Your plan defines your entry amount and your final 10X reward potential.',
    detail: 'Instant account activation upon payment verification.',
  },
  {
    number: '02',
    icon: Target,
    title: 'Join the Arena',
    description: 'Every challenge cycle spans 3 consecutive days. Once active, you gain full access to the live match arena to place your predictions.',
    detail: 'Real-time match data provided for all active members.',
  },
  {
    number: '03',
    icon: Activity,
    title: 'Place Predictions',
    description: 'Place one precise match outcome prediction every 24 hours. Your prediction must be submitted before the match kickoff time.',
    detail: 'Single-entry integrity enforced for every 24h cycle.',
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Maintain Streak',
    description: 'Track match results in real-time. To win the grand prize, you must maintain a perfect 3-day winning streak (3 correct picks in a row).',
    detail: 'Live streak indicator available in your dashboard.',
  },
  {
    number: '05',
    icon: Trophy,
    title: 'Receive Payouts',
    description: 'Hit a 3/3 streak and automatically trigger your 10X reward. Verified winnings are processed and paid directly to your wallet.',
    detail: 'Automated payouts initiated within 24-48 hours of verification.',
  },
];

const REWARD_TABLE = [
  { tier: 'Standard', entry: '₦1,000', reward: '₦10,000', multiplier: '10X' },
  { tier: 'Premium', entry: '₦3,000', reward: '₦30,000', multiplier: '10X' },
  { tier: 'Executive', entry: '₦5,000', reward: '₦50,000', multiplier: '10X' },
];

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen bg-primary pt-32 pb-24 md:pt-48 md:pb-40">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[800px] bg-gold-glow blur-[140px] opacity-20" />
      </div>

      {/* Hero: Simplified Luxury */}
      <section className="relative z-10 mb-32 text-center px-6">
        <div className="container max-w-4xl">
          <div className="badge-elite !text-gold mb-10 px-6 py-2 bg-white/[0.03] border-gold/10 italic">SYSTEM GUIDE</div>
          <h1 className="mb-8 leading-tight">
            How it <span className="text-gradient-gold">Works.</span>
          </h1>
          <p className="text-muted text-sm md:text-base font-medium opacity-60 max-w-xl mx-auto mb-16 uppercase tracking-widest leading-relaxed">
            A high-reward, sequence-based sports prediction platform. <br className="hidden md:block" /> Follow these five simple steps to secure your 10X payout.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/accounts" className="btn btn-primary !px-12 !py-5 rounded-2xl font-black italic shadow-2xl">
               Get Started <ArrowUpRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/arena" className="btn btn-ghost !px-12 !py-5 rounded-2xl font-black italic border-white/5 bg-white/[0.02]">Browse Arena</Link>
          </div>
        </div>
      </section>

      {/* Vertical Timeline: High-Density Elite Cards */}
      <section className="relative z-10 mb-48 px-6">
        <div className="container max-w-4xl space-y-8">
          {STEPS.map((step, i) => (
            <div key={i} className="card-elite !p-10 md:!p-16 flex flex-col md:flex-row items-center md:items-start gap-12 group bg-[#080a0f] border-white/5 hover:border-gold/20 transition-all duration-700 shadow-xl overflow-hidden">
              {/* Icon Hub */}
              <div className="relative shrink-0 text-center">
                 <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold shadow-inner relative z-10 group-hover:scale-110 transition-transform duration-700">
                    <step.icon className="w-10 h-10" />
                 </div>
                 <div className="mt-4 text-4xl font-black text-white/5 italic group-hover:text-gold/5 transition-colors">{step.number}</div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                 <div className="badge-elite !text-blue-electric bg-blue-electric/10 border-blue-electric/10 mb-6 px-4 italic">STEP {step.number}</div>
                 <h2 className="text-2xl md:text-4xl mb-6 italic tracking-tight">{step.title}</h2>
                 <p className="text-muted text-xs md:text-sm font-bold opacity-30 leading-loose mb-10 max-w-lg mx-auto md:mx-0 uppercase tracking-widest">
                    {step.description}
                 </p>
                 <div className="p-5 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-4 group-hover:bg-white/[0.01] transition-all">
                    <ShieldCheck className="w-4 h-4 text-success opacity-40 shrink-0" />
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-20 italic">NOTE: {step.detail}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Payout Matrix */}
      <section className="relative z-10 mb-48 px-6">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="mb-4">Reward <span className="text-gradient-gold">Matrix.</span></h2>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-30 italic">Confirmed 10X yield mapping across all tiers</p>
          </div>
          
          <div className="card-elite !p-0 overflow-hidden bg-[#080a0f] border-white/5 shadow-2xl">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.03] border-b border-white/5">
                    <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-widest opacity-40 italic">TIER</th>
                    <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-widest opacity-40 italic">ENTRY</th>
                    <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-widest opacity-40 italic text-right">TOTAL REWARD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {REWARD_TABLE.map((r, i) => (
                    <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-10 py-8 text-xl font-black text-white italic tracking-tighter uppercase">{r.tier}</td>
                      <td className="px-10 py-8 text-xs font-bold text-muted opacity-40 italic uppercase tracking-widest">{r.entry}</td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex flex-col items-end gap-2">
                           <span className="text-2xl md:text-3xl font-black text-gold italic tracking-tighter">₦{r.reward}</span>
                           <div className="badge-elite !py-0.5 !px-3 font-bold !bg-success/10 !text-success border-success/10 italic">10X MULTIPLIER</div>
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

      {/* Network Referral */}
      <section className="relative z-10 mb-48 px-6 container">
        <div className="card-elite !p-16 md:!p-24 bg-blue-electric/[0.01] border-blue-electric/10 relative overflow-hidden flex flex-col lg:flex-row items-center gap-20 shadow-3xl">
           <div className="absolute top-0 right-0 p-24 opacity-[0.02] pointer-events-none group-hover:opacity-10 transition-all duration-1000"><Globe className="w-96 h-96" /></div>
           
           <div className="flex-1 text-center lg:text-left relative z-10">
              <div className="badge-elite !text-blue-electric bg-white/[0.03] border-blue-electric/20 mb-10 px-5 italic">AFFILIATE PROGRAM</div>
              <h2 className="mb-10 leading-tight">Scale Your <br /><span className="text-gradient-blue text-white">Network.</span></h2>
              <p className="text-muted text-xs md:text-sm font-bold opacity-30 mb-14 max-w-sm mx-auto lg:mx-0 uppercase tracking-widest leading-loose italic">
                Share your unique link and earn ₦1,000 instantly for every new account activation in your network.
              </p>
              <Link href="/referral" className="btn btn-primary !bg-white !text-black !px-12 !py-5 rounded-2xl font-black italic shadow-2xl hover:scale-105 transition-all">
                 Affiliate Portal <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto relative z-10">
              {[
                { icon: ShieldAlert, text: 'AUTHENTICATE' },
                { icon: Globe, text: 'GLOBAL LINK' },
                { icon: Zap, text: 'VERIFY NODE' },
                { icon: Wallet, text: 'EARN REWARDS' },
              ].map((item, i) => (
                <div key={i} className="card-elite !p-8 bg-black/60 border-white/5 flex items-center gap-6 shadow-inner hover:border-blue-electric/30 transition-all">
                   <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 text-muted opacity-30 shadow-inner">
                      <item.icon className="w-5 h-5" />
                   </div>
                   <span className="text-[10px] font-black text-muted uppercase tracking-widest opacity-20 italic">{item.text}</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative z-10 container pb-24 px-6">
        <div className="card-elite !p-16 md:!p-32 text-center relative overflow-hidden bg-grad-glow border-gold/10 shadow-3xl">
           <div className="max-w-2xl mx-auto relative z-10">
              <h2 className="mb-12 leading-tight">Ready to <br /><span className="text-gradient-gold">Begin?</span></h2>
              <p className="text-muted text-xs font-bold opacity-30 mb-16 uppercase tracking-widest max-w-sm mx-auto leading-loose italic">
                 Choose your plan, synchronize with the arena, and start your first 3-day sequence today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/accounts" className="btn btn-primary !px-16 !py-5 rounded-2xl font-black italic shadow-2xl hover:scale-105 transition-all">Join the Arena</Link>
                <Link href="/arena" className="btn btn-ghost !px-12 !py-5 rounded-2xl font-black italic border-white/5 bg-white/[0.02]">Active Grid</Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
