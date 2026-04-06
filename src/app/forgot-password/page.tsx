'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { resetPassword } from '@/app/actions/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await resetPassword(formData);

    setIsPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#030508] flex items-center justify-center p-12 md:p-24 overflow-y-auto">
      {/* Background Glows (Subtle on mobile) */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-blue-electric/5 blur-[120px] pointer-events-none hidden md:block" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gold/5 blur-[120px] pointer-events-none hidden md:block" />

      <div className="w-full max-w-sm relative z-10 py-24">
        <Link 
          href="/login" 
          className="flex items-center gap-2 text-muted hover:text-white transition-colors mb-20 text-[10px] font-black uppercase tracking-widest group w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          Back to Login
        </Link>

        <div className="card p-24 md:p-32 border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-grad-gold opacity-50" />
          
          <div className="mb-24">
            <h1 className="font-display text-2xl font-black text-white italic uppercase tracking-tight mb-8">
              Reset <span className="text-grad-gold">Password</span>
            </h1>
            <p className="text-muted text-[10px] font-bold uppercase tracking-widest opacity-60 leading-relaxed">
              Enter your email address and we'll send a secure link to reset your account password.
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-16">
              {error && (
                <div className="flex items-center gap-10 p-12 bg-danger/10 border border-danger/20 rounded-xl animate-shake">
                  <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
                  <p className="text-danger text-[9px] font-black uppercase tracking-widest leading-tight">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-6">
                <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-16 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted group-focus-within:text-blue-electric transition-colors" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-12 pl-44 pr-16 text-white font-mono text-xs focus:outline-none focus:border-blue-electric/40 transition-all placeholder:text-white/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="btn btn-blue w-full py-12 font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-blue-electric/20 flex items-center justify-center gap-10 group"
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    Send Reset Link
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center text-center py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mb-20 relative">
                <div className="absolute inset-0 bg-success/20 blur-xl rounded-full" />
                <CheckCircle2 className="w-8 h-8 text-success relative z-10" />
              </div>
              <h3 className="text-white font-black uppercase tracking-widest mb-8 text-sm">Check your email</h3>
              <p className="text-muted text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-[240px]">
                We've sent a password reset link to <span className="text-white">{email}</span>. Please check your inbox.
              </p>
              <Link 
                href="/login" 
                className="mt-24 btn btn-outline w-full py-12 text-[10px] font-black uppercase tracking-widest"
              >
                Return to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
