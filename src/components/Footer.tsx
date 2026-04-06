'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Clock, 
  Globe,
  Check,
  Shield,
  Zap,
  ArrowRight,
  Send
} from 'lucide-react';
import styles from './Footer.module.css';

const FooterLogo = () => (
  <div className="flex items-center gap-10 mb-20 group">
    <div className="w-20 h-20 transition-transform group-hover:scale-110 duration-500">
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2L24 8V20L14 26L4 20V8L14 2Z" fill="url(#fLogoGrad)" stroke="url(#fLogoStroke)" strokeWidth="0.5"/>
        <path d="M14 7L19 10.5V17.5L14 21L9 17.5V10.5L14 7Z" fill="rgba(3,5,8,0.8)"/>
        <path d="M14 9.5L17 11.5V16L14 18L11 16V11.5L14 9.5Z" fill="url(#fLogoGrad2)"/>
        <defs>
          <linearGradient id="fLogoGrad" x1="4" y1="2" x2="24" y2="26">
            <stop stopColor="#F2C94C"/><stop offset="1" stopColor="#00E5FF"/>
          </linearGradient>
          <linearGradient id="fLogoStroke" x1="4" y1="2" x2="24" y2="26">
            <stop stopColor="#F2C94C" stopOpacity="0.6"/><stop offset="1" stopColor="#00E5FF" stopOpacity="0.6"/>
          </linearGradient>
          <linearGradient id="fLogoGrad2" x1="11" y1="9.5" x2="17" y2="18">
            <stop stopColor="#F2C94C"/><stop offset="1" stopColor="#FDE68A"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
    <span className="font-display text-base font-black text-white uppercase tracking-tight">Pred<span className="text-gold italic">Chain</span></span>
  </div>
);

export default function Footer() {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/dashboard') ?? false;
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  if (isAuthRoute || isAdminRoute) return null;

  return (
    <footer className={`${styles.footer} bg-[#070B14] border-t border-white/5 relative pt-48 md:pt-64 pb-24`} role="contentinfo">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-grad-gold opacity-10" />
      <div className="container">
        <div className="grid grid-1 md:grid-12 gap-48 mb-64">
          {/* Brand */}
          <div className="md:col-span-4 lg:col-span-5 flex flex-col items-start gap-24">
            <FooterLogo />
            <p className="text-[11px] font-medium text-muted/60 leading-relaxed uppercase tracking-widest max-w-400 italic">
              PredChain provides a premium, secure, and transparent 3-day football prediction experience with instant rewards for all members.
            </p>
            <div className="flex gap-16">
              <a href="#" className="p-10 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all text-muted hover:text-white shadow-lg" aria-label="Twitter">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="p-10 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all text-muted hover:text-white shadow-lg" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="p-10 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all text-muted hover:text-white shadow-lg" aria-label="Telegram">
                <Send className="w-14 h-14" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-8 lg:col-span-7 grid grid-2 md:grid-3 gap-32 md:gap-48">
             <div className="flex flex-col gap-20">
               <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-8"><Globe className="w-12 h-12 text-blue-electric" /> NETWORK</h3>
               <ul className="flex flex-col gap-12">
                 {[
                   { h: '/how-it-works', l: 'Protocol' },
                   { h: '/accounts', l: 'Tier System' },
                   { h: '/live-challenges', l: 'Active Arena' },
                   { h: '/leaderboard', l: 'Leaderboard' },
                   { h: '/winners', l: 'Winner Ledger' }
                 ].map(link => (
                   <li key={link.h}><Link href={link.h} className="text-[10px] font-black text-muted/40 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-6 group"><ArrowRight className="w-10 h-10 -ml-16 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all" /> {link.l}</Link></li>
                 ))}
               </ul>
             </div>

             <div className="flex flex-col gap-20">
               <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-8"><Zap className="w-12 h-12 text-gold" /> OPERATIONS</h3>
               <ul className="flex flex-col gap-12">
                 {[
                   { h: '/dashboard', l: 'Command Center' },
                   { h: '/dashboard', l: 'Treasury' },
                   { h: '/referral', l: 'Network Growth' },
                   { h: '/dashboard', l: 'Profile Node' },
                   { h: '/login', l: 'Authorization' }
                 ].map(link => (
                   <li key={link.l}><Link href={link.h} className="text-[10px] font-black text-muted/40 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-6 group"><ArrowRight className="w-10 h-10 -ml-16 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all" /> {link.l}</Link></li>
                 ))}
               </ul>
             </div>

             <div className="flex flex-col gap-20">
               <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-8"><Shield className="w-12 h-12 text-muted" /> GOVERNANCE</h3>
               <ul className="flex flex-col gap-12">
                 {[
                   { h: '/faq', l: 'Documentation' },
                   { h: '/contact', l: 'Support Channel' },
                   { h: '/rules', l: 'Challenge Rules' },
                   { h: '/terms', l: 'Legal Framework' },
                   { h: '/privacy', l: 'Data Encryption' }
                 ].map(link => (
                   <li key={link.l}><Link href={link.h} className="text-[10px] font-black text-muted/40 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-6 group"><ArrowRight className="w-10 h-10 -ml-16 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all" /> {link.l}</Link></li>
                 ))}
               </ul>
             </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-2 md:grid-4 gap-12 p-20 md:p-16 bg-white/[0.02] border border-white/5 rounded-2xl mb-48 shadow-2xl">
          {[
            { icon: <ShieldCheck className="w-14 h-14" />, label: 'Verified Security' },
            { icon: <CheckCircle2 className="w-14 h-14" />, label: 'Instant Settlement' },
            { icon: <Lock className="w-14 h-14" />, label: 'Secure Encryption' },
            { icon: <Clock className="w-14 h-14" />, label: 'Live Data Feeds' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-center gap-10 py-10 border-r border-white/5 last:border-none group">
              <div className="text-blue-electric/40 group-hover:text-blue-electric transition-colors">{item.icon}</div>
              <span className="text-[9px] font-black text-muted/60 uppercase tracking-[0.2em]">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Operational Status */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-24 pt-24 border-t border-white/5">
          <p className="text-[9px] font-black text-muted/30 uppercase tracking-[0.3em] flex items-center gap-8 italic">
            <Check className="w-10 h-10 text-success" /> System Operational
          </p>
          <p className="text-[9px] font-black text-muted/30 uppercase tracking-[0.2em]">
            © 2026 PREDCHAIN. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-20">
            <Link href="/terms" className="text-[9px] font-black text-muted/30 hover:text-blue-electric uppercase tracking-widest transition-colors">TERMS</Link>
            <Link href="/privacy" className="text-[9px] font-black text-muted/30 hover:text-blue-electric uppercase tracking-widest transition-colors">PRIVACY</Link>
            <Link href="/rules" className="text-[9px] font-black text-muted/30 hover:text-blue-electric uppercase tracking-widest transition-colors">RULES</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
