'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { login } from '@/app/actions/auth';
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';

function LoginForm() {
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) setErrorMsg(decodeURIComponent(errorParam));

    const messageParam = searchParams.get('message');
    if (messageParam) setInfoMsg(decodeURIComponent(messageParam));
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
    <div className="w-full max-w-[360px] animate-fade-in px-6">
      <div className="text-center mb-10">
        <h2 className="mb-2">Welcome <span className="text-gradient-gold">Back.</span></h2>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-40">Please enter your account details</p>
      </div>

      <form action={loginAction} className="space-y-5">
        {errorMsg && (
          <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-[10px] font-bold uppercase tracking-widest text-center animate-slide-up">
            {errorMsg}
          </div>
        )}
        {infoMsg && (
          <div className="p-3 bg-blue-electric/10 border border-blue-electric/20 rounded-xl text-blue-electric text-[10px] font-bold uppercase tracking-widest text-center animate-slide-up">
            {infoMsg}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[9px] font-bold text-muted uppercase tracking-widest ml-1 opacity-40">
            <Mail className="w-3 h-3" /> Email Address
          </label>
          <input 
            name="email" 
            type="email" 
            required 
            placeholder="name@example.com" 
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 transition-all shadow-inner" 
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="flex items-center gap-2 text-[9px] font-bold text-muted uppercase tracking-widest opacity-40">
              <Lock className="w-3 h-3" /> Password
            </label>
            <Link href="/forgot-password" title="Recover Password" className="text-[9px] text-gold/60 font-bold uppercase tracking-widest hover:text-gold transition-colors">Forgot?</Link>
          </div>
          <input 
            name="password" 
            type="password" 
            required 
            placeholder="••••••••" 
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 transition-all shadow-inner" 
          />
        </div>

        <button 
          type="submit" 
          disabled={isPending} 
          className="btn btn-primary w-full py-4 shadow-xl mt-4"
        >
          {isPending ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-30">
          Don't have an account? <Link href={signupUrl} className="text-gold hover:text-white transition-colors border-b border-gold/20 hover:border-white ml-2 pb-0.5">Create One</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-[#020406] overflow-hidden">
      
      {/* LEFT: Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-16 bg-[#030508] border-r border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-glow blur-[120px] opacity-10 pointer-events-none" />
        
        <Link href="/" className="relative z-10 flex items-center gap-2 group">
           <span className="font-display text-2xl font-black text-white uppercase tracking-tighter italic">Pred<span className="text-gradient-gold">Chain</span></span>
        </Link>
        
        <div className="relative z-10 max-w-sm">
          <h1 className="mb-6 leading-tight">
            Predict. <br />
            <span className="text-gradient-gold">Perform.</span> <br />
            Win.
          </h1>
          <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em] opacity-30 leading-loose">
            High-Yield Sports Prediction Arena
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-muted opacity-20">
           <ShieldCheck className="w-5 h-5" />
           <span className="text-[8px] font-black uppercase tracking-[0.4em]">Verified Payout Protocols Active</span>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gold-glow blur-[100px] opacity-10 pointer-events-none" />
        
        <Suspense fallback={<div className="text-[10px] font-bold text-muted uppercase tracking-widest animate-pulse">Connecting...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
