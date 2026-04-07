'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, User, LogOut, ChevronRight, Menu, X, ArrowUpRight, ArrowRight } from 'lucide-react';
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
                <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                  <path d="M14 2L24 8V20L14 26L4 20V8L14 2Z" fill="var(--gold)" fillOpacity="0.9"/>
                  <path d="M14 8L18 11V17L14 20L10 17V11L14 8Z" fill="#FFF"/>
                </svg>
              </div>
              <span className="font-display text-sm font-black text-white uppercase tracking-tighter italic">
                Pred<span className="text-gold">Chain</span>
              </span>
            </Link>

            <div className={styles.divider} />

            {/* Desktop Links */}
            <ul className="hidden lg:flex items-center gap-1" role="list">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`${styles.navLink} ${pathname === href ? styles.active : ''} !text-[10px] !font-black !uppercase !tracking-[0.25em] !px-4 !py-2 !italic !transition-all !opacity-50 hover:!opacity-100`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className={styles.divider} />

            {/* Actions */}
            <div className="flex items-center gap-1.5 ml-auto md:ml-0">
              {!user ? (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="hidden lg:block text-[9px] font-black text-muted hover:text-white px-4 transition-all uppercase tracking-[0.3em] italic">Sign In</Link>
                  <Link href="/accounts" className="btn btn-primary !py-2.5 !px-5 !text-[11px] !rounded-xl italic font-black shadow-2xl transition-all hover:-translate-y-0.5">
                    JOIN ARENA
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/dashboard" className="btn btn-blue !py-2 !px-5 !text-[10px] !rounded-lg gap-2 italic">
                    DASHBOARD <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className={styles.menuToggle}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
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
             <div className="w-7 h-7 bg-gold/10 rounded-lg flex items-center justify-center text-gold text-xs font-black italic border border-gold/20">P</div>
             <span className="font-display text-sm font-black text-white uppercase italic tracking-tighter">PredChain</span>
          </div>
          <button onClick={() => setMenuOpen(false)} className={styles.closeBtn}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className={styles.mobileMenuInner}>
          <div className="text-[9px] font-black text-muted uppercase tracking-[0.4em] mb-10 opacity-30 italic px-4">ARENA_OPERATIONS</div>
          <ul className="flex flex-col gap-2 mb-12" role="list">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] italic transition-all ${pathname === href ? 'bg-white/5 text-white border border-white/5 shadow-inner' : 'text-muted/40 hover:text-white hover:bg-white/[0.02]'} group`}
                >
                  <span>{label}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gold" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-4 px-2 pb-6 pt-10 border-t border-white/5">
            {!user ? (
              <>
                <Link href="/accounts" onClick={() => setMenuOpen(false)} className="btn btn-primary w-full py-5 !rounded-xl !text-[12px] font-black italic shadow-2xl">
                  GET STARTED
                </Link>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="btn btn-ghost w-full py-5 !rounded-xl !text-[11px] font-black italic border-white/5">
                  OPERATOR SIGN IN
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="btn btn-primary w-full py-5 !rounded-xl !text-[12px] font-black italic shadow-2xl gap-3">
                  MY DASHBOARD <ArrowUpRight className="w-5 h-5" />
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="text-[9px] font-black text-muted/40 hover:text-danger uppercase tracking-[0.4em] py-5 transition-all italic text-center">
                  TERMINATE_PROTOCOL
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
