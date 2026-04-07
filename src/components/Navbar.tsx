'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LogOut, Menu, X, ArrowUpRight, ChevronRight } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { createClient } from '@/lib/supabase/client';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'Guide' },
  { href: '/accounts', label: 'Plans' },
  { href: '/arena', label: 'Arena' },
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

  const closeMenu = useCallback(() => setMenuOpen(false), []);

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
              <span className="font-display text-lg font-black text-white uppercase tracking-tighter italic">
                Pred<span className="text-gradient-gold">Chain</span>
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
            <div className="flex items-center gap-2">
              {!user ? (
                <>
                  <Link href="/login" className="hidden lg:block text-[10px] font-bold text-muted hover:text-white px-3 transition-colors uppercase tracking-widest italic">Sign In</Link>
                  <Link href="/accounts" className="btn btn-primary !py-2 !px-5 !text-[10px] !rounded-lg font-bold shadow-xl">
                    JOIN ARENA
                  </Link>
                </>
              ) : (
                <Link href="/dashboard" className="btn btn-blue !py-2 !px-5 !text-[10px] !rounded-lg gap-2 font-bold shadow-xl">
                  DASHBOARD <ArrowUpRight className="w-3 h-3" />
                </Link>
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
        onClick={closeMenu}
      />

      {/* Mobile Menu Side Panel */}
      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        role="dialog"
      >
        <div className={styles.mobileMenuHeader}>
          <div className="flex items-center gap-2">
             <span className="font-display text-sm font-black text-white uppercase italic tracking-tighter">PredChain</span>
          </div>
          <button onClick={closeMenu} className={styles.closeBtn}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={styles.mobileMenuInner}>
          <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-8 opacity-40 italic px-2">Main Menu</div>
          <ul className="flex flex-col gap-3" role="list">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeMenu}
                  className={`flex items-center justify-between px-4 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${pathname === href ? 'bg-white/5 text-gold' : 'text-muted hover:text-white hover:bg-white/[0.02]'}`}
                >
                  {label}
                  <ChevronRight className="w-4 h-4 opacity-30" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-3">
            {!user ? (
              <>
                <Link href="/accounts" onClick={closeMenu} className="btn btn-primary w-full py-4 text-xs font-bold shadow-xl">
                  GET STARTED
                </Link>
                <Link href="/login" onClick={closeMenu} className="btn btn-ghost w-full py-4 text-xs font-bold">
                  SIGN IN
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" onClick={closeMenu} className="btn btn-blue w-full py-4 text-xs font-bold shadow-xl gap-2">
                  DASHBOARD <ArrowUpRight className="w-4 h-4" />
                </Link>
                <button onClick={() => { logout(); closeMenu(); }} className="text-[10px] font-black text-muted hover:text-danger uppercase tracking-[0.2em] py-4 transition-all italic text-center">
                  SIGN OUT
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
