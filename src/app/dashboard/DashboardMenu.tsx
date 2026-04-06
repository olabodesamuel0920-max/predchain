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
    { category: 'Mission Control', links: [
      { href: '/dashboard', label: 'Command Center', icon: Zap },
      { href: '/live-challenges', label: 'Live Arena', icon: ShieldCheck },
      { href: '/accounts', label: 'Node Strategy', icon: WalletIcon },
      { href: '/referral', label: 'Nexus Network', icon: Users },
    ]},
    { category: 'System Configuration', links: [
      { href: '/dashboard/settings', label: 'Account Center', icon: Settings },
      ...(profile?.role === 'admin' ? [{ href: '/admin', label: 'Admin Console', icon: Terminal }] : []),
    ]}
  ];

  const secondaryLinks = [
    { href: '/rules', label: '📜 Rules & Logic' },
    { href: '/faq', label: '❓ Support / FAQ' },
  ];

  const displayName = profile?.full_name || profile?.username || profile?.email?.split('@')[0] || 'Account';
  const displayInitial = displayName === 'Account' ? 'A' : displayName.charAt(0).toUpperCase();

  const processStatus = (status: string) => {
    switch (status) {
      case 'active': return { label: 'Operational', color: 'success' };
      case 'suspended': return { label: 'Suspended', color: 'danger' };
      case 'under_review': return { label: 'Review', color: 'gold' };
      case 'demo': return { label: 'Demo Node', color: 'blue-electric' };
      default: return { label: 'Operational', color: 'success' };
    }
  };

  const status = processStatus(profile?.status || 'active');

  return (
    <div className="flex min-h-screen bg-[#030508] text-white">
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="w-56 border-r border-white/5 bg-[#05070a] fixed h-full z-50 hidden lg:flex flex-col shadow-2xl">
        <div className="p-12 border-b border-white/5 bg-white/[0.01]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-7 h-7 rounded-lg bg-grad-gold flex items-center justify-center font-black text-black group-hover:scale-105 transition-transform shadow-lg shadow-gold/20 text-xs">
              P
            </div>
            <span className="font-display font-black tracking-tighter text-base uppercase italic">PREDCHAIN</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-24 overflow-y-auto no-scrollbar">
          {navLinks.map((group) => (
            <div key={group.category} className="flex flex-col gap-4">
              <div className="px-10">
                 <span className="text-[8px] font-black text-muted uppercase tracking-[0.2em] opacity-30 italic">{group.category}</span>
              </div>
              <div className="flex flex-col gap-1">
                {group.links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link key={link.href} href={link.href} className={`flex items-center justify-between gap-3 px-8 py-2 rounded-lg transition-all font-black uppercase text-[10px] tracking-widest group ${isActive ? 'bg-blue-electric/10 border border-blue-electric/20 text-white shadow-lg shadow-blue-electric/5' : 'hover:bg-white/[0.03] text-muted hover:text-white border border-transparent hover:border-white/5'}`}>
                      <div className="flex items-center gap-3">
                         <link.icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-electric' : 'opacity-40 group-hover:opacity-100 transition-opacity'}`} />
                         {link.label}
                      </div>
                      {isActive && <div className="w-1 h-1 rounded-full bg-blue-electric shadow-[0_0_8px_var(--blue-electric)]" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-auto border-t border-white/5 pt-10 flex flex-col gap-1">
            {secondaryLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-6 px-10 py-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors uppercase italic">
                {link.label}
              </Link>
            ))}
            <form action={logout}>
              <button type="submit" className="w-full flex items-center gap-8 px-10 py-3 text-[10px] font-black uppercase tracking-widest text-danger hover:bg-danger/10 rounded-lg transition-all group">
                <LogOut className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                Sign Out Protocol
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
                <div className="w-8 h-8 rounded-lg bg-grad-gold flex items-center justify-center font-black text-black text-xs">P</div>
                <span className="font-display font-black text-base uppercase italic">PREDCHAIN</span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-8 bg-white/5 rounded-full text-muted hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <nav className="flex-1 p-16 flex flex-col gap-24 overflow-y-auto">
              {navLinks.map((group) => (
                <div key={group.category} className="flex flex-col gap-8">
                  <div className="px-12">
                     <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em] opacity-30 italic">{group.category}</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {group.links.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={`flex items-center gap-10 px-12 py-10 rounded-xl transition-all font-black uppercase text-[12px] tracking-widest ${isActive ? 'bg-blue-electric/10 text-white' : 'text-muted'}`}>
                          <link.icon className={`w-5 h-5 ${isActive ? 'text-blue-electric' : 'opacity-40'}`} />
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              <div className="mt-auto flex flex-col gap-8 pt-16 border-t border-white/5">
                {secondaryLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="px-12 py-6 text-[11px] font-black uppercase tracking-widest text-zinc-500">
                    {link.label}
                  </Link>
                ))}
                <form action={logout}>
                   <button type="submit" className="w-full btn btn-outline-danger py-12 text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-8">
                     <LogOut className="w-4 h-4" />
                     Logout System
                   </button>
                </form>
              </div>
            </nav>
          </aside>
        </>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 lg:pl-56 flex flex-col min-w-0">
        <header className="h-14 md:h-16 border-b border-white/5 bg-[#030508]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-4 lg:px-10">
          <div className="flex items-center gap-4 lg:gap-6">
             {/* Mobile Toggle */}
             <button 
               onClick={() => setIsOpen(true)} 
               className="lg:hidden p-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all"
             >
               <Menu className="w-5 h-5" />
             </button>

             <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full shrink-0">
                <span className={`w-1 h-1 rounded-full animate-pulse shadow-[0_0_4px_var(--${status.color})] bg-${status.color}`} />
                <span className={`text-[9px] font-black uppercase tracking-widest leading-none text-${status.color}`}>
                   {status.label}
                </span>
             </div>
             
             <div className="hidden xl:flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
                <span className="text-[9px] font-black text-muted uppercase italic tracking-tighter opacity-40">PredChain Sentinel Protocol</span>
             </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <Link href="/dashboard/settings" title="Account Identity" className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-white/15 transition-all cursor-pointer group shrink-0">
               <div className="w-6 h-6 rounded-full bg-blue-electric/20 flex items-center justify-center font-black text-[10px] text-blue-electric group-hover:bg-blue-electric/40 transition-colors uppercase">
                 {displayInitial}
               </div>
               <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white hidden md:block max-w-[120px] truncate italic">
                 {displayName}
               </span>
            </Link>

            <Link href="/accounts" className="btn btn-blue px-6 py-2.5 text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-electric/10 border-none shrink-0 min-w-fit">
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
