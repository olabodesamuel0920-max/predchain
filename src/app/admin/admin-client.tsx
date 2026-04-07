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
  Target
} from 'lucide-react';
import { ChallengeRound, ChallengeMatch, PayoutRequest, Transaction } from '@/types';

// Import Modular Views
import DashboardView from './views/DashboardView';
import UsersView from './views/UsersView';
import FinanceView from './views/FinanceView';
import MatchesView from './views/MatchesView';
import SupportView from './views/SupportView';
import SettingsView from './views/SettingsView';

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
  const [activeView, setActiveView] = useState<'dashboard'|'users'|'finance'|'matches'|'support'|'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'users' as const, label: 'User Directory', icon: Users },
    { id: 'finance' as const, label: 'Bank & Ledger', icon: CreditCard },
    { id: 'matches' as const, label: 'Arena Control', icon: Target },
    { id: 'support' as const, label: 'Help Desk', icon: HelpCircle },
    { id: 'settings' as const, label: 'System Config', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
           <Shield className="w-5 h-5 text-gold opacity-80" />
           <span className="text-[10px] font-black text-gold uppercase tracking-widest italic">System Admin</span>
        </div>
        <h2 className="text-xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">Pred<span className="text-gradient-gold">Chain.</span></h2>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => {
              setActiveView(item.id);
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all text-[11px] font-black uppercase tracking-widest group ${
              activeView === item.id 
                ? 'bg-white/[0.04] text-white border border-white/10 shadow-lg' 
                : 'text-muted hover:text-white hover:bg-white/[0.02] border border-transparent hover:border-white/5'
            }`}
          >
            <item.icon className={`w-4 h-4 transition-opacity ${activeView === item.id ? 'opacity-100 text-gold' : 'opacity-20 group-hover:opacity-100'}`} />
            <span className="italic">{item.label}</span>
            {item.id === 'finance' && initialMetrics.pendingPayouts > 0 && (
              <div className="ml-auto w-2 h-2 rounded-full bg-danger shadow-glow-danger animate-pulse" />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4">
         <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center font-black text-gold italic shadow-inner">AD</div>
         <div className="flex flex-col">
            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Administrator</span>
            <span className="text-[8px] font-bold text-success uppercase tracking-widest flex items-center gap-1.5">
               <div className="w-1 h-1 rounded-full bg-success" /> Online
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
          <div className="mb-10 flex items-center justify-between px-1">
            {isSidebarOpen ? (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2.5 mb-2">
                   <Shield className="w-3.5 h-3.5 text-gold opacity-80" />
                   <span className="text-[8px] font-black text-gold uppercase tracking-[0.2em] italic">System Admin</span>
                </div>
                <h2 className="text-base font-black text-white italic tracking-tighter uppercase whitespace-nowrap">Pred<span className="text-gradient-gold">Chain.</span></h2>
              </div>
            ) : (
              <Shield className="w-5 h-5 text-gold mx-auto" />
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
             <div className="shrink-0 w-8 h-8 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center font-black text-gold italic shadow-inner text-[10px]">AD</div>
             {isSidebarOpen && (
               <div className="flex flex-col animate-fade-in min-w-0">
                  <span className="text-[9px] font-black text-white uppercase tracking-widest italic truncate">Control Unit</span>
                  <span className="text-[7.5px] font-bold text-success uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                     <div className="w-1 h-1 rounded-full bg-success" /> Synchronized
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
        <header className="h-14 border-b border-white/5 bg-[#020406]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-4 md:px-6">
           <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 bg-white/[0.03] rounded-xl border border-white/5 shadow-inner">
                 <Menu className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                 <div className="hidden sm:flex items-center gap-2 opacity-20 text-[8px] font-black uppercase tracking-[0.25em]">
                    <span>SYSTEM</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                    <span className="text-white">{navItems.find(i => i.id === activeView)?.label}</span>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-5">
              <div className="hidden sm:flex items-center gap-2.5">
                 <div className="w-1 h-1 rounded-full bg-success shadow-[0_0_6px_var(--success)] animate-pulse" />
                 <span className="text-[8px] font-black text-muted uppercase tracking-[0.2em] opacity-30 italic">KERNEL: SYNCHRONIZED</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <button onClick={() => window.location.reload()} className="p-1.5 text-muted hover:text-white transition-opacity opacity-20 hover:opacity-100">
                 <Activity className="w-3.5 h-3.5" />
              </button>
           </div>
        </header>

        {/* Dynamic View Content */}
        <div className="p-4 md:p-6 lg:p-7 w-full max-w-[1600px] mx-auto overflow-x-hidden">
           {/* Section Identity */}
           <div className="mb-6 md:mb-8 animate-slide-up flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                 <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter leading-none mb-2 text-white uppercase">{navItems.find(i => i.id === activeView)?.label}.</h1>
                 <p className="text-[8px] md:text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-20 italic leading-none ml-1">Administrative Matrix node_alpha</p>
              </div>
              <div className="flex items-center gap-3.5 bg-white/[0.01] border border-white/5 rounded-2xl px-5 py-2.5 shadow-sm">
                 <div className="flex flex-col items-end shrink-0">
                    <span className="text-[7.5px] font-black text-muted uppercase tracking-widest opacity-20 leading-none mb-1">Status</span>
                    <span className="text-[9px] font-mono font-bold text-success uppercase leading-none italic">OPERATIONAL</span>
                 </div>
                 <div className="w-px h-5 bg-white/5" />
                 <Database className="w-4 h-4 text-blue-electric opacity-20 shrink-0" />
              </div>
           </div>

           {/* Modular View Switcher */}
           <div className="animate-slide-up relative" style={{ animationDelay: '0.1s' }}>
              {activeView === 'dashboard' && <DashboardView metrics={initialMetrics} recentPurchases={recentPurchases} />}
              {activeView === 'users' && <UsersView />}
              {activeView === 'finance' && <FinanceView payoutRequests={payoutRequests} initialMetrics={initialMetrics} />}
              {activeView === 'matches' && <MatchesView matches={matches} rounds={rounds} />}
              {activeView === 'support' && <SupportView />}
              {activeView === 'settings' && <SettingsView />}
           </div>
        </div>
      </main>
    </div>
  );
}
