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
    <footer className="bg-bg-darker pt-20 pb-10 relative overflow-hidden border-t border-border-subtle" role="contentinfo">
      <div className="container-tight relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 sm:gap-16 mb-16">
          {/* Brand & Narrative */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="inline-block group mb-4">
              <span className="font-display text-xl font-black text-white uppercase italic tracking-tighter">PRED<span className="text-gold">CHAIN.</span></span>
            </Link>
            <p className="text-text-secondary text-xs font-normal leading-relaxed max-w-sm italic opacity-80">
               The professional arena for high-performance sports analytics. 
               Join an elite network of nodes building 3-day sequences for premium rewards.
            </p>
            <div className="flex gap-4">
               {[
                  { icon: Globe, href: '#' },
                  { icon: Send, href: '#' },
                  { icon: Activity, href: '#' }
               ].map((social, i) => (
                  <Link key={i} href={social.href} className="w-9 h-9 rounded-lg bg-white/[0.02] border border-border-subtle flex items-center justify-center text-text-dim hover:text-gold hover:border-gold/30 transition-all group">
                     <social.icon className="w-3.5 h-3.5" />
                  </Link>
               ))}
            </div>
          </div>

          {/* Sitemaps */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
             {[
               { 
                 title: 'ARENA', 
                 links: [
                   { h: '/how-it-works', l: 'Protocol' },
                   { h: '/accounts', l: 'Tier Entry' },
                   { h: '/arena', l: 'Live Feed' },
                 ] 
               },
               { 
                 title: 'PLAYER HUB', 
                 links: [
                   { h: '/dashboard', l: 'Dashboard' },
                   { h: '/winners', l: 'Winners' },
                   { h: '/leaderboard', l: 'Rankings' },
                   { h: '/referral', l: 'Affiliates' },
                 ] 
               },
               { 
                 title: 'LEGAL', 
                 links: [
                   { h: '/terms', l: 'Terms' },
                   { h: '/privacy', l: 'Privacy' },
                   { h: '/rules', l: 'Rules' }
                 ] 
               }
             ].map((group, i) => (
                <div key={i} className="space-y-6">
                   <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] font-display italic">
                       {group.title}
                   </h3>
                   <ul className="space-y-4">
                      {group.links.map(link => (
                        <li key={link.l}>
                           <Link href={link.h} className="text-[11px] font-black text-text-dim uppercase tracking-[0.05em] hover:text-white transition-all italic flex items-center gap-2 group/item">
                              <span className="w-1 h-px bg-gold/30 scale-x-0 group-hover/item:scale-x-100 transition-all origin-left" />
                              {link.l}
                           </Link>
                        </li>
                      ))}
                   </ul>
                </div>
             ))}
          </div>
        </div>

        {/* Global Footer Bar */}
        <div className="pt-10 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
               <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-text-muted uppercase tracking-widest italic opacity-40">NODE ACTIVE</span>
               </div>
               <span className="text-[9px] font-black text-text-dim uppercase tracking-[0.3em] italic opacity-40">© 2026 PREDCHAIN • v2.0 ELITE</span>
            </div>
            
            <span className="text-[9px] font-black text-text-dim/40 uppercase tracking-widest italic">
               SECURED GATEWAY • SSL 256-BIT
            </span>
        </div>
      </div>
    </footer>
  );
}
