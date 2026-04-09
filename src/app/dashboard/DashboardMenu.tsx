'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Zap, Wallet as WalletIcon, Users, Settings, LogOut, Menu, X, Terminal } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { Profile } from '@/types';

interface DashboardMenuProps {
  profile: Profile | null;
  children: React.ReactNode;
}

export default function DashboardMenu({ profile, children }: DashboardMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { category: 'Overview', links: [
      { href: '/dashboard', label: 'Dashboard', icon: Zap },
      { href: '/live-challenges', label: 'Challenges', icon: ShieldCheck },
      { href: '/accounts', label: 'Accounts', icon: WalletIcon },
      { href: '/referral', label: 'Referrals', icon: Users },
    ]},
    { category: 'Configuration', links: [
      { href: '/dashboard/settings', label: 'Account', icon: Settings },
      ...(profile?.role === 'admin' ? [{ href: '/admin', label: 'Admin', icon: Terminal }] : []),
    ]}
  ];

  const secondaryLinks = [
    { href: '/rules', label: '📜 Rules' },
    { href: '/faq', label: '❓ Support' },
  ];

  // Unified Identity Resolver Protocol
  // Full Name -> Username -> Email Prefix -> "Account" Fallback
  const displayName = profile?.full_name || (profile?.username ? `@${profile.username}`.toUpperCase() : null) || profile?.email?.split('@')[0] || 'Account';
  const displayInitial = profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : (profile?.username ? profile.username.charAt(0).toUpperCase() : 'A');

  const processStatus = (status: string) => {
    switch (status) {
      case 'active': return { label: 'Active', color: 'success' };
      case 'suspended': return { label: 'Suspended', color: 'danger' };
      case 'under_review': return { label: 'Review', color: 'gold' };
      case 'demo': return { label: 'Demo', color: 'blue-electric' };
      default: return { label: 'Active', color: 'success' };
    }
  };

  const status = processStatus(profile?.status || 'active');

  return (
    <div className="flex min-h-screen bg-[#030508] text-white">
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="w-52 border-r border-white/5 bg-[#05070a] fixed h-full z-50 hidden lg:flex flex-col shadow-2xl">
        <div className="p-10 border-b border-white/5 bg-white/[0.01]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-6 h-6 rounded-lg bg-grad-gold flex items-center justify-center font-black text-black group-hover:scale-105 transition-transform shadow-lg shadow-gold/20 text-xs">
              P
            </div>
            <span className="font-display font-black tracking-tighter text-sm uppercase italic">PREDCHAIN</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-3 flex flex-col gap-12 overflow-y-auto no-scrollbar">
          {navLinks.map((group) => (
            <div key={group.category} className="flex flex-col gap-2">
              <div className="px-8 mt-4">
                 <span className="text-[8px] font-black text-muted uppercase tracking-[0.2em] opacity-30 italic">{group.category}</span>
              </div>
              <div className="flex flex-col gap-1">
                {group.links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link key={link.href} href={link.href} className={`flex items-center justify-between gap-3 px-6 py-1.5 rounded-lg transition-all font-black uppercase text-[10px] tracking-widest group ${isActive ? 'bg-blue-electric/10 border border-blue-electric/20 text-white shadow-lg shadow-blue-electric/5' : 'hover:bg-white/[0.03] text-muted hover:text-white border border-transparent hover:border-white/5'}`}>
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

          <div className="mt-auto border-t border-white/5 pt-6 flex flex-col gap-1">
            {secondaryLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-6 px-8 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors uppercase italic">
                {link.label}
              </Link>
            ))}
            <form action={logout}>
              <button type="submit" className="w-full flex items-center gap-8 px-8 py-2 text-[10px] font-black uppercase tracking-widest text-danger hover:bg-danger/10 rounded-lg transition-all group">
                <LogOut className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                Sign Out
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
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#05070a] z-[70] lg:hidden flex flex-col border-r border-white/10 animate-slide-in-left shadow-3xl">
            <div className="p-16 border-b border-white/10 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-grad-gold flex items-center justify-center font-black text-black text-xs">P</div>
                <span className="font-display font-black text-sm uppercase italic">PREDCHAIN</span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-6 bg-white/5 rounded-full text-muted hover:text-white transition-colors"><X className="w-4 h-4" /></button>
            </div>
            
            <nav className="flex-1 p-12 flex flex-col gap-16 overflow-y-auto">
              {navLinks.map((group) => (
                <div key={group.category} className="flex flex-col gap-6">
                  <div className="px-10">
                     <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em] opacity-30 italic">{group.category}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {group.links.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={`flex items-center gap-10 px-10 py-8 rounded-xl transition-all font-black uppercase text-[11px] tracking-widest ${isActive ? 'bg-blue-electric/10 text-white' : 'text-muted'}`}>
                          <link.icon className={`w-4 h-4 ${isActive ? 'text-blue-electric' : 'opacity-40'}`} />
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              <div className="mt-auto flex flex-col gap-6 pt-12 border-t border-white/5">
                {secondaryLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="px-10 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    {link.label}
                  </Link>
                ))}
                <form action={logout}>
                   <button type="submit" className="w-full btn btn-outline-danger py-10 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-8">
                     <LogOut className="w-4 h-4" />
                     Sign Out
                   </button>
                </form>
              </div>
            </nav>
          </aside>
        </>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 lg:pl-52 flex flex-col min-w-0">
        <header className="h-12 md:h-14 border-b border-white/5 bg-[#030508]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4 lg:gap-6">
             {/* Mobile Toggle */}
             <button 
               onClick={() => setIsOpen(true)} 
               className="lg:hidden p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all"
             >
               <Menu className="w-4.5 h-4.5" />
             </button>

             <div className="flex items-center gap-2 px-3 py-0.5 bg-white/5 border border-white/5 rounded-full shrink-0">
                <span 
                  className={`w-1 h-1 rounded-full animate-pulse bg-${status.color}`}
                  style={{ boxShadow: `0 0 4px var(--${status.color})` }}
                />
                <span className={`text-[9px] font-black uppercase tracking-widest leading-none text-${status.color}`}>
                   {status.label}
                </span>
             </div>
             
             <div className="hidden xl:flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
                <span className="text-[9px] font-black text-muted uppercase italic tracking-tighter opacity-40 uppercase">Verified Member Network</span>
             </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <Link href="/dashboard/settings" title="Account" className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-white/15 transition-all cursor-pointer group shrink-0">
               <div className="w-5.5 h-5.5 rounded-full bg-blue-electric/20 flex items-center justify-center font-black text-[9px] text-blue-electric group-hover:bg-blue-electric/40 transition-colors uppercase">
                 {displayInitial}
               </div>
               <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white hidden md:block max-w-[120px] truncate italic">
                 {displayName}
               </span>
            </Link>

            <Link href="/accounts" className="btn btn-blue px-4 py-2 text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-electric/10 border-none shrink-0 min-w-fit">
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
