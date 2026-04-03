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

  const navItems = [
    { id: 'dashboard' as const, label: 'Overview', icon: Monitor },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'finance' as const, label: 'Finance', icon: BarChart3 },
    { id: 'matches' as const, label: 'Matches', icon: Sword },
    { id: 'support' as const, label: 'Support', icon: HelpCircle },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-primary text-white flex">
      
      {/* ─── COMPACT SIDE NAVIGATION ─── */}
      <aside className="fixed w-64 border-r border-white/5 bg-primary/40 backdrop-blur-3xl sticky top-0 h-screen flex flex-col p-6">
        <div className="mb-12 px-3">
          <div className="flex items-center gap-3 mb-4">
             <Shield className="w-6 h-6 text-gold opacity-80" />
             <div className="text-[9px] font-black text-gold uppercase tracking-[0.2em]">Platform Control</div>
          </div>
          <h1 className="font-display text-xl font-black tracking-tighter uppercase whitespace-nowrap">Predchain Admin</h1>
        </div>

        <nav className="flex-1 flex flex-col gap-4">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all text-sm font-bold group ${
                activeView === item.id 
                  ? 'bg-white/5 text-white border border-white/10 shadow-lg' 
                  : 'text-muted hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon className={`w-18 h-18 transition-opacity ${activeView === item.id ? 'opacity-100 text-blue-electric' : 'opacity-40 group-hover:opacity-70'}`} />
              {item.label}
              {item.id === 'finance' && initialMetrics.pendingPayouts > 0 && (
                <div className="ml-auto w-2 h-2 rounded-full bg-danger shadow-[0_0_8px_var(--danger)]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-electric/10 border border-blue-electric/20 flex items-center justify-center font-black text-blue-electric text-xs">AD</div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Administrator</span>
              <span className="text-[8px] text-success font-bold uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 ml-64 p-8 max-w-[1600px]">
        
        {/* Header Section */}
        <header className="mb-8 flex justify-between items-end">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6 opacity-40">
               <span className="text-[10px] font-bold uppercase tracking-widest">Management</span>
               <ChevronRight className="w-10 h-10" />
               <span className="text-[10px] font-bold uppercase tracking-widest">{navItems.find(i => i.id === activeView)?.label}</span>
            </div>
            <h2 className="font-display text-3xl font-black tracking-tight mb-4">
              {navItems.find(i => i.id === activeView)?.label}
            </h2>
            <p className="text-muted text-[10px] font-bold uppercase tracking-[0.2em]">
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

      </main>
    </div>
  );
}
