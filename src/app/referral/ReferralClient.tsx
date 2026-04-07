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
  DollarSign
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

  const referralCode = profile?.username?.toUpperCase() || 'REF-USER';
  const referralLink = `predchain.io/ref/${referralCode}`;
  const referralCount = referrals.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    showSuccess('Referral link copied to clipboard.');
  };

  return (
    <div className="relative min-h-screen bg-primary pt-32 pb-24 md:pt-44">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gold-glow blur-[140px] opacity-20" />
      </div>

      <div className="container relative z-10 px-6">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
          <div className="lg:col-span-8 card-elite !p-12 md:!p-16 bg-[#080a0f] border-gold/10 flex flex-col justify-center">
             <div className="badge-elite !text-gold mb-8 px-5 py-1 bg-white/[0.03]">AFFILIATE PROGRAM</div>
             <h1 className="mb-6">Share & <span className="text-gradient-gold">Earn.</span></h1>
             <p className="text-muted text-sm md:text-base font-medium opacity-60 max-w-lg">
               Invite friends to join the PredChain arena and earn ₦1,000 for every successfully activated account.
             </p>
          </div>
          
          <div className="lg:col-span-4 card-elite !p-12 bg-black border-white/5 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gold/5 blur-[40px] pointer-events-none" />
             <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4 opacity-40 italic">Total Earned</div>
             <div className="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-none mb-4">
                ₦{totalEarnings.toLocaleString()}
             </div>
             <div className="flex items-center gap-2 text-[9px] font-bold text-success uppercase tracking-widest bg-success/10 px-3 py-1 rounded-full border border-success/10">
                <Gift className="w-3 h-3" />
                Uncapped Rewards
             </div>
          </div>
        </div>

        {/* Link & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
           {/* Referral Link */}
           <div className="card-elite !p-10 bg-[#080a0f] border-white/5 flex flex-col justify-between shadow-xl">
              <div>
                 <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-blue-electric shadow-inner"><LinkIcon className="w-5 h-5" /></div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Personal Invite Link</span>
                       <span className="text-[8px] font-bold text-muted opacity-30 tracking-widest uppercase">Unique Code: {referralCode}</span>
                    </div>
                 </div>
                 <div className="flex gap-2 p-1.5 bg-black/40 border border-white/10 rounded-xl focus-within:border-blue-electric/40 transition-all mb-8 shadow-inner">
                    <input readOnly value={referralLink} className="flex-1 bg-transparent px-4 font-mono text-[11px] text-blue-electric font-bold focus:outline-none" />
                    <button onClick={handleCopy} className="btn btn-blue !py-3 !px-8 !text-[10px] font-bold shadow-xl">COPY LINK</button>
                 </div>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                 <span className="text-[8px] font-bold text-muted uppercase tracking-widest opacity-30 italic">Real-time Attribution Active</span>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                    <span className="text-[8px] font-bold text-success uppercase tracking-widest">Live</span>
                 </div>
              </div>
           </div>

           {/* Quick Stats */}
           <div className="grid grid-cols-2 gap-8">
              <div className="card-elite !p-10 bg-[#080a0f] border-white/5 flex flex-col items-center justify-center text-center shadow-xl group hover:border-white/10">
                 <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-6 text-white/20 group-hover:text-white transition-colors"><Users className="w-6 h-6" /></div>
                 <div className="text-3xl font-black text-white italic tracking-tighter mb-1 leading-none">{referralCount}</div>
                 <span className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-40">Total Referrals</span>
              </div>
              <div className="card-elite !p-10 bg-gold/5 border-gold/10 flex flex-col items-center justify-center text-center shadow-xl group hover:bg-gold/10">
                 <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 text-gold"><Zap className="w-6 h-6" /></div>
                 <div className="text-3xl font-black text-white italic tracking-tighter mb-1 leading-none">₦1,000</div>
                 <span className="text-[10px] font-bold text-gold uppercase tracking-widest opacity-50">Per Referral</span>
              </div>
           </div>
        </div>

        {/* History Table */}
        <div className="space-y-6 mb-24">
           <div className="flex items-center gap-3 px-2 opacity-40">
              <Activity className="w-5 h-5 text-blue-electric" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white italic">Referral Log</h2>
              <div className="flex-1 h-px bg-white/5 ml-4" />
           </div>

           <div className="card-elite !p-0 overflow-hidden bg-[#080a0f] border-white/5 shadow-2xl">
              <div className="overflow-x-auto no-scrollbar">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-white/[0.02] border-b border-white/5">
                          <th className="px-10 py-5 text-[10px] font-black text-muted uppercase tracking-widest opacity-40 italic">Participant</th>
                          <th className="px-10 py-5 text-[10px] font-black text-muted uppercase tracking-widest opacity-40 italic">Date</th>
                          <th className="px-10 py-5 text-[10px) font-black text-muted uppercase tracking-widest opacity-40 italic">Payout</th>
                          <th className="px-10 py-5 text-[10px] font-black text-muted uppercase tracking-widest opacity-40 italic text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {referrals.length === 0 ? (
                         <tr>
                            <td colSpan={4} className="py-24 text-center">
                               <p className="text-[10px] font-black text-muted uppercase tracking-widest opacity-20 italic">No referrals found in your network.</p>
                            </td>
                         </tr>
                       ) : (
                         referrals.map((r, i) => (
                           <tr key={r.id} className="hover:bg-white/[0.01] transition-colors group">
                              <td className="px-10 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-[10px] font-black text-muted group-hover:text-white transition-all italic">
                                       {r.referred_user?.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-[11px] font-black text-white uppercase tracking-tight italic group-hover:text-gold transition-colors">@{r.referred_user?.username || 'Challenger'}</span>
                                 </div>
                              </td>
                              <td className="px-10 py-6">
                                 <span className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-40 italic">{new Date(r.created_at).toLocaleDateString()}</span>
                              </td>
                              <td className="px-10 py-6">
                                 <span className="text-sm font-black text-gold italic">₦1,000</span>
                              </td>
                              <td className="px-10 py-6 text-right">
                                 <div className={`badge-elite !py-0.5 !px-3 italic ${r.status === 'qualified' ? '!bg-success/10 !text-success border-success/10' : 'opacity-20'}`}>
                                    {r.status === 'qualified' ? 'PAID' : 'PENDING'}
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

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
           {[
              { title: 'Commission Policy', desc: 'Unlimited referrals. Earn for every unique account activation.', icon: Gift },
              { title: 'Automated Payouts', desc: 'Earnings are credited instantly to your wallet upon verification.', icon: Zap },
              { title: 'Global Coverage', desc: 'Invite participants from across the globe to the arena.', icon: Globe }
           ].map((item, i) => (
              <div key={i} className="card-elite !p-10 bg-[#080a0f] border-white/5 flex flex-col gap-8 group hover:border-white/10 transition-all duration-500">
                 <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5 group-hover:bg-blue-electric/10 group-hover:border-blue-electric/20 transition-all">
                    <item.icon className="w-5 h-5 text-muted group-hover:text-blue-electric transition-colors" />
                 </div>
                 <h3 className="text-xs font-black text-white uppercase tracking-wider italic">{item.title}</h3>
                 <p className="text-[10px] text-muted font-bold leading-relaxed uppercase tracking-widest opacity-40">{item.desc}</p>
              </div>
           ))}
        </div>

        {/* Global Feedback Notifications */}
        {success && (
          <div className="fixed top-24 right-6 left-6 md:left-auto md:w-96 z-[100] p-6 rounded-2xl backdrop-blur-3xl border bg-success/90 border-success/20 text-black shadow-2xl animate-slide-up flex items-center gap-5">
             <Check className="w-5 h-5" />
             <span className="text-xs font-bold uppercase tracking-widest">{success}</span>
             <button onClick={clear} className="ml-auto text-lg leading-none opacity-50 hover:opacity-100 transition-opacity">×</button>
          </div>
        )}
      </div>
    </div>
  );
}
