'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X, ArrowUpRight, ChevronRight, Shield, Globe } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { createClient } from '@/lib/supabase/client';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/how-it-works', label: 'GUIDE' },
  { href: '/accounts', label: 'TIERS' },
  { href: '/arena', label: 'ARENA' },
  { href: '/winners', label: 'WINNERS' },
  { href: '/leaderboard', label: 'RANKINGS' },
  { href: '/referral', label: 'PARTNERS' },
];

const mobileSecondaryLinks = [
  { href: '/faq', label: 'FAQ' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/dashboard') ?? false;
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      subscription.unsubscribe();
    };
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  if (isAuthRoute || isAdminRoute) return null;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${scrolled ? 'h-16' : 'h-20'}`}>
        <div className="container-tight h-full py-2">
          <div className={`h-full flex items-center justify-between px-5 rounded-2xl border transition-all duration-700 ${scrolled ? 'bg-bg-card/80 backdrop-blur-3xl border-white/10 shadow-2xl' : 'bg-transparent border-transparent'}`}>
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gold/5 flex items-center justify-center border border-gold/10 transition-all group-hover:scale-105 group-hover:bg-gold/10 shadow-inner">
                <Shield className="w-4.5 h-4.5 text-gold" />
              </div>
              <span className="font-display text-[13px] font-black text-white tracking-[0.1em] uppercase italic leading-none">
                PRED<span className="text-gold">CHAIN.</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-white hover:scale-105 italic ${pathname === href ? 'text-gold' : 'text-text-muted/60'}`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* CTA's */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-5 mr-1">
                {!user ? (
                  <Link href="/login" className="text-[10px] font-black text-text-dim hover:text-white transition-all uppercase tracking-[0.2em] italic">Login</Link>
                ) : null}
              </div>

              {!user ? (
                <Link href="/accounts" className="btn-luxury btn-gold btn-premium-depth !py-2.5 !px-6 flex items-center gap-2.5 shadow-xl">
                  <span className="text-[10px] font-black tracking-widest italic">START STREAK</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link href="/dashboard" className="btn-luxury btn-outline btn-premium-depth !py-2.5 !px-6 flex items-center gap-2.5 bg-white/[0.02]">
                  <span className="text-[10px] font-black tracking-widest uppercase italic">Dashboard</span>
                  <Globe className="w-3.5 h-3.5 text-gold/60" />
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMenuOpen(true)}
                className="lg:hidden p-2.5 text-text-muted hover:text-white transition-all bg-white/[0.02] border border-white/5 rounded-xl"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[200] lg:hidden transition-all duration-700 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-bg-darker/60 backdrop-blur-sm" onClick={closeMenu} />
        <div className={`absolute right-0 top-0 bottom-0 w-full max-w-[320px] bg-[#07090e] border-l border-white/5 p-8 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? 'translate-x-0 shadow-[-50px_0_100px_rgba(0,0,0,0.5)]' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gold" />
              <span className="font-display text-[13px] font-black uppercase tracking-widest italic text-white">PRED<span className="text-gold">CHAIN.</span></span>
            </div>
            <button onClick={closeMenu} className="p-2.5 bg-white/[0.03] rounded-xl text-text-muted hover:text-white border border-white/10 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar flex-1 pr-2">
            {navLinks.map(({ href, label }) => (
              <Link 
                key={href} 
                href={href} 
                onClick={closeMenu}
                className={`py-4 px-6 rounded-2xl font-display text-sm font-black flex items-center justify-between transition-all italic tracking-tight ${pathname === href ? 'bg-gold/10 text-gold border border-gold/10' : 'text-text-secondary hover:bg-white/[0.03] border border-transparent'}`}
              >
                <span className="uppercase">{label}</span>
                <ChevronRight className={`w-4 h-4 transition-all ${pathname === href ? 'translate-x-0' : '-translate-x-2 opacity-0'}`} />
              </Link>
            ))}
            
            <div className="my-8 h-px bg-white/5 mx-4" />
            
            {mobileSecondaryLinks.map(({ href, label }) => (
              <Link 
                key={href} 
                href={href} 
                onClick={closeMenu}
                className="py-3 px-6 text-[10px] font-black text-text-dim hover:text-white flex items-center justify-between uppercase tracking-widest italic"
              >
                {label}
                <ArrowUpRight className="w-3.5 h-3.5 opacity-20" />
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-4 pt-10 border-t border-white/5">
            {!user ? (
               <Link href="/accounts" onClick={closeMenu} className="btn-luxury btn-gold btn-premium-depth w-full !py-5 text-[11px] uppercase tracking-[0.2em] font-black italic shadow-2xl">
                 Start Your Streak
               </Link>
            ) : (
               <button onClick={() => { logout(); closeMenu(); }} className="btn-luxury btn-outline btn-premium-depth w-full !py-5 text-[11px] uppercase tracking-[0.2em] font-black italic text-rose-500 border-rose-500/20 bg-rose-500/5">
                 Log Out Session
               </button>
            )}
            <p className="text-center text-[8px] font-black text-text-dim/30 uppercase tracking-[0.4em] mt-3 italic">PREDCHAIN ELITE ARENA</p>
          </div>
        </div>
      </div>
    </>
  );
}
