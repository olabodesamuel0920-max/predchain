'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signup } from '@/app/actions/auth';
import { User, Mail, Lock, Phone, Ticket, ShieldCheck, ArrowRight } from 'lucide-react';

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
    <div className="w-full max-w-[420px] animate-fade-in px-6">
      <div className="text-center mb-10">
        <h2 className="mb-2">Join the <span className="text-gradient-gold">Arena.</span></h2>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-40">Create your account to start winning</p>
      </div>

      <form action={signupAction} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-[10px] font-bold uppercase tracking-widest text-center animate-slide-up">
            {errorMsg}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[9px] font-bold text-muted uppercase tracking-widest ml-1 opacity-40">
              Full Name
            </label>
            <input 
              name="full_name" 
              type="text" 
              required 
              placeholder="Full Name" 
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 transition-all shadow-inner" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[9px] font-bold text-muted uppercase tracking-widest ml-1 opacity-40">
              Username
            </label>
            <input 
              name="username" 
              type="text" 
              required 
              placeholder="Username" 
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 transition-all shadow-inner" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[9px] font-bold text-muted uppercase tracking-widest ml-1 opacity-40">
            <Mail className="w-3 h-3" /> Email Address
          </label>
          <input 
            name="email" 
            type="email" 
            required 
            placeholder="name@example.com" 
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 transition-all shadow-inner" 
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[9px] font-bold text-muted uppercase tracking-widest ml-1 opacity-40">
            <Phone className="w-3 h-3" /> Phone Number
          </label>
          <input 
            name="phone" 
            type="tel" 
            required 
            placeholder="+234..." 
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 transition-all shadow-inner" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[9px] font-bold text-muted uppercase tracking-widest ml-1 opacity-40">
              <Lock className="w-3 h-3" /> Password
            </label>
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••" 
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 transition-all shadow-inner" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[9px] font-bold text-muted uppercase tracking-widest ml-1 opacity-40">
              <Ticket className="w-3 h-3" /> Referral Code
            </label>
            <input 
              name="referral_code" 
              type="text" 
              placeholder="Optional" 
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-xs text-gold placeholder:text-white/10 focus:outline-none focus:border-gold/30 transition-all shadow-inner font-bold" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isPending} 
          className="btn btn-blue w-full py-4 shadow-xl mt-4"
        >
          {isPending ? 'Processing...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-30">
          Already have an account? <Link href={loginUrl} className="text-gold hover:text-white transition-colors border-b border-gold/20 hover:border-white ml-2 pb-0.5">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex bg-[#020406] overflow-hidden">
      
      {/* LEFT: Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-16 bg-[#030508] border-r border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-glow blur-[120px] opacity-10 pointer-events-none" />
        
        <Link href="/" className="relative z-10 flex items-center gap-2 group">
           <span className="font-display text-2xl font-black text-white uppercase tracking-tighter italic">Pred<span className="text-gradient-gold">Chain</span></span>
        </Link>
        
        <div className="relative z-10 max-w-sm">
          <h1 className="mb-6 leading-tight">
            Join the <br />
            <span className="text-gradient-gold">Arena.</span> <br />
            Win Big.
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
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
