'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, User, LogOut, ChevronRight, Menu, X, ArrowUpRight } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { createClient } from '@/lib/supabase/client';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'Guide' },
  { href: '/accounts', label: 'Plans' },
  { href: '/live-challenges', label: 'Arena' },
  { href: '/leaderboard', label: 'Rankings' },
  { href: '/winners', label: 'Winners' },
  { href: '/referral', label: 'Referral' },
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
        <div className={styles.navContainer}>
          <div className={`${styles.navPill} glass-pill`}>
            {/* Logo */}
            <Link href="/" className={styles.logo} aria-label="PredChain Home">
              <div className={styles.logoMark}>
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                  <path d="M14 2L24 8V20L14 26L4 20V8L14 2Z" fill="var(--gold)" fillOpacity="0.8"/>
                  <path d="M14 8L18 11V17L14 20L10 17V11L14 8Z" fill="#FFF"/>
                </svg>
              </div>
              <span className="font-display text-sm font-bold text-white uppercase tracking-tight">
                Pred<span className="text-gold">Chain</span>
              </span>
            </Link>

            <div className={styles.divider} />

            {/* Desktop Links */}
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

            <div className={styles.divider} />

            {/* Actions */}
            <div className={styles.navActions}>
              {!user ? (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="text-2xs font-bold text-secondary hover:text-white px-2">Sign In</Link>
                  <Link href="/accounts" className="btn btn-primary btn-sm rounded-full">
                    Join Node
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/dashboard" className="btn btn-blue btn-sm rounded-full gap-2">
                    Console <ArrowUpRight className="w-3 h-3" />
                  </Link>
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-gold">
                    {user.user_metadata?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className={styles.menuToggle}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
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
        <div className={styles.mobileMenuHeader}>
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-gold/10 rounded flex items-center justify-center text-gold text-xs font-bold italic">P</div>
             <span className="font-display text-sm font-bold text-white uppercase italic">PredChain</span>
          </div>
          <button onClick={() => setMenuOpen(false)} className={styles.closeBtn}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={styles.mobileMenuInner}>
          <div className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4 opacity-40">Navigation</div>
          <ul className={styles.mobileNavLinks} role="list">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`${styles.mobileNavLink} ${pathname === href ? styles.active : ''}`}
                >
                  <span className="text-[14px]">{label}</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-all -translate-x-2 group-hover:translate-x-0" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-white/5">
            {!user ? (
              <>
                <Link href="/accounts" onClick={() => setMenuOpen(false)} className="btn btn-primary w-full py-3 font-bold uppercase tracking-widest text-xs">
                  Get Started
                </Link>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="btn btn-ghost w-full py-3 font-bold uppercase tracking-widest text-xs">
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="btn btn-primary w-full py-3 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                  Console <ArrowUpRight className="w-4 h-4" />
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="text-[10px] font-bold text-muted uppercase tracking-widest py-2 hover:text-white transition-colors">
                  Terminate Session
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
