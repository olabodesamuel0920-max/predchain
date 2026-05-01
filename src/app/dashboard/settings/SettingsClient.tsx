"use client";

import { useState } from 'react';
import { 
  User, 
  Shield, 
  KeyRound, 
  Mail, 
  Phone, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  LogOut, 
  Copy, 
  Calendar,
  Globe
} from 'lucide-react';
import { updatePassword, updateProfile, logout } from '@/app/actions/auth';
import { Profile } from '@/types';

interface SettingsClientProps {
  profile: Profile;
}

export default function SettingsClient({ profile }: SettingsClientProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isProfilePending, setIsProfilePending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Profile fields state
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [username, setUsername] = useState(profile.username || '');
  const [phone, setPhone] = useState(profile.phone || '');

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setSuccess(false);

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

    setIsPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProfilePending(true);
    setProfileError(null);
    setProfileSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    setIsProfilePending(false);
    if (result?.error) {
      setProfileError(result.error);
    } else {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 5000);
    }
  };

  const handleCopyReferral = () => {
    const link = `${window.location.origin}/signup?ref=${profile.username}`;
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Unified Identity Resolver Protocol
  const displayName = profile.full_name || (profile.username ? `@${profile.username}`.toUpperCase() : null) || profile.email?.split('@')[0] || 'Account';
  const initial = profile.full_name ? profile.full_name.charAt(0).toUpperCase() : (profile.username ? profile.username.charAt(0).toUpperCase() : 'A');

  const statusLabels = {
    active: { label: 'Active', color: 'success' },
    suspended: { label: 'Suspended', color: 'danger' },
    under_review: { label: 'Review', color: 'gold' },
    demo: { label: 'Demo', color: 'blue-electric' }
  };

  const status = statusLabels[profile.status as keyof typeof statusLabels] || statusLabels.active;
  const joinedDate = new Date(profile.created_at).toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="container py-12 md:py-24 animate-fade-in max-w-6xl">
      <div className="flex flex-col gap-16 md:gap-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-16">
          <div>
            <h1 className="font-display text-3xl font-black text-white italic uppercase tracking-tight mb-4">
              Account <span className="text-grad-gold">Center</span>
            </h1>
            <p className="text-muted text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
              Manage your profile and security settings
            </p>
          </div>
          
          <form action={logout}>
            <button type="submit" className="flex items-center gap-6 px-12 py-6 bg-danger/10 border border-danger/20 rounded-xl text-danger text-[9px] font-black uppercase tracking-widest hover:bg-danger/20 transition-all group">
              <LogOut className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              Sign Out
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24">
          {/* Identity Summary Card */}
          <div className="lg:col-span-1 flex flex-col gap-16 md:gap-20">
            <div className="card p-20 bg-white/[0.01] border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                  <User className="w-16 h-16" />
               </div>
               
               <div className="flex flex-col items-center text-center mb-20 md:mb-24">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-blue-electric/10 border border-blue-electric/20 flex items-center justify-center font-black text-2xl md:text-3xl text-blue-electric mb-12 md:mb-16 shadow-2xl shadow-blue-electric/10">
                    {initial}
                  </div>
                  <h2 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tight leading-tight">{displayName}</h2>
                  <span className="text-[9px] font-black text-blue-electric uppercase tracking-widest mt-2">Verified Member</span>
               </div>

               <div className="flex flex-col gap-8 md:gap-10">
                  <div className="flex items-center justify-between p-10 bg-black/40 border border-white/5 rounded-xl">
                     <span className="text-[8px] font-black text-muted uppercase tracking-[0.2em]">Username</span>
                     <span className="text-[10px] font-mono font-black text-white">@{profile.username}</span>
                  </div>
                  <div className="flex items-center justify-between p-10 bg-black/40 border border-white/5 rounded-xl">
                     <span className="text-[8px] font-black text-muted uppercase tracking-[0.2em]">Status</span>
                     <div className="flex items-center gap-6">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${status.color} animate-pulse`} style={{ boxShadow: `0 0 4px var(--${status.color})` }} />
                        <span className={`text-[10px] font-black text-${status.color} uppercase tracking-widest`}>
                          {status.label}
                        </span>
                     </div>
                  </div>
                  <div className="flex items-center justify-between p-10 bg-black/40 border border-white/5 rounded-xl">
                     <span className="text-[8px] font-black text-muted uppercase tracking-[0.2em]">Access</span>
                     <span className="text-[10px] font-black text-gold uppercase tracking-widest">{profile.role}</span>
                  </div>
                  <div className="flex items-center justify-between p-10 bg-black/40 border border-white/5 rounded-xl">
                     <span className="text-[8px] font-black text-muted uppercase tracking-[0.2em]">Joined</span>
                     <div className="flex items-center gap-6">
                        <Calendar className="w-3 h-3 text-muted" />
          <span className="text-[10px] font-black text-white/50 uppercase tracking-widest" suppressHydrationWarning>
            {joinedDate}
          </span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Referral Info */}
            <div className="card p-16 border-blue-electric/10 bg-blue-electric/[0.02]">
               <div className="flex items-center gap-8 mb-8">
                  <Globe className="w-4 h-4 text-blue-electric" />
                  <h3 className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Members Network</h3>
               </div>
               <p className="text-muted text-[10px] font-bold uppercase tracking-widest leading-relaxed opacity-60 mb-12">
                 Invite new members to PredChain and claim account rewards.
               </p>
               <button 
                 onClick={handleCopyReferral}
                 className="w-full flex items-center justify-between gap-12 p-10 bg-black/40 border border-white/10 rounded-xl hover:border-blue-electric/40 transition-all group"
               >
                 <span className="text-[9px] font-mono font-black text-blue-electric truncate">
                    {copySuccess ? 'Link Copied' : `predchain.com/ref=${profile.username}`}
                 </span>
                 <Copy className={`w-3.5 h-3.5 ${copySuccess ? 'text-success' : 'text-blue-electric'}`} />
               </button>
            </div>
            {/* Security Notice */}
            <div className="card p-16 bg-gold/[0.02] border-gold/10">
               <div className="flex items-center gap-8 mb-8">
                  <Shield className="w-4 h-4 text-gold" />
                  <h3 className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Security</h3>
               </div>
               <p className="text-muted text-[10px] font-bold uppercase tracking-widest leading-relaxed opacity-60">
                 Ensure your account password is updated regularly to keep your assets secure.
               </p>
            </div>
          </div>

          {/* Settings Actions */}
          <div className="lg:col-span-2 flex flex-col gap-16 md:gap-24">
            
            {/* Identity Form */}
            <div className="card p-20 md:p-24 border-white/5">
               <div className="flex items-center gap-10 mb-20 md:mb-24 border-b border-white/5 pb-12 md:pb-16">
                  <User className="w-4.5 h-4.5 text-blue-electric" />
                  <h3 className="text-[11px] md:text-[12px] font-black text-white uppercase tracking-widest">Profile Details</h3>
               </div>
               
               <form onSubmit={handleProfileUpdate} className="flex flex-col gap-16 md:gap-20">
                  {profileSuccess && (
                    <div className="flex items-center gap-10 p-12 bg-success/10 border border-success/20 rounded-xl animate-fade-in">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                      <p className="text-success text-[10px] font-black uppercase tracking-widest">Profile updated successfully.</p>
                    </div>
                  )}
                  
                  {profileError && (
                    <div className="flex items-center gap-10 p-12 bg-danger/10 border border-danger/20 rounded-xl animate-shake">
                      <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
                      <p className="text-danger text-[10px] font-black uppercase tracking-widest">{profileError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
                    <div className="flex flex-col gap-6">
                       <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">Full Name</label>
                       <input
                         type="text"
                         name="full_name"
                         value={fullName}
                         onChange={(e) => setFullName(e.target.value)}
                         className="w-full bg-black/40 border border-white/5 rounded-xl py-10 px-12 text-white font-mono text-sm focus:outline-none focus:border-blue-electric/40 transition-all focus:bg-black/60"
                       />
                    </div>
                    <div className="flex flex-col gap-6">
                       <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">Username</label>
                       <div className="relative group">
                          <span className="absolute left-12 top-1/2 -translate-y-1/2 text-muted font-mono text-sm">@</span>
                          <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-xl py-10 pl-24 pr-12 text-white font-mono text-sm focus:outline-none focus:border-blue-electric/40 transition-all uppercase focus:bg-black/60"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
                    <div className="flex flex-col gap-6">
                       <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">Email Address</label>
                       <div className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-12 py-10 text-white/20 font-mono text-sm cursor-not-allowed">
                         {profile.email}
                       </div>
                    </div>
                    <div className="flex flex-col gap-6">
                       <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">Phone Number</label>
                       <input
                         type="tel"
                         name="phone"
                         value={phone}
                         onChange={(e) => setPhone(e.target.value)}
                         className="w-full bg-black/40 border border-white/5 rounded-xl py-10 px-12 text-white font-mono text-sm focus:outline-none focus:border-blue-electric/40 transition-all focus:bg-black/60"
                       />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProfilePending}
                    className="btn btn-blue w-full md:w-fit px-24 py-11 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-electric/20 flex items-center justify-center gap-10 group mt-4"
                  >
                    {isProfilePending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>Save Changes</>
                    )}
                  </button>
               </form>
            </div>

            {/* Password Reset Form */}
            <div className="card p-20 md:p-24 border-white/5 bg-white/[0.01]">
               <div className="flex items-center gap-10 mb-20 md:mb-24 border-b border-white/5 pb-12 md:pb-16">
                  <KeyRound className="w-4.5 h-4.5 text-gold" />
                  <h3 className="text-[11px] md:text-[12px] font-black text-white uppercase tracking-widest">Change Password</h3>
               </div>

               <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-16 md:gap-20 max-w-sm">
                 {success && (
                    <div className="flex items-center gap-10 p-12 bg-success/10 border border-success/20 rounded-xl animate-fade-in">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                      <p className="text-success text-[10px] font-black uppercase tracking-widest">
                        Password updated successfully.
                      </p>
                    </div>
                 )}
                 
                 {error && (
                    <div className="flex items-center gap-10 p-12 bg-danger/10 border border-danger/20 rounded-xl animate-shake">
                      <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
                      <p className="text-danger text-[10px] font-black uppercase tracking-widest">
                        {error}
                      </p>
                    </div>
                 )}

                 <div className="flex flex-col gap-6">
                   <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">New Password</label>
                   <div className="relative group">
                     <Lock className="absolute left-16 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted group-focus-within:text-gold transition-colors" />
                     <input
                       type="password"
                       name="password"
                       required
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="••••••••"
                       className="w-full bg-black/40 border border-white/5 rounded-xl py-10 pl-44 pr-16 text-white font-mono text-sm focus:outline-none focus:border-gold/40 transition-all focus:bg-black/60"
                     />
                   </div>
                 </div>

                 <div className="flex flex-col gap-6">
                   <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-2">Confirm New Password</label>
                   <div className="relative group">
                     <Lock className="absolute left-16 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted group-focus-within:text-gold transition-colors" />
                     <input
                       type="password"
                       required
                       value={confirmPassword}
                       onChange={(e) => setConfirmPassword(e.target.value)}
                       placeholder="••••••••"
                       className="w-full bg-black/40 border border-white/5 rounded-xl py-10 pl-44 pr-16 text-white font-mono text-sm focus:outline-none focus:border-gold/40 transition-all focus:bg-black/60"
                     />
                   </div>
                 </div>

                 <button
                   type="submit"
                   disabled={isPending}
                   className="btn btn-blue w-full md:w-fit px-24 py-11 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-electric/20 flex items-center justify-center gap-10 group mt-4"
                 >
                   {isPending ? (
                     <Loader2 className="w-3.5 h-3.5 animate-spin" />
                   ) : (
                     <>Update Password</>
                   )}
                 </button>
               </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
