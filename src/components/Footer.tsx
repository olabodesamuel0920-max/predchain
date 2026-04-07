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
  <div className="flex items-center gap-3 mb-8 group">
    <span className="font-display text-2xl font-black text-white uppercase tracking-tighter italic">Pred<span className="text-gradient-gold">Chain</span></span>
  </div>
);

export default function Footer() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAdmin = pathname?.startsWith('/admin');
  const isAuth = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';

  if (isDashboard || isAdmin || isAuth) return null;

  return (
    <footer className="bg-[#020406] pt-24 pb-12 relative overflow-hidden border-t border-white/5" role="contentinfo">
      {/* Background Ambience */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gold-glow blur-[140px] opacity-10 pointer-events-none" />
      
      <div className="container relative z-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          {/* Brand & About */}
          <div className="md:col-span-5 space-y-8">
            <FooterLogo />
            <p className="text-[11px] font-bold text-muted uppercase tracking-[0.2em] leading-loose max-w-sm opacity-40 italic">
               The ultimate arena for elite football predictions. Build your sequence, maintain your streak, and claim your rewards.
            </p>
            <div className="flex gap-4">
               {[
                  { icon: Send, href: '#' },
                  { icon: Globe, href: '#' },
                  { icon: Activity, href: '#' }
               ].map((social, i) => (
                  <Link key={i} href={social.href} className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-muted hover:text-gold hover:border-gold/20 transition-all shadow-inner group">
                     <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </Link>
               ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
             {[
               { 
                 title: 'ARENA', 
                 links: [
                   { h: '/how-it-works', l: 'Guide' },
                   { h: '/accounts', l: 'Plans' },
                   { h: '/arena', l: 'Live Match' },
                   { h: '/leaderboard', l: 'Rankings' },
                 ] 
               },
               { 
                 title: 'ACCOUNT', 
                 links: [
                   { h: '/dashboard', l: 'Dashboard' },
                   { h: '/winners', l: 'Hall of Fame' },
                   { h: '/referral', l: 'Affiliates' },
                   { h: '/login', l: 'Sign In' },
                 ] 
               },
               { 
                 title: 'LEGAL', 
                 links: [
                   { h: '/terms', l: 'Terms' },
                   { h: '/privacy', l: 'Privacy' },
                   { h: '/faq', l: 'Support' },
                   { h: '/rules', l: 'Rules' }
                 ] 
               }
             ].map((group, i) => (
                <div key={i} className="space-y-8">
                   <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic opacity-50 flex items-center gap-2">
                       {group.title}
                   </h3>
                   <ul className="space-y-4">
                      {group.links.map(link => (
                        <li key={link.l}>
                           <Link href={link.h} className="text-[10px] font-bold text-muted uppercase tracking-widest hover:text-gold transition-all duration-300 flex items-center gap-2 group/item">
                              <span className="w-1 h-1 rounded-full bg-gold/50 scale-0 group-hover/item:scale-100 transition-transform" />
                              {link.l}
                           </Link>
                        </li>
                      ))}
                   </ul>
                </div>
             ))}
          </div>
        </div>

        {/* Console Status Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-12">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-glow-gold" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-20 italic">Systems Operational</span>
               </div>
               <span className="text-[9px] font-black text-muted uppercase tracking-[0.4em] opacity-20 italic">© 2026 PREDCHAIN • ALL RIGHTS RESERVED</span>
            </div>
            
            <div className="flex items-center gap-3 text-[10px] font-black text-muted uppercase tracking-widest opacity-20 italic">
               MADE WITH PROUD IN NIGERIA <Heart className="w-3 h-3 text-danger opacity-40 ml-1" />
            </div>
        </div>
      </div>
    </footer>
  );
}
