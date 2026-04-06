'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Zap, Wallet as WalletIcon, Users, Settings, LogOut, Menu, X, Terminal, ChevronRight } from 'lucide-react';
import { logout } from '@/app/actions/auth';

interface DashboardMenuProps {
  profile: any;
  children: React.ReactNode;
}

export default function DashboardMenu({ profile, children }: DashboardMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Zap },
    { href: '/live-challenges', label: 'Live Arena', icon: ShieldCheck },
    { href: '/accounts', label: 'Account Tiers', icon: WalletIcon },
    { href: '/referral', label: 'Referral Network', icon: Users },
  ];

  const secondaryLinks = [
    { href: '/rules', label: '📜 Rules & Logic' },
    { href: '/faq', label: '❓ Support / FAQ' },
  ];

  return (
    <div className="flex min-h-screen bg-[#030508] text-white">
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="w-64 border-r border-white/5 bg-[#05070a] fixed h-full z-50 hidden lg:flex flex-col shadow-2xl">
        <div className="p-24 border-b border-white/5 bg-white/[0.01]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-grad-gold flex items-center justify-center font-black text-black group-hover:scale-105 transition-transform shadow-lg shadow-gold/20">
              P
            </div>
            <span className="font-display font-black tracking-tighter text-lg uppercase italic">PREDCHAIN</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-3">
          <div className="px-16 py-8 mb-4">
             <span className="text-[8px] font-black text-muted uppercase tracking-[0.2em] opacity-40">Main Matrix</span>
          </div>

          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className={`flex items-center justify-between gap-3 px-6 py-12 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest group ${isActive ? 'bg-blue-electric/10 border border-blue-electric/20 text-white' : 'hover:bg-white/[0.03] text-muted hover:text-white border border-transparent hover:border-white/5'}`}>
                <div className="flex items-center gap-3">
                   <link.icon className={`w-4 h-4 ${isActive ? 'text-blue-electric' : 'opacity-40 group-hover:opacity-100 transition-opacity'}`} />
                   {link.label}
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-electric animate-pulse" />}
              </Link>
            );
          })}

          <div className="mt-auto border-t border-white/5 pt-20 flex flex-col gap-4">
            {secondaryLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-12 px-16 py-8 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
            <form action={logout}>
              <button type="submit" className="w-full flex items-center gap-12 px-16 py-12 text-[10px] font-black uppercase tracking-widest text-danger hover:bg-danger/10 rounded-xl transition-all group">
                <LogOut className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                Sign Out Matrix
              </button>
            </form>
          </div>
        </nav>
      </aside>

      {/* ─── MOBILE SIDEBAR ─── */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-[#05070a] z-[70] lg:hidden flex flex-col border-r border-white/10 animate-slide-in-left shadow-3xl">
            <div className="p-20 border-b border-white/10 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-grad-gold flex items-center justify-center font-black text-black">P</div>
                <span className="font-display font-black text-lg uppercase italic">PREDCHAIN</span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-8 bg-white/5 rounded-full text-muted hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <nav className="flex-1 p-16 flex flex-col gap-4 overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={`flex items-center gap-12 px-16 py-14 rounded-xl transition-all font-black uppercase text-[12px] tracking-widest ${isActive ? 'bg-blue-electric/10 text-white' : 'text-muted'}`}>
                    <link.icon className={`w-5 h-5 ${isActive ? 'text-blue-electric' : 'opacity-40'}`} />
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="mt-auto flex flex-col gap-10 pt-20 border-t border-white/5">
                {secondaryLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="px-16 py-8 text-[11px] font-black uppercase tracking-widest text-zinc-500">
                    {link.label}
                  </Link>
                ))}
                <form action={logout}>
                   <button type="submit" className="w-full btn btn-outline-danger py-14 text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-8">
                     <LogOut className="w-4 h-4" />
                     Sign Out Hub
                   </button>
                </form>
              </div>
            </nav>
          </aside>
        </>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="h-20 border-b border-white/5 bg-[#030508]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-6">
             {/* Mobile Toggle */}
             <button 
               onClick={() => setIsOpen(true)} 
               className="lg:hidden p-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all"
             >
               <Menu className="w-5 h-5" />
             </button>

             <div className="flex items-center gap-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-black text-success uppercase tracking-widest leading-none">Operational</span>
             </div>
             <div className="h-4 w-[1px] bg-white/10 hidden sm:block opacity-40" />
             <div className="hidden sm:flex items-center gap-6">
                <span className="text-[9px] font-black text-muted uppercase tracking-widest opacity-40">System: </span>
                <span className="text-[10px] font-black text-white uppercase italic tracking-tighter">PredChain Sentinel</span>
             </div>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-8">
            {profile?.role === 'admin' && (
              <Link href="/admin" className="opacity-40 hover:opacity-100 transition-opacity p-2 hidden sm:flex items-center gap-2 text-muted hover:text-blue-electric group text-[9px] uppercase tracking-[0.3em] font-mono font-black mr-4">
                <Terminal className="w-4 h-4" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">SYS_CTRL</span>
              </Link>
            )}
            
            <Link href="/dashboard/settings" title="Account Identity" className="flex items-center gap-6 px-4 sm:px-10 py-4 sm:py-6 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer group shrink-0">
               <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-electric/20 flex items-center justify-center font-black text-[10px] sm:text-[12px] text-blue-electric group-hover:bg-blue-electric/40 transition-colors uppercase">
                 {profile?.username?.charAt(0) || 'U'}
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest text-white hidden md:block">
                 {profile?.username || 'User'}
               </span>
            </Link>

            <Link href="/accounts" className="btn btn-blue px-10 sm:px-16 py-6 sm:py-8 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-electric/20 border-none shrink-0">
               Upgrade
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <div className="max-w-[1440px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
