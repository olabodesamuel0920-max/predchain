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
  ArrowUpRight
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Protocol Guide — PredChain',
  description: 'Detailed operational protocol for the PredChain arena challenge and reward settlement.',
};

const STEPS = [
  {
    number: '01',
    icon: Wallet,
    title: 'Node Activation',
    description: 'Select your operational node tier — Standard, Premium, or Executive. Your tier defines your arena entry protocol and final settlement volume.',
    detail: 'Instant network synchronization upon verification.',
  },
  {
    number: '02',
    icon: Layout,
    title: 'Arena Synchronization',
    description: 'Every operational cycle spans exactly 72 hours. Upon node activation, your system is synchronized with active live arena events.',
    detail: 'Continuous real-time data feed for all active nodes.',
  },
  {
    number: '03',
    icon: Target,
    title: 'Execute Daily Pick',
    description: 'Submit one precision match outcome prediction per 24-hour cycle. Picks must be locked on-chain before match kickoff.',
    detail: 'Single-entry integrity protocol per match event.',
  },
  {
    number: '04',
    icon: Activity,
    title: 'Integrity Monitoring',
    description: 'Track live resolution of arena events. Your streak integrity is updated in real-time as match results are verified by the settlement layer.',
    detail: 'Live ranking console and performance tracking.',
  },
  {
    number: '05',
    icon: Trophy,
    title: 'Yield Settlement',
    description: 'Maintain a perfect 3/3 integrity streak to trigger the 10X reward multiplier. Verified wins are processed for automated settlement.',
    detail: 'Verified settlement via automated payouts within 48h.',
  },
];

const REWARD_TABLE = [
  { tier: 'Standard Node', entry: '₦1,000', reward: '₦10,000', multiplier: '10X' },
  { tier: 'Premium Node', entry: '₦3,000', reward: '₦30,000', multiplier: '10X' },
  { tier: 'Executive Node', entry: '₦5,000', reward: '₦50,000', multiplier: '10X' },
];

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen bg-primary pt-32 pb-24 md:pt-48 md:pb-40">
      {/* Background Cinematic Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[800px] bg-grad-glow opacity-30 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-electric/5 blur-[120px]" />
      </div>

      {/* Hero: Elite Methodology */}
      <section className="relative z-10 mb-32 text-center">
        <div className="container">
          <div className="badge-elite !text-gold !px-6 !py-2 mb-10 shadow-glow-gold">OPERATIONAL PROTOCOL</div>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-10 leading-[0.9] italic">
            Arena <br /> <span className="text-gradient-gold">Methodology.</span>
          </h1>
          <p className="text-secondary text-sm md:text-base font-medium opacity-50 max-w-xl mx-auto mb-16 uppercase tracking-[0.25em] leading-relaxed">
            A high-integrity, performance-based prediction arena. <br /> Follow the five-phase protocol to secure your settlement.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link href="/accounts" className="btn btn-primary !px-12 !py-5 rounded-full font-bold shadow-glow-gold group">
               Initialize Node <ArrowUpRight className="w-4 h-4 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <Link href="/live-challenges" className="btn btn-ghost !px-12 !py-5 rounded-full font-bold border-white/5">Arena Status</Link>
          </div>
        </div>
      </section>

      {/* Methodology Phases: High-Density Card Pass */}
      <section className="relative z-10 mb-48">
        <div className="container max-w-4xl">
          <div className="flex flex-col gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="card-elite p-10 md:p-16 flex flex-col md:flex-row items-start gap-10 md:gap-20 hover:border-gold/30 transition-all group overflow-hidden">
                {/* Number Hub */}
                <div className="relative shrink-0">
                   <div className="text-6xl font-black text-white italic opacity-[0.03] group-hover:opacity-10 transition-opacity absolute -top-8 -left-8 pointer-events-none">
                      {step.number}
                   </div>
                   <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold shadow-glow-gold relative z-10 group-hover:scale-110 transition-transform duration-700">
                      <step.icon className="w-8 h-8" />
                   </div>
                </div>

                {/* Content */}
                <div className="flex-1 relative z-10 text-left">
                   <div className="badge-elite !text-blue-electric !bg-blue-electric/5 border-blue-electric/10 mb-6 !px-4 italic opacity-60">PHASE {step.number} — INTEGRITY CHECK</div>
                   <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-6 italic">
                      {step.title}
                   </h2>
                   <p className="text-secondary text-xs md:text-sm font-medium opacity-50 leading-loose mb-10 uppercase tracking-[0.1em]">
                      {step.description}
                   </p>
                   <div className="p-6 bg-black/60 border border-white/5 rounded-2xl text-[10px] font-bold text-muted uppercase tracking-[0.3em] opacity-30 italic">
                      SYSTEM NOTE: {step.detail}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Settlement Matrix Audit */}
      <section className="relative z-10 mb-48">
        <div className="container max-w-4xl">
          <div className="text-center mb-20 animate-slide-up">
            <div className="badge-elite !text-gold mb-8 opacity-60">Verified Yieldmapping</div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 italic">Settlement <span className="text-gradient-gold">Matrix.</span></h2>
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.4em] opacity-30 italic">Node Tier vs Settlement Volume Mapping Protocol</p>
          </div>
          <div className="card-elite !p-0 overflow-hidden bg-black/40 shadow-2xl border-white/5">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-12 py-8 text-[11px] font-black text-muted uppercase tracking-[0.3em] opacity-40">PROTOCOL TIER</th>
                    <th className="px-12 py-8 text-[11px] font-black text-muted uppercase tracking-[0.3em] opacity-40">ENTRY LOAD</th>
                    <th className="px-12 py-8 text-[11px] font-black text-muted uppercase tracking-[0.3em] opacity-40 text-right">TARGET SETTLEMENT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {REWARD_TABLE.map((r, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-12 py-10 text-xl font-black text-white uppercase tracking-tighter italic">{r.tier}</td>
                      <td className="px-12 py-10 text-[11px] font-bold text-muted uppercase tracking-widest opacity-40 italic">{r.entry}</td>
                      <td className="px-12 py-10 text-right">
                        <div className="flex flex-col items-end gap-2">
                           <span className="text-3xl font-black text-white font-mono tracking-tighter italic">{r.reward}</span>
                           <span className="badge-elite !py-0.5 !px-3 !text-[9px] !bg-success/5 !text-success !border-success/20">10X MULTIPLIER</span>
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

      {/* Network Referral Strategy */}
      <section className="relative z-10 mb-48 container">
        <div className="card-elite p-16 md:p-24 border-blue-electric/10 bg-blue-electric/[0.01] relative overflow-hidden flex flex-col lg:flex-row items-center gap-20">
           <div className="absolute top-0 right-0 p-24 opacity-[0.02]"><Globe className="w-80 h-80" /></div>
           <div className="flex-1 relative z-10 text-center lg:text-left">
              <div className="badge-elite !text-blue-electric border-blue-electric/20 mb-10 !px-5 opacity-60">NETWORK ADVOCATE SYSTEM</div>
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-10 leading-[0.9] italic">
                Scale the <br /> <span className="text-gradient-blue">Network.</span>
              </h2>
              <p className="text-secondary text-xs md:text-sm font-medium opacity-40 mb-14 max-w-sm mx-auto lg:mx-0 uppercase tracking-[0.2em] leading-loose">
                Refer associate operators and secure instant protocol settlements for every verified onboarding.
              </p>
              <Link href="/referral" className="btn btn-blue !px-16 !py-5 rounded-full font-bold italic group inline-flex items-center shadow-glow-blue">
                 Access Console <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10 w-full lg:w-auto">
              {[
                { icon: ShieldCheck, text: 'AUTHENTICATE' },
                { icon: Globe, text: 'DEPLOY PROTOCOL' },
                { icon: Zap, text: 'VERIFY NODE' },
                { icon: Wallet, ton: 'SETTLE YIELD' },
              ].map((item, i) => (
                <div key={i} className="card-elite !p-8 bg-black/60 border-white/5 flex items-center gap-6 hover:border-blue-electric/40 transition-all min-w-[240px] shadow-inner">
                   <div className="p-3 bg-white/5 rounded-2xl text-muted group-hover:text-blue-electric shadow-inner">
                      <item.icon className="w-5 h-5 opacity-40" />
                   </div>
                   <span className="text-[11px] font-extrabold text-muted uppercase tracking-[0.3em] opacity-40 italic">{(item as any).text || (item as any).ton}</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Final Action Hub */}
      <section className="relative z-10 container pb-24">
        <div className="card-elite p-16 md:p-32 text-center relative overflow-hidden bg-grad-glow border-gold/10">
           <div className="max-w-2xl mx-auto relative z-10">
              <span className="badge-elite !text-gold mb-10 opacity-60">Ready for Execution</span>
              <h2 className="text-5xl md:text-9xl font-black text-white tracking-tighter uppercase mb-12 leading-[0.85] italic">
                The Arena <br /><span className="text-gradient-gold">Calls.</span>
              </h2>
              <p className="text-secondary text-xs md:text-sm font-medium opacity-40 mb-16 uppercase tracking-[0.3em] max-w-sm mx-auto leading-loose italic">
                 Connect your node, analyze the grid, and secure your perfect sequence today.
              </p>
              <div className="flex flex-wrap gap-6 justify-center">
                <Link href="/accounts" className="btn btn-primary !px-16 !py-5 rounded-full font-bold shadow-2xl">Connect Protocol</Link>
                <Link href="/live-challenges" className="btn btn-ghost !px-12 !py-5 rounded-full font-bold border-white/5 opacity-50">Active Grid</Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
