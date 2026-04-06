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
    <div className="min-h-screen bg-[#030508] flex items-center justify-center p-24">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-electric/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link 
          href="/login" 
          className="flex items-center gap-2 text-muted hover:text-white transition-colors mb-32 text-[10px] font-black uppercase tracking-widest group w-fit"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Login
        </Link>

        <div className="card p-32 md:p-40 border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-grad-gold opacity-50" />
          
          <div className="mb-32">
            <h1 className="font-display text-3xl font-black text-white italic uppercase tracking-tight mb-12">
              Reset <span className="text-grad-gold">Access</span>
            </h1>
            <p className="text-muted text-[11px] font-bold uppercase tracking-widest opacity-60 leading-relaxed">
              Enter your registered email and we'll transmit a secure synchronization link to recover your matrix credentials.
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-24">
              {error && (
                <div className="flex items-center gap-12 p-16 bg-danger/10 border border-danger/20 rounded-xl animate-shake">
                  <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
                  <p className="text-danger text-[10px] font-black uppercase tracking-widest leading-tight">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-8">
                <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-4">
                  Neural Identity (Email)
                </label>
                <div className="relative group">
                  <Mail className="absolute left-16 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-blue-electric transition-colors" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="identity@predchain.network"
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-16 pl-48 pr-20 text-white font-mono text-sm focus:outline-none focus:border-blue-electric/40 transition-all placeholder:text-white/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="btn btn-blue w-full py-16 font-black uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-blue-electric/20 flex items-center justify-center gap-12 group"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Transmit Link
                    <ArrowLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center text-center py-12 animate-fade-in">
              <div className="w-64 h-64 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mb-24 relative">
                <div className="absolute inset-0 bg-success/20 blur-xl rounded-full" />
                <CheckCircle2 className="w-32 h-32 text-success relative z-10" />
              </div>
              <h3 className="text-white font-black uppercase tracking-widest mb-12">Transmission Successful</h3>
              <p className="text-muted text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-[280px]">
                Verification sequence sent to <span className="text-white">{email}</span>. Please check your terminal in-box.
              </p>
              <Link 
                href="/login" 
                className="mt-32 btn btn-outline w-full py-14 text-[10px] font-black uppercase tracking-widest"
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
