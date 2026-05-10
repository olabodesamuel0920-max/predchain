'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signup } from '@/app/actions/auth';
import { User, Mail, Lock, Phone, Ticket, ShieldCheck, ArrowRight, Radio, Activity } from 'lucide-react';

function SignupForm() {
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) setReferralCode(ref);
  }, [searchParams]);

  const signupAction = async (formData: FormData) => {
    setIsPending(true);
    setErrorMsg(null);
    
    const returnTo = searchParams.get('returnTo');
    if (returnTo) formData.append('returnTo', returnTo);
    
    if (!formData.get('referral_code') && referralCode) {
      formData.append('referral_code', referralCode);
    }
    
    const res = await signup(formData);
    if (res?.error) {
      setErrorMsg(res.error);
      setIsPending(false);
    }
  };

  const returnTo = searchParams.get('returnTo');
  const loginUrl = returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : '/login';

  return (
    <div className="w-full max-w-[480px] animate-fade-in px-6 relative z-10">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 badge-luxury mb-8 px-6 py-2 bg-white/[0.02] border-white/10"
        >
           <Radio className="w-3.5 h-3.5 text-gold animate-pulse" /> 
           <span className="font-black tracking-[0.2em] text-[9px] italic">ARENA_REGISTRATION</span>
        </motion.div>
        <h2 className="mb-4 uppercase italic font-black leading-none tracking-tighter text-4xl sm:text-5xl text-white">Initialize <span className="text-gradient-gold">Access.</span></h2>
        <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.4em] opacity-30 italic">JOIN THE ELITE PERFORMANCE CIRCUIT</p>
      </div>

      <form action={signupAction} className="space-y-6">
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-[0.2em] text-center italic flex items-center justify-center gap-4 shadow-inner"
          >
             <Activity className="w-4 h-4 opacity-50" />
             {errorMsg}
          </motion.div>
        )}
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em] ml-2 opacity-30 italic">
              LEGAL_NAME
            </label>
            <input 
              name="full_name" 
              type="text" 
              required 
              placeholder="FULL NAME" 
              className="w-full bg-[#07090e] border border-white/5 rounded-2xl py-5 px-8 text-sm text-white placeholder:text-white/5 focus:outline-none focus:border-gold/30 transition-all shadow-inner uppercase font-black italic tracking-wider" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em] ml-2 opacity-30 italic">
              ARENA_HANDLE
            </label>
            <input 
              name="username" 
              type="text" 
              required 
              placeholder="USERNAME" 
              className="w-full bg-[#07090e] border border-white/5 rounded-2xl py-5 px-8 text-sm text-white placeholder:text-white/5 focus:outline-none focus:border-gold/30 transition-all shadow-inner uppercase font-black italic tracking-wider" 
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 text-[10px] font-black text-text-dim uppercase tracking-[0.3em] ml-2 opacity-30 italic">
            <Mail className="w-4 h-4 opacity-40" /> EMAIL_IDENTIFIER
          </label>
          <input 
            name="email" 
            type="email" 
            required 
            placeholder="PLAYER@ARENA.COM" 
            className="w-full bg-[#07090e] border border-white/5 rounded-2xl py-5 px-8 text-sm text-white placeholder:text-white/5 focus:outline-none focus:border-gold/30 transition-all shadow-inner uppercase font-black italic tracking-wider" 
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 text-[10px] font-black text-text-dim uppercase tracking-[0.3em] ml-2 opacity-30 italic">
            <Phone className="w-4 h-4 opacity-40" /> MOBILE_UPLINK
          </label>
          <input 
            name="phone" 
            type="tel" 
            required 
            placeholder="+234..." 
            className="w-full bg-[#07090e] border border-white/5 rounded-2xl py-5 px-8 text-sm text-white placeholder:text-white/5 focus:outline-none focus:border-gold/30 transition-all shadow-inner font-black tracking-wider" 
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-[10px] font-black text-text-dim uppercase tracking-[0.3em] ml-2 opacity-30 italic">
              <Lock className="w-4 h-4 opacity-40" /> ACCESS_KEY
            </label>
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••" 
              className="w-full bg-[#07090e] border border-white/5 rounded-2xl py-5 px-8 text-sm text-white placeholder:text-white/5 focus:outline-none focus:border-gold/30 transition-all shadow-inner" 
            />
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-[10px] font-black text-text-dim uppercase tracking-[0.3em] ml-2 opacity-30 italic">
              <Ticket className="w-4 h-4 opacity-40" /> INVITE_CODE
            </label>
            <input 
              name="referral_code" 
              type="text" 
              placeholder="OPTIONAL" 
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full bg-[#07090e] border border-white/5 rounded-2xl py-5 px-8 text-sm text-gold placeholder:text-white/5 focus:outline-none focus:border-gold/30 transition-all shadow-inner font-black italic tracking-wider uppercase" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isPending} 
          className="btn-luxury btn-gold btn-premium-depth w-full py-6 shadow-[0_30px_60px_-15px_rgba(242,201,76,0.2)] mt-8 group text-[11px] font-black italic tracking-[0.3em] uppercase"
        >
          <span className="flex items-center justify-center gap-4">
             {isPending ? (
               <Activity className="w-5 h-5 animate-spin" />
             ) : (
               <>
                 INITIALIZE CIRCUIT ACCESS <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
               </>
             )}
          </span>
        </button>
      </form>

      <div className="mt-16 text-center">
        <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.4em] opacity-30">
          ALREADY A MEMBER? <Link href={loginUrl} className="text-gold hover:text-white transition-colors border-b border-gold/20 hover:border-white ml-2 pb-1 italic">SIGN_IN</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex bg-[#020406] overflow-hidden font-display">
      
      {/* LEFT: Branding */}
      <div className="hidden lg:flex flex-[1.2] flex-col justify-between p-20 bg-[#030508] border-r border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gold-glow blur-[180px] opacity-[0.08] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-glow blur-[140px] opacity-[0.03] pointer-events-none" />
        
        <Link href="/" className="relative z-10 flex items-center gap-4 group">
           <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gold shadow-inner group-hover:rotate-12 transition-transform duration-500">
              <ShieldCheck className="w-6 h-6" />
           </div>
           <span className="font-display text-3xl font-black text-white uppercase tracking-tighter italic">Pred<span className="text-gold">Chain.</span></span>
        </Link>
        
        <div className="relative z-10 max-w-xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="badge-luxury mb-12 px-8 py-2.5 bg-white/[0.02] border-white/10 italic font-black"
          >
            ELITE_PERFORMANCE_CIRCUIT
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 leading-[1] uppercase italic font-black text-7xl sm:text-9xl text-white tracking-tighter"
          >
            Join the <br />
            <span className="text-gradient-gold">Arena.</span> <br />
            Win Big.
          </motion.h1>
          <p className="text-[12px] font-black text-text-dim uppercase tracking-[0.6em] opacity-30 leading-loose italic">
            HIGH_YIELD_SPORTS_PREDICTION_ARENA
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-10 text-text-dim opacity-30">
           <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 px-6 py-3 rounded-2xl shadow-inner">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">ARENA_SYNCED</span>
           </div>
           <div className="w-px h-6 bg-white/10" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">256_BIT_ENCRYPTION</span>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-glow blur-[150px] opacity-[0.05] pointer-events-none" />
        
        <Suspense fallback={
          <div className="flex flex-col items-center gap-8 animate-pulse">
             <div className="w-16 h-16 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center shadow-inner">
                <Activity className="w-8 h-8 text-gold/20" />
             </div>
             <div className="text-[11px] font-black text-gold/20 uppercase tracking-[0.6em] italic">INITIALIZING_ARENA...</div>
          </div>
        }>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
