'use client';

import { useState } from 'react';
import { 
  Monitor, 
  Users, 
  BarChart3, 
  Sword, 
  HelpCircle, 
  Settings, 
  Shield, 
  Zap, 
  Activity,
  ChevronRight,
  Database,
  Cpu,
  LayoutDashboard,
  Menu,
  X,
  CreditCard,
  Target,
  TrendingUp
} from 'lucide-react';
import { ChallengeRound, ChallengeMatch, PayoutRequest, Transaction } from '@/types';

// Import Modular Views from components
import DashboardView from '@/components/admin/views/DashboardView';
import UsersView from '@/components/admin/views/UsersView';
import FinanceView from '@/components/admin/views/FinanceView';
import MatchesView from '@/components/admin/views/MatchesView';
import SupportView from '@/components/admin/views/SupportView';
import SettingsView from '@/components/admin/views/SettingsView';
import PlaysView from '@/components/admin/views/PlaysView';

interface AdminClientProps {
  initialMetrics: { totalUsers: number; totalRevenue: number; pendingPayouts: number };
  rounds: ChallengeRound[];
  matches: (ChallengeMatch & { challenge_rounds?: { round_number: number } })[];
  recentPurchases: (Transaction & { profiles?: { username: string } })[];
  payoutRequests: (PayoutRequest & { profiles?: { username: string } })[];
}

export default function AdminClient({
  initialMetrics,
  rounds,
  matches,
  recentPurchases,
  payoutRequests
}: AdminClientProps) {
  const [activeView, setActiveView] = useState<'dashboard'|'users'|'finance'|'matches'|'support'|'settings'|'plays'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'users' as const, label: 'User Directory', icon: Users },
    { id: 'plays' as const, label: 'User Plays', icon: TrendingUp },
    { id: 'finance' as const, label: 'Bank & Ledger', icon: CreditCard },
    { id: 'matches' as const, label: 'Arena Control', icon: Target },
    { id: 'support' as const, label: 'Help Desk', icon: HelpCircle },
    { id: 'settings' as const, label: 'System Config', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
           <Shield className="w-4 h-4 text-gold opacity-60" />
           <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] font-display">System Integrity</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tighter uppercase font-display">Pred<span className="text-gradient-gold">Chain.</span></h2>
      </div>

      <nav className="flex-1 space-y-3">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => {
              setActiveView(item.id);
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-4 py-4 px-5 rounded-2xl transition-all text-[11px] font-bold uppercase tracking-widest font-display group ${
              activeView === item.id 
                ? 'bg-white/10 text-white shadow-xl' 
                : 'text-secondary hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <item.icon className={`w-4 h-4 transition-all ${activeView === item.id ? 'text-gold' : 'opacity-30 group-hover:opacity-100'}`} />
            <span className="italic">{item.label}</span>
            {item.id === 'finance' && initialMetrics.pendingPayouts > 0 && (
              <div className="ml-auto w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)] animate-pulse" />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4">
         <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center font-bold text-gold italic shadow-inner">AD</div>
         <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest font-display">Administrative Hub</span>
            <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 mt-1">
               <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Verified
            </span>
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020406] text-white flex overflow-x-hidden">
      
      {/* DESKTOP SIDEBAR (Laptop & Monitor) */}
      <aside className={`fixed h-screen border-r border-white/5 bg-[#030508] transition-all duration-300 z-50 flex flex-col p-5 hidden lg:flex ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="mb-10 flex items-center justify-between px-2">
            {isSidebarOpen ? (
              <div className="animate-fade-in group">
                <div className="flex items-center gap-2.5 mb-2">
                   <Shield className="w-3.5 h-3.5 text-gold opacity-50" />
                   <span className="text-[8px] font-bold text-gold uppercase tracking-[0.2em] font-display">System Integrity</span>
                </div>
                <h2 className="text-lg font-bold text-white tracking-tighter uppercase font-display group-hover:tracking-tight transition-all">Pred<span className="text-gradient-gold">Chain.</span></h2>
              </div>
            ) : (
              <Shield className="w-5 h-5 text-gold mx-auto opacity-40" />
            )}
          </div>

          <nav className="flex-1 space-y-1.5">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3.5 py-2.5 px-3 rounded-xl transition-all font-black uppercase tracking-widest group ${
                  activeView === item.id 
                    ? 'bg-white/[0.04] text-white border border-white/10 shadow-lg' 
                    : 'text-muted hover:text-white hover:bg-white/[0.02] border border-transparent hover:border-white/5'
                }`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <item.icon className={`w-3.5 h-3.5 shrink-0 transition-opacity ${activeView === item.id ? 'opacity-100 text-gold' : 'opacity-20 group-hover:opacity-100'}`} />
                {isSidebarOpen && <span className="text-[9px] italic animate-fade-in whitespace-nowrap">{item.label}</span>}
                {item.id === 'finance' && initialMetrics.pendingPayouts > 0 && (
                  <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-danger shadow-[0_0_8px_var(--danger)] animate-pulse ${!isSidebarOpen ? 'absolute top-2 right-2' : ''}`} />
                )}
              </button>
            ))}
          </nav>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="mt-4 p-2.5 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl border border-white/5 flex items-center justify-center transition-all opacity-40 hover:opacity-100"
          >
            <ChevronRight className={`w-3.5 h-3.5 text-muted transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>

          <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-3 overflow-hidden">
             <div className="shrink-0 w-9 h-9 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center font-bold text-gold italic shadow-inner text-[11px]">AD</div>
             {isSidebarOpen && (
               <div className="flex flex-col animate-fade-in min-w-0">
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest font-display truncate">Control Node</span>
                  <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 mt-0.5 opacity-80">
                     <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Operational
                  </span>
               </div>
             )}
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      <div className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setIsSidebarOpen(false)} />
          <aside className={`absolute left-0 top-0 bottom-0 w-64 bg-[#030508] p-5 border-r border-white/10 flex flex-col transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
             <div className="flex flex-col h-full leading-none">
                <div className="mb-10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                       <Shield className="w-3.5 h-3.5 text-gold opacity-80" />
                       <span className="text-[8px] font-black text-gold uppercase tracking-[0.2em] italic">System Admin</span>
                    </div>
                    <h2 className="text-base font-black text-white italic tracking-tighter uppercase">Pred<span className="text-gradient-gold">Chain.</span></h2>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 border border-white/10 rounded-lg text-muted hover:text-white"><X className="w-4 h-4" /></button>
                </div>
                <nav className="flex-1 space-y-1.5">
                  {navItems.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => { setActiveView(item.id); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3.5 py-3.5 px-4 rounded-xl transition-all font-black uppercase tracking-widest ${activeView === item.id ? 'bg-white/[0.05] text-white border border-white/10 shadow-lg' : 'text-muted border border-transparent'}`}
                    >
                      <item.icon className={`w-4 h-4 ${activeView === item.id ? 'text-gold' : 'opacity-20'}`} />
                      <span className="text-[10px] italic">{item.label}</span>
                    </button>
                  ))}
                </nav>
             </div>
          </aside>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 transition-all duration-300 flex flex-col min-w-0 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
        
        {/* Responsive Header Bar */}
        <header className="h-16 border-b border-white/5 bg-[#030508]/80 backdrop-blur-3xl sticky top-0 z-40 flex items-center justify-between px-6 md:px-10">
           <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-3 bg-white/[0.03] rounded-2xl border border-white/5 shadow-inner hover:bg-white/[0.06] transition-colors">
                 <Menu className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-3">
                 <div className="hidden sm:flex items-center gap-3 opacity-40 text-[9px] font-bold uppercase tracking-[0.25em] font-display">
                    <span>ADMINISTRATION</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-white opacity-100">{navItems.find(i => i.id === activeView)?.label}</span>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="hidden md:flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                 <span className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] opacity-40 italic">STRATEGY: SYNCHRONIZED</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <button onClick={() => window.location.reload()} className="p-2 text-secondary hover:text-gold transition-colors opacity-40 hover:opacity-100">
                 <Activity className="w-4 h-4" />
              </button>
           </div>
        </header>

        {/* Dynamic View Content */}
        <div className="p-4 md:p-6 lg:p-7 w-full max-w-[1600px] mx-auto overflow-x-hidden">
           {/* Section Identity */}
           <div className="mb-10 md:mb-12 animate-slide-up flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-2">
              <div className="space-y-3">
                 <h1 className="text-3xl md:text-5xl font-bold tracking-tighter leading-none text-white uppercase font-display italic">{navItems.find(i => i.id === activeView)?.label}.</h1>
                 <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] opacity-30 leading-none font-display">Strategic Administrative Hub</p>
              </div>
              <div className="flex items-center gap-5 bg-white/[0.02] border border-white/5 rounded-3xl px-8 py-4 shadow-xl">
                 <div className="flex flex-col items-end shrink-0">
                    <span className="text-[9px] font-bold text-secondary uppercase tracking-widest opacity-30 leading-none mb-2">Systems</span>
                    <span className="text-[11px] font-bold text-emerald-500 uppercase leading-none italic font-display">OPERATIONAL</span>
                 </div>
                 <div className="w-px h-6 bg-white/5" />
                 <Database className="w-5 h-5 text-gold opacity-20 shrink-0" />
              </div>
           </div>

           {/* Modular View Switcher */}
           <div className="animate-slide-up relative" style={{ animationDelay: '0.1s' }}>
              {activeView === 'dashboard' && <DashboardView metrics={initialMetrics} recentPurchases={recentPurchases} />}
              {activeView === 'users' && <UsersView />}
              {activeView === 'finance' && <FinanceView payoutRequests={payoutRequests} initialMetrics={initialMetrics} />}
              {activeView === 'matches' && <MatchesView matches={matches} rounds={rounds} />}
              {activeView === 'plays' && <PlaysView rounds={rounds} />}
              {activeView === 'support' && <SupportView />}
              {activeView === 'settings' && <SettingsView />}
           </div>
        </div>
      </main>
    </div>
  );
}
