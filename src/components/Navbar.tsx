'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X, ArrowUpRight, ChevronRight, Shield, Globe } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { createClient } from '@/lib/supabase/client';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/accounts', label: 'Tiers' },
  { href: '/arena', label: 'Arena' },
  { href: '/winners', label: 'Winners' },
  { href: '/leaderboard', label: 'Rankings' },
];

const mobileSecondaryLinks = [
  { href: '/how-it-works', label: 'Guide' },
  { href: '/referral', label: 'Affiliates' },
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
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'h-16 py-2' : 'h-20 py-4'}`}>
        <div className="container-tight h-full">
          <div className={`h-full flex items-center justify-between px-6 rounded-2xl border transition-all duration-500 ${scrolled ? 'bg-bg-card/80 backdrop-blur-3xl border-border-main shadow-md' : 'bg-transparent border-transparent'}`}>
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/20 transition-all group-hover:bg-gold/20">
                <Shield className="w-4 h-4 text-gold" />
              </div>
              <span className="font-display text-sm font-bold text-white tracking-widest uppercase italic">
                PRED<span className="text-gold">CHAIN</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-9">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-white ${pathname === href ? 'text-gold' : 'text-text-muted'}`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* CTA's */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-6 mr-2">
                {!user ? (
                  <Link href="/login" className="text-[10px] font-bold text-text-muted hover:text-white transition-all uppercase tracking-widest">Login</Link>
                ) : null}
              </div>

              {!user ? (
                <Link href="/accounts" className="btn-luxury btn-gold !py-2.5 !px-5 flex items-center gap-2 shadow-sm">
                  <span className="text-[10px] pb-px">MEMBERSHIP</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link href="/dashboard" className="btn-luxury btn-outline !py-2.5 !px-5 flex items-center gap-2">
                  <span className="text-[10px] pb-px">COMMAND</span>
                  <Globe className="w-3.5 h-3.5 text-gold" />
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMenuOpen(true)}
                className="lg:hidden p-2 text-text-muted hover:text-white transition-all"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-bg-darker/95 backdrop-blur-xl" onClick={closeMenu} />
        <div className={`absolute right-0 top-0 bottom-0 w-full max-w-sm bg-bg-card border-l border-border-main p-8 flex flex-col transition-all duration-500 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold" />
              <span className="font-display text-sm font-bold uppercase tracking-widest italic">PRED<span className="text-gold">CHAIN</span></span>
            </div>
            <button onClick={closeMenu} className="p-2 bg-white/5 rounded-full text-text-muted hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link 
                key={href} 
                href={href} 
                onClick={closeMenu}
                className={`py-4 px-6 rounded-xl font-display text-lg font-bold flex items-center justify-between transition-all ${pathname === href ? 'bg-gold/10 text-gold' : 'text-text-secondary hover:bg-white/5'}`}
              >
                {label}
                <ChevronRight className={`w-5 h-5 transition-all ${pathname === href ? 'opacity-100' : 'opacity-20'}`} />
              </Link>
            ))}
            
            <div className="my-6 border-t border-border-subtle" />
            
            {mobileSecondaryLinks.map(({ href, label }) => (
              <Link 
                key={href} 
                href={href} 
                onClick={closeMenu}
                className="py-3 px-6 text-sm font-semibold text-text-muted hover:text-white flex items-center justify-between"
              >
                {label}
                <ArrowUpRight className="w-4 h-4 opacity-20" />
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-4 pt-10">
            {!user ? (
               <Link href="/accounts" onClick={closeMenu} className="btn-luxury btn-gold w-full py-5 text-sm uppercase tracking-widest font-bold">
                 Initialize Arena Access
               </Link>
            ) : (
               <button onClick={() => { logout(); closeMenu(); }} className="btn-luxury btn-outline w-full py-5 text-sm uppercase tracking-widest font-bold text-rose-500 border-rose-500/20">
                 Terminate Session
               </button>
            )}
            <p className="text-center text-[9px] font-bold text-text-dim uppercase tracking-[0.3em] mt-2">v2.0 Elite Production Node</p>
          </div>
        </div>
      </div>
    </>
  );
}
