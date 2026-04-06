'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signup } from '@/app/actions/auth';

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
    
    // Ensure referral_code is included even if read-only
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
    <div className="w-full max-w-[420px] relative z-10 px-4">
      <div className="mb-32 text-center">
        <h2 className="font-display text-4xl font-black text-white mb-8 uppercase italic">Create Account</h2>
        <p className="text-sm text-muted font-bold uppercase tracking-widest italic opacity-60">Start your prediction streak today.</p>
      </div>

      <form action={signupAction} className="flex flex-col gap-6">
        {errorMsg && (
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-xs font-black uppercase tracking-widest text-center shadow-lg shadow-danger/5">
            {errorMsg}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-4">Full Name</label>
            <input name="full_name" type="text" required placeholder="John Doe" className="input-premium" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-4">Username</label>
            <input name="username" type="text" required placeholder="striker1" className="input-premium" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-4">Email Address</label>
          <input name="email" type="email" required placeholder="john@example.com" className="input-premium" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-4">Phone Number</label>
          <input name="phone" type="tel" required placeholder="+234..." className="input-premium" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-4">Password</label>
            <input name="password" type="password" required placeholder="••••••••" className="input-premium" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-4">Referral</label>
            <input 
              name="referral_code" 
              type="text" 
              placeholder="Optional" 
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="input-premium" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isPending} 
          className="btn btn-primary w-full mt-4 py-14 font-black uppercase tracking-widest text-sm shadow-xl shadow-gold/10"
        >
          {isPending ? 'Verifying Details...' : 'Register Account'}
        </button>
      </form>

      <p className="text-center text-xs text-muted font-bold uppercase tracking-widest mt-32">
        Already registered? <Link href={loginUrl} className="text-gold hover:text-white transition-colors">Sign In</Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex bg-primary overflow-hidden">
      
      {/* LEFT: CINEMATIC ART */}
      <div className="auth-pane-left">
        <div className="absolute inset-0 bg-secondary z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-grad-aurora filter blur-[140px] opacity-20 rounded-full z-1" />
        <div className="absolute inset-0 opacity-[0.03] z-1" style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 p-64 max-w-[600px]">
          <Link href="/" className="inline-flex items-center gap-12 mb-48 group">
            <div className="w-12 h-12 bg-grad-gold rounded-xl flex items-center justify-center text-black font-black text-xl shadow-lg group-hover:scale-105 transition-transform">P</div>
            <span className="font-display text-2xl font-black text-white uppercase tracking-tighter italic">PredChain</span>
          </Link>
          
          <h1 className="font-display text-6xl font-black text-white leading-[1.05] mb-24 uppercase italic tracking-tighter">
            Join the <br />
            <span className="text-gold">Elite Squad.</span>
          </h1>
          <p className="text-xl text-muted font-bold leading-relaxed uppercase tracking-widest italic opacity-60">
            Build your streak. <br />
            Unlock rewards. <br />
            Master the arena.
          </p>
        </div>
      </div>

      {/* RIGHT: AUTH FORM */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 filter blur-[160px] pointer-events-none" />
        
        <Suspense fallback={<div className="text-muted font-black uppercase tracking-widest text-[10px] animate-pulse">Initializing Security...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)',
  border: '1px solid var(--border)', borderRadius: '12px', color: '#FFF',
  fontSize: '0.9375rem', outline: 'none', transition: 'all 0.2s',
  fontFamily: 'inherit'
};
