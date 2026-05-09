'use client';

import { useState, useEffect, Suspense } from 'react';
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
    <div className="w-full max-w-[440px] animate-fade-in px-6 relative z-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2.5 badge-luxury mb-6 px-4 py-1.5 bg-gold/5 border-gold/10">
           <Radio className="w-3 h-3 text-gold animate-pulse" /> 
           <span className="font-display tracking-[0.15em] font-extrabold pb-px">ARENA ACCESS</span>
        </div>
        <h2 className="mb-3 uppercase italic font-black leading-tight tracking-tighter">Create Your <span className="text-gradient-gold">Account.</span></h2>
        <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] opacity-40">Join the elite performance arena</p>
      </div>

      <form action={signupAction} className="space-y-5">
        {errorMsg && (
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-2xl text-danger text-[10px] font-black uppercase tracking-widest text-center animate-slide-up flex items-center justify-center gap-3">
             <Activity className="w-4 h-4" />
             {errorMsg}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1 opacity-40 italic">
              Full Name
            </label>
            <input 
              name="full_name" 
              type="text" 
              required 
              placeholder="Full Name" 
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 transition-all shadow-inner focus:bg-white/[0.04]" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1 opacity-40 italic">
              Username
            </label>
            <input 
              name="username" 
              type="text" 
              required 
              placeholder="Username" 
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 transition-all shadow-inner focus:bg-white/[0.04]" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[9px] font-black text-muted uppercase tracking-widest ml-1 opacity-40 italic">
            <Mail className="w-3.5 h-3.5 opacity-60" /> Email Address
          </label>
          <input 
            name="email" 
            type="email" 
            required 
            placeholder="name@example.com" 
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 transition-all shadow-inner focus:bg-white/[0.04]" 
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[9px] font-black text-muted uppercase tracking-widest ml-1 opacity-40 italic">
            <Phone className="w-3.5 h-3.5 opacity-60" /> Phone Number
          </label>
          <input 
            name="phone" 
            type="tel" 
            required 
            placeholder="+234..." 
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 transition-all shadow-inner focus:bg-white/[0.04]" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[9px] font-black text-muted uppercase tracking-widest ml-1 opacity-40 italic">
              <Lock className="w-3.5 h-3.5 opacity-60" /> Password
            </label>
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••" 
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-gold/30 transition-all shadow-inner focus:bg-white/[0.04]" 
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[9px] font-black text-muted uppercase tracking-widest ml-1 opacity-40 italic">
              <Ticket className="w-3.5 h-3.5 opacity-60" /> Invite Code
            </label>
            <input 
              name="referral_code" 
              type="text" 
              placeholder="Optional" 
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm text-gold placeholder:text-white/10 focus:outline-none focus:border-gold/30 transition-all shadow-inner font-bold focus:bg-white/[0.04]" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isPending} 
          className="btn-luxury btn-gold w-full py-5 shadow-2xl mt-6 group"
        >
          <span className="flex items-center justify-center gap-3">
             {isPending ? (
               <Activity className="w-5 h-5 animate-spin" />
             ) : (
               <>
                 START YOUR JOURNEY <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
               </>
             )}
          </span>
        </button>
      </form>

      <div className="mt-12 text-center">
        <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] opacity-30">
          Already a member? <Link href={loginUrl} className="text-gold hover:text-white transition-colors border-b border-gold/20 hover:border-white ml-2 pb-0.5 italic">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex bg-[#020406] overflow-hidden font-display">
      
      {/* LEFT: Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-16 bg-[#030508] border-r border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-glow blur-[140px] opacity-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-glow blur-[100px] opacity-5 pointer-events-none" />
        
        <Link href="/" className="relative z-10 flex items-center gap-3 group">
           <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/10 flex items-center justify-center text-gold">
              <ShieldCheck className="w-5 h-5" />
           </div>
           <span className="font-display text-2xl font-black text-white uppercase tracking-tighter italic">Pred<span className="text-gold">Chain.</span></span>
        </Link>
        
        <div className="relative z-10 max-w-md">
          <div className="badge-luxury mb-10 px-6 py-2">ELITE PERFORMANCE</div>
          <h1 className="mb-8 leading-[1.1] uppercase italic font-black text-6xl">
            Join the <br />
            <span className="text-gradient-gold">Arena.</span> <br />
            Win Big.
          </h1>
          <p className="text-[11px] font-black text-muted uppercase tracking-[0.5em] opacity-30 leading-loose italic">
            High-Yield Sports Prediction Arena
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-muted opacity-40">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] italic">System Active</span>
           </div>
           <div className="w-px h-4 bg-white/10" />
           <span className="text-[9px] font-black uppercase tracking-[0.3em] italic">256-BIT ENCRYPTION</span>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold-glow blur-[120px] opacity-10 pointer-events-none" />
        
        <Suspense fallback={
          <div className="flex flex-col items-center gap-6 animate-pulse">
             <div className="w-12 h-12 rounded-2xl bg-gold/5 border border-gold/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-gold/30" />
             </div>
             <div className="text-[10px] font-black text-gold/30 uppercase tracking-[0.5em] italic">Initializing Arena...</div>
          </div>
        }>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
