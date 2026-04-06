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
  Cpu
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
    { id: 'dashboard' as const, label: 'Overview', icon: Monitor },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'finance' as const, label: 'Finance', icon: BarChart3 },
    { id: 'matches' as const, label: 'Matches', icon: Sword },
    { id: 'support' as const, label: 'Support', icon: HelpCircle },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-12 px-3">
        <div className="flex items-center gap-3 mb-4">
           <Shield className="w-5 h-5 text-gold opacity-80" />
           <div className="text-[8px] font-black text-gold uppercase tracking-[0.2em]">Platform Control</div>
        </div>
        <h1 className="font-display text-lg font-black tracking-tighter uppercase whitespace-nowrap">Predchain Admin</h1>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => {
              setActiveView(item.id);
              setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all text-[11px] font-black uppercase tracking-widest group ${
              activeView === item.id 
                ? 'bg-blue-electric/10 text-white border border-blue-electric/20 shadow-lg shadow-blue-electric/5' 
                : 'text-muted hover:text-white hover:bg-white/[0.03] border border-transparent hover:border-white/5'
            }`}
          >
            <item.icon className={`w-3.5 h-3.5 transition-opacity ${activeView === item.id ? 'opacity-100 text-blue-electric' : 'opacity-40 group-hover:opacity-70'}`} />
            {item.label}
            {item.id === 'finance' && initialMetrics.pendingPayouts > 0 && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-danger shadow-[0_0_8px_var(--danger)]" />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-electric/10 border border-blue-electric/20 flex items-center justify-center font-black text-blue-electric text-[10px]">AD</div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-white uppercase tracking-widest">Administrator</span>
            <span className="text-[8px] text-success font-bold uppercase tracking-widest">Online</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030508] text-white flex">
      
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="fixed w-60 border-r border-white/5 bg-[#05070a] h-screen hidden lg:flex flex-col p-6 z-50">
        <SidebarContent />
      </aside>

      {/* ─── MOBILE SIDEBAR / DRAWER ─── */}
      {isSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#05070a] z-[70] lg:hidden flex flex-col p-6 border-r border-white/10 animate-slide-in-left">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 lg:ml-60 flex flex-col min-w-0">
        
        {/* Responsive Mobile Header */}
        <header className="lg:hidden h-14 border-b border-white/5 bg-[#030508]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6">
           <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gold" />
              <span className="font-display font-black text-[14px] uppercase tracking-tighter italic">Admin Portal</span>
           </div>
           <button 
             onClick={() => setIsSidebarOpen(true)}
             className="p-2 bg-white/5 rounded-lg border border-white/10"
           >
             <Activity className="w-4 h-4" />
           </button>
        </header>

        <section className="p-6 md:p-8 max-w-[1600px] mx-auto w-full">
        
        {/* Header Section */}
        <header className="mb-8 flex justify-between items-end">
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-6 opacity-40">
               <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Management</span>
               <ChevronRight className="w-3 h-3" />
               <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{navItems.find(i => i.id === activeView)?.label}</span>
            </div>
            <h2 className="font-display text-3xl font-black tracking-tight mb-4 uppercase italic">
              {navItems.find(i => i.id === activeView)?.label}
            </h2>
            <p className="text-muted text-[10px] font-bold uppercase tracking-[0.2em] italic opacity-40">
              Platform Management & Oversight
            </p>
          </div>

          <div className="flex gap-6 items-center">
             <div className="flex flex-col items-end">
                <div className="text-[9px] text-muted font-black tracking-widest uppercase mb-4">System Status</div>
                <div className="flex items-center gap-6">
                   <Activity className="w-12 h-12 text-success opacity-60" />
                   <span className="text-success font-mono text-xs font-bold font-mono uppercase tracking-widest">Operational</span>
                </div>
             </div>
          </div>
        </header>

        {/* View Switcher with Slide Animation */}
        <div className="animate-slide-up">
          {activeView === 'dashboard' && (
            <DashboardView metrics={initialMetrics} recentPurchases={recentPurchases} />
          )}
          {activeView === 'users' && (
            <UsersView />
          )}
          {activeView === 'finance' && (
            <FinanceView payoutRequests={payoutRequests} initialMetrics={initialMetrics} />
          )}
          {activeView === 'matches' && (
            <MatchesView matches={matches} rounds={rounds} />
          )}
          {activeView === 'support' && (
            <SupportView />
          )}
          {activeView === 'settings' && (
            <SettingsView />
          )}
        </div>
      </section>

      </main>
    </div>
  );
}
