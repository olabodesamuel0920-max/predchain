'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Wallet as WalletIcon, Users, LogOut, ChevronRight, Menu, X, Landmark, Trophy, HelpCircle } from 'lucide-react';

import { logout } from '@/app/actions/auth';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Overview', icon: Zap, active: pathname === '/dashboard' },
    { href: '/live-challenges', label: 'Live Challenges', icon: Trophy, active: pathname === '/live-challenges' },
    { href: '/accounts', label: 'Account Tiers', icon: WalletIcon, active: pathname === '/accounts' },
    { href: '/referral', label: 'Referral Network', icon: Users, active: pathname === '/referral' },
  ];

  const secondaryLinks = [
    { href: '/rules', label: 'Rules & Logic', icon: Landmark },
    { href: '/faq', label: 'Support / FAQ', icon: HelpCircle },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-[#030508] text-white overflow-x-hidden">
      
      {/* ─── MOBILE DRAWER OVERLAY ─── */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ─── PROFESSIONAL SIDEBAR SHELL ─── */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 border-r border-white/5 bg-[#05070a] z-[70] 
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col shadow-2xl
      `}>
        <div className="p-24 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-12 group">
            <div className="w-8 h-8 rounded-lg bg-grad-gold flex items-center justify-center font-black text-black group-hover:scale-105 transition-transform shadow-lg shadow-gold/20">
              P
            </div>
            <span className="font-display font-black tracking-tighter text-lg uppercase italic">PREDCHAIN</span>
          </Link>
          <button onClick={toggleSidebar} className="lg:hidden text-muted p-4"><X size={20} /></button>
        </div>
        
        <nav className="flex-1 p-6 flex flex-col gap-2">
          <div className="px-16 py-8 mb-4">
             <span className="text-[8px] font-black text-muted uppercase tracking-[0.2em] opacity-40">System Nodes</span>
          </div>

          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              onClick={() => setIsSidebarOpen(false)}
              className={`
                flex items-center justify-between gap-3 px-16 py-12 rounded-2xl transition-all duration-200
                font-black uppercase text-[10px] tracking-widest group
                ${link.active 
                  ? 'bg-blue-electric/10 border border-blue-electric/20 text-white shadow-lg shadow-blue-electric/5' 
                  : 'hover:bg-white/[0.03] text-muted hover:text-white border border-transparent hover:border-white/5'}
              `}
            >
              <div className="flex items-center gap-12">
                 <link.icon className={`w-4 h-4 ${link.active ? 'text-blue-electric' : 'opacity-40 group-hover:opacity-100 transition-opacity'}`} />
                 {link.label}
              </div>
              {link.active && <div className="w-1.5 h-1.5 rounded-full bg-blue-electric animate-pulse" />}
            </Link>
          ))}

          <div className="mt-auto border-t border-white/5 pt-20 flex flex-col gap-2">
            {secondaryLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-12 px-16 py-10 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
              >
                <link.icon size={14} className="opacity-40" />
                {link.label}
              </Link>
            ))}
            
            <form action={logout}>
              <button type="submit" className="w-full flex items-center justify-between px-16 py-14 mt-4 rounded-2xl bg-danger/5 border border-danger/10 text-danger hover:bg-danger/10 transition-all group">
                <div className="flex items-center gap-12 text-[10px] font-black uppercase tracking-widest">
                  <LogOut className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  Sign Out Matrix
                </div>
                <ChevronRight size={12} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </form>
          </div>
        </nav>
      </aside>

      {/* ─── MAIN APP CONTENT ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Unified Top Header Bar */}
        <header className="h-20 border-b border-white/5 bg-[#030508]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-20">
          <div className="flex items-center gap-12 lg:gap-6">
             <button onClick={toggleSidebar} className="lg:hidden p-8 bg-white/5 rounded-xl text-muted hover:text-white transition-all transform active:scale-95">
                <Menu size={20} />
             </button>

             <div className="flex items-center gap-2 px-6 py-1.5 bg-success/10 border border-success/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-black text-success uppercase tracking-widest leading-none">Operational</span>
             </div>
             <div className="h-4 w-[1px] bg-white/10 hidden sm:block opacity-40" />
             <div className="hidden sm:flex items-center gap-6">
                <span className="text-[9px] font-black text-muted uppercase tracking-widest opacity-40">System: </span>
                <span className="text-[10px] font-black text-white uppercase italic tracking-tighter">PredChain Sentinel</span>
             </div>
          </div>
          
          <div className="flex items-center gap-8">
            <Link href="/accounts" className="btn btn-blue px-14 py-8 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-electric/20 border-none hover:scale-105 transition-all">
               Upgrade Node
            </Link>
          </div>
        </header>

        <main className="flex-1 p-16 lg:p-24 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
