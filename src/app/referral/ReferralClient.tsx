'use client';

import { 
  Users, 
  TrendingUp, 
  Zap, 
  Link as LinkIcon, 
  Check, 
  ChevronRight, 
  Activity, 
  Globe, 
  ShieldCheck, 
  Target,
  ArrowUpRight,
  Gift
} from 'lucide-react';
import Link from 'next/link';
import { useFeedback } from '@/hooks/useFeedback';

interface ReferralClientProps {
  user: { id: string; email?: string };
  profile: { username?: string; full_name?: string };
  referrals: Array<{
    id: string;
    created_at: string;
    status: string;
    referred_user?: { username?: string; full_name?: string };
  }>;
  totalEarnings: number;
}

export default function ReferralClient({ profile, referrals, totalEarnings }: ReferralClientProps) {
  const { success, showSuccess, clear } = useFeedback();

  const referralCode = profile?.username?.toUpperCase() || 'STRIKERX';
  const referralLink = `predchain.io/ref/${referralCode}`;
  const referralCount = referrals.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    showSuccess('Referral link copied.');
  };

  return (
    <div className="min-h-screen bg-primary pt-64 flex flex-col items-stretch overflow-x-hidden animate-fade-in">
      {/* ─── DENSE COMMAND HEADER ─── */}
      <section className="relative py-32 md:py-48 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[#0D1321] opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)]" />
        
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-16 md:gap-32">
            <div className="max-w-[700px] animate-slide-right">
              <div className="flex items-center gap-8 mb-12">
                 <div className="px-10 py-3 bg-gold/10 border border-gold/20 rounded-full">
                    <span className="text-[9px] font-black text-gold uppercase tracking-widest">Referral Program Active</span>
                 </div>
                 <div className="px-10 py-3 bg-blue-electric/10 border border-blue-electric/20 rounded-full">
                    <span className="text-[9px] font-black text-blue-electric uppercase tracking-widest">ID: {referralCode}</span>
                 </div>
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-black text-white leading-tight mb-12 uppercase tracking-tight italic">
                Referral <span className="text-gold">Rewards</span>
              </h1>
              <p className="text-xs md:text-sm font-medium text-muted leading-relaxed opacity-80 uppercase tracking-[0.1em] italic">
                Invite friends to PredChain and earn ₦1,000 for every member realization. 
                <span className="block mt-4 text-[9px] font-black text-white/30 tracking-widest italic">Uncapped earnings active.</span>
              </p>
            </div>

            <div className="card p-20 bg-white/[0.02] border-gold/10 shadow-2xl shadow-gold/5 backdrop-blur-xl animate-slide-left min-w-[200px] md:min-w-[280px]">
              <div className="flex flex-col items-center">
                <div className="font-display text-3xl md:text-4xl font-black text-white tracking-widest flex items-center gap-6 mb-4">
                  <span className="text-gold">₦</span>{totalEarnings.toLocaleString()}
                </div>
                <div className="text-[9px] font-black text-muted/60 uppercase tracking-[0.2em]">Total Earnings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── OPERATIVE CONSOLE ─── */}
      <section className="py-32 md:py-48 bg-primary relative">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 mb-32 md:mb-48">
             {/* Referral Link Card */}
             <div className="card p-24 md:p-32 bg-white/[0.02] flex flex-col justify-between border-white/5 animate-slide-up">
                <div>
                   <div className="flex items-center gap-10 mb-16 md:mb-24">
                      <div className="p-8 bg-blue-electric/10 rounded-xl border border-blue-electric/20"><LinkIcon className="w-4 h-4 text-blue-electric" /></div>
                      <h4 className="font-display text-[10px] md:text-[11px] font-black text-white uppercase tracking-[0.2em]">Your Referral Link</h4>
                   </div>
                   <div className="flex gap-4 p-3 bg-black/40 border border-white/10 rounded-xl group focus-within:border-blue-electric/40 transition-all mb-12">
                      <input readOnly value={referralLink} className="flex-1 bg-transparent px-12 py-10 font-mono text-[10px] text-blue-electric font-black focus:outline-none" />
                      <button onClick={handleCopy} className="btn btn-blue px-12 md:px-16 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-electric/20">COPY</button>
                   </div>
                </div>
                <div className="flex items-center justify-between pt-12 border-t border-white/5">
                   <div className="text-[8px] text-muted/30 font-black uppercase tracking-[0.2em] italic">Code: {referralCode}</div>
                   <div className="flex items-center gap-4">
                      <div className="w-4 h-4 bg-success rounded-full animate-pulse" />
                      <span className="text-[8px] font-black text-success uppercase tracking-widest">Active</span>
                   </div>
                </div>
             </div>

             {/* Stats Summary */}
             <div className="grid grid-cols-2 gap-12 md:gap-16">
                <div className="card p-20 bg-white/[0.01] border-white/5 flex flex-col items-center justify-center text-center animate-slide-up animation-delay-100">
                   <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-12">
                      <Users className="w-5 h-5 text-muted" />
                   </div>
                   <div className="text-xl md:text-2xl font-black text-white mb-2">{referralCount}</div>
                   <div className="text-[8px] md:text-[9px] font-black text-muted uppercase tracking-widest">Total Referrals</div>
                </div>
                <div className="card p-20 bg-gold/[0.02] border-gold/10 flex flex-col items-center justify-center text-center animate-slide-up animation-delay-200">
                   <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-12 border border-gold/20">
                      <Zap className="w-5 h-5 text-gold" />
                   </div>
                   <div className="text-xl md:text-2xl font-black text-gold mb-2">₦1,000</div>
                   <div className="text-[8px] md:text-[9px] font-black text-gold/60 uppercase tracking-widest">Per Referral</div>
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-16 md:gap-24">
             <div className="flex items-center justify-between border-b border-white/5 pb-12">
                <div className="flex items-center gap-10">
                   <Activity className="w-4 h-4 text-blue-electric" />
                   <h2 className="font-display text-[11px] font-black uppercase tracking-[0.2em] text-white">Referral History</h2>
                </div>
                <span className="badge badge-success px-10 py-3 h-fit !text-[8px] !font-black !tracking-[0.2em]">{referralCount} TOTAL</span>
             </div>

             <div className="card p-0 overflow-hidden border-white/5">
                <div className="table-wrapper">
                   <table className="table">
                      <thead>
                         <tr>
                            <th className="!text-[9px] !font-black !tracking-[0.2em] py-12 pl-24">USERNAME</th>
                            <th className="!text-[9px] !font-black !tracking-[0.2em] py-12">DATE</th>
                            <th className="!text-[9px] !font-black !tracking-[0.2em] py-12">REWARD</th>
                            <th className="!text-[9px] !font-black !tracking-[0.2em] py-12 pr-24 text-right">STATUS</th>
                         </tr>
                      </thead>
                      <tbody>
                         {referrals.length === 0 ? (
                           <tr>
                              <td colSpan={4} className="py-64 text-center opacity-30 italic font-medium text-xs font-mono">
                                 No referrals yet. Share your link to start earning.
                              </td>
                           </tr>
                         ) : (
                           referrals.map((h, i) => (
                             <tr key={h.id} className="group hover:bg-white/[0.01] transition-colors">
                                <td className="py-16 pl-24">
                                   <div className="flex items-center gap-10">
                                      <div className="w-24 h-24 bg-white/5 rounded-lg flex items-center justify-center text-[9px] font-black font-mono text-muted group-hover:text-white transition-colors">
                                         {h.referred_user?.username?.[0]?.toUpperCase() || 'U'}
                                      </div>
                                      <span className="text-xs font-black text-white group-hover:text-blue-electric transition-colors">@{h.referred_user?.username || 'Challenger'}</span>
                                   </div>
                                </td>
                                <td className="py-16 font-mono text-[9px] text-muted tracking-tighter uppercase">{new Date(h.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}</td>
                                <td className="py-16 font-display font-black text-xs text-gold">₦1,000</td>
                                <td className="py-16 pr-24 text-right">
                                   <span className={`badge px-10 py-3 !text-[8px] !font-black !tracking-widest ${h.status === 'qualified' ? 'badge-success' : 'badge-gold opacity-50'}`}>
                                      {h.status === 'qualified' ? 'PAID' : 'PENDING'}
                                   </span>
                                </td>
                             </tr>
                           ))
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>

          <div className="mt-48 md:mt-64 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
             {[
                { title: 'Reward Structure', desc: 'Unlimited earnings. Earn ₦1,000 for every new member who joins PredChain.', icon: Gift },
                { title: 'Wallet Sync', desc: 'Rewards are automatically credited to your wallet upon verification.', icon: Zap },
                { title: 'Global Program', desc: 'Invite friends anywhere. Our program is open to members worldwide.', icon: Globe }
             ].map((item, i) => (
                <div key={i} className="card p-20 bg-white/[0.01] border-white/5 flex flex-col gap-12 group hover:border-white/20 transition-all cursor-default">
                   <div className="p-8 bg-white/5 rounded-xl border border-white/10 w-fit group-hover:bg-blue-electric/10 group-hover:border-blue-electric/20 transition-all">
                      <item.icon className="w-4 h-4 text-muted group-hover:text-blue-electric transition-colors" />
                   </div>
                   <h3 className="font-display text-[9px] font-black text-white uppercase tracking-[0.2em] italic">{item.title}</h3>
                   <p className="text-[9px] text-muted/60 font-medium leading-relaxed uppercase tracking-[0.1em] italic">{item.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* ─── GLOBAL FEEDBACK NODE ─── */}
      {success && (
        <div className="fixed bottom-24 right-24 px-16 py-12 rounded-xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] backdrop-blur-3xl z-[100] flex items-center gap-12 border bg-success/90 border-success/20 text-black animate-slide-up">
           <div className="p-8 rounded-lg bg-black/5"><Check className="w-16 h-16" /></div>
           <div className="flex flex-col gap-1">
              <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-40">System</span>
              <span className="font-black text-[10px] uppercase tracking-wide italic">{success}</span>
           </div>
        </div>
      )}
    </div>
  );
}
