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
  Menu,
  X,
  LayoutDashboard
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
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'finance' as const, label: 'Finance', icon: BarChart3 },
    { id: 'matches' as const, label: 'Matches', icon: Sword },
    { id: 'support' as const, label: 'Support', icon: HelpCircle },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  const activeLabel = navItems.find(i => i.id === activeView)?.label;

  return (
    <div className="min-h-screen bg-primary text-white flex overflow-x-hidden">
      
      {/* ─── MOBILE DRAWER OVERLAY ─── */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ─── COMPACT SIDE NAVIGATION ─── */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 border-r border-white/5 bg-[#05070a]/90 backdrop-blur-3xl z-[70] 
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col p-6 shadow-2xl
      `}>
        <div className="mb-12 px-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-8 mb-4">
               <Shield className="w-6 h-6 text-gold opacity-80" />
               <div className="text-[9px] font-black text-gold uppercase tracking-[0.2em]">Matrix Control</div>
            </div>
            <h1 className="font-display text-xl font-black tracking-tighter uppercase whitespace-nowrap">Predchain Admin</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-muted p-4"><X size={20} /></button>
        </div>

        <nav className="flex-1 flex flex-col gap-3">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center justify-between p-12 px-16 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest group ${
                activeView === item.id 
                  ? 'bg-white/5 text-white border border-white/10 shadow-lg' 
                  : 'text-muted hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-12">
                 <item.icon className={`w-4 h-4 transition-opacity ${activeView === item.id ? 'opacity-100 text-blue-electric' : 'opacity-40 group-hover:opacity-70'}`} />
                 {item.label}
              </div>
              {item.id === 'finance' && initialMetrics.pendingPayouts > 0 && (
                <div className="w-1.5 h-1.5 rounded-full bg-danger shadow-[0_0_8px_var(--danger)]" />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-16 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex items-center gap-12">
            <div className="w-32 h-32 rounded-lg bg-grad-gold flex items-center justify-center font-black text-black text-[10px]">AD</div>
            <div className="flex flex-col">
              <div className="text-[10px] font-black text-white leading-none mb-2 text-gold">SUPERUSER</div>
              <div className="flex items-center gap-4">
                 <div className="w-4 h-4 rounded-full bg-success opacity-80" />
                 <div className="text-[8px] text-muted font-bold uppercase tracking-widest">Active Node</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 min-w-0 p-12 lg:p-24 max-w-[1500px] mx-auto w-full">
        
        {/* Header Section */}
        <header className="mb-12 flex justify-between items-center lg:items-end">
          <div className="flex items-center gap-12 lg:block">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-10 bg-white/5 rounded-xl text-muted hover:text-white transition-all transform active:scale-95">
               <Menu size={20} />
            </button>
            
            <div className="animate-fade-in">
              <div className="flex items-center gap-8 mb-8 opacity-40 hidden lg:flex">
                 <span className="text-[10px] font-bold uppercase tracking-widest">Sentinel</span>
                 <ChevronRight className="w-10 h-10" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">{activeLabel}</span>
              </div>
              <h2 className="font-display text-2xl lg:text-3xl font-black tracking-tight mb-2 lg:mb-4">
                {activeLabel}
              </h2>
              <p className="text-muted text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                Oversight & Verification Protocols
              </p>
            </div>
          </div>

          <div className="flex gap-24 items-center">
             <div className="flex flex-col items-end">
                <div className="text-[7px] lg:text-[9px] text-muted font-black tracking-widest uppercase mb-2">Network Health</div>
                <div className="flex items-center gap-6">
                   <Activity className="w-10 h-10 lg:w-12 h-12 text-success opacity-60" />
                   <span className="text-success font-mono text-[10px] lg:text-xs font-bold uppercase tracking-widest">Encrypted</span>
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

      </main>
    </div>
  );
}
