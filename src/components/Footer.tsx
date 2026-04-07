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
  Send,
  Activity
} from 'lucide-react';
import styles from './Footer.module.css';

const FooterLogo = () => (
  <div className="flex items-center gap-3 mb-10 group">
    <div className="w-8 h-8 transition-transform group-hover:scale-110 duration-700">
      <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2L24 8V20L14 26L4 20V8L14 2Z" fill="url(#fLogoGrad)" stroke="url(#fLogoStroke)" strokeWidth="0.5"/>
        <path d="M14 7L19 10.5V17.5L14 21L9 17.5V10.5L14 7Z" fill="rgba(3,5,8,0.8)"/>
        <path d="M14 9.5L17 11.5V16L14 18L11 16V11.5L14 9.5Z" fill="url(#fLogoGrad2)"/>
        <defs>
          <linearGradient id="fLogoGrad" x1="4" y1="2" x2="24" y2="26">
            <stop stopColor="#C5A059"/><stop offset="1" stopColor="#38BDF8"/>
          </linearGradient>
          <linearGradient id="fLogoStroke" x1="4" y1="2" x2="24" y2="26">
            <stop stopColor="#C5A059" stopOpacity="0.6"/><stop offset="1" stopColor="#38BDF8" stopOpacity="0.6"/>
          </linearGradient>
          <linearGradient id="fLogoGrad2" x1="11" y1="9.5" x2="17" y2="18">
            <stop stopColor="#C5A059"/><stop offset="1" stopColor="#FDE68A"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
    <span className="font-display text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic">Pred<span className="text-gradient-gold">Chain</span></span>
  </div>
);

export default function Footer() {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/dashboard') ?? false;
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  if (isAuthRoute || isAdminRoute) return null;

  return (
    <footer className="bg-[#020406] pt-20 pb-10 relative overflow-hidden border-t border-white/5" role="contentinfo">
      {/* Background Ambience */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gold/5 blur-[100px] pointer-events-none" />
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand & Mission */}
          <div className="md:col-span-5 flex flex-col items-start">
            <FooterLogo />
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] leading-relaxed max-w-[300px] opacity-40 italic">
               The ultimate arena for elite football predictions. Build your sequence, maintain integrity, and claim high-value rewards.
            </p>
            <div className="flex gap-3 mt-8">
               <a href="#" className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-muted hover:text-white hover:border-white/20 transition-all shadow-inner group">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
               </a>
               <a href="#" className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-muted hover:text-white hover:border-white/20 transition-all shadow-inner group">
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
               </a>
            </div>
          </div>

          {/* Sitemaps */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
             {[
               { 
                 title: 'ARENA', icon: <Globe className="w-3 h-3" />, 
                 links: [
                   { h: '/how-it-works', l: 'Guide' },
                   { h: '/accounts', l: 'Plans' },
                   { h: '/live-challenges', l: 'Arena' },
                   { h: '/leaderboard', l: 'Rankings' },
                 ] 
               },
               { 
                 title: 'ACCOUNT', icon: <Activity className="w-3 h-3" />, 
                 links: [
                   { h: '/dashboard', l: 'Dashboard' },
                   { h: '/dashboard?tab=wallet', l: 'Wallet' },
                   { h: '/referral', l: 'Referrals' },
                   { h: '/winners', l: 'Winners' },
                 ] 
               },
               { 
                 title: 'SUPPORT', icon: <ShieldCheck className="w-3 h-3" />, 
                 links: [
                   { h: '/faq', l: 'Support' },
                   { h: '/terms', l: 'Terms' },
                   { h: '/privacy', l: 'Privacy' },
                   { h: '/rules', l: 'Rules' }
                 ] 
               }
             ].map((group, i) => (
                <div key={i} className="flex flex-col gap-6">
                   <h3 className="text-[9px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-2 italic opacity-40">
                      {group.icon} {group.title}
                   </h3>
                   <ul className="flex flex-col gap-3">
                      {group.links.map(link => (
                        <li key={link.l}>
                           <Link href={link.h} className="text-[10px] font-bold text-muted uppercase tracking-widest hover:text-white transition-all flex items-center gap-2 group/item">
                              <span className="w-1 h-1 rounded-full bg-white/20 opacity-0 group-hover/item:opacity-100 group-hover/item:scale-150 transition-all mr-1" />
                              {link.l}
                           </Link>
                        </li>
                      ))}
                   </ul>
                </div>
             ))}
          </div>
        </div>

        {/* Cinematic Status Monitor Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-10">
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse shadow-glow-gold" />
                  <span className="text-[9px] font-black text-white uppercase tracking-[0.3em] opacity-20 italic">NETWORK STATUS // OPERATIONAL</span>
               </div>
               <span className="text-[9px] font-black text-muted uppercase tracking-[0.4em] opacity-20 italic">© 2026 PREDCHAIN • ALL RIGHTS RESERVED</span>
            </div>
            
            <div className="flex items-center gap-8">
               {['TERMS', 'PRIVACY', 'VERIFICATION'].map(l => (
                  <Link key={l} href={`/${l.toLowerCase()}`} className="text-[9px] font-black text-muted hover:text-white uppercase tracking-[0.4em] italic opacity-20 hover:opacity-100 transition-all">
                     {l}
                  </Link>
               ))}
            </div>
        </div>
      </div>
    </footer>
  );
}
