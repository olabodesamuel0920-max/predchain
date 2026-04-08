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
  ShieldAlert,
  Star,
  Shield,
  Search,
  Award,
  CreditCard
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How it Works — PredChain',
  description: 'Master the elite football prediction arena. Learn our performance-driven 3-day sequence methodology.',
};

const STEPS = [
  {
    number: '01',
    icon: CreditCard,
    title: 'Select Your Tier',
    description: 'Choose an entry tier that fits your goals. Your plan defines your level of access and reward potential in the arena.',
    detail: 'Instant account synchronization upon activation.',
  },
  {
    number: '02',
    icon: Search,
    title: 'Analyze Fixtures',
    description: 'Every challenge spans 3 consecutive matchdays. Study upcoming matches using our data-driven performance feeds.',
    detail: 'Real-time match analytics provided for all members.',
  },
  {
    number: '03',
    icon: Target,
    title: 'Submit Predictions',
    description: 'Place one precise match outcome prediction every 24 hours before kickoff. High-precision analysis is strictly required.',
    detail: 'Single-pick integrity enforced for every matchday.',
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Maintain Consistency',
    description: 'Track your streak live. To secure the top multiplier, you must maintain a perfect 3-day winning sequence.',
    detail: 'Live performance indicators visible in your dashboard.',
  },
  {
    number: '05',
    icon: Award,
    title: 'Secured Rewards',
    description: 'Achieve a 3/3 sequence and unlock your 10X reward multipliers. Winnings are settled and paid directly to your wallet.',
    detail: 'Automated settlement initiated upon final verification.',
  },
];

const REWARD_TABLE = [
  { tier: 'Starter', entry: '₦5,000', reward: '50,000', multiplier: '10X' },
  { tier: 'Standard', entry: '₦10,000', reward: '100,000', multiplier: '10X' },
  { tier: 'Premium', entry: '₦20,000', reward: '200,000', multiplier: '10X' },
];

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen pt-40 pb-32">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full h-[800px] bg-gold-glow blur-[140px] opacity-10" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 mb-40 text-center px-6">
        <div className="container max-w-4xl">
          <div className="badge-premium !text-gold mb-10 px-6 py-2">The Player Guide</div>
          <h1 className="mb-10 leading-[1.05]">
            Master the <span className="text-gradient-gold">Arena Pool.</span>
          </h1>
          <p className="text-secondary text-lg font-medium opacity-70 max-w-2xl mx-auto mb-16 leading-relaxed">
            PredChain is a high-performance prediction system. Build a perfect 3-day winning sequence to unlock 10X reward multipliers. 
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/accounts" className="btn btn-primary !px-16 !py-6 text-base shadow-2xl group">
               Start Your Streak <ArrowUpRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
            <Link href="/arena" className="btn btn-secondary !px-16 !py-6 text-base border-white/10">Browse Live Matches</Link>
          </div>
        </div>
      </section>

      {/* Vertical Timeline */}
      <section className="relative z-10 mb-48 px-6">
        <div className="container max-w-4xl space-y-10">
          {STEPS.map((step, i) => (
            <div key={i} className="card-premium flex flex-col md:flex-row items-center md:items-start gap-16 group bg-[#0a0d14] hover:border-gold/30 transition-all duration-700 shadow-2xl relative overflow-hidden">
              {/* Icon Section */}
              <div className="relative shrink-0 flex flex-col items-center gap-6">
                 <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gold shadow-lg group-hover:scale-110 group-hover:bg-gold group-hover:text-black transition-all duration-700">
                    <step.icon className="w-9 h-9" />
                 </div>
                 <div className="text-5xl font-bold font-display text-white/5 group-hover:text-gold/20 transition-colors uppercase italic">{step.number}</div>
              </div>

              {/* Content Section */}
              <div className="flex-1 text-center md:text-left">
                 <div className="badge-premium !text-gold mb-8 px-4 font-display">Step {step.number}</div>
                 <h2 className="text-3xl md:text-5xl mb-8 tracking-tight font-display">{step.title}</h2>
                 <p className="text-secondary text-base md:text-lg font-medium opacity-60 leading-relaxed mb-12">
                    {step.description}
                 </p>
                 <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-6 group-hover:bg-white/[0.05] transition-all">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-xs font-bold text-muted uppercase tracking-widest opacity-40 italic">{step.detail}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reward Matrix */}
      <section className="relative z-10 mb-48 px-6">
        <div className="container max-w-5xl">
          <div className="text-center mb-20">
            <h2 className="mb-6">Reward <span className="text-gradient-gold">Matrix.</span></h2>
            <p className="text-secondary opacity-60 font-medium tracking-wide">Standardized 10X reward multipliers at every entry level.</p>
          </div>
          
          <div className="card-premium !p-0 overflow-hidden bg-[#0a0d14] border-white/5 shadow-2xl">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-12 py-8 text-xs font-bold text-muted uppercase tracking-[0.2em] opacity-40 italic">TIER CATEGORY</th>
                    <th className="px-12 py-8 text-xs font-bold text-muted uppercase tracking-[0.2em] opacity-40 italic">ENTRY FEE</th>
                    <th className="px-12 py-8 text-xs font-bold text-muted uppercase tracking-[0.2em] opacity-40 italic text-right">MAXIMUM REWARD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {REWARD_TABLE.map((r, i) => (
                    <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-12 py-10 text-2xl font-bold text-white font-display uppercase italic">{r.tier}</td>
                      <td className="px-12 py-10 text-sm font-bold text-muted opacity-50 uppercase tracking-widest">{r.entry}</td>
                      <td className="px-12 py-10 text-right">
                        <div className="flex flex-col items-end gap-3">
                           <span className="text-3xl md:text-4xl font-bold font-display text-white tracking-tight">₦{r.reward}</span>
                           <div className="badge-premium !py-1 !px-4 font-bold !bg-emerald-500/10 !text-emerald-500 border-emerald-500/10 italic text-[10px] tracking-tight">10X PAYOUT</div>
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

      {/* Referral Program */}
      <section className="relative z-10 mb-40 px-6 container">
        <div className="card-premium !p-20 md:!p-32 bg-[#07090e] border-blue-500/10 relative overflow-hidden flex flex-col xl:flex-row items-center gap-24 shadow-2xl">
           <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none select-none"><Globe className="w-96 h-96" /></div>
           
           <div className="flex-1 text-center xl:text-left relative z-10">
              <div className="badge-premium !text-blue-electric mb-10 px-6 py-2">Performance Affiliates</div>
              <h2 className="mb-10 text-5xl md:text-7xl leading-tight">Scale Your <br /><span className="text-gradient-blue text-white">Network.</span></h2>
              <p className="text-secondary text-lg font-medium opacity-60 mb-16 max-w-xl mx-auto xl:mx-0 leading-relaxed">
                Connect other players to the arena. Earn ₦1,000 for every successful account activation in your professional network.
              </p>
              <Link href="/referral" className="btn btn-primary !bg-white !text-black !px-16 !py-6 text-base rounded-2xl shadow-2xl group">
                 Affiliate Portal <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2" />
              </Link>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full xl:w-auto relative z-10">
              {[
                { icon: Shield, text: 'AUTHENTICATE' },
                { icon: Globe, text: 'SHARE LINK' },
                { icon: Zap, text: 'TRACK ACTIVITY' },
                { icon: Wallet, text: 'COLLECT BONUSES' },
              ].map((item, i) => (
                <div key={i} className="card-premium !p-8 bg-black/40 border-white/5 flex items-center gap-8 shadow-inner hover:border-blue-500/30 transition-all">
                   <div className="w-12 h-12 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center justify-center text-muted/30">
                      <item.icon className="w-6 h-6" />
                   </div>
                   <span className="text-[11px] font-bold text-muted uppercase tracking-[0.2em] opacity-40">{item.text}</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container pb-24 px-6">
        <div className="card-premium !p-24 md:!p-44 text-center relative overflow-hidden bg-grad-glow border-gold/10 shadow-2xl">
           <div className="max-w-3xl mx-auto relative z-10">
              <h2 className="mb-12 text-6xl md:text-8xl leading-none tracking-tight">Ready to <br /><span className="text-gradient-gold">Dominate?</span></h2>
              <p className="text-secondary text-lg font-medium opacity-50 mb-20 max-w-xl mx-auto leading-relaxed">
                 Choose your tier, analyze the arena, and secure your first 3-day winning sequence today.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Link href="/accounts" className="btn btn-primary !px-20 !py-6 text-lg shadow-2xl">Join the Arena Pool</Link>
                <Link href="/arena" className="btn btn-secondary !px-20 !py-6 text-lg border-white/10">Active Matches</Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
