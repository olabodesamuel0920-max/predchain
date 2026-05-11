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
import { motion } from 'framer-motion';
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

      <div className="container relative z-10 px-4 sm:px-6 max-w-6xl">
        {/* Public Landing Hero */}
        <div className="text-center mb-24 sm:mb-40">
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="badge-luxury !text-gold mb-10 px-8 py-2.5 bg-white/[0.02] border-white/10 italic font-black"
           >
             PREDCHAIN PARTNER PROGRAM
           </motion.div>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="mb-10 uppercase italic font-black leading-none tracking-tighter text-5xl sm:text-8xl"
           >
             Grow the Arena. <br />
             <span className="text-gradient-gold">Command Rewards.</span>
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-text-secondary text-base sm:text-xl font-medium opacity-60 max-w-2xl mx-auto mb-16 leading-relaxed italic"
           >
             Access the PredChain elite partner program. Grow the arena and earn <span className="text-white font-black">₦1,000</span> for every confirmed player activation. No caps, instant payouts.
           </motion.p>
           
           {!user && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="flex flex-col sm:flex-row gap-8 justify-center"
             >
                <Link href="/signup" className="btn-luxury btn-gold btn-premium-depth !py-6 !px-20 !text-[11px] font-black italic tracking-[0.2em] shadow-2xl uppercase">JOIN THE PARTNERS</Link>
                <Link href="/login" className="btn-luxury btn-outline btn-premium-depth !py-6 !px-20 !text-[11px] font-black italic tracking-[0.2em] border-white/10 bg-white/[0.02] uppercase">LOGIN</Link>
             </motion.div>
           )}
        </div>

        {/* Global Rewards Snapshot */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-32 items-stretch"
        >
          <div className="lg:col-span-8 card-luxury !p-12 sm:!p-20 bg-[#07090e] border-white/10 flex flex-col justify-center relative overflow-hidden group depth-card shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)]">
             <div className="absolute top-0 right-0 p-16 opacity-[0.01] group-hover:opacity-[0.05] transition-all duration-1000 rotate-12 pointer-events-none"><Users className="w-80 h-80" /></div>
             <div className="badge-luxury !text-gold mb-10 px-6 py-2 bg-white/[0.03] uppercase italic font-black tracking-[0.3em] w-fit text-[9px]">PARTNER_REWARDS</div>
             <h2 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter mb-8 leading-none text-white">The Partner <span className="text-gradient-gold">Program.</span></h2>
             <p className="text-text-dim text-base sm:text-lg font-medium opacity-40 max-w-xl leading-relaxed italic group-hover:opacity-100 transition-opacity duration-700">
                PredChain partners grow the most transparent football prediction arena in existence. Every verified player you invite strengthens the community and unlocks automated payouts.
             </p>
          </div>
          
          <motion.div 
            whileHover={{ y: -10 }}
            className="lg:col-span-4 card-luxury !p-14 bg-black border-gold/15 flex flex-col items-center justify-center text-center shadow-[0_40px_80px_-20px_rgba(242,201,76,0.1)] relative overflow-hidden group depth-card"
          >
             <div className="absolute inset-0 bg-gold/5 blur-[50px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             <div className="text-[10px] font-black text-gold uppercase tracking-[0.4em] mb-8 italic opacity-40">Cumulative Earnings</div>
             <div className="text-6xl sm:text-7xl font-black text-white italic tracking-tighter leading-none mb-10 font-display transition-transform group-hover:scale-110 duration-700">
                ₦{totalEarnings.toLocaleString()}
             </div>
             <div className="flex items-center gap-3 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-6 py-3 rounded-2xl border border-emerald-500/10 italic glass-layered shadow-inner">
                <Gift className="w-4 h-4 opacity-40" />
                Verified Revenue
             </div>
          </motion.div>
        </motion.div>

        {/* Program Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-40">
           {[
              { 
                title: 'Live Tracking', 
                desc: 'Every click and activation is tracked instantly. Full transparency on your network growth.', 
                icon: Activity 
              },
              { 
                title: 'Instant Payouts', 
                desc: 'Rewards are credited instantly upon player activation. Zero delay in reward flow.', 
                icon: Zap 
              },
              { 
                title: 'Partner Support', 
                desc: 'Access marketing assets and support to help you grow your partner rewards.', 
                icon: ShieldCheck 
              }
           ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-luxury !p-12 bg-[#07090e] border-white/5 flex flex-col gap-12 group hover:border-gold/30 transition-all duration-700 shadow-2xl depth-card"
              >
                 <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.02] flex items-center justify-center border border-white/5 group-hover:bg-gold group-hover:text-black transition-all duration-700 shadow-inner group-hover:rotate-12">
                    <item.icon className="w-7 h-7" />
                 </div>
                 <div className="space-y-5">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic font-display">{item.title}</h3>
                    <p className="text-[10px] text-text-dim font-black leading-relaxed uppercase tracking-[0.3em] opacity-30 group-hover:opacity-100 transition-opacity duration-700 italic">{item.desc}</p>
                 </div>
              </motion.div>
           ))}
        </div>

        {/* Partner Dashboard (Authenticated Only) */}
        {user && (
          <div className="space-y-16 mb-40">
             <div className="flex items-center gap-6 px-4">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/15 shadow-inner"><Star className="w-6 h-6 animate-pulse" /></div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white font-display">Partner <span className="text-gradient-gold">Dashboard.</span></h2>
                <div className="flex-1 h-px bg-white/5 ml-6" />
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Referral Link */}
                <div className="card-luxury !p-14 bg-[#07090e] border-white/10 flex flex-col justify-between shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)] relative overflow-hidden group depth-card">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:opacity-[0.05] transition-all duration-1000 pointer-events-none"><LinkIcon className="w-48 h-48" /></div>
                   <div>
                      <div className="flex items-center gap-6 mb-16">
                         <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center text-gold border border-gold/15 shadow-inner group-hover:rotate-12 transition-transform duration-700"><LinkIcon className="w-6 h-6" /></div>
                         <div className="flex flex-col gap-1">
                            <span className="text-[12px] font-black text-white uppercase tracking-[0.2em] italic">Partner Link</span>
                            <span className="text-[10px] font-black text-text-dim opacity-30 tracking-[0.4em] uppercase">ACCESS CODE: {referralCode}</span>
                         </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 p-3 bg-black/60 border border-white/5 rounded-[2rem] focus-within:border-gold/30 transition-all mb-12 shadow-inner">
                         <input readOnly value={referralLink} className="flex-1 bg-transparent px-8 font-mono text-[13px] text-gold font-black focus:outline-none py-5" />
                         <button onClick={handleCopy} className="btn-luxury btn-gold btn-premium-depth !py-5 !px-16 !text-[11px] font-black italic tracking-[0.2em] shadow-2xl uppercase">COPY LINK</button>
                      </div>
                   </div>
                   <div className="flex items-center justify-between pt-10 border-t border-white/5">
                      <div className="flex items-center gap-4">
                         <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
                         <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] italic">Live Tracking Active</span>
                      </div>
                      <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.4em] opacity-20 italic">SECURE_ACCESS</span>
                   </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                   <div className="card-luxury !p-14 bg-[#07090e] border-white/5 flex flex-col items-center justify-center text-center shadow-2xl group hover:border-gold/30 transition-all duration-700 depth-card">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.02] flex items-center justify-center mb-10 text-white/20 group-hover:bg-gold group-hover:text-black transition-all duration-700 shadow-inner group-hover:rotate-12"><Users className="w-8 h-8" /></div>
                      <div className="text-5xl font-black text-white italic tracking-tighter mb-4 leading-none font-display transition-transform group-hover:scale-110 duration-700">{referralCount}</div>
                      <span className="text-[11px] font-black text-text-dim uppercase tracking-[0.4em] opacity-30 group-hover:opacity-100 transition-opacity italic">Active Members</span>
                   </div>
                   <div className="card-luxury !p-14 bg-gold/5 border-gold/15 flex flex-col items-center justify-center text-center shadow-2xl group hover:bg-gold/10 transition-all duration-700 depth-card">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-gold/10 flex items-center justify-center mb-10 text-gold shadow-inner group-hover:rotate-12 transition-transform duration-700"><Zap className="w-8 h-8" /></div>
                      <div className="text-5xl font-black text-white italic tracking-tighter mb-4 leading-none font-display transition-transform group-hover:scale-110 duration-700">₦1,000</div>
                      <span className="text-[11px] font-black text-gold uppercase tracking-[0.4em] opacity-50 group-hover:opacity-100 transition-opacity italic">Per Activation</span>
                   </div>
                </div>
             </div>

             {/* History Table */}
             <div className="space-y-10">
                <div className="flex items-center gap-6 px-4 opacity-40">
                   <Activity className="w-6 h-6 text-gold/60" />
                   <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-white italic">Recent Partner Activity</h3>
                   <div className="flex-1 h-px bg-white/5 ml-8" />
                </div>

                <div className="card-luxury !p-0 overflow-hidden bg-[#07090e] border-white/10 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)]">
                   <div className="overflow-x-auto no-scrollbar">
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                               <th className="px-12 py-8 text-[11px] font-black text-text-dim uppercase tracking-[0.4em] italic opacity-40">PARTICIPANT</th>
                               <th className="px-12 py-8 text-[11px] font-black text-text-dim uppercase tracking-[0.4em] italic opacity-40 text-center">TIMESTAMP</th>
                               <th className="px-12 py-8 text-[11px] font-black text-text-dim uppercase tracking-[0.4em] italic opacity-40 text-center">REWARD</th>
                               <th className="px-12 py-8 text-[11px] font-black text-text-dim uppercase tracking-[0.4em] italic opacity-40 text-right">STATUS</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {referrals.length === 0 ? (
                               <tr>
                                  <td colSpan={4} className="py-40 text-center">
                                     <p className="text-[12px] font-black text-text-dim uppercase tracking-[0.5em] opacity-20 italic">No partner activity detected.</p>
                                  </td>
                               </tr>
                            ) : (
                               referrals.map((r, i) => (
                                 <tr key={r.id} className="hover:bg-white/[0.01] transition-all group/row duration-700">
                                    <td className="px-12 py-10">
                                       <div className="flex items-center gap-6">
                                          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-sm font-black text-text-dim group-hover/row:text-gold group-hover/row:border-gold/30 transition-all duration-700 italic shadow-inner group-hover/row:rotate-12">
                                             {r.referred_user?.username?.[0]?.toUpperCase() || 'P'}
                                          </div>
                                          <span className="text-lg font-black text-white uppercase tracking-tighter italic group-hover/row:text-gold transition-colors font-display">@{r.referred_user?.username || 'ACTIVE_PLAYER'}</span>
                                       </div>
                                    </td>
                                    <td className="px-12 py-10 text-center">
                                       <span className="text-[11px] font-black text-text-dim uppercase tracking-[0.2em] opacity-40 group-hover/row:opacity-100 transition-opacity italic">{new Date(r.created_at).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-12 py-10 text-center">
                                       <span className="text-2xl font-black text-gold italic font-display transition-transform group-hover/row:scale-110 duration-700 block">₦1,000</span>
                                    </td>
                                    <td className="px-12 py-10 text-right">
                                       <div className={`badge-luxury !py-2 !px-6 italic font-black text-[10px] tracking-[0.15em] shadow-inner ${r.status === 'qualified' ? '!bg-emerald-500/5 !text-emerald-500 border-emerald-500/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'opacity-20'}`}>
                                          {r.status === 'qualified' ? 'CONFIRMED' : 'PENDING'}
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
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card-luxury-gold !p-20 md:!p-32 text-center mb-32 border-gold/15 shadow-[0_60px_120px_-40px_rgba(242,201,76,0.15)] relative overflow-hidden group rounded-[4rem]"
          >
             <div className="absolute inset-0 bg-[#05070a]" />
             <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.05] to-transparent opacity-50" />
             <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-5xl md:text-8xl mb-12 uppercase italic font-black tracking-tighter leading-none text-white">Join the <br /><span className="text-gradient-gold">Partners.</span></h2>
                <p className="text-text-secondary text-lg font-medium mb-16 leading-relaxed italic opacity-60">
                   Secure your position in the PredChain arena and grow your revenue through our professional partner program.
                </p>
                <div className="flex flex-col sm:flex-row gap-8 justify-center">
                   <Link href="/signup" className="btn-luxury btn-gold btn-premium-depth !py-6 !px-20 !text-[12px] font-black italic tracking-[0.2em] shadow-2xl uppercase">Join the Partners</Link>
                   <Link href="/arena" className="btn-luxury btn-outline btn-premium-depth !py-6 !px-20 !text-[12px] font-black italic tracking-[0.2em] border-white/10 bg-white/[0.02] uppercase">View Arena</Link>
                </div>
             </div>
          </motion.div>
        )}

        {/* Feedback Notifications */}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-12 right-6 left-6 md:left-auto md:w-96 z-[100] p-8 rounded-[2.5rem] backdrop-blur-3xl border bg-emerald-500/90 border-emerald-500/20 text-black shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] flex items-center gap-6"
          >
             <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center shrink-0"><ShieldCheck className="w-6 h-6" /></div>
             <span className="text-[11px] font-black uppercase tracking-[0.2em] italic leading-tight">{success}</span>
             <button onClick={clear} className="ml-auto text-2xl leading-none opacity-40 hover:opacity-100 transition-opacity">×</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
