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
    <div className="w-full max-w-[400px] relative z-10 px-4 md:px-0">
      <div className="mb-10 text-center md:text-left">
        <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-3 uppercase tracking-tighter italic">Join Arena</h2>
        <p className="text-[10px] text-muted font-bold uppercase tracking-[0.2em] opacity-30 italic">Protocol access authorization</p>
      </div>

      <form action={signupAction} className="flex flex-col gap-5">
        {errorMsg && (
          <div className="p-4 bg-danger/5 border border-danger/10 rounded-xl text-danger text-[9px] font-black uppercase tracking-[0.2em] text-center animate-slide-up italic">
            {errorMsg}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-muted uppercase tracking-[0.3em] ml-1 opacity-40 italic">Full Identity</label>
            <input name="full_name" type="text" required placeholder="John Doe" className="bg-white/[0.02] border border-white/5 rounded-xl py-3.5 px-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-muted uppercase tracking-[0.3em] ml-1 opacity-40 italic">Operator Alias</label>
            <input name="username" type="text" required placeholder="striker1" className="bg-white/[0.02] border border-white/5 rounded-xl py-3.5 px-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all" />
          </div>
        </div>

        <div className="flex flex-col gap-2 text-left">
          <label className="text-[9px] font-black text-muted uppercase tracking-[0.3em] ml-1 opacity-40 italic">Registry Email</label>
          <input name="email" type="email" required placeholder="operator@predchain.arena" className="bg-white/[0.02] border border-white/5 rounded-xl py-3.5 px-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all" />
        </div>

        <div className="flex flex-col gap-2 text-left">
          <label className="text-[9px] font-black text-muted uppercase tracking-[0.3em] ml-1 opacity-40 italic">Mobile Contact (WhatsApp/Calls)</label>
          <input name="phone" type="tel" required placeholder="+234..." className="bg-white/[0.02] border border-white/5 rounded-xl py-3.5 px-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-muted uppercase tracking-[0.3em] ml-1 opacity-40 italic">Access Key</label>
            <input name="password" type="password" required placeholder="••••••••" className="bg-white/[0.02] border border-white/5 rounded-xl py-3.5 px-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-muted uppercase tracking-[0.3em] ml-1 opacity-40 italic">Referral Code</label>
            <input 
              name="referral_code" 
              type="text" 
              placeholder="Optional" 
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="bg-white/[0.02] border border-white/5 rounded-xl py-3.5 px-5 text-[11px] font-bold text-gold placeholder:text-white/10 focus:outline-none focus:border-gold/30 focus:bg-white/[0.04] transition-all" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isPending} 
          className="btn btn-blue w-full mt-6 py-4.5 !rounded-xl italic shadow-2xl shadow-blue-electric/10"
        >
          {isPending ? 'Onboarding...' : 'Join the Arena'}
        </button>
      </form>

      <p className="text-center md:text-left text-[9px] text-muted font-black uppercase tracking-[0.25em] mt-12 opacity-30 italic">
        Existing operator? <Link href={loginUrl} className="text-gold hover:text-white transition-colors border-b border-gold/20 hover:border-white">Authorize Entry</Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex bg-[#030508] overflow-hidden">
      
      {/* LEFT: CINEMATIC ART */}
      <div className="auth-pane-left bg-[#020406] border-r border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-electric/5 filter blur-[150px] opacity-20 rounded-full z-1" />
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
            Join the <br />
            <span className="text-gradient-gold">Arena.</span> <br />
            Win Big.
          </h1>
          <p className="text-[10px] text-muted font-black leading-relaxed uppercase tracking-[0.4em] opacity-30 italic">
            High-Yield Football Challenge Arena
          </p>
        </div>
      </div>

      {/* RIGHT: AUTH FORM */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/5 filter blur-[120px] pointer-events-none" />
        
        <Suspense fallback={<div className="text-muted font-black uppercase tracking-[0.2em] text-[10px] animate-pulse italic">Synchronizing...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
