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
    <footer className={`${styles.footer} bg-[#070B14] border-t border-white/5 relative pt-40 md:pt-48 pb-20`} role="contentinfo">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-grad-gold opacity-10" />
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-24 mb-32">
          {/* Brand */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col items-start gap-4">
            <FooterLogo />
            <p className="text-[10px] font-medium text-muted/40 leading-relaxed uppercase tracking-widest max-w-[320px] italic">
              PredChain provides a professional, secure, and transparent 3-day football 
              prediction challenge with secure payouts for all members.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="p-2 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all text-muted hover:text-white" aria-label="Twitter">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all text-muted hover:text-white" aria-label="Telegram">
                <Send className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-8 lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
             <div className="flex flex-col gap-5">
                <h3 className="text-[9px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2"><Globe className="w-3 h-3 text-blue-electric opacity-50" /> NETWORK</h3>
                <ul className="flex flex-col gap-2.5">
                  {[
                    { h: '/how-it-works', l: 'How it Works' },
                    { h: '/accounts', l: 'Account Plans' },
                    { h: '/live-challenges', l: 'Challenges' },
                    { h: '/leaderboard', l: 'Leaderboard' },
                    { h: '/winners', l: 'Winners' }
                  ].map(link => (
                    <li key={link.h}><Link href={link.h} className="text-[9px] font-black text-muted/30 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2 group"><ArrowRight className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-all" /> {link.l}</Link></li>
                  ))}
                </ul>
             </div>

             <div className="flex flex-col gap-5">
                <h3 className="text-[9px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2"><Zap className="w-3 h-3 text-gold opacity-50" /> ACCOUNT</h3>
                <ul className="flex flex-col gap-2.5">
                  {[
                    { h: '/dashboard', l: 'Dashboard' },
                    { h: '/dashboard?tab=wallet', l: 'Wallet' },
                    { h: '/referral', l: 'Referrals' },
                    { h: '/dashboard/settings', l: 'Settings' },
                    { h: '/login', l: 'Login' }
                  ].map(link => (
                    <li key={link.l}><Link href={link.h} className="text-[9px] font-black text-muted/30 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2 group"><ArrowRight className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-all" /> {link.l}</Link></li>
                  ))}
                </ul>
             </div>

             <div className="flex flex-col gap-5">
                <h3 className="text-[9px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2"><Shield className="w-3 h-3 text-muted" /> SUPPORT</h3>
                <ul className="flex flex-col gap-2.5">
                  {[
                    { h: '/faq', l: 'FAQ' },
                    { h: '/rules', l: 'Rules' },
                    { h: '/terms', l: 'Terms' },
                    { h: '/privacy', l: 'Privacy' }
                  ].map(link => (
                    <li key={link.l}><Link href={link.h} className="text-[9px] font-black text-muted/30 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2 group"><ArrowRight className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-all" /> {link.l}</Link></li>
                  ))}
                </ul>
             </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-white/[0.01] border border-white/5 rounded-xl mb-10">
          {[
            { icon: <ShieldCheck className="w-3 h-3" />, label: 'Verified' },
            { icon: <CheckCircle2 className="w-3 h-3" />, label: 'Payouts' },
            { icon: <Lock className="w-3 h-3" />, label: 'Encryption' },
            { icon: <Clock className="w-3 h-3" />, label: 'Live Data' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-center gap-2.5 py-1.5 border-r border-white/5 last:border-none group">
              <div className="text-blue-electric/30 group-hover:text-blue-electric transition-colors">{item.icon}</div>
              <span className="text-[7px] font-black text-muted/30 uppercase tracking-[0.2em]">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Final Status */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
          <p className="text-[7px] font-black text-muted/15 uppercase tracking-[0.2em] flex items-center gap-2 italic">
            <Check className="w-2 h-2 text-success" /> System Active
          </p>
          <p className="text-[7px] font-black text-muted/15 uppercase tracking-[0.1em]">
            © 2026 PREDCHAIN.
          </p>
          <div className="flex gap-8">
            <Link href="/terms" className="text-[7px] font-black text-muted/15 hover:text-blue-electric uppercase tracking-widest transition-colors">TERMS</Link>
            <Link href="/privacy" className="text-[7px] font-black text-muted/15 hover:text-blue-electric uppercase tracking-widest transition-colors">PRIVACY</Link>
            <Link href="/rules" className="text-[7px] font-black text-muted/15 hover:text-blue-electric uppercase tracking-widest transition-colors">RULES</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
