'use client';

import { 
  Users, 
  Zap, 
  Link as LinkIcon, 
  Check, 
  Activity, 
  Globe, 
  Gift
} from 'lucide-react';
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
  const { success, showSuccess } = useFeedback();

  const referralCode = profile?.username?.toUpperCase() || 'STRIKERX';
  const referralLink = `predchain.io/ref/${referralCode}`;
  const referralCount = referrals.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    showSuccess('Ref-link verified and copied.');
  };

  return (
    <div className="min-h-screen bg-primary pt-80 flex flex-col items-stretch overflow-x-hidden animate-fade-in">
      {/* ─── DENSE COMMAND HEADER ─── */}
      <section className="relative py-48 md:py-64 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[#0D1321] opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)]" />
        
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-32">
            <div className="max-w-600 animate-slide-right">
              <div className="flex items-center gap-12 mb-16">
                 <div className="px-10 py-4 bg-gold/10 border border-gold/20 rounded-full">
                    <span className="text-[10px] font-black text-gold uppercase tracking-widest">Growth Protocol Active</span>
                 </div>
                 <div className="px-10 py-4 bg-blue-electric/10 border border-blue-electric/20 rounded-full">
                    <span className="text-[10px] font-black text-blue-electric uppercase tracking-widest">Node ID: REF-OPS-93</span>
                 </div>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-tight mb-16 uppercase tracking-tight">
                Expansion <span className="text-gold">Intelligence</span>
              </h1>
              <p className="text-sm font-medium text-muted leading-relaxed opacity-80 uppercase tracking-wide">
                Propagate the PredChain infrastructure to earn ₦1,000 per qualified operative realization. 
                <span className="block mt-4 text-[10px] font-black text-white/40 tracking-widest">Global Payout Threshold: ACTIVE /// Uncapped</span>
              </p>
            </div>

            <div className="card p-24 md:p-32 bg-white/[0.02] border-gold/10 shadow-2xl shadow-gold/5 backdrop-blur-xl animate-slide-left min-w-280">
              <div className="flex flex-col items-center">
                <div className="font-display text-4xl font-black text-white tracking-widest flex items-center gap-8 mb-8">
                  <span className="text-gold">₦</span>{totalEarnings.toLocaleString()}
                </div>
                <div className="text-[10px] font-black text-muted/60 uppercase tracking-[0.2em]">Total Realized Growth Yield</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── OPERATIVE CONSOLE ─── */}
      <section className="py-64 bg-primary relative">
        <div className="container max-w-1000">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-64">
             {/* Referral Link Card */}
             <div className="card p-32 bg-white/[0.02] flex flex-col justify-between border-white/5 animate-slide-up">
                <div>
                   <div className="flex items-center gap-12 mb-24">
                      <div className="p-10 bg-blue-electric/10 rounded-xl border border-blue-electric/20"><LinkIcon className="w-18 h-18 text-blue-electric" /></div>
                      <h4 className="font-display text-[11px] font-black text-white uppercase tracking-[0.2em]">Inbound Propagator Node</h4>
                   </div>
                   <div className="flex gap-4 p-4 bg-black/40 border border-white/10 rounded-xl group focus-within:border-blue-electric/40 transition-all mb-16">
                      <input readOnly value={referralLink} className="flex-1 bg-transparent px-16 py-12 font-mono text-[11px] text-blue-electric font-black focus:outline-none" />
                      <button onClick={handleCopy} className="btn btn-blue px-20 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-electric/20">COPY</button>
                   </div>
                </div>
                <div className="flex items-center justify-between pt-16 border-t border-white/5">
                   <div className="text-[9px] text-muted/40 font-black uppercase tracking-[0.2em] italic">Identity: CONSOLE-{referralCode}</div>
                   <div className="flex items-center gap-6">
                      <div className="w-6 h-6 bg-success rounded-full animate-pulse" />
                      <span className="text-[9px] font-black text-success uppercase tracking-widest">Sync Verified</span>
                   </div>
                </div>
             </div>

             {/* Stats Summary */}
             <div className="grid grid-cols-2 gap-16">
                <div className="card p-24 md:p-32 bg-white/[0.01] border-white/5 flex flex-col items-center justify-center text-center animate-slide-up animation-delay-100">
                   <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center mb-16">
                      <Users className="w-20 h-20 text-muted" />
                   </div>
                   <div className="text-2xl font-black text-white mb-4">{referralCount}</div>
                   <div className="text-[9px] font-black text-muted uppercase tracking-widest">Total Operatives</div>
                </div>
                <div className="card p-24 md:p-32 bg-gold/[0.02] border-gold/10 flex flex-col items-center justify-center text-center animate-slide-up animation-delay-200">
                   <div className="w-48 h-48 bg-gold/10 rounded-full flex items-center justify-center mb-16 border border-gold/20">
                      <Zap className="w-20 h-20 text-gold" />
                   </div>
                   <div className="text-2xl font-black text-gold mb-4">₦1,000</div>
                   <div className="text-[9px] font-black text-gold/60 uppercase tracking-widest">Per Conversion</div>
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-32">
             <div className="flex items-center justify-between border-b border-white/5 pb-16">
                <div className="flex items-center gap-12">
                   <Activity className="w-16 h-16 text-blue-electric" />
                   <h2 className="font-display text-sm font-black uppercase tracking-[0.2em] text-white">Registry History</h2>
                </div>
                <span className="badge badge-success px-12 py-4 h-fit !text-[9px] !font-black !tracking-[0.2em]">{referralCount} ACTIVE NODES</span>
             </div>

             <div className="card p-0 overflow-hidden border-white/5">
                <div className="table-wrapper">
                   <table className="table">
                      <thead>
                         <tr>
                            <th className="!text-[10px] !font-black !tracking-[0.2em] py-16 pl-24">OPERATIVE ID</th>
                            <th className="!text-[10px] !font-black !tracking-[0.2em] py-16">REGISTRY DATE</th>
                            <th className="!text-[10px] !font-black !tracking-[0.2em] py-16">YIELD</th>
                            <th className="!text-[10px] !font-black !tracking-[0.2em] py-16 pr-24 text-right">STATUS</th>
                         </tr>
                      </thead>
                      <tbody>
                         {referrals.length === 0 ? (
                           <tr>
                              <td colSpan={4} className="py-80 text-center opacity-30 italic font-medium text-xs font-mono">
                                 No Operatives Synced. propagate your link to initialize growth.
                              </td>
                           </tr>
                         ) : (
                           referrals.map((h) => (
                             <tr key={h.id} className="group hover:bg-white/[0.01] transition-colors">
                                <td className="py-20 pl-24">
                                   <div className="flex items-center gap-12">
                                      <div className="w-28 h-28 bg-white/5 rounded-lg flex items-center justify-center text-[10px] font-black font-mono text-muted group-hover:text-white transition-colors">
                                         {h.referred_user?.username?.[0]?.toUpperCase() || 'U'}
                                      </div>
                                      <span className="text-xs font-black text-white group-hover:text-blue-electric transition-colors">@{h.referred_user?.username || 'Challenger'}</span>
                                   </div>
                                </td>
                                <td className="py-20 font-mono text-[10px] text-muted tracking-tighter uppercase">{new Date(h.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}</td>
                                <td className="py-20 font-display font-black text-xs text-gold">₦1,000</td>
                                <td className="py-20 pr-24 text-right">
                                   <span className={`badge px-10 py-4 !text-[8px] !font-black !tracking-widest ${h.status === 'qualified' ? 'badge-success' : 'badge-gold opacity-50'}`}>
                                      {h.status === 'qualified' ? 'REALIZED' : 'PENDING'}
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

          <div className="mt-80 grid grid-cols-1 md:grid-cols-3 gap-24">
             {[
                { title: 'Incentive Structure', desc: 'Unlimited scalability. Earn ₦1,000 for every distinct account activation globally.', icon: Gift },
                { title: 'Treasury Sync', desc: 'Earnings are instantly reflected in your primary dashboard treasury node.', icon: Zap },
                { title: 'Global Coverage', desc: 'Propagate anywhere. Intelligence nodes are optimized for global conversion.', icon: Globe }
             ].map((item, i) => (
                <div key={i} className="card p-24 bg-white/[0.01] border-white/5 flex flex-col gap-16 group hover:border-white/20 transition-all cursor-default">
                   <div className="p-10 bg-white/5 rounded-xl border border-white/10 w-fit group-hover:bg-blue-electric/10 group-hover:border-blue-electric/20 transition-all">
                      <item.icon className="w-16 h-16 text-muted group-hover:text-blue-electric transition-colors" />
                   </div>
                   <h3 className="font-display text-[10px] font-black text-white uppercase tracking-[0.2em]">{item.title}</h3>
                   <p className="text-[10px] text-muted/60 font-medium leading-relaxed uppercase tracking-wide italic">{item.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* ─── GLOBAL FEEDBACK NODE ─── */}
      {success && (
        <div className="fixed bottom-32 right-32 px-24 py-16 rounded-xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] backdrop-blur-3xl z-[100] flex items-center gap-16 border bg-success/90 border-success/20 text-black animate-slide-up">
           <div className="p-10 rounded-lg bg-black/5"><Check className="w-16 h-16" /></div>
           <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Transmission Verified</span>
              <span className="font-black text-[11px] uppercase tracking-wide italic">{success}</span>
           </div>
        </div>
      )}
    </div>
  );
}
