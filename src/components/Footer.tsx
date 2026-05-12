'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Globe,
  Activity,
  Send,
  Monitor,
  Heart
} from 'lucide-react';

const FooterLogo = () => (
  <Link href="/" className="flex items-center gap-3 mb-10 group inline-block">
    <span className="font-display text-3xl font-bold text-white uppercase tracking-tighter">Pred<span className="text-gradient-gold">Chain.</span></span>
  </Link>
);

export default function Footer() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAdmin = pathname?.startsWith('/admin');
  const isAuth = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';

  if (isDashboard || isAdmin || isAuth) return null;

  return (
    <footer className="bg-primary pt-24 pb-12 relative overflow-hidden border-t border-white/5" role="contentinfo">
      {/* Background Ambience */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold-glow blur-[140px] opacity-[0.03] pointer-events-none" />
      
      <div className="container-tight relative z-10 px-4 sm:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          {/* Brand & Narrative */}
          <div className="lg:col-span-5 space-y-10">
            <Link href="/" className="inline-block group">
              <span className="font-display text-2xl font-black text-white uppercase italic tracking-tighter">PRED<span className="text-gold">CHAIN.</span></span>
            </Link>
            <p className="text-text-secondary text-xs sm:text-sm font-medium leading-relaxed max-w-sm italic opacity-40 group-hover:opacity-100 transition-opacity duration-700">
               The premier platform for high-performance football analysis. 
               Join an elite community of challengers building 3-day winning streaks for premium rewards.
            </p>
            <div className="flex gap-5">
               {[
                  { icon: Globe, href: '#' },
                  { icon: Send, href: '#' },
                  { icon: Activity, href: '#' }
               ].map((social, i) => (
                  <Link key={i} href={social.href} className="w-11 h-11 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-text-dim hover:text-gold hover:border-gold/30 hover:rotate-12 transition-all duration-500 shadow-inner group">
                     <social.icon className="w-4 h-4" />
                  </Link>
               ))}
            </div>
          </div>

          {/* Sitemaps */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
             {[
               { 
                 title: 'ARENA', 
                 links: [
                   { h: '/', l: 'Home' },
                   { h: '/how-it-works', l: 'Guide' },
                   { h: '/accounts', l: 'Tiers' },
                   { h: '/arena', l: 'Arena' },
                 ] 
               },
               { 
                 title: 'COMMUNITY', 
                 links: [
                   { h: '/winners', l: 'Winners' },
                   { h: '/leaderboard', l: 'Rankings' },
                   { h: '/referral', l: 'Partners' },
                   { h: '/faq', l: 'FAQ' },
                 ] 
               },
               { 
                 title: 'LEGAL', 
                 links: [
                   { h: '/terms', l: 'Terms of Service' },
                   { h: '/privacy', l: 'Privacy Policy' },
                   { h: '/rules', l: 'Match Rules' }
                 ] 
               }
             ].map((group, i) => (
                <div key={i} className="space-y-8">
                   <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] font-display italic opacity-40">
                       {group.title}
                   </h3>
                   <ul className="space-y-5">
                      {group.links.map(link => (
                         <li key={link.l}>
                            <Link href={link.h} className="text-[11px] font-black text-text-dim uppercase tracking-[0.2em] hover:text-white transition-all italic flex items-center gap-3 group/item">
                               <span className="w-2 h-px bg-gold/50 scale-x-0 group-hover/item:scale-x-100 transition-transform duration-500 origin-left" />
                               <span className="group-hover/item:translate-x-1 transition-transform duration-500">{link.l}</span>
                            </Link>
                         </li>
                      ))}
                   </ul>
                </div>
             ))}
          </div>
        </div>

        {/* Global Footer Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-10">
                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-full shadow-inner">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                   <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Arena Operational</span>
                </div>
                <span className="text-[9px] font-black text-text-dim uppercase tracking-[0.4em] italic opacity-30">© 2026 PREDCHAIN • PREMIUM FOOTBALL PREDICTION</span>
            </div>
            
            <div className="flex items-center gap-6">
               <span className="text-[9px] font-black text-text-dim/40 uppercase tracking-[0.3em] italic">
                  Verified Access
               </span>
               <div className="w-px h-3 bg-white/10 hidden sm:block" />
               <Link href="/terms" className="text-[9px] font-black text-text-dim/40 hover:text-white transition-colors uppercase tracking-[0.3em] italic">
                  TERMS
               </Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
