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
  ShieldCheck
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — PredChain',
  description: 'Learn how the 3-day football prediction challenge works, how to buy an account, submit predictions, and unlock the 10X cash reward.',
};

const STEPS = [
  {
    number: '01',
    icon: Wallet,
    color: 'text-gold',
    bg: 'bg-gold/5',
    title: 'Buy an Account',
    description: 'Choose your challenge account tier — Starter (₦5,000), Standard (₦10,000), or Premium (₦20,000). Your account unlocks full access to the prediction challenge round and determines your cash reward multiplier.',
    detail: 'Account purchase is secure and instant. Once confirmed, you are automatically assigned to the current or next active challenge round.',
  },
  {
    number: '02',
    icon: Layout,
    color: 'text-blue-electric',
    bg: 'bg-blue-electric/5',
    title: 'Enter a 3-Day Challenge Round',
    description: 'Each challenge round runs for exactly 3 days. You are placed into the active round immediately after your account is confirmed. Rounds run continuously — a new round begins as soon as the previous one ends.',
    detail: 'The round dashboard shows your 3 scheduled prediction matches — one per day — along with kickoff times, live status, and current leaderboard position.',
  },
  {
    number: '03',
    icon: Target,
    color: 'text-success',
    bg: 'bg-success/5',
    title: 'Predict 1 Live Match Per Day',
    description: 'Each day of the challenge, one live football match opens for prediction. You have a defined window to submit your prediction before the match kicks off. Predictions lock automatically at match start.',
    detail: 'You predict the match outcome: Home Win, Draw, or Away Win. You submit one prediction per day for 3 consecutive days. Missing a prediction means your streak resets.',
  },
  {
    number: '04',
    icon: Activity,
    color: 'text-blue-electric',
    bg: 'bg-blue-electric/5',
    title: 'Track Your Results Live',
    description: 'Watch match results in real time on the Live Challenge page. Your dashboard updates live as each match resolves. Correct predictions advance your streak. Incorrect predictions reset it.',
    detail: 'The live leaderboard reflects your position against all active challengers in real time. Track your streak progress and see who you need to beat.',
  },
  {
    number: '05',
    icon: Trophy,
    color: 'text-gold',
    bg: 'bg-gold/5',
    title: 'Complete 3/3 to Unlock the 10X Cash Reward',
    description: 'If you predict all 3 matches correctly within the same round — a perfect 3/3 streak — you unlock the 10X cash reward for your account tier.',
    detail: 'Your win is reviewed and verified by the PredChain admin team. Once verified, the cash reward is processed and paid out. All verified winners are publicly displayed on the Winners page.',
  },
];

const REWARD_TABLE = [
  { tier: 'Starter', entry: '₦5,000', reward: '₦50,000', multiplier: '10X' },
  { tier: 'Standard', entry: '₦10,000', reward: '₦100,000', multiplier: '10X' },
  { tier: 'Premium', entry: '₦20,000', reward: '₦200,000', multiplier: '10X' },
];

export default function HowItWorksPage() {
  return (
    <div className="pt-20 lg:pt-28">

      {/* Hero */}
      <section className="relative py-16 md:py-24 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-primary opacity-50" />
        <div className="absolute top-[-100px] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-electric/5 blur-[100px] pointer-events-none" aria-hidden="true" />
        
        <div className="container relative z-10 text-center px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest italic opacity-40">Verification Protocol Guide</span>
          </div>
          <h1 className="font-display text-4xl md:text-7xl font-bold text-white italic uppercase tracking-tighter mb-8 leading-none">
            How PredChain <span className="text-gradient-gold">Works</span>
          </h1>
          <p className="text-[11px] md:text-xs font-bold text-secondary uppercase tracking-widest max-w-lg mx-auto leading-relaxed mb-12 italic opacity-40">
            A structured, transparent performance challenge. 
            Five steps from account purchase to verified cash reward settlement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/accounts" className="btn btn-blue px-10 py-4 text-[10px] font-bold uppercase tracking-wide shadow-xl shadow-blue-electric/10 w-full sm:w-auto">Buy Account</Link>
            <Link href="/live-challenges" className="btn btn-ghost px-10 py-4 text-[10px] font-bold uppercase tracking-wide border-white/5 w-full sm:w-auto">Live Grid</Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-white/[0.01]">
        <div className="container max-w-4xl px-6">
          <div className="grid grid-cols-1 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="card p-6 md:p-10 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 hover:border-white/10 transition-all group bg-white/[0.01]">
                {/* Left: Icon Hub */}
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl ${step.bg} ${step.color} border border-current/10 flex items-center justify-center mb-4 transition-transform group-hover:rotate-6 duration-500`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="h-full w-px bg-white/10 md:block hidden opacity-20" />
                </div>

                {/* Right: Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold text-blue-electric uppercase tracking-widest italic opacity-40">Protocol Phase {step.number}</span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-white uppercase italic tracking-tight mb-6">
                    {step.title}
                  </h2>
                  <p className="text-xs md:text-sm font-medium text-secondary leading-relaxed uppercase tracking-wide mb-8 opacity-60">
                    {step.description}
                  </p>
                  <div className="p-6 bg-black/40 border border-white/5 rounded-2xl text-[10px] font-bold text-muted uppercase tracking-wide leading-relaxed italic opacity-40 shadow-inner">
                    {step.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reward mapping */}
      <section className="py-24 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 opacity-40 blur-[120px] translate-y-1/2" />
        <div className="container max-w-4xl px-6 relative z-10">
          <div className="text-center mb-16 px-4">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white uppercase italic tracking-tighter">Settlement Matrix</h2>
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-3 opacity-30 italic">Account Tier → Potential Yield Protocol</p>
          </div>
          <div className="card p-0 overflow-x-auto border-white/10 bg-black/60 shadow-2xl backdrop-blur-3xl no-scrollbar">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-10 py-6 text-[10px] font-bold text-white/30 uppercase tracking-widest">Protocol Tier</th>
                  <th className="px-10 py-6 text-[10px] font-bold text-white/30 uppercase tracking-widest">Entry Load</th>
                  <th className="px-10 py-6 text-[10px] font-bold text-white/30 uppercase tracking-widest">Multiplier</th>
                  <th className="px-10 py-6 text-[10px] font-bold text-white/30 uppercase tracking-widest text-right">Settlement Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {REWARD_TABLE.map((r, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-8 font-display text-base font-bold text-white uppercase italic tracking-tight">{r.tier}</td>
                    <td className="px-10 py-8 text-xs font-bold text-muted uppercase tracking-wide opacity-60">{r.entry}</td>
                    <td className="px-10 py-8">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/5 border border-gold/15 rounded-full">
                        <TrendingUp className="w-3 h-3 text-gold" />
                        <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{r.multiplier}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <span className="font-display text-2xl font-bold text-white italic tracking-tighter">{r.reward}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Referral explanation */}
      <section className="py-24">
        <div className="container max-w-5xl px-6">
          <div className="card p-10 md:p-16 border-blue-electric/20 bg-blue-electric/[0.02] relative overflow-hidden flex flex-col md:flex-row items-center gap-16">
            <div className="absolute top-0 right-0 p-10 opacity-5"><Globe className="w-32 h-32" /></div>
            <div className="flex-1 relative z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-electric/5 border border-blue-electric/15 rounded-full mb-8">
                <Users className="w-3.5 h-3.5 text-blue-electric" />
                <span className="text-[9px] font-bold text-blue-electric uppercase tracking-wider">Advocate Network</span>
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white uppercase italic tracking-tighter mb-6 leading-tight">
                Refer associates.<br />Earn <span className="text-gradient-blue italic">Unlimited</span> Yield.
              </h2>
              <p className="text-[11px] font-bold text-secondary uppercase tracking-widest leading-relaxed mb-12 italic opacity-40 max-w-md mx-auto md:mx-0">
                Deploy your unique signature code. Every associate onboarding earns you a ₦1,000 instant protocol credit.
              </p>
              <Link href="/referral" className="btn btn-blue px-10 py-4 text-[10px] font-bold uppercase tracking-wide shadow-2xl shadow-blue-electric/20 inline-flex items-center gap-3 group w-full sm:w-auto justify-center">
                Access Network <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="flex flex-col gap-4 relative z-10 w-full md:w-auto min-w-[300px]">
              {[
                { icon: Target, text: 'Retrieve signature hub link' },
                { icon: Globe, text: 'Deploy to your active network' },
                { icon: ShieldCheck, text: 'Associate verifies account plan' },
                { icon: Wallet, text: '₦1,000 credits to your hub' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-6 bg-black/60 border border-white/5 rounded-2xl group/item hover:border-blue-electric/30 transition-all shadow-xl">
                  <div className="p-3 bg-white/5 rounded-xl text-muted group-hover/item:text-blue-electric transition-colors">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest italic opacity-40 group-hover/item:opacity-100 transition-all">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-center relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-blue-electric/5 opacity-20 blur-[120px]" />
        <div className="container relative z-10 px-6">
          <h2 className="font-display text-5xl md:text-8xl font-bold text-white uppercase italic tracking-tighter mb-8 bg-grad-gold bg-clip-text text-transparent">
            Ready?
          </h2>
          <p className="text-[11px] font-bold text-secondary uppercase tracking-widest max-w-sm mx-auto leading-relaxed mb-14 italic opacity-40">
            Verify your plan, enter the arena, and execute the perfect sequence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/accounts" className="btn btn-blue px-14 py-4 text-[11px] font-bold uppercase tracking-wide shadow-2xl shadow-gold/20 w-full sm:w-auto">Buy Account</Link>
            <Link href="/live-challenges" className="btn btn-ghost px-14 py-4 text-[11px] font-bold uppercase tracking-wide border-white/10 w-full sm:w-auto">Active Grid</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
