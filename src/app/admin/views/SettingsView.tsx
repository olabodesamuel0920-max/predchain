'use client';

import { useState, useEffect, useTransition } from 'react';
import { 
  Settings, 
  ShieldAlert, 
  DollarSign, 
  Megaphone, 
  BarChart3, 
  Database, 
  RefreshCcw, 
  Power, 
  Globe, 
  Activity, 
  Check,
  ChevronRight,
  ShieldCheck,
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
    tier_pricing: { starter: 5000, standard: 10000, premium: 25000 }
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
    <div className="flex flex-col gap-8 animate-slide-up">
      {/* Toast Notifications */}
      {successMsg && (
        <div className="fixed bottom-24 right-24 z-[100] px-20 py-12 bg-success/90 backdrop-blur-xl border border-success/20 text-black rounded-xl flex items-center gap-12 shadow-2xl animate-slide-up">
           <Check className="w-16 h-16" />
           <span className="text-xs font-bold">{successMsg}</span>
        </div>
      )}

      {/* ─── SETTINGS HEADER ─── */}
      <div className="card p-4 flex justify-between items-center gap-6">
        <div className="flex items-center gap-2">
           <div className="p-2 bg-blue-electric/10 rounded-lg"><Settings className="w-5 h-5 text-blue-electric" /></div>
           <div>
              <h2 className="font-display text-lg font-black tracking-tight">Platform Settings</h2>
              <p className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-60">Global App Configuration</p>
           </div>
        </div>
        <div className="badge badge-muted text-[8px] font-black uppercase px-2 py-1 border border-white/10">Active Session</div>
      </div>
        
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        <div className="flex flex-col gap-24">
          <div className="card p-24 bg-white/[0.02]">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted mb-20 flex items-center gap-8">
               <Power className="w-5 h-5" /> Access Control
            </h3>
            
            <div className="flex flex-col gap-10">
              {/* Maintenance Mode */}
              <div className="flex justify-between items-center p-16 bg-white/[0.03] rounded-xl border border-white/5 group hover:border-white/10 transition-all">
                <div className="flex items-center gap-12">
                   <div className={`w-8 h-8 rounded-full ${settings.maintenance_mode ? 'bg-danger shadow-[0_0_8px_var(--danger)] animate-pulse' : 'bg-success shadow-[0_0_8px_var(--success)]'}`} />
                   <div>
                     <div className="font-black text-xs text-white">Maintenance Mode <span className="badge badge-muted text-[8px] ml-4 bg-transparent border-danger/50 text-danger">Not Wired</span></div>
                     <div className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-40">Block non-admin ingress</div>
                   </div>
                </div>
                <button 
                  disabled={true}
                  className={`btn btn-xs px-16 py-8 font-black uppercase text-[9px] tracking-widest transition-all bg-white/5 text-muted hover:text-white border-dashed opacity-30 cursor-not-allowed`}
                >
                  OFF
                </button>
              </div>

              {/* Referral Bonus */}
              <div className="flex justify-between items-center p-16 bg-white/[0.03] rounded-xl border border-white/5 group hover:border-white/10 transition-all">
                <div className="flex items-center gap-12">
                   <div className="p-8 bg-blue-electric/10 rounded-lg"><DollarSign className="w-5 h-5 text-blue-electric" /></div>
                   <div>
                     <div className="font-black text-xs text-white">Referral Bonus</div>
                     <div className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-40">NGN Reward per Conversion</div>
                   </div>
                </div>
                <div className="flex gap-8 items-center">
                    <input 
                        type="number" 
                        value={settings.referral_bonus} 
                        onChange={(e) => setSettings((prev) => ({ ...prev, referral_bonus: Number(e.target.value) }))}
                        className="w-24 h-10 bg-black/40 border border-white/10 text-white rounded-lg px-8 text-[11px] font-black focus:outline-none focus:border-blue-electric"
                    />
                    <button 
                      onClick={() => handleUpdate('referral_bonus', settings.referral_bonus)} 
                      disabled={isPending}
                      className="p-8 bg-blue-electric/10 hover:bg-blue-electric/20 text-blue-electric rounded-lg transition-all"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                </div>
              </div>

              {/* Trust Stats Mode */}
              <div className="p-16 bg-white/[0.03] rounded-xl border border-white/5 group hover:border-white/10 transition-all">
                <div className="flex items-center gap-12 mb-16">
                   <div className="p-8 bg-blue-electric/10 rounded-lg"><BarChart3 className="w-5 h-5 text-blue-electric" /></div>
                   <div>
                     <div className="font-black text-xs text-white">Stats Mode <span className="badge badge-muted text-[8px] ml-4 bg-transparent border-danger/50 text-danger">Not Wired</span></div>
                     <div className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-40">Display mode for metrics</div>
                   </div>
                </div>
                <div className="grid grid-3 gap-4">
                    {['real', 'launch', 'hidden'].map(m => (
                        <button 
                            key={m}
                            disabled={true}
                            className={`py-8 text-[9px] font-black uppercase tracking-widest rounded-lg border transition-all bg-transparent border-dashed border-white/10 text-muted opacity-20 cursor-not-allowed`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Announcement Banner */}
          <div className="card p-24 bg-white/[0.02]">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted mb-20 flex items-center gap-8">
               <Megaphone className="w-4 h-4" /> Announcement Banner <span className="badge badge-muted text-[8px] ml-auto bg-transparent border-danger/50 text-danger">Not Wired</span>
            </h3>
            <div className="flex flex-col gap-12">
              <textarea 
                  value={settings.announcement_banner?.text || ''} 
                  onChange={(e) => setSettings((prev) => ({ ...prev, announcement_banner: { ...prev.announcement_banner, text: e.target.value } }))}
                  className="input-premium flex-1 h-24 text-xs font-medium py-12" 
                  placeholder="Banner notification text..."
              />
              <div className="flex gap-4">
                <button 
                  disabled={true}
                  className={`flex-1 py-10 rounded-xl border font-black uppercase text-[10px] tracking-widest transition-all bg-white/5 text-muted border-dashed border-white/10 opacity-30 cursor-not-allowed`}
                >
                  Inactive
                </button>
                <button 
                  disabled={true}
                  className="btn btn-blue px-24 py-10 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-electric/20 opacity-30 cursor-not-allowed"
                >Update Banner</button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-24">
          {/* Tier Pricing */}
          <div className="card p-24 bg-white/[0.02]">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted mb-20 flex items-center gap-8">
               <Globe className="w-5 h-5" /> Pricing Structure
            </h3>
            <div className="flex flex-col gap-10">
               {Object.entries(settings.tier_pricing || {}).map(([tier, price]) => (
                <div key={tier} className="flex justify-between items-center p-12 bg-white/[0.03] border border-white/5 rounded-xl group hover:border-white/10 transition-all">
                   <div className="flex items-center gap-12">
                      <div className="w-8 h-8 rounded-full bg-blue-electric/40" />
                      <span className="text-[11px] font-black text-white uppercase tracking-widest">{tier}</span>
                   </div>
                   <div className="flex items-center gap-10">
                      <span className="text-[10px] text-muted font-bold font-mono">₦</span>
                      <input 
                        type="number" 
                        value={price}
                        onChange={(e) => setSettings((prev) => ({ 
                          ...prev, 
                          tier_pricing: { ...prev.tier_pricing, [tier]: Number(e.target.value) } 
                        }))}
                        className="w-24 h-10 bg-black/40 border border-white/5 text-white rounded-lg px-8 text-[11px] font-black focus:outline-none focus:border-blue-electric text-right"
                      />
                   </div>
                </div>
              ))}
              <button 
                  onClick={() => handleUpdate('tier_pricing', settings.tier_pricing)}
                  disabled={isPending}
                  className="btn btn-blue w-full py-12 mt-10 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-electric/20 flex items-center justify-center gap-8"
              >
                <RefreshCcw className="w-4 h-4" />
                Update All Prices
              </button>
            </div>
          </div>

          {/* SYSTEM TOOLS */}
          <div className="card p-24 bg-danger/[0.02] border-danger/20">
            <div className="flex items-center gap-12 mb-16">
               <div className="p-10 bg-danger/10 rounded-xl"><ShieldAlert className="w-5 h-5 text-danger" /></div>
               <div>
                  <h3 className="font-black text-xs text-white uppercase tracking-widest">System Actions</h3>
                  <p className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-60">High-Risk Tools</p>
               </div>
            </div>
            <p className="text-[10px] text-muted mb-20 leading-relaxed italic opacity-80">Manual actions for debugging and cache updates. Use with caution.</p>
            <div className="flex gap-4">
                <button 
                  onClick={handleRevalidate}
                  disabled={isPending}
                  className="btn btn-danger flex-1 py-12 font-black uppercase text-[10px] tracking-[0.15em] shadow-lg shadow-danger/20 flex items-center justify-center gap-8 group"
                >
                   <Zap className={`w-12 h-12 ${isPending ? 'animate-spin' : 'group-hover:animate-pulse'}`} /> 
                   {isPending ? 'REVALIDATING...' : 'CLEAN CACHE'}
                </button>
                <button className="p-12 hover:bg-white/5 rounded-xl opacity-40 hover:opacity-100 transition-all border border-transparent hover:border-white/10" onClick={() => window.location.reload()}>
                   <RefreshCcw className="w-14 h-14" />
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
