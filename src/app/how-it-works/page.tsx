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
    title: 'Initialize Node Account',
    description: 'Select your operational tier — Starter, Standard, or Premium. Your selection defines your arena entry protocol and final reward settlement volume.',
    detail: 'Instant network activation upon verification.',
  },
  {
    number: '02',
    icon: Layout,
    title: 'Connect to Arena Cycle',
    description: 'Each operational cycle spans exactly 72 hours. Upon activation, your node is synchronized with the current live arena events.',
    detail: 'Continuous round synchronization for all active nodes.',
  },
  {
    number: '03',
    icon: Target,
    title: 'Submit daily Prediction',
    description: 'Provide one match outcome prediction per 24-hour cycle. Predictions must be submitted and locked before match kickoff.',
    detail: 'Single-entry protocol per match event.',
  },
  {
    number: '04',
    icon: Activity,
    title: 'Monitor Live Performance',
    description: 'Track the live resolution of arena events. Your integrity streak is updated in real-time as match results are verified by the network.',
    detail: 'Real-time leaderboard and status tracking.',
  },
  {
    number: '05',
    icon: Trophy,
    title: 'Unlock 10X Settlement',
    description: 'Maintain a perfect 3/3 integrity streak to trigger the 10X reward protocol. Verified wins are processed for automated settlement.',
    detail: 'Verified settlement within 48-hour protocol window.',
  },
];

const REWARD_TABLE = [
  { tier: 'Starter', entry: '₦5,000', reward: '₦50,000', multiplier: '10X' },
  { tier: 'Standard', entry: '₦10,000', reward: '₦100,000', multiplier: '10X' },
  { tier: 'Premium', entry: '₦20,000', reward: '₦200,000', multiplier: '10X' },
];

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen bg-primary pt-32 pb-24">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-grad-glow opacity-30 pointer-events-none z-0" />

      {/* Hero */}
      <section className="relative z-10 mb-24 text-center">
        <div className="container">
          <div className="badge-elite mb-8 !px-4">ARENA OPERATIONAL PROTOCOL</div>
          <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight uppercase mb-8 leading-tight">
            How PredChain <br /> <span className="text-gradient-gold">Operates.</span>
          </h1>
          <p className="text-secondary text-sm font-medium opacity-60 max-w-lg mx-auto mb-12">
            A high-integrity, performance-based prediction challenge. 
            Follow the five-phase protocol to secure your settlement.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/accounts" className="btn btn-primary px-12 py-4 rounded-2xl font-bold uppercase text-[11px] tracking-widest group shadow-[0_0_40px_rgba(197,160,89,0.15)]">
               Initiate Account <ArrowUpRight className="w-4 h-4 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <Link href="/live-challenges" className="btn btn-ghost px-10 py-4 rounded-2xl font-bold uppercase text-[11px] tracking-widest border-white/10">The Grid</Link>
          </div>
        </div>
      </section>

      {/* Methodology Steps */}
      <section className="relative z-10 mb-32">
        <div className="container max-w-4xl px-6">
          <div className="grid grid-cols-1 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="card-elite p-8 md:p-12 flex flex-col md:flex-row items-start gap-8 md:gap-16 hover:border-gold/20 transition-all group">
                {/* Number Hub */}
                <div className="flex flex-col items-center">
                   <div className="text-4xl font-black text-white italic opacity-[0.03] group-hover:opacity-10 transition-opacity absolute -top-4 -left-4 pointer-events-none">
                      {step.number}
                   </div>
                   <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gold relative z-10 group-hover:scale-110 transition-transform duration-500">
                      <step.icon className="w-7 h-7" />
                   </div>
                </div>

                {/* Content */}
                <div className="flex-1 relative z-10">
                   <div className="badge-elite !text-blue-electric !bg-blue-electric/5 border-blue-electric/10 mb-4 !px-3">PROTOCOL PHASE {step.number}</div>
                   <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-6">
                      {step.title}
                   </h2>
                   <p className="text-secondary text-sm font-medium opacity-60 leading-relaxed mb-8 uppercase tracking-wide">
                      {step.description}
                   </p>
                   <div className="p-5 bg-black/40 border border-white/5 rounded-2xl text-[10px] font-bold text-muted uppercase tracking-widest opacity-40 italic">
                      {step.detail}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Settlement Table */}
      <section className="relative z-10 mb-32">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-4">Settlement Matrix</h2>
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-30 italic">Protocol Tier Mapping Protocol</p>
          </div>
          <div className="card-elite !p-0 overflow-hidden bg-black/40 shadow-2xl">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-10 py-6 text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-40">PROTOCOL TIER</th>
                    <th className="px-10 py-6 text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-40">ENTRY LOAD</th>
                    <th className="px-10 py-6 text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-40 text-right">SETTLEMENT YIELD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {REWARD_TABLE.map((r, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-10 py-8 text-lg font-bold text-white uppercase tracking-tight italic">{r.tier}</td>
                      <td className="px-10 py-8 text-xs font-bold text-muted uppercase tracking-widest opacity-40">{r.entry}</td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex flex-col items-end gap-1">
                           <span className="text-2xl font-bold text-white font-mono tracking-tighter italic">{r.reward}</span>
                           <span className="text-[9px] font-bold text-gold uppercase tracking-widest">10X PAYOUT</span>
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
      <section className="relative z-10 mb-32 container">
        <div className="card-elite p-12 md:p-20 border-blue-electric/20 bg-blue-electric/[0.02] relative overflow-hidden flex flex-col md:flex-row items-center gap-20">
           <div className="absolute top-0 right-0 p-16 opacity-[0.03]"><Globe className="w-56 h-56" /></div>
           <div className="flex-1 relative z-10 text-center md:text-left">
              <div className="badge-elite !text-blue-electric border-blue-electric/20 mb-8 !px-4">NETWORK ADVOCATE</div>
              <h2 className="text-3xl md:text-6xl font-bold text-white uppercase tracking-tight mb-8 leading-tight">
                Scale the <br /> <span className="text-gradient-blue">Network.</span>
              </h2>
              <p className="text-secondary text-sm font-medium opacity-60 mb-12 max-w-sm mx-auto md:mx-0 uppercase tracking-wide leading-relaxed">
                Refer associate operators and secure instant protocol credits for every verified onboarding.
              </p>
              <Link href="/referral" className="btn btn-blue px-12 py-4 rounded-2xl font-bold uppercase text-[11px] tracking-widest shadow-2xl shadow-blue-electric/20 group inline-flex items-center">
                 Access Console <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 w-full md:w-auto">
              {[
                { icon: ShieldCheck, text: 'Retrieve Signature' },
                { icon: Globe, text: 'Deploy to Network' },
                { icon: Zap, text: 'Verified Activation' },
                { icon: Wallet, text: 'Instant Settlement' },
              ].map((item, i) => (
                <div key={i} className="card-elite !p-6 bg-black/60 border-white/5 flex items-center gap-5 hover:border-blue-electric/30 transition-all min-w-[200px]">
                   <div className="p-2.5 bg-white/5 rounded-xl text-muted group-hover:text-blue-electric">
                      <item.icon className="w-4 h-4" />
                   </div>
                   <span className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-40">{item.text}</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Global CTA */}
      <section className="relative z-10 container">
        <div className="card-elite p-12 md:p-24 text-center relative overflow-hidden bg-grad-glow border-gold/10">
           <div className="max-w-xl mx-auto relative z-10">
              <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tight uppercase mb-8 leading-tight italic">
                Ready to <br /><span className="text-gradient-gold">Execute?</span>
              </h2>
              <p className="text-secondary text-sm font-medium opacity-60 mb-14 uppercase tracking-wide max-w-sm mx-auto leading-relaxed">
                Connect your protocol, analyze the arena events, and secure your perfect streak today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/accounts" className="btn btn-primary px-14 py-4 rounded-2xl font-bold uppercase text-[11px] tracking-widest shadow-2xl">Connect Protocol</Link>
                <Link href="/live-challenges" className="btn btn-ghost px-14 py-4 rounded-2xl font-bold uppercase text-[11px] tracking-widest border-white/10">Active Grid</Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
