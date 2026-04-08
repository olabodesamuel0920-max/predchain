'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LogOut, Menu, X, ArrowUpRight, ChevronRight, Shield } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { createClient } from '@/lib/supabase/client';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How it Works' },
  { href: '/accounts', label: 'Tiers' },
  { href: '/arena', label: 'Arena' },
  { href: '/winners', label: 'Winners' },
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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  if (isAuthRoute || isAdminRoute) return null;

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} role="navigation">
        <div className="container">
          <div className="flex justify-center">
            <div className="glass-nav rounded-full px-5 py-2 flex items-center gap-12 md:gap-20 relative shadow-2xl">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-8 group" aria-label="PredChain Home">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/20 group-hover:scale-105 transition-transform">
                  <Shield className="w-4 h-4 text-gold" />
                </div>
                <span className="font-display text-base font-bold text-white tracking-tighter italic">
                  PRED<span className="text-gold">CHAIN</span>
                </span>
              </Link>

              {/* Desktop Links */}
              <ul className="hidden lg:flex items-center gap-12" role="list">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`text-[10px] font-bold uppercase tracking-widest italic transition-colors ${pathname === href ? 'text-gold' : 'text-muted hover:text-white'}`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Actions */}
              <div className="flex items-center gap-12">
                {!user ? (
                  <>
                    <Link href="/login" className="hidden lg:block text-[10px] font-bold text-muted hover:text-white transition-colors uppercase tracking-widest italic">Sign In</Link>
                    <Link href="/accounts" className="btn btn-primary !py-2 !px-6 !text-[10px] !rounded-full shadow-lg">
                      JOIN ARENA
                    </Link>
                  </>
                ) : (
                  <Link href="/dashboard" className="btn btn-secondary !py-2 !px-6 !text-[10px] !rounded-full gap-8">
                    COMMAND CENTER <ArrowUpRight className="w-3 h-3" />
                  </Link>
                )}

                {/* Mobile Toggle */}
                <button
                  className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`${styles.mobileMenuOverlay} ${menuOpen ? styles.active : ''}`}
        onClick={closeMenu}
      />

      {/* Mobile Menu Side Panel */}
      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        role="dialog"
      >
        <div className="p-8 flex justify-between items-center border-b border-white/5 bg-bg-secondary">
          <div className="flex items-center gap-2">
             <span className="font-display text-xs font-bold text-white uppercase italic tracking-tighter">PRED<span className="text-gold">CHAIN</span></span>
          </div>
          <button onClick={closeMenu} className="p-2 text-muted hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col p-8 overflow-y-auto bg-grad-dark">
          <nav className="flex flex-col gap-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={`flex items-center justify-between px-6 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${pathname === href ? 'bg-gold/10 text-gold border border-gold/10' : 'text-muted hover:text-white hover:bg-white/[0.03] border border-transparent'}`}
              >
                {label}
                <ChevronRight className="w-4 h-4 opacity-20" />
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-10 flex flex-col gap-4">
            {!user ? (
              <>
                <Link href="/accounts" onClick={closeMenu} className="btn btn-primary w-full py-5 text-xs font-bold">
                  GET STARTED
                </Link>
                <Link href="/login" onClick={closeMenu} className="btn btn-secondary w-full py-5 text-xs font-bold border-white/10">
                  SIGN IN
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" onClick={closeMenu} className="btn btn-primary w-full py-5 text-xs font-bold gap-3">
                  ACCESS DASHBOARD <ArrowUpRight className="w-4 h-4" />
                </Link>
                <button onClick={() => { logout(); closeMenu(); }} className="text-[10px] font-bold text-muted hover:text-rose-500 uppercase tracking-widest py-6 transition-all italic text-center">
                  DISCONNECT SESSION
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
