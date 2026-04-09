'use client';

import { useState, useEffect, useTransition } from 'react';
import { 
  Settings, 
  ShieldAlert, 
  DollarSign, 
  Megaphone, 
  BarChart3, 
  RefreshCcw, 
  Power, 
  Globe, 
  Check,
  Zap
} from 'lucide-react';
import { updatePlatformSettings, getAllPlatformSettings, revalidatePlatform } from '@/app/actions/admin';
import { PlatformSettings } from '@/types';
import { useFeedback } from '@/hooks/useFeedback';

export default function SettingsView() {
  const [isPending, startTransition] = useTransition();
  const { success: successMsg, showSuccess } = useFeedback();
  const [settings, setSettings] = useState<PlatformSettings>({
    maintenance_mode: false,
    referral_bonus: 1000,
    announcement_banner: { text: '', active: false },
    trust_stats_mode: 'real',
    tier_pricing: { starter: 5000, standard: 10000, premium: 20000 }
  });

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getAllPlatformSettings();
      if (data) {
        setSettings((prev) => ({ ...prev, ...(data as Partial<PlatformSettings>) }));
      }
    };
    loadSettings();
  }, []);

  const handleUpdate = async <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => {
    startTransition(async () => {
      try {
        await updatePlatformSettings(key, value);
        setSettings((prev) => ({ ...prev, [key]: value }));
        showSuccess(`Setting updated successfully.`);
      } catch (err) {
        console.error('Update failed:', err);
      }
    });
  };
  const handleRevalidate = async () => {
    startTransition(async () => {
      try {
        await revalidatePlatform();
        showSuccess('Platform cache revalidated.');
      } catch (err) {
        console.error('Revalidation failed:', err);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Toast Notifications */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 z-[100] px-5 py-3 bg-success/90 backdrop-blur-xl border border-success/20 text-black rounded-xl flex items-center gap-3 shadow-2xl animate-slide-up">
           <Check className="w-4 h-4" />
           <span className="text-xs font-bold">{successMsg}</span>
        </div>
      )}

      {/* ─── SETTINGS HEADER ─── */}
      <div className="bg-[#030508] border border-white/5 rounded-2xl p-4 md:p-5 flex justify-between items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3">
           <div className="p-2.5 bg-blue-electric/10 rounded-xl border border-blue-electric/20"><Settings className="w-4 h-4 text-blue-electric" /></div>
           <div className="leading-tight">
              <h2 className="font-display text-base font-black tracking-tight text-white uppercase italic">Platform <span className="text-gradient-gold">Kernel.</span></h2>
              <p className="text-[9px] text-muted font-black uppercase tracking-widest mt-1 opacity-40 italic">Global Environment Matrix</p>
           </div>
        </div>
        <div className="hidden sm:block badge badge-muted text-[8px] font-black uppercase px-2.5 py-1 border border-white/10 opacity-40 tracking-widest">SESSION:STABLE</div>
      </div>
        
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col gap-6">
          <div className="card p-5 bg-white/[0.02]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-6 flex items-center gap-3 opacity-60">
               <Power className="w-4 h-4" /> SECURE ACCESS DEPLOYMENT
            </h3>
            
            <div className="flex flex-col gap-3">
              {/* Maintenance Mode */}
              <div className="flex justify-between items-center p-4 bg-white/[0.03] rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                   <div className={`w-3 h-3 rounded-full ${settings.maintenance_mode ? 'bg-danger shadow-[0_0_8px_var(--danger)] animate-pulse' : 'bg-success shadow-[0_0_8px_var(--success)]'}`} />
                   <div>
                     <div className="font-black text-[11px] text-white uppercase tracking-tight">Maintenance Protocol <span className="text-[8px] ml-2 text-danger/60 italic font-bold">(DE-COUPLED)</span></div>
                     <div className="text-[9px] text-muted font-black uppercase tracking-widest mt-1 opacity-20">Gate high-traffic ingress</div>
                   </div>
                </div>
                <button 
                  disabled={true}
                  className="px-4 py-2 border border-dashed border-white/5 rounded-lg text-[8px] font-black text-muted opacity-30 cursor-not-allowed uppercase"
                >
                  OFFLINE
                </button>
              </div>

              {/* Referral Bonus */}
              <div className="flex justify-between items-center p-4 bg-white/[0.03] rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-blue-electric/10 rounded-xl border border-blue-electric/10"><DollarSign className="w-4 h-4 text-blue-electric" /></div>
                   <div>
                     <div className="font-black text-[11px] text-white uppercase tracking-tight">Reward Yield</div>
                     <div className="text-[9px] text-muted font-black uppercase tracking-widest mt-1 opacity-20">NGN Reward per conversion</div>
                   </div>
                </div>
                <div className="flex gap-2 items-center">
                    <input 
                        type="number" 
                        value={settings.referral_bonus} 
                        onChange={(e) => setSettings((prev) => ({ ...prev, referral_bonus: Number(e.target.value) }))}
                        className="w-20 h-9 bg-black/40 border border-white/10 text-white rounded-lg px-3 text-[11px] font-black font-mono focus:outline-none focus:border-blue-electric"
                    />
                    <button 
                      onClick={() => handleUpdate('referral_bonus', settings.referral_bonus)} 
                      disabled={isPending}
                      className="p-2.5 bg-blue-electric/10 hover:bg-blue-electric/20 text-blue-electric rounded-lg border border-blue-electric/20 transition-all"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                </div>
              </div>

              {/* Trust Stats Mode */}
              <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 group transition-all">
                <div className="flex items-center gap-4 mb-5">
                   <div className="p-2 bg-blue-electric/10 rounded-xl border border-blue-electric/10"><BarChart3 className="w-4 h-4 text-blue-electric" /></div>
                   <div>
                     <div className="font-black text-[11px] text-white uppercase tracking-tight">Metrics Mode <span className="text-[8px] ml-2 text-danger/60 italic font-bold">(STABLE)</span></div>
                     <div className="text-[9px] text-muted font-black uppercase tracking-widest mt-1 opacity-20">Data visualization policy</div>
                   </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {['REAL', 'HYBRID', 'STEALTH'].map(m => (
                        <button 
                            key={m}
                            disabled={true}
                            className={`py-2 text-[8px] font-black tracking-widest rounded-lg border border-dashed border-white/5 text-muted opacity-20 cursor-not-allowed`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Announcement Banner */}
          <div className="card p-5 bg-white/[0.02]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-6 flex items-center gap-3 opacity-60">
               <Megaphone className="w-4 h-4" /> HYPER-DASHBOARD BANNER
            </h3>
            <div className="flex flex-col gap-4">
              <textarea 
                  value={settings.announcement_banner?.text || ''} 
                  onChange={(e) => setSettings((prev) => ({ ...prev, announcement_banner: { ...prev.announcement_banner, text: e.target.value } }))}
                  className="input-premium h-24 text-[11px] font-black py-4 px-4 italic placeholder:opacity-20 resize-none" 
                  placeholder="Input global broadcast transmission..."
              />
              <div className="flex gap-3">
                <button 
                  disabled={true}
                  className="flex-1 py-2.5 rounded-xl border border-dashed border-white/5 text-[9px] font-black uppercase tracking-widest text-muted opacity-30 cursor-not-allowed"
                >
                  DE-ACTIVATED
                </button>
                <button 
                  disabled={true}
                  className="px-6 py-2.5 bg-blue-electric/5 border border-blue-electric/10 text-blue-electric rounded-xl text-[9px] font-black uppercase tracking-widest opacity-20 cursor-not-allowed"
                >UPDATE</button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Tier Pricing */}
          <div className="card p-5 bg-white/[0.02]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-6 flex items-center gap-3 opacity-60">
               <Globe className="w-4 h-4" /> ASSET PRICE MATRIX
            </h3>
            <div className="flex flex-col gap-3">
               {Object.entries(settings.tier_pricing || {}).map(([tier, price]) => (
                <div key={tier} className="flex justify-between items-center p-3 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-xl bg-blue-electric/5 border border-blue-electric/10 flex items-center justify-center text-blue-electric group-hover:bg-blue-electric/20 transition-all"><Zap className="w-4 h-4" /></div>
                      <span className="text-[11px] font-black text-white uppercase tracking-wider italic">{tier}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted font-bold font-mono opacity-20">NGN</span>
                      <input 
                        type="number" 
                        value={price}
                        onChange={(e) => setSettings((prev) => ({ 
                          ...prev, 
                          tier_pricing: { ...prev.tier_pricing, [tier]: Number(e.target.value) } 
                        }))}
                        className="w-24 h-9 bg-black/40 border border-white/5 text-white rounded-lg px-3 text-[11px] font-black font-mono focus:outline-none focus:border-blue-electric text-right"
                      />
                   </div>
                </div>
              ))}
              <button 
                  onClick={() => handleUpdate('tier_pricing', settings.tier_pricing)}
                  disabled={isPending}
                  className="btn btn-blue w-full py-3.5 mt-2 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-electric/10 flex items-center justify-center gap-3"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                SYNCHRONIZE PRICE STRUCTURE
              </button>
            </div>
          </div>

          {/* SYSTEM TOOLS */}
          <div className="p-5 bg-danger/[0.02] border border-danger/10 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:scale-110 transition-transform"><ShieldAlert className="w-12 h-12 text-danger" /></div>
            <div className="flex items-center gap-4 mb-5 relative z-10">
               <div className="p-2.5 bg-danger/10 rounded-xl border border-danger/20"><ShieldAlert className="w-4 h-4 text-danger" /></div>
               <div>
                  <h3 className="font-black text-xs text-white uppercase tracking-tight">System Termination</h3>
                  <p className="text-[9px] text-muted font-black uppercase tracking-widest mt-1 opacity-40">High-Severity Overrides</p>
               </div>
            </div>
            <p className="text-[10px] text-muted mb-6 leading-relaxed italic opacity-60 relative z-10 pr-12">Manual synchronization of Edge Cache and global revalidation. Procedural caution advised.</p>
            <div className="flex gap-3 relative z-10">
                <button 
                  onClick={handleRevalidate}
                  disabled={isPending}
                  className="btn btn-danger flex-1 py-3 font-black uppercase text-[10px] tracking-[0.15em] shadow-xl shadow-danger/10 flex items-center justify-center gap-3 overflow-hidden bg-danger text-black hover:bg-danger/90"
                >
                   <Zap className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} /> 
                   {isPending ? 'SYNCHING...' : 'REVALIDATE CORE'}
                </button>
                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all" onClick={() => window.location.reload()}>
                   <RefreshCcw className="w-4 h-4 opacity-40 hover:opacity-100" />
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
