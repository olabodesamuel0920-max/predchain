'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Minus, 
  ShieldCheck, 
  Target, 
  Trophy, 
  ArrowUpRight, 
  HelpCircle, 
  MessageSquare, 
  Zap, 
  Users,
  Search,
  CheckCircle2,
  Lock,
  ChevronRight,
  Activity
} from 'lucide-react';

const FAQ_SECTIONS = [
  {
    category: 'Platform Basics',
    icon: Globe,
    items: [
      {
        q: 'What is PredChain?',
        a: 'PredChain is a premium performance-based football prediction challenge platform. You join an entry tier, enter a 3-day challenge round, predict 1 live football match per day for 3 consecutive days, and unlock a 10X reward with a perfect 3/3 streak.',
      },
      {
        q: 'Is this a betting or gambling platform?',
        a: 'No. PredChain is a performance challenge platform. You are not wagering against an opponent or placing bets. You are purchasing entry into a structured performance challenge to test your prediction accuracy against live match outcomes.',
      },
      {
        q: 'Who can participate?',
        a: 'Anyone who joins a valid PredChain tier can participate. Accounts are personal, non-transferable, and subject to security checks at the point of reward payout.',
      },
    ],
  },
  {
    category: 'Challenge Rules',
    icon: Target,
    items: [
      {
        q: 'How does the 3-day challenge work?',
        a: 'Each challenge round runs for 3 consecutive days. One live football match opens for prediction each day. You must predict the outcome (Home Win, Draw, or Away Win) before the match kicks off. All 3 predictions must be correct in the same round to qualify for the reward.',
      },
      {
        q: 'How many predictions are in each round?',
        a: 'Exactly 3 — one per day for 3 days. Day 1, Day 2, and Day 3 each feature one live match. All 3 must be predicted correctly in a single streak.',
      },
      {
        q: 'What happens if I miss one prediction?',
        a: 'If you fail to submit a prediction before the match kicks off, your streak is broken. A missed prediction resets your progress for that round. You must wait for the next round to re-enter.',
      },
      {
        q: 'What happens if I get one prediction wrong?',
        a: 'Your streak ends immediately. You can re-join a tier and enter the next challenge round to try again.',
      },
      {
        q: 'Can I change my prediction after submitting?',
        a: 'No. Once submitted, predictions are locked to ensure arena integrity. Predictions also lock automatically when the match kicks off.',
      },
    ],
  },
  {
    category: 'Rewards',
    icon: Award,
    items: [
      {
        q: 'How does the 10X reward work?',
        a: 'Each tier has a fixed 10X reward multiplier applied to the entry fee: Starter (₦5,000 → ₦50,000), Standard (₦10,000 → ₦100,000), Premium (₦20,000 → ₦200,000). Completing a perfect 3/3 streak unlocks your tier\'s payout.',
      },
      {
        q: 'When is the reward paid?',
        a: 'After completing a perfect 3/3 streak, your result is confirmed by the audit team. Confirmed rewards are typically processed within 24–48 hours. All confirmed winners are displayed on the Winners page.',
      },
      {
        q: 'Is the reward guaranteed?',
        a: 'The reward is guaranteed upon completion of a confirmed perfect 3/3 streak. It is not guaranteed for incomplete, failed, or fraudulent attempts. Security confirmation is required before any payout.',
      },
    ],
  },
  {
    category: 'Partners',
    icon: Users,
    items: [
      {
        q: 'How does the partner program work?',
        a: 'You earn ₦1,000 for every player who joins a PredChain tier using your unique invite link. There is no cap on earnings. Bonuses are deposited instantly to your wallet upon confirmed tier entry.',
      },
      {
        q: 'How do I get my invite link?',
        a: 'Your unique invite link is automatically generated once you join a tier. You can find it on your dashboard under the Partners tab.',
      },
      {
        q: 'Can I earn bonuses without completing a streak?',
        a: 'Yes. Partner earnings are independent of your challenge performance. You earn ₦1,000 per successful referral regardless of your streak status.',
      },
    ],
  },
  {
    category: 'Security',
    icon: ShieldCheck,
    items: [
      {
        q: 'How are winners confirmed?',
        a: 'Every winning streak is reviewed by the security and moderation team. This includes checking for duplicate accounts and identity confirmation. Only confirmed winners receive rewards.',
      },
      {
        q: 'Can I have multiple accounts?',
        a: 'No. Multiple accounts are strictly prohibited. Our system performs duplicate detection and manual review for all reward claims to ensure fairness.',
      },
      {
        q: 'How are rankings determined?',
        a: 'Leaderboard rankings are based on total confirmed wins, rewards unlocked, and streak performance.',
      },
    ],
  },
];

import { Globe, Award } from 'lucide-react';

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="group mb-4">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full p-6 sm:p-8 rounded-2xl border flex items-center justify-between transition-all duration-500 text-left ${
          open ? 'bg-white/[0.03] border-gold/30 shadow-2xl' : 'bg-[#0a0d14] border-white/5 hover:border-white/10'
        }`}
      >
        <span className={`text-sm sm:text-base font-black italic uppercase tracking-tight transition-colors ${open ? 'text-white' : 'text-text-secondary'}`}>{q}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${open ? 'bg-gold text-black rotate-180' : 'bg-white/5 text-text-dim'}`}>
           <Plus className={`w-4 h-4 transition-all ${open ? 'hidden' : 'block'}`} />
           <Minus className={`w-4 h-4 transition-all ${open ? 'block' : 'hidden'}`} />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
        <div className="p-8 bg-white/[0.01] border border-white/5 rounded-2xl">
          <p className="text-text-secondary text-sm leading-relaxed font-medium opacity-70 italic">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('Platform Basics');

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-glow blur-[140px] opacity-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-glow blur-[120px] opacity-5" />
      </div>

      <div className="container-tight relative z-10 px-6">
        {/* Header */}
        <div className="max-w-3xl mb-20">
           <div className="badge-luxury mb-6 px-5 py-1.5 flex items-center gap-2.5 bg-gold/5 border-gold/10 inline-flex">
              <HelpCircle className="w-4 h-4 text-gold" />
              <span className="pb-px font-display tracking-[0.2em] font-extrabold uppercase">Arena Intelligence</span>
           </div>
           <h1 className="mb-6 uppercase italic font-black leading-tight tracking-tight">Arena <span className="text-gradient-gold">Intelligence.</span></h1>
           <p className="text-text-secondary text-base font-medium opacity-70 leading-relaxed max-w-xl italic">
              Everything you need to know about the PredChain arena, challenge mechanics, and reward confirmation systems.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Sidebar Nav */}
          <div className="lg:col-span-4 space-y-2 sticky top-32">
            {FAQ_SECTIONS.map((section) => (
              <button
                key={section.category}
                onClick={() => setActiveCategory(section.category)}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all duration-500 group ${
                  activeCategory === section.category 
                  ? 'bg-gold text-black border-gold shadow-xl scale-[1.02] z-10' 
                  : 'bg-white/[0.02] border-white/5 text-text-secondary hover:bg-white/[0.04]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  activeCategory === section.category ? 'bg-black/20 text-black' : 'bg-white/5 text-text-dim group-hover:text-gold'
                }`}>
                   <section.icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest italic">{section.category}</span>
                <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${activeCategory === section.category ? 'translate-x-1' : 'opacity-0'}`} />
              </button>
            ))}

            <div className="pt-10 mt-10 border-t border-white/5">
               <div className="card-luxury !p-8 bg-blue-glow/5 border-blue-500/10">
                  <MessageSquare className="w-6 h-6 text-blue-electric mb-4" />
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-3 italic">Direct Support</h4>
                  <p className="text-[10px] font-medium text-text-secondary opacity-60 mb-6 italic leading-relaxed">
                     Can't find the answer? Our specialists are available 24/7.
                  </p>
                  <Link href="/contact" className="btn-luxury btn-outline !py-3 !px-6 !text-[9px] w-full border-blue-500/20 text-blue-electric hover:bg-blue-500 hover:text-white transition-all uppercase tracking-[0.2em] font-black">
                     OPEN TICKET
                  </Link>
               </div>
            </div>
          </div>

          {/* Main FAQ Content */}
          <div className="lg:col-span-8 animate-fade-in">
            {FAQ_SECTIONS
              .filter(s => s.category === activeCategory)
              .map((section) => (
                <div key={section.category} className="space-y-6">
                  <div className="flex items-center gap-4 mb-10 pb-4 border-b border-white/5">
                     <section.icon className="w-6 h-6 text-gold opacity-50" />
                     <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white font-display">{section.category}</h2>
                  </div>
                  <div className="space-y-4">
                    {section.items.map((item, i) => (
                      <AccordionItem key={i} q={item.q} a={item.a} />
                    ))}
                  </div>
                </div>
              ))}
            
            {/* Bottom Proof Tag */}
            <div className="mt-16 flex items-center justify-center gap-8 py-10 border-t border-white/5 opacity-20">
               <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">Audited Rewards</span>
               </div>
               <div className="w-1 h-1 rounded-full bg-white/20" />
               <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">Live Real-time Feeds</span>
               </div>
               <div className="w-1 h-1 rounded-full bg-white/20" />
               <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">Secure Gateway</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
