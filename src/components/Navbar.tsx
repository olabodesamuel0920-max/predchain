'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, User, LogOut, ChevronRight, Menu, X, ArrowUpRight } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { createClient } from '@/lib/supabase/client';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/how-it-works', label: 'WORKFLOW' },
  { href: '/accounts', label: 'ACCOUNTS' },
  { href: '/live-challenges', label: 'ARENA' },
  { href: '/leaderboard', label: 'RANKINGS' },
  { href: '/winners', label: 'VERIFIED' },
  { href: '/referral', label: 'NETWORK' },
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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  if (isAuthRoute || isAdminRoute) return null;

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} role="navigation">
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="PredChain Home">
            <div className={styles.logoMark}>
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2L24 8V20L14 26L4 20V8L14 2Z" fill="url(#logoGrad)" stroke="url(#logoStroke)" strokeWidth="0.5"/>
                <path d="M14 7L19 10.5V17.5L14 21L9 17.5V10.5L14 7Z" fill="rgba(3,5,8,0.8)"/>
                <path d="M14 9.5L17 11.5V16L14 18L11 16V11.5L14 9.5Z" fill="url(#logoGrad2)"/>
                <defs>
                  <linearGradient id="logoGrad" x1="4" y1="2" x2="24" y2="26">
                    <stop stopColor="#D4AF37"/>
                    <stop offset="1" stopColor="#00D2FF"/>
                  </linearGradient>
                  <linearGradient id="logoStroke" x1="4" y1="2" x2="24" y2="26">
                    <stop stopColor="#D4AF37" stopOpacity="0.4"/>
                    <stop offset="1" stopColor="#00D2FF" stopOpacity="0.4"/>
                  </linearGradient>
                  <linearGradient id="logoGrad2" x1="11" y1="9.5" x2="17" y2="18">
                    <stop stopColor="#D4AF37"/>
                    <stop offset="1" stopColor="#F4E4BC"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="font-display text-base font-extrabold tracking-tight text-white uppercase">Pred<span className="text-gold italic">Chain</span></span>
          </Link>

          {/* Desktop Nav - Compact Pill */}
          <ul className={styles.navLinks} role="list">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.navLink} ${pathname === href ? styles.active : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-12">
            {!user ? (
              <>
                <Link href="/login" className="px-12 py-6 text-2xs font-bold text-secondary hover:text-white uppercase tracking-wider transition-colors">Sign In</Link>
                <Link href="/accounts" className="btn btn-blue btn-sm font-bold uppercase tracking-wide">
                   Get Account
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-8">
                <Link href="/dashboard" className="btn btn-blue btn-sm font-bold uppercase tracking-wide flex items-center gap-4">
                   Dashboard <ChevronRight className="w-12 h-12" />
                </Link>
                <div className="w-28 h-28 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gold uppercase">
                  {user.user_metadata?.username?.charAt(0) || 'U'}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-20 h-20" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`${styles.mobileMenuOverlay} ${menuOpen ? styles.active : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Menu Side Panel */}
      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        role="dialog"
      >
        <div className={styles.mobileMenuInner}>
          <div className="flex items-center justify-between mb-24">
            <span className="font-display text-base font-extrabold text-white uppercase italic">PredChain</span>
            <button onClick={() => setMenuOpen(false)} className="p-4 text-secondary hover:text-white transition-colors">
              <X className="w-18 h-18" />
            </button>
          </div>
          
          <ul className={styles.mobileNavLinks} role="list">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`${styles.mobileNavLink} ${pathname === href ? styles.active : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-8 pt-24 border-t border-white/5">
            {!user ? (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="py-10 text-center text-xs font-bold text-secondary uppercase tracking-wider">Sign In</Link>
                <Link href="/accounts" onClick={() => setMenuOpen(false)} className="btn btn-blue w-full py-12 font-bold uppercase tracking-wide">Join Network</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="btn btn-blue w-full py-12 font-bold uppercase tracking-wide flex items-center justify-center gap-6">
                   Open Dashboard <ChevronRight className="w-14 h-14" />
                </Link>
                <form action={logout}>
                   <button type="submit" onClick={() => setMenuOpen(false)} className="w-full py-10 text-xs font-bold text-muted hover:text-white uppercase tracking-wider flex items-center justify-center gap-6">
                     Sign Out <LogOut className="w-14 h-14" />
                   </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
