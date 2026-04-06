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
  <div className="flex items-center gap-2 mb-6 group">
    <div className="w-6 h-6 transition-transform group-hover:scale-110 duration-500">
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
    <span className="font-display text-base font-bold text-white uppercase tracking-tight">Pred<span className="text-gold italic">Chain</span></span>
  </div>
);

export default function Footer() {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/dashboard') ?? false;
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  if (isAuthRoute || isAdminRoute) return null;

  return (
    <footer className="bg-primary border-t border-white/5 relative pt-16 md:pt-24 pb-12 overflow-hidden" role="contentinfo">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-grad-gold opacity-10" />
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          {/* Brand */}
          <div className="md:col-span-4 flex flex-col items-start">
            <FooterLogo />
            <p className="text-[10px] font-medium text-secondary leading-relaxed uppercase tracking-wide max-w-[280px] italic opacity-30">
              PredChain provides a professional, secure, and transparent 3-day 
              prediction protocol with automated financial settlement.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { label: 'X', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                { label: 'Telegram', icon: <Send className="w-3 h-3" /> }
              ].map((social, i) => (
                <a key={i} href="#" className="p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all text-muted hover:text-white" aria-label={social.label}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
             {[
               { 
                 title: 'PROTOCOL', icon: <Globe className="w-3 h-3 text-blue-electric/40" />, 
                 links: [
                   { h: '/how-it-works', l: 'How it Works' },
                   { h: '/accounts', l: 'Account Plans' },
                   { h: '/live-challenges', l: 'Live Grid' },
                   { h: '/leaderboard', l: 'Leaderboard' },
                 ] 
               },
               { 
                 title: 'MEMBERSHIP', icon: <Zap className="w-3 h-3 text-gold/40" />, 
                 links: [
                   { h: '/dashboard', l: 'Dashboard' },
                   { h: '/dashboard?tab=wallet', l: 'Wallet Hub' },
                   { h: '/referral', l: 'Network' },
                   { h: '/login', l: 'Authentication' },
                 ] 
               },
               { 
                 title: 'RESOURCES', icon: <Shield className="w-3 h-3 text-muted/40" />, 
                 links: [
                   { h: '/faq', l: 'Knowledge' },
                   { h: '/rules', l: 'Guidelines' },
                   { h: '/terms', l: 'Legal' },
                   { h: '/privacy', l: 'Privacy' }
                 ] 
               }
             ].map((group, i) => (
               <div key={i} className="flex flex-col gap-4">
                  <h3 className="text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-2">{group.icon} {group.title}</h3>
                  <ul className="flex flex-col gap-2">
                    {group.links.map(link => (
                      <li key={link.l}>
                        <Link href={link.h} className="text-[9px] font-bold text-muted/30 hover:text-white uppercase tracking-wide transition-colors flex items-center gap-2 group">
                          <ArrowRight className="w-2 h-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /> 
                          {link.l}
                        </Link>
                      </li>
                    ))}
                  </ul>
               </div>
             ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
          <div className="flex items-center gap-6">
            <div className="text-[8px] font-bold text-muted uppercase tracking-widest flex items-center gap-1.5 italic">
              <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" /> Protocol Online
            </div>
            <p className="text-[8px] font-bold text-muted uppercase tracking-widest">
              © 2026 PREDCHAIN.
            </p>
          </div>
          <div className="flex gap-6">
            {['TERMS', 'PRIVACY', 'RULES'].map(link => (
              <Link key={link} href={`/${link.toLowerCase()}`} className="text-[8px] font-bold text-muted hover:text-white uppercase tracking-widest transition-colors">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
