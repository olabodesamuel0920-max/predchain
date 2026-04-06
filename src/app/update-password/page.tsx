'use client';

import { useState } from 'react';
import { Shield, KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { updatePassword } from '@/app/actions/auth';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsPending(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsPending(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const result = await updatePassword(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030508] flex items-center justify-center p-24">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-electric/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="card p-32 md:p-40 border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-grad-gold opacity-50" />
          
          <div className="mb-32 flex flex-col items-center text-center">
            <div className="w-48 h-48 rounded-lg bg-blue-electric/10 border border-blue-electric/20 flex items-center justify-center mb-24">
              <Shield className="w-24 h-24 text-blue-electric" />
            </div>
            <h1 className="font-display text-2xl font-black text-white italic uppercase tracking-tight mb-8">
              Update <span className="text-grad-gold">Protocol</span>
            </h1>
            <p className="text-muted text-[10px] font-bold uppercase tracking-widest opacity-60 leading-relaxed max-w-[280px]">
              Secure your synchronization node by establishing a new master access key.
            </p>
          </div>

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
                New Matrix Key
              </label>
              <div className="relative group">
                <KeyRound className="absolute left-16 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-blue-electric transition-colors" />
                <input
                  type="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Master Protocol Key"
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-16 pl-48 pr-20 text-white font-mono text-sm focus:outline-none focus:border-blue-electric/40 transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-4">
                Confirm Matrix Key
              </label>
              <div className="relative group">
                <KeyRound className="absolute left-16 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-blue-electric transition-colors" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Verify Key Hash"
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
                  Establish Connection
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
