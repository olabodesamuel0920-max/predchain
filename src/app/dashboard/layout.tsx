import { ReactNode } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ShieldCheck, Zap, Wallet as WalletIcon, Users, Settings, LogOut, ChevronRight, Menu } from 'lucide-react';

import { logout } from '@/app/actions/auth';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#030508] text-white">
      {/* ─── PROFESSIONAL SIDEBAR SHELL ─── */}
      <aside className="w-64 border-r border-white/5 bg-[#05070a] fixed h-full z-50 hidden lg:flex flex-col shadow-2xl">
        <div className="p-24 border-b border-white/5 bg-white/[0.01]">
          <Link href="/" className="flex items-center gap-12 group">
            <div className="w-8 h-8 rounded-lg bg-grad-gold flex items-center justify-center font-black text-black group-hover:scale-105 transition-transform shadow-lg shadow-gold/20">
              P
            </div>
            <span className="font-display font-black tracking-tighter text-lg uppercase italic">PREDCHAIN</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-3">
          <div className="px-16 py-8 mb-4">
             <span className="text-[8px] font-black text-muted uppercase tracking-[0.2em] opacity-40">Main Matrix</span>
          </div>

          <Link href="/dashboard" className="flex items-center justify-between gap-3 px-16 py-12 rounded-xl bg-blue-electric/10 border border-blue-electric/20 text-white font-black uppercase text-[10px] tracking-widest transition-all">
            <div className="flex items-center gap-12">
               <Zap className="w-4 h-4 text-blue-electric" />
               Dashboard
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-electric animate-pulse" />
          </Link>

          <Link href="/live-challenges" className="flex items-center gap-3 px-16 py-12 rounded-xl hover:bg-white/[0.03] text-muted hover:text-white border border-transparent hover:border-white/5 transition-all font-black uppercase text-[10px] tracking-widest group">
            <ShieldCheck className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
            Live Arena
          </Link>

          <Link href="/accounts" className="flex items-center gap-3 px-16 py-12 rounded-xl hover:bg-white/[0.03] text-muted hover:text-white border border-transparent hover:border-white/5 transition-all font-black uppercase text-[10px] tracking-widest group">
            <WalletIcon className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
            Account Tiers
          </Link>

          <Link href="/referral" className="flex items-center gap-3 px-16 py-12 rounded-xl hover:bg-white/[0.03] text-muted hover:text-white border border-transparent hover:border-white/5 transition-all font-black uppercase text-[10px] tracking-widest group">
            <Users className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
            Referral Network
          </Link>

          <div className="mt-auto border-t border-white/5 pt-20 flex flex-col gap-4">
            <Link href="/rules" className="flex items-center gap-12 px-16 py-8 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
              📜 Rules & Logic
            </Link>
            <Link href="/faq" className="flex items-center gap-12 px-16 py-8 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
              ❓ Support / FAQ
            </Link>
            <form action={logout}>
              <button type="submit" className="w-full flex items-center gap-12 px-16 py-12 text-[10px] font-black uppercase tracking-widest text-danger hover:bg-danger/10 rounded-xl transition-all group">
                <LogOut className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                Sign Out Matrix
              </button>
            </form>
          </div>
        </nav>
      </aside>

      {/* ─── MAIN APP SPACING ─── */}
      <div className="flex-1 lg:pl-64 flex flex-col">
        {/* Unified Top Header Bar */}
        <header className="h-20 border-b border-white/5 bg-[#030508]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-black text-success uppercase tracking-widest leading-none">Operational</span>
             </div>
             <div className="h-4 w-[1px] bg-white/10 hidden sm:block opacity-40" />
             <div className="hidden sm:flex items-center gap-6">
                <span className="text-[9px] font-black text-muted uppercase tracking-widest opacity-40">System: </span>
                <span className="text-[10px] font-black text-white uppercase italic tracking-tighter">PredChain Sentinel</span>
             </div>
          </div>
          
          <div className="flex items-center gap-8">
            <Link href="/accounts" className="btn btn-blue px-16 py-8 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-electric/20 border-none">
               Upgrade Account
            </Link>
          </div>
        </header>

        <main className="min-h-screen">
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
