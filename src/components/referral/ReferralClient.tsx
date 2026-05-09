'use client';

import { 
  Users, 
  Zap, 
  Link as LinkIcon, 
  Check, 
  ChevronRight, 
  Activity, 
  Globe, 
  ArrowUpRight,
  Gift,
  Search,
  DollarSign,
  Trophy,
  ShieldCheck,
  Star,
  PlayCircle
} from 'lucide-react';
import Link from 'next/link';
import { useFeedback } from '@/hooks/useFeedback';

interface ReferralClientProps {
  user: { id: string; email?: string } | null;
  profile: { username?: string; full_name?: string } | null;
  referrals: Array<{
    id: string;
    created_at: string;
    status: string;
    referred_user?: { username?: string; full_name?: string };
  }>;
  totalEarnings: number;
}

export default function ReferralClient({ user, profile, referrals, totalEarnings }: ReferralClientProps) {
  const { success, showSuccess, clear } = useFeedback();

  const referralCode = profile?.username?.toUpperCase() || 'REF-USER';
  const referralLink = `predchain.io/ref/${referralCode}`;
  const referralCount = referrals.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    showSuccess('Referral link copied to clipboard.');
  };

  return (
    <div className="relative min-h-screen bg-primary pt-32 pb-24 md:pt-40">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gold-glow blur-[140px] opacity-10" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-glow blur-[120px] opacity-[0.05]" />
      </div>

      <div className="container relative z-10 px-6 max-w-6xl">
        {/* Public Landing Hero */}
        <div className="text-center mb-20 md:mb-32">
           <div className="badge-luxury !text-gold mb-8 px-6 py-2 bg-gold/5 border-gold/10">Official Partner Program</div>
           <h1 className="mb-8 uppercase italic font-black leading-tight tracking-tighter">
             Grow the Arena. <br />
             <span className="text-gradient-gold">Earn Real Rewards.</span>
           </h1>
           <p className="text-text-secondary text-lg font-medium opacity-70 max-w-2xl mx-auto mb-12 leading-relaxed">
             Join the PredChain elite partner network. Invite players to the arena and earn ₦1,000 for every verified membership activation. No limits, automated rewards.
           </p>
           
           {!user && (
             <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/signup" className="btn-luxury btn-gold !py-5 !px-16 !text-sm shadow-2xl">BECOME A PARTNER</Link>
                <Link href="/login" className="btn-luxury btn-outline !py-5 !px-16 !text-sm">PARTNER LOGIN</Link>
             </div>
           )}
        </div>

        {/* Global Rewards Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-stretch">
          <div className="lg:col-span-8 card-elite !p-12 md:!p-16 bg-[#080a0f] border-white/5 flex flex-col justify-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 rotate-12"><Users className="w-64 h-64" /></div>
             <div className="badge-elite !text-gold mb-10 px-5 py-1.5 bg-white/[0.03] uppercase italic font-black tracking-widest w-fit">Network Growth</div>
             <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-8 leading-none">The Partner <span className="text-gradient-gold">Advantage.</span></h2>
             <p className="text-muted text-sm md:text-base font-medium opacity-60 max-w-lg leading-relaxed">
                As a PredChain partner, you help scale the most transparent sports prediction arena in the world. Every new player you bring helps build the pool and increase the stakes.
             </p>
          </div>
          
          <div className="lg:col-span-4 card-elite !p-12 bg-black border-gold/10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gold/5 blur-[40px] pointer-events-none group-hover:opacity-20 transition-opacity" />
             <div className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-6 italic opacity-60">Rewards Generated</div>
             <div className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none mb-8 font-display">
                ₦{totalEarnings.toLocaleString()}
             </div>
             <div className="flex items-center gap-3 text-[9px] font-bold text-success uppercase tracking-widest bg-success/10 px-4 py-2 rounded-full border border-success/10 italic">
                <Gift className="w-3.5 h-3.5" />
                Uncapped Earnings
             </div>
          </div>
        </div>

        {/* Program Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
           {[
              { 
                title: 'Instant Tracking', 
                desc: 'Every click and activation is tracked in real-time. Full transparency on your network growth.', 
                icon: Activity 
              },
              { 
                title: 'Automated Payouts', 
                desc: 'Rewards are settled instantly upon player verification. No withdrawal delays.', 
                icon: Zap 
              },
              { 
                title: 'Elite Support', 
                desc: 'Access marketing assets and dedicated support to help you scale your network.', 
                icon: ShieldCheck 
              }
           ].map((item, i) => (
              <div key={i} className="card-elite !p-12 bg-[#080a0f] border-white/5 flex flex-col gap-10 group hover:border-gold/30 transition-all duration-700 shadow-xl">
                 <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/10 group-hover:bg-gold group-hover:text-black transition-all duration-500">
                    <item.icon className="w-6 h-6" />
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight italic">{item.title}</h3>
                    <p className="text-[11px] text-muted font-bold leading-relaxed uppercase tracking-widest opacity-40">{item.desc}</p>
                 </div>
              </div>
           ))}
        </div>

        {/* Partner Dashboard (Authenticated Only) */}
        {user && (
          <div className="space-y-12 mb-32 animate-slide-up">
             <div className="flex items-center gap-5 px-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/10"><Star className="w-5 h-5" /></div>
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-white font-display">Partner <span className="text-gradient-gold">Dashboard.</span></h2>
                <div className="flex-1 h-px bg-white/5 ml-4" />
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Referral Link */}
                <div className="card-elite !p-12 bg-[#0a0d12] border-white/10 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity"><LinkIcon className="w-32 h-32" /></div>
                   <div>
                      <div className="flex items-center gap-4 mb-12">
                         <div className="w-12 h-12 rounded-xl bg-blue-electric/10 flex items-center justify-center text-blue-electric border border-blue-electric/20 shadow-inner"><LinkIcon className="w-5 h-5" /></div>
                         <div className="flex flex-col">
                            <span className="text-[11px] font-black text-white uppercase tracking-widest italic">Unique Partner Link</span>
                            <span className="text-[9px] font-bold text-muted opacity-40 tracking-[0.2em] uppercase">Code: {referralCode}</span>
                         </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 p-2 bg-black/60 border border-white/5 rounded-2xl focus-within:border-gold/30 transition-all mb-10 shadow-inner">
                         <input readOnly value={referralLink} className="flex-1 bg-transparent px-6 font-mono text-[12px] text-gold font-black focus:outline-none py-4" />
                         <button onClick={handleCopy} className="btn-luxury btn-gold !py-4 !px-12 !text-[11px] font-black shadow-2xl">COPY LINK</button>
                      </div>
                   </div>
                   <div className="flex items-center justify-between pt-8 border-t border-white/5">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                         <span className="text-[10px] font-black text-success uppercase tracking-widest italic">Real-time Attribution Active</span>
                      </div>
                      <span className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-20 italic">v2.1 Active</span>
                   </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   <div className="card-elite !p-12 bg-[#0a0d12] border-white/5 flex flex-col items-center justify-center text-center shadow-xl group hover:border-gold/20 transition-all duration-700">
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-8 text-white/20 group-hover:bg-gold group-hover:text-black transition-all duration-500 shadow-inner"><Users className="w-7 h-7" /></div>
                      <div className="text-4xl font-black text-white italic tracking-tighter mb-2 leading-none font-display">{referralCount}</div>
                      <span className="text-[11px] font-extrabold text-muted uppercase tracking-widest opacity-40 italic">Active Partners</span>
                   </div>
                   <div className="card-elite !p-12 bg-gold/5 border-gold/10 flex flex-col items-center justify-center text-center shadow-xl group hover:bg-gold/10 transition-all duration-700">
                      <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-8 text-gold shadow-inner"><Zap className="w-7 h-7" /></div>
                      <div className="text-4xl font-black text-white italic tracking-tighter mb-2 leading-none font-display">₦1,000</div>
                      <span className="text-[11px] font-extrabold text-gold uppercase tracking-widest opacity-60 italic">Per Activation</span>
                   </div>
                </div>
             </div>

             {/* History Table */}
             <div className="space-y-8 animate-slide-up">
                <div className="flex items-center gap-4 px-4 opacity-50">
                   <Activity className="w-5 h-5 text-gold/60" />
                   <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">Recent Partner Activity</h3>
                   <div className="flex-1 h-px bg-white/5 ml-6" />
                </div>

                <div className="card-elite !p-0 overflow-hidden bg-[#080a0f] border-white/5 shadow-2xl">
                   <div className="overflow-x-auto no-scrollbar">
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                               <th className="px-12 py-6 text-[11px] font-black text-muted uppercase tracking-widest opacity-40 italic">Participant</th>
                               <th className="px-12 py-6 text-[11px] font-black text-muted uppercase tracking-widest opacity-40 italic text-center">Date</th>
                               <th className="px-12 py-6 text-[11px] font-black text-muted uppercase tracking-widest opacity-40 italic text-center">Reward</th>
                               <th className="px-12 py-6 text-[11px] font-black text-muted uppercase tracking-widest opacity-40 italic text-right">Status</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {referrals.length === 0 ? (
                              <tr>
                                 <td colSpan={4} className="py-32 text-center">
                                    <p className="text-[11px] font-black text-muted uppercase tracking-[0.3em] opacity-20 italic">No partner activity recorded yet.</p>
                                 </td>
                              </tr>
                            ) : (
                              referrals.map((r, i) => (
                                <tr key={r.id} className="hover:bg-white/[0.01] transition-all group duration-500">
                                   <td className="px-12 py-8">
                                      <div className="flex items-center gap-5">
                                         <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-xs font-black text-muted group-hover:text-gold group-hover:border-gold/20 transition-all italic shadow-inner">
                                            {r.referred_user?.username?.[0]?.toUpperCase() || 'P'}
                                         </div>
                                         <span className="text-[13px] font-black text-white uppercase tracking-tight italic group-hover:text-gold transition-colors font-display">@{r.referred_user?.username || 'ActivePlayer'}</span>
                                      </div>
                                   </td>
                                   <td className="px-12 py-8 text-center">
                                      <span className="text-[11px] font-bold text-muted uppercase tracking-widest opacity-40 italic">{new Date(r.created_at).toLocaleDateString()}</span>
                                   </td>
                                   <td className="px-12 py-8 text-center">
                                      <span className="text-base font-black text-gold italic font-display">₦1,000</span>
                                   </td>
                                   <td className="px-12 py-8 text-right">
                                      <div className={`badge-elite !py-1 !px-4 italic font-black text-[10px] ${r.status === 'qualified' ? '!bg-emerald-500/10 !text-emerald-500 border-emerald-500/10' : 'opacity-20'}`}>
                                         {r.status === 'qualified' ? 'VERIFIED' : 'PENDING'}
                                      </div>
                                   </td>
                                </tr>
                              ))
                            )}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Public CTA (Bottom) */}
        {!user && (
          <div className="card-luxury-gold !p-20 md:!p-32 text-center mb-24 border-gold/10 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-grad-premium opacity-5" />
             <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl mb-10 uppercase italic font-black tracking-tighter leading-tight">Ready to <span className="text-gradient-gold">Join the Elite?</span></h2>
                <p className="text-text-secondary text-base font-medium mb-12 leading-relaxed italic opacity-70">
                   Take your place in the PredChain arena and scale your earnings through our professional partner network.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                   <Link href="/signup" className="btn-luxury btn-gold !py-5 !px-20 !text-sm shadow-2xl">CREATE ACCOUNT</Link>
                   <Link href="/arena" className="btn-luxury btn-outline !py-5 !px-20 !text-sm">VIEW ARENA</Link>
                </div>
             </div>
          </div>
        )}

        {/* Feedback Notifications */}
        {success && (
          <div className="fixed bottom-12 right-6 left-6 md:left-auto md:w-96 z-[100] p-6 rounded-2xl backdrop-blur-3xl border bg-emerald-500/90 border-emerald-500/20 text-black shadow-2xl animate-slide-up flex items-center gap-5">
             <ShieldCheck className="w-6 h-6" />
             <span className="text-[11px] font-black uppercase tracking-widest italic">{success}</span>
             <button onClick={clear} className="ml-auto text-xl leading-none opacity-50 hover:opacity-100 transition-opacity">×</button>
          </div>
        )}
      </div>
    </div>
  );
}
