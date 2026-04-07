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
    <div className="min-h-screen bg-[#020406] text-white flex">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed w-64 border-r border-white/5 bg-[#030508] h-screen hidden lg:flex flex-col p-8 z-50">
        <SidebarContent />
      </aside>

      {/* MOBILE DRAWER */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
           <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#030508] p-8 border-r border-white/10 flex flex-col animate-slide-right">
              <SidebarContent />
           </aside>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-white/5 bg-[#020406]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6">
           <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold" />
              <span className="font-display font-black text-sm uppercase tracking-tighter italic text-white/80">Admin Console</span>
           </div>
           <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-white/[0.03] rounded-xl border border-white/10">
              <Menu className="w-5 h-5" />
           </button>
        </header>

        <div className="p-6 md:p-12 max-w-[1400px] w-full mx-auto">
           {/* Section Header */}
           <header className="mb-12 flex justify-between items-end animate-slide-up">
              <div>
                 <div className="flex items-center gap-2 mb-6 opacity-30">
                    <span className="text-[10px] font-black uppercase tracking-widest">Management</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{navItems.find(i => i.id === activeView)?.label}</span>
                 </div>
                 <h1 className="mb-2 italic">{navItems.find(i => i.id === activeView)?.label}.</h1>
                 <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] opacity-40 italic">Global System Oversight Active</p>
              </div>

              <div className="hidden md:flex flex-col items-end gap-3 opacity-60">
                 <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end text-right">
                       <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Load</span>
                       <span className="text-[10px] font-mono font-bold text-success">OPTIMAL</span>
                    </div>
                    <Activity className="w-10 h-10 text-success opacity-40 animate-pulse" />
                 </div>
              </div>
           </header>

           {/* View Switcher */}
           <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
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
