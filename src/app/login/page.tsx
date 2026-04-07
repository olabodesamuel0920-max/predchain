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
    <div className="w-full max-w-[340px] relative z-10 px-4 md:px-0">
      <div className="mb-12 text-center md:text-left">
        <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-3 uppercase tracking-tighter italic">Welcome back</h2>
        <p className="text-[10px] text-muted font-bold uppercase tracking-[0.2em] opacity-30 italic">Secure entry protocol initiated</p>
      </div>

      <form action={loginAction} className="flex flex-col gap-6">
        {errorMsg && (
          <div className="p-4 bg-danger/5 border border-danger/10 rounded-xl text-danger text-[9px] font-black uppercase tracking-[0.2em] text-center animate-slide-up italic">
            {errorMsg}
          </div>
        )}
        {infoMsg && (
          <div className="p-4 bg-blue-electric/5 border border-blue-electric/10 rounded-xl text-blue-electric text-[9px] font-black uppercase tracking-[0.2em] text-center animate-slide-up italic">
            {infoMsg}
          </div>
        )}
        
        <div className="flex flex-col gap-2.5">
          <label className="text-[9px] font-black text-muted uppercase tracking-[0.3em] ml-1 opacity-40 italic">Registry Email</label>
          <input name="email" type="email" required placeholder="operator@predchain.arena" className="bg-white/[0.02] border border-white/5 rounded-xl py-4 px-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all shadow-inner" />
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-40 italic">Access Key</label>
            <Link href="/forgot-password" title="Recover Password" className="text-[9px] text-gold/40 font-black uppercase tracking-[0.2em] hover:text-gold transition-colors italic">Lost Key?</Link>
          </div>
          <input name="password" type="password" required placeholder="••••••••" className="bg-white/[0.02] border border-white/5 rounded-xl py-4 px-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all shadow-inner" />
        </div>

        <button 
          type="submit" 
          disabled={isPending} 
          className="btn btn-primary w-full mt-6 py-4.5 !rounded-xl italic"
        >
          {isPending ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center md:text-left text-[9px] text-muted font-black uppercase tracking-[0.25em] mt-12 opacity-30 italic">
        New operator? <Link href={signupUrl} className="text-gold hover:text-white transition-colors border-b border-gold/20 hover:border-white">Create Profile</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-[#030508] overflow-hidden">
      
      {/* LEFT: CINEMATIC ART */}
      <div className="auth-pane-left bg-[#020406] border-r border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 filter blur-[150px] opacity-20 rounded-full z-1" />
        <div className="absolute inset-0 opacity-[0.02] z-1" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 p-20 max-w-[600px]">
          <Link href="/" className="inline-flex items-center gap-3 mb-24 group">
             <div className="w-8 h-8 transition-transform group-hover:scale-110 duration-700">
                <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2L24 8V20L14 26L4 20V8L14 2Z" fill="var(--gold)" fillOpacity="0.9"/>
                  <path d="M14 8L18 11V17L14 20L10 17V11L14 8Z" fill="#FFF"/>
                </svg>
             </div>
             <span className="font-display text-xl font-black text-white uppercase tracking-tighter italic">PredChain</span>
          </Link>
          
          <h1 className="font-display text-6xl md:text-7xl font-black text-white leading-[0.95] mb-12 uppercase tracking-tighter italic">
            Predict. <br />
            <span className="text-gradient-gold">Perform.</span> <br />
            Win.
          </h1>
          <p className="text-[10px] text-muted font-black leading-relaxed uppercase tracking-[0.4em] opacity-30 italic">
            High-Yield Football Challenge Arena
          </p>
        </div>
      </div>

      {/* RIGHT: AUTH FORM */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/5 filter blur-[120px] pointer-events-none" />
        
        <Suspense fallback={<div className="text-muted font-black uppercase tracking-[0.2em] text-[9px] animate-pulse italic">Connecting to Arena...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
