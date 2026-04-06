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
    <div className="w-full max-w-[360px] relative z-10 px-6">
      <div className="mb-12 text-center">
        <h2 className="font-display text-4xl font-bold text-white mb-4 uppercase italic tracking-tighter bg-grad-gold bg-clip-text text-transparent">Welcome</h2>
        <p className="text-[10px] text-muted font-bold uppercase tracking-widest italic opacity-40">Verification Protocol Required</p>
      </div>

      <form action={loginAction} className="flex flex-col gap-5">
        {errorMsg && (
          <div className="p-4 bg-danger/5 border border-danger/20 rounded-xl text-danger text-[9px] font-bold uppercase tracking-widest text-center animate-slide-up italic">
            {errorMsg}
          </div>
        )}
        {infoMsg && (
          <div className="p-4 bg-blue-electric/5 border border-blue-electric/20 rounded-xl text-blue-electric text-[9px] font-bold uppercase tracking-widest text-center animate-slide-up italic">
            {infoMsg}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-muted/40 uppercase tracking-widest italic ml-1">Email Address</label>
          <input name="email" type="email" required placeholder="name@email.com" className="input-premium py-3 px-4 text-sm" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[10px] font-bold text-muted/40 uppercase tracking-widest italic">Hub Password</label>
            <Link href="/forgot-password" title="Recover Password" className="text-[9px] text-blue-electric/60 font-bold uppercase tracking-widest hover:text-blue-electric transition-colors italic">Forgot Entry?</Link>
          </div>
          <input name="password" type="password" required placeholder="••••••••" className="input-premium py-3 px-4 text-sm" />
        </div>

        <button 
          type="submit" 
          disabled={isPending} 
          className="btn btn-blue w-full mt-4 py-3.5 font-bold uppercase tracking-widest text-[11px] shadow-2xl shadow-blue-electric/10"
        >
          {isPending ? 'Logging In...' : 'Verify Entry'}
        </button>
      </form>

      <p className="text-center text-[10px] text-muted/30 font-bold uppercase tracking-widest mt-12 italic">
        New associate? <Link href={signupUrl} className="text-gold hover:text-white transition-colors">Apply for Account</Link>
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

        <div className="relative z-10 p-16 md:p-24 max-w-[600px]">
          <Link href="/" className="inline-flex items-center gap-3 mb-24 group">
            <div className="w-8 h-8 bg-grad-gold rounded-lg flex items-center justify-center text-black font-bold text-base shadow-lg group-hover:scale-105 transition-transform">P</div>
            <span className="font-display text-lg font-bold text-white uppercase tracking-tighter italic">PredChain</span>
          </Link>
          
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-[1.05] mb-12 uppercase italic tracking-tighter">
            Security. <br />
            <span className="text-gradient-gold">Yield.</span> <br />
            Transparency.
          </h1>
          <p className="text-xs text-muted font-bold leading-relaxed uppercase tracking-[0.2em] italic opacity-30">
            Unified Prediction Network
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
