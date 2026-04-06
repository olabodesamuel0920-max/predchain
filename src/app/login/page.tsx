'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { login } from '@/app/actions/auth';

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
    <div className="w-full max-w-[380px] relative z-10 px-4">
      <div className="mb-24 text-center">
        <h2 className="font-display text-3xl font-black text-white mb-6 uppercase italic tracking-tight">Welcome Back</h2>
        <p className="text-[10px] text-muted font-bold uppercase tracking-[0.2em] italic opacity-60">Sign in to your account to continue.</p>
      </div>

      <form action={loginAction} className="flex flex-col gap-4">
        {errorMsg && (
          <div className="p-12 mb-2 bg-danger/10 border border-danger/20 rounded-xl text-danger text-[9px] font-black uppercase tracking-widest text-center animate-slide-up">
            {errorMsg}
          </div>
        )}
        {infoMsg && (
          <div className="p-12 mb-2 bg-blue-electric/10 border border-blue-electric/20 rounded-xl text-blue-electric text-[9px] font-black uppercase tracking-widest text-center animate-slide-up">
            {infoMsg}
          </div>
        )}
        <div className="flex flex-col gap-1.5 px-2">
          <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em]">Email Address</label>
          <input name="email" type="email" required placeholder="name@email.com" className="input-premium py-12" />
        </div>

        <div className="flex flex-col gap-1.5 px-2">
          <div className="flex justify-between items-center">
            <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em]">Password</label>
            <Link href="/forgot-password" title="Recover Password" className="text-[9px] text-blue-electric font-black uppercase tracking-[0.2em] hover:text-white transition-colors">Forgot?</Link>
          </div>
          <input name="password" type="password" required placeholder="••••••••" className="input-premium py-12" />
        </div>

        <button 
          type="submit" 
          disabled={isPending} 
          className="btn btn-primary w-full mt-4 py-12 font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-gold/10"
        >
          {isPending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-[10px] text-muted font-bold uppercase tracking-widest mt-20">
        Don't have an account? <Link href={signupUrl} className="text-gold hover:text-white transition-colors">Sign Up</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-primary overflow-hidden">
      
      {/* LEFT: CINEMATIC ART */}
      <div className="auth-pane-left">
        <div className="absolute inset-0 bg-secondary z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-grad-aurora filter blur-[140px] opacity-20 rounded-full z-1" />
        <div className="absolute inset-0 opacity-[0.03] z-1" style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 p-32 md:p-64 max-w-[600px]">
          <Link href="/" className="inline-flex items-center gap-12 mb-32 group">
            <div className="w-10 h-10 bg-grad-gold rounded-xl flex items-center justify-center text-black font-black text-lg shadow-lg group-hover:scale-105 transition-transform">P</div>
            <span className="font-display text-xl font-black text-white uppercase tracking-tighter italic">PredChain</span>
          </Link>
          
          <h1 className="font-display text-5xl font-black text-white leading-[1.05] mb-16 uppercase italic tracking-tighter">
            Secure your <br />
            <span className="text-gold">Predictions.</span>
          </h1>
          <p className="text-lg text-muted font-bold leading-relaxed uppercase tracking-widest italic opacity-60">
            Access your dashboard. <br />
            Manage your wallet. <br />
            Verify your wins.
          </p>
        </div>
      </div>

      {/* RIGHT: AUTH FORM */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/5 filter blur-[120px] pointer-events-none" />
        
        <Suspense fallback={<div className="text-muted font-black uppercase tracking-widest text-[10px] animate-pulse">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
