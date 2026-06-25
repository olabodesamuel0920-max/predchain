'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { login } from '@/app/actions/auth';
import { ArrowRight, Lock, Mail, ShieldCheck, Radio, Activity } from 'lucide-react';

function LoginForm() {
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const [deviceFingerprint, setDeviceFingerprint] = useState('');
  const [timezone, setTimezone] = useState('UTC');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) setErrorMsg(decodeURIComponent(errorParam));

    const messageParam = searchParams.get('message');
    if (messageParam) setInfoMsg(decodeURIComponent(messageParam));

    let fingerprint = localStorage.getItem('predchain_client_id');
    if (!fingerprint) {
      fingerprint = 'pc_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('predchain_client_id', fingerprint);
    }
    setDeviceFingerprint(fingerprint);

    try {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
    } catch (e) {}
  }, [searchParams]);

  const loginAction = async (formData: FormData) => {
    setIsPending(true);
    setErrorMsg(null);
    
    const returnTo = searchParams.get('returnTo');
    if (returnTo) formData.append('returnTo', returnTo);
    
    const res = await login(formData);
    if (res?.error) {
      setErrorMsg(res.error);
      setIsPending(false);
    }
  };

  const returnTo = searchParams.get('returnTo');
  const signupUrl = returnTo ? `/signup?returnTo=${encodeURIComponent(returnTo)}` : '/signup';

  return (
    <div className="w-full max-w-[420px] animate-fade-in px-6 relative z-10">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 badge-luxury mb-8 px-6 py-2 bg-white/[0.02] border-white/10"
        >
           <Radio className="w-3.5 h-3.5 text-gold animate-pulse" /> 
           <span className="font-black tracking-[0.2em] text-[9px] italic">Login</span>
        </motion.div>
        <h2 className="mb-4 uppercase italic font-black leading-none tracking-tighter text-4xl sm:text-5xl text-white">Welcome <span className="text-gradient-gold">Back.</span></h2>
        <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.4em] opacity-30 italic">LOGIN</p>
      </div>

      <form action={loginAction} className="space-y-8">
        <input type="hidden" name="device_fingerprint" value={deviceFingerprint} />
        <input type="hidden" name="timezone" value={timezone} />
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
        {infoMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 bg-gold/5 border border-gold/10 rounded-2xl text-gold text-[10px] font-black uppercase tracking-[0.2em] text-center italic shadow-inner"
          >
            {infoMsg}
          </motion.div>
        )}
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-[10px] font-black text-text-dim uppercase tracking-[0.3em] ml-2 opacity-30 italic">
            <Mail className="w-4 h-4 opacity-40" /> EMAIL ADDRESS
          </label>
          <div className="relative group">
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="MEMBER@PREDCHAIN.COM" 
              className="w-full bg-[#07090e] border border-white/5 rounded-2xl py-5 px-8 text-sm text-white placeholder:text-white/5 focus:outline-none focus:border-gold/30 transition-all shadow-inner group-hover:border-white/10 uppercase font-black italic tracking-wider" 
            />
            <div className="absolute inset-0 rounded-2xl bg-gold/[0.02] opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center ml-2">
            <label className="flex items-center gap-3 text-[10px] font-black text-text-dim uppercase tracking-[0.3em] opacity-30 italic">
              <Lock className="w-4 h-4 opacity-40" /> PASSWORD
            </label>
            <Link href="/forgot-password" title="Recover Password" className="text-[9px] text-gold/40 font-black uppercase tracking-[0.3em] hover:text-gold transition-colors italic">FORGOT PASSWORD</Link>
          </div>
          <div className="relative group">
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••" 
              className="w-full bg-[#07090e] border border-white/5 rounded-2xl py-5 px-8 text-sm text-white placeholder:text-white/5 focus:outline-none focus:border-gold/30 transition-all shadow-inner group-hover:border-white/10" 
            />
            <div className="absolute inset-0 rounded-2xl bg-gold/[0.02] opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
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
                 Login <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
               </>
             )}
          </span>
        </button>
      </form>

      <div className="mt-16 text-center">
        <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.4em] opacity-30">
          NOT A MEMBER YET? <Link href={signupUrl} className="text-gold hover:text-white transition-colors border-b border-gold/20 hover:border-white ml-2 pb-1 italic">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
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
            PREMIUM FOOTBALL PREDICTION
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 leading-[1] uppercase italic font-black text-7xl sm:text-9xl text-white tracking-tighter"
          >
            Predict. <br />
            <span className="text-gradient-gold">Perform.</span> <br />
            Win.
          </motion.h1>
          <p className="text-[12px] font-black text-text-dim uppercase tracking-[0.6em] opacity-30 leading-loose italic">
            Premium Football Prediction
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-10 text-text-dim opacity-30">
           <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 px-6 py-3 rounded-2xl shadow-inner">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">ARENA ONLINE</span>
           </div>
           <div className="w-px h-6 bg-white/10" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">MEMBER ACCESS</span>
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
             <div className="text-[11px] font-black text-gold/20 uppercase tracking-[0.6em] italic">CONNECTING...</div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
