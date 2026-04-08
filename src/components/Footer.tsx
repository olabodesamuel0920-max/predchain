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
    <footer className="bg-[#030508] pt-32 pb-16 relative overflow-hidden border-t border-white/5" role="contentinfo">
      {/* Background Ambience */}
      <div className="absolute bottom-0 right-[-10%] w-[50%] h-[500px] bg-gold-glow blur-[160px] opacity-10 pointer-events-none" />
      
      <div className="container relative z-10 px-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-20 mb-24">
          {/* Brand & Narrative */}
          <div className="xl:col-span-5 space-y-10">
            <FooterLogo />
            <p className="text-secondary text-sm font-medium opacity-50 leading-relaxed max-w-sm">
               The premier arena for professional football prediction. Join an elite network of players building 3-day sequences for high-impact rewards.
            </p>
            <div className="flex gap-6">
               {[
                  { icon: Globe, href: '#' },
                  { icon: Send, href: '#' },
                  { icon: Activity, href: '#' }
               ].map((social, i) => (
                  <Link key={i} href={social.href} className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-muted hover:text-gold hover:border-gold/30 transition-all shadow-xl group">
                     <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </Link>
               ))}
            </div>
          </div>

          {/* Sitemaps */}
          <div className="xl:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-16">
             {[
               { 
                 title: 'ARENA', 
                 links: [
                   { h: '/how-it-works', l: 'The Guide' },
                   { h: '/accounts', l: 'Entry Tiers' },
                   { h: '/arena', l: 'Live Match Grid' },
                   { h: '/leaderboard', l: 'Global Rankings' },
                 ] 
               },
               { 
                 title: 'PLAYER HUB', 
                 links: [
                   { h: '/dashboard', l: 'Commander Hub' },
                   { h: '/winners', l: 'Hall of Fame' },
                   { h: '/referral', l: 'Elite Associates' },
                   { h: '/login', l: 'Account Login' },
                 ] 
               },
               { 
                 title: 'STANDARDS', 
                 links: [
                   { h: '/terms', l: 'Terms of Use' },
                   { h: '/privacy', l: 'Privacy Protocol' },
                   { h: '/faq', l: 'Support Center' },
                   { h: '/rules', l: 'Arena Rules' }
                 ] 
               }
             ].map((group, i) => (
                <div key={i} className="space-y-10">
                   <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.3em] font-display opacity-40">
                       {group.title}
                   </h3>
                   <ul className="space-y-6">
                      {group.links.map(link => (
                        <li key={link.l}>
                           <Link href={link.h} className="text-[11px] font-bold text-secondary uppercase tracking-[0.1em] hover:text-white transition-all duration-400 flex items-center gap-3 group/item">
                              <div className="w-1 h-1 rounded-full bg-gold scale-0 group-hover/item:scale-100 transition-transform" />
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
        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-12">
               <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-widest opacity-30 italic">High-Trust Servers Active</span>
               </div>
               <span className="text-[10px] font-bold text-muted uppercase tracking-[0.4em] opacity-30 italic">© 2026 PREDCHAIN • PROFESSIONAL ANALYTICS HUB</span>
            </div>
            
            <div className="flex items-center gap-3 text-[10px] font-bold text-muted uppercase tracking-widest opacity-30 italic">
               SECURED BY PREDCHAIN FOUNDATION <Heart className="w-3.5 h-3.5 text-rose-500/50 ml-1.5" />
            </div>
        </div>
      </div>
    </footer>
  );
}
