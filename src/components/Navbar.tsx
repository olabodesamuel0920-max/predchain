'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, User, LogOut, ChevronRight, Menu, X, ArrowUpRight } from 'lucide-react';
import { logout } from '@/app/actions/auth';
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
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/dashboard') ?? false;
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  if (isAuthRoute || isAdminRoute) return null;

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} backdrop-blur-3xl border-b border-white/5`} role="navigation">
        <div className={`container ${styles.inner} py-8`}>
          {/* Logo */}
          <Link href="/" className={`${styles.logo} flex items-center gap-12 group`} aria-label="PredChain Home">
            <div className={`${styles.logoMark} transition-transform group-hover:scale-110 duration-500`}>
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2L24 8V20L14 26L4 20V8L14 2Z" fill="url(#logoGrad)" stroke="url(#logoStroke)" strokeWidth="0.5"/>
                <path d="M14 7L19 10.5V17.5L14 21L9 17.5V10.5L14 7Z" fill="rgba(3,5,8,0.8)"/>
                <path d="M14 9.5L17 11.5V16L14 18L11 16V11.5L14 9.5Z" fill="url(#logoGrad2)"/>
                <defs>
                  <linearGradient id="logoGrad" x1="4" y1="2" x2="24" y2="26">
                    <stop stopColor="#F2C94C"/>
                    <stop offset="1" stopColor="#00E5FF"/>
                  </linearGradient>
                  <linearGradient id="logoStroke" x1="4" y1="2" x2="24" y2="26">
                    <stop stopColor="#F2C94C" stopOpacity="0.6"/>
                    <stop offset="1" stopColor="#00E5FF" stopOpacity="0.6"/>
                  </linearGradient>
                  <linearGradient id="logoGrad2" x1="11" y1="9.5" x2="17" y2="18">
                    <stop stopColor="#F2C94C"/>
                    <stop offset="1" stopColor="#FDE68A"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="font-display text-lg font-black tracking-tight text-white uppercase">Pred<span className="text-grad-gold italic">Chain</span></span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8 bg-white/[0.02] border border-white/5 rounded-full px-6 py-2" role="list">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`px-10 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.15em] transition-all hover:text-white ${
                    pathname === href ? 'bg-white/10 text-white shadow-sm' : 'text-muted/60'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-16">
            {isAdminRoute ? (
              <div className="px-12 py-6 rounded-lg bg-gold/10 border border-gold/20 flex items-center gap-8">
                <Shield className="w-12 h-12 text-gold" />
                <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Sentinel Protocol</span>
              </div>
            ) : !isAuthRoute ? (
              <div className="flex items-center gap-8">
                <Link href="/login" className="px-16 py-8 text-[10px] font-black text-muted hover:text-white uppercase tracking-widest transition-colors">Sign In</Link>
                <Link href="/accounts" className="btn btn-blue px-16 py-8 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-electric/20 flex items-center gap-6">
                   Get Account <ArrowUpRight className="w-10 h-10" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-12 group cursor-pointer">
                <Link href="/accounts" className="px-12 py-4 rounded-lg border border-white/5 text-[9px] font-black text-muted uppercase tracking-widest hover:border-white/20 transition-all">Upgrade Tier</Link>
                <div className="w-32 h-32 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-gold shadow-lg group-hover:border-gold/30 transition-all">
                  S
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-8 text-muted hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-20 h-20" /> : <Menu className="w-20 h-20" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''} backdrop-blur-3xl bg-primary/95 border-l border-white/5`}
        role="dialog"
      >
        <div className="p-32 flex flex-col h-full">
           <div className="flex items-center justify-between mb-48">
              <span className="font-display text-lg font-black tracking-tight text-white uppercase italic">PredChain</span>
              <button onClick={() => setMenuOpen(false)} className="p-8 bg-white/5 rounded-full text-muted"><X className="w-16 h-16" /></button>
           </div>
           
           <ul className="flex flex-col gap-24 mb-64" role="list">
            {navLinks.map(({ href, label }, i) => (
              <li key={href} style={{ transitionDelay: `${i * 50}ms` }} className={`transform transition-all ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-32 opacity-0'}`}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-xl font-black uppercase tracking-[0.2em] transition-all ${
                    pathname === href ? 'text-blue-electric italic' : 'text-muted/60 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-12">
            {isAdminRoute ? (
              <Link href="/" onClick={() => setMenuOpen(false)} className="btn btn-outline-gold w-full text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-8">
                 Exit Sentinel <LogOut className="w-14 h-14" />
              </Link>
            ) : !isAuthRoute ? (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="px-24 py-16 text-center text-[11px] font-black text-muted uppercase tracking-widest">Sign In</Link>
                <Link href="/accounts" onClick={() => setMenuOpen(false)} className="btn btn-blue w-full py-16 text-[11px] font-black uppercase tracking-widest shadow-xl">Join Network</Link>
              </>
            ) : (
              <>
                <Link href="/accounts" onClick={() => setMenuOpen(false)} className="px-24 py-16 text-center text-[11px] font-black text-muted uppercase tracking-widest">Upgrade Tier</Link>
                <button onClick={() => logout()} className="btn btn-primary w-full py-16 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-8">
                   Sign Out <LogOut className="w-14 h-14" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
