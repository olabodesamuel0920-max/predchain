'use client';

import { useState, useTransition } from 'react';
import { 
  Search, 
  User, 
  Users,
  Wallet, 
  Sword, 
  TrendingUp, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Activity,
  ChevronRight,
  UserPlus,
  Check,
  AlertCircle,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import { searchUsers, updateUserStatus, adjustUserWallet, getUserDetails, createDemoUser } from '@/app/actions/admin';
import { AdminSearchProfile, Profile, FullUserDetails, UserStatus } from '@/types';
import { useFeedback } from '@/hooks/useFeedback';

export default function UsersView() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AdminSearchProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<FullUserDetails | null>(null);
  const [isPending, startTransition] = useTransition();
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');
  const { success: successMsg, error: errorMsg, showSuccess, showError, clear } = useFeedback();
  const [activeTab, setActiveTab] = useState<'overview' | 'arena' | 'finance' | 'referrals'>('overview');
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoData, setDemoData] = useState({ email: '', username: '', password: '', balance: 14000 });

  const handleSearch = async () => {
    startTransition(async () => {
      try {
        const data = await searchUsers(query);
        setResults(data);
      } catch (err: unknown) {
        showError((err as Error).message || 'Search failed');
      }
    });
  };

  const loadUserDetails = async (userId: string) => {
    startTransition(async () => {
      try {
        const details = await getUserDetails(userId);
        setUserDetails(details);
        setSelectedUserId(userId);
      } catch (err: unknown) {
        showError((err as Error).message || 'Failed to load details');
      }
    });
  };

  const handleUpdateStatus = async (userId: string, updates: Partial<Profile>) => {
    startTransition(async () => {
      try {
        await updateUserStatus(userId, updates as { status?: UserStatus; is_verified?: boolean; is_suspended?: boolean; is_demo?: boolean; admin_notes?: string; phone_verified?: boolean; });
        showSuccess('User updated successfully');
        if (selectedUserId === userId) {
          loadUserDetails(userId);
        }
        handleSearch();
      } catch (err: unknown) {
        showError((err as Error).message || 'Update failed');
      }
    });
  };

  const handleAdjustWallet = async () => {
    if (!selectedUserId || !adjustAmount) return;
    startTransition(async () => {
      try {
        await adjustUserWallet(selectedUserId, adjustAmount, adjustReason);
        setAdjustAmount(0);
        setAdjustReason('');
        showSuccess('Wallet adjusted successfully');
        loadUserDetails(selectedUserId);
        handleSearch();
      } catch (err: unknown) {
        showError((err as Error).message || 'Adjustment failed');
      }
    });
  };

  const handleCreateDemo = async () => {
    if (!demoData.email || !demoData.username || !demoData.password) return;
    startTransition(async () => {
      try {
        await createDemoUser(demoData);
        showSuccess('Demo user created successfully');
        setShowDemoModal(false);
        setDemoData({ email: '', username: '', password: '', balance: 14000 });
        handleSearch();
      } catch (err: unknown) {
        showError((err as Error).message || 'Creation failed');
      }
    });
  };

  return (
    <>
    <div className="flex flex-col gap-24 animate-slide-up">
      {/* Notifications */}
      {(successMsg || errorMsg) && (
        <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl backdrop-blur-xl border flex items-center gap-3 shadow-2xl animate-slide-up ${
          successMsg ? 'bg-success/90 border-success/20 text-black' : 'bg-danger/90 border-danger/20 text-white'
        }`}>
           {successMsg ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
           <span className="text-xs font-bold">{successMsg || errorMsg}</span>
           <button onClick={clear} className="ml-12 p-4 hover:bg-black/10 rounded-lg opacity-40 hover:opacity-100 transition-all font-black">×</button>
        </div>
      )}

      {/* SEARCH HEADER */}
      <div className="card p-4">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="p-10 bg-blue-electric/10 rounded-lg"><Users className="w-5 h-5 text-blue-electric" /></div>
             <h2 className="font-display text-lg font-bold tracking-tight">User Management</h2>
          </div>
          <div className="flex flex-1 max-w-[500px] gap-3 items-center">
            <div className="relative flex-1">
               <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-4 h-4 text-muted opacity-40" />
               <input 
                 type="text" 
                 placeholder="Search by username, email, or ID..." 
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                 className="input-premium pl-32 py-10"
               />
            </div>
            <button onClick={handleSearch} disabled={isPending} className="btn btn-blue btn-xs px-6 h-10 font-black uppercase tracking-widest text-[10px]">
              {isPending ? 'SEARCHING...' : 'SEARCH'}
            </button>
            <div className="h-24 w-px bg-white/10 mx-4" />
            <button onClick={() => setShowDemoModal(true)} className="btn btn-primary btn-xs px-6 h-10 font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> CREATE DEMO
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        {/* RESULTS LIST */}
        <div className="flex flex-col gap-12">
          {results.length === 0 ? (
            <div className="card py-60 text-center flex flex-col items-center gap-4 opacity-30">
               <Activity className="w-10 h-10 text-muted" />
               <p className="text-[10px] font-black uppercase tracking-widest italic font-mono">No users found. Use the search bar above.</p>
            </div>
          ) : (
            results.map(user => (
              <div 
                key={user.id} 
                onClick={() => loadUserDetails(user.id)}
                className={`card p-16 cursor-pointer transition-all border outline-none ${
                  selectedUserId === user.id 
                  ? 'border-blue-electric bg-blue-electric/[0.03] shadow-lg shadow-blue-electric/10' 
                  : 'border-white/5 hover:border-white/10 bg-white/[0.02]'
                }`}
              >
                <div className="flex justify-between items-center gap-16">
                  <div className="flex items-center gap-16">
                    <div className={`w-24 h-24 rounded-lg flex items-center justify-center font-black text-[10px] font-display uppercase ${
                      user.is_demo ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'bg-primary border border-white/10 text-blue-electric'
                    }`}>
                      {user.username?.[0] || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-8 mb-1">
                         <span className="font-black text-sm text-white">@{user.username}</span>
                         {user.is_demo && <span className="badge badge-gold !text-[7px] px-2 py-0.5">DEMO</span>}
                         {user.is_suspended && <span className="badge badge-danger !text-[7px] px-2 py-0.5">SUSPENDED</span>}
                      </div>
                      <div className="text-[9px] text-muted font-medium font-mono uppercase tracking-tighter opacity-60">
                         {user.email} <span className="mx-4 opacity-20">|</span> {user.status}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="text-white font-black text-sm font-mono">₦{user.wallets?.[0]?.balance_ngn?.toLocaleString() || 0}</div>
                    <div className="text-[9px] text-muted uppercase font-black tracking-widest opacity-40">{user.role}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DETAIL VIEW PANEL */}
        <div className="sticky top-24">
          {!selectedUserId ? (
            <div className="card py-60 flex flex-col items-center justify-center border-dashed border-white/10 opacity-20 bg-transparent shadow-none">
              <User className="w-10 h-10 mb-8 opacity-40" />
              <p className="text-[9px] font-black uppercase tracking-widest text-center max-w-[150px] leading-relaxed italic">Select a user to view full profile</p>
            </div>
          ) : !userDetails ? (
            <div className="card py-60 flex flex-col items-center justify-center">
               <div className="w-10 h-10 border-2 border-blue-electric/20 border-t-blue-electric rounded-full animate-spin mb-16" />
               <p className="text-[10px] text-muted font-black tracking-widest uppercase">Fetching details...</p>
            </div>
          ) : (
            <div className="card p-0 animate-slide-up flex flex-col overflow-hidden">
              {/* Profile Header */}
              <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                     <div className="p-8 bg-white/5 rounded-xl border border-white/10"><User className="w-5 h-5 text-white" /></div>
                     <div>
                       <h3 className="font-display text-lg font-black tracking-tight flex items-center gap-8">
                         {userDetails.profile?.username}
                         {userDetails.profile?.is_verified && <ShieldCheck className="w-4 h-4 text-success" />}
                       </h3>
                       <p className="text-[9px] text-muted font-mono uppercase tracking-tighter mt-1">{userDetails.profile?.id}</p>
                     </div>
                  </div>
                  <button onClick={() => { setSelectedUserId(null); setUserDetails(null); }} className="p-8 hover:bg-white/5 rounded-lg opacity-40 hover:opacity-100 transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-2 p-4 bg-white/5 rounded-lg w-full">
                  {[
                    { id: 'overview', label: 'PROFILE', icon: User },
                    { id: 'arena', label: 'HISTORY', icon: Sword },
                    { id: 'finance', label: 'WALLET', icon: Wallet },
                    { id: 'referrals', label: 'NETWORK', icon: TrendingUp },
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'overview' | 'arena' | 'finance' | 'referrals')} 
                      className={`flex-1 flex items-center justify-center gap-6 px-4 py-8 rounded-md text-[9px] font-black tracking-widest transition-all ${
                        activeTab === tab.id ? 'bg-white/10 text-white' : 'text-muted hover:text-white'
                      }`}
                    >
                      <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-blue-electric' : 'opacity-40'}`} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Detail Body */}
              <div className="p-6 overflow-y-auto max-h-[600px]">
                {activeTab === 'overview' && (
                  <div className="flex flex-col gap-6 animate-fade-in">
                     <div className="grid grid-cols-2 gap-6">
                       <div className="p-16 bg-white/[0.03] border border-white/5 rounded-xl">
                         <div className="text-[9px] text-muted font-black uppercase mb-8 tracking-widest">Trust Status</div>
                         <div className={`flex items-center gap-6 text-[10px] font-black ${userDetails.profile?.is_verified ? 'text-success' : 'text-danger'}`}>
                            {userDetails.profile?.is_verified ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {userDetails.profile?.is_verified ? 'VERIFIED' : 'UNVERIFIED'}
                         </div>
                       </div>
                       <div className="p-16 bg-white/[0.03] border border-white/5 rounded-xl">
                         <div className="text-[9px] text-muted font-black uppercase mb-8 tracking-widest">Account State</div>
                         <div className="flex items-center gap-8">
                            <div className={`w-3 h-3 rounded-full ${userDetails.profile?.status === 'active' ? 'bg-success shadow-[0_0_8px_var(--success)]' : 'bg-danger'}`} />
                            <div className="text-[10px] font-black text-white uppercase tracking-tighter">{userDetails.profile?.status}</div>
                         </div>
                       </div>
                     </div>

                     <div className="flex flex-col gap-6">
                        <div className="text-[9px] text-muted uppercase font-black tracking-widest mb-4 ml-4">Administrative Access</div>
                        <div className="grid grid-cols-2 gap-6">
                           <button 
                             disabled={isPending}
                             onClick={() => handleUpdateStatus(userDetails.profile!.id, { is_verified: !userDetails.profile?.is_verified })}
                             className={`btn btn-xs py-10 font-black uppercase text-[9px] tracking-widest ${userDetails.profile?.is_verified ? 'btn-ghost' : 'btn-success'}`}
                           >
                             {userDetails.profile?.is_verified ? 'REVOKE VERIFICATION' : 'VERIFY IDENTITY'}
                           </button>
                           <button 
                             disabled={isPending}
                             onClick={() => handleUpdateStatus(userDetails.profile!.id, { status: userDetails.profile?.status === 'suspended' ? 'active' : 'suspended', is_suspended: userDetails.profile?.status !== 'suspended' })}
                             className={`btn btn-xs py-10 font-black uppercase text-[9px] tracking-widest ${userDetails.profile?.status === 'suspended' ? 'btn-success border-success/30' : 'btn-danger border-danger/30 text-danger'}`}
                           >
                             {userDetails.profile?.status === 'suspended' ? <Unlock className="w-3.5 h-3.5 mr-4" /> : <Lock className="w-3.5 h-3.5 mr-4" />}
                             {userDetails.profile?.status === 'suspended' ? 'RESTORE' : 'SUSPEND'}
                           </button>
                        </div>
                     </div>

                     <div className="flex flex-col gap-8">
                       <div className="text-[9px] text-muted uppercase font-black tracking-widest mb-4 ml-4">Internal Staff Notes</div>
                       <textarea 
                         className="input-premium text-[11px] h-24 py-12 leading-relaxed"
                         defaultValue={userDetails.profile?.admin_notes || ''}
                         placeholder="Add administrative notes regarding this member..."
                         onBlur={(e) => handleUpdateStatus(userDetails.profile!.id, { admin_notes: e.target.value })}
                       />
                     </div>
                  </div>
                )}

                {activeTab === 'arena' && (
                  <div className="flex flex-col gap-16 animate-fade-in">
                     <div className="flex justify-between items-center mb-12">
                        <div className="text-[9px] text-muted uppercase font-black tracking-widest">Recent Challenges</div>
                        <span className="badge badge-muted text-[8px] px-6 py-2">{userDetails.entries.length} Entries</span>
                     </div>
                     <div className="flex flex-col gap-6">
                        {userDetails.entries.length === 0 ? (
                          <div className="py-60 text-center flex flex-col items-center gap-12 opacity-30">
                             <Sword className="w-10 h-10 text-muted" />
                             <p className="text-[10px] text-muted font-mono italic">No challenge history found.</p>
                          </div>
                        ) : (
                          userDetails.entries.map(e => (
                             <div key={e.id} className="p-12 bg-white/[0.03] border border-white/5 rounded-xl flex justify-between items-center hover:bg-white/[0.05] transition-colors">
                                <div className="flex items-center gap-12">
                                  <div className="p-8 bg-blue-electric/10 rounded-lg text-blue-electric"><Sword className="w-4 h-4" /></div>
                                  <div>
                                    <div className="text-xs font-black text-white">Round {e.challenge_rounds?.round_number}</div>
                                    <div className="text-[9px] text-muted font-bold tracking-widest uppercase opacity-40">{e.account_tiers?.name} Tier</div>
                                  </div>
                                </div>
                                <div className={`badge text-[7px] font-black uppercase ${e.is_winner ? 'badge-success' : 'badge-muted opacity-50'}`}>
                                   {e.is_winner ? 'Winner' : 'Pending'}
                                </div>
                             </div>
                          ))
                        )}
                     </div>
                  </div>
                )}

                {activeTab === 'finance' && (
                  <div className="flex flex-col gap-24 animate-fade-in">
                     <div className="p-20 bg-blue-electric/5 border border-blue-electric/10 rounded-2xl flex flex-col gap-4">
                       <div className="text-[9px] text-blue-electric uppercase font-bold tracking-widest">Wallet Balance</div>
                       <div className="text-2xl font-black font-display text-white">₦{userDetails.wallet?.balance_ngn?.toLocaleString()}</div>
                     </div>

                     <div className="flex flex-col gap-12">
                        <h4 className="text-[9px] text-muted uppercase font-black tracking-widest ml-4 mb-4 flex items-center gap-6"><Activity className="w-4 h-4" /> Adjust Balance</h4>
                        <div className="flex flex-col gap-8">
                           <div className="grid grid-cols-2 gap-6">
                              <input 
                                type="number" 
                                placeholder="Amount (₦)" 
                                value={adjustAmount || ''}
                                onChange={(e) => setAdjustAmount(Number(e.target.value))}
                                className="input-premium py-10 font-mono text-xs font-black"
                              />
                              <input 
                                type="text" 
                                placeholder="Adjustment reason..." 
                                value={adjustReason}
                                onChange={(e) => setAdjustReason(e.target.value)}
                                className="input-premium py-10 text-xs font-bold"
                              />
                           </div>
                           <button 
                             disabled={isPending || !adjustAmount}
                             onClick={handleAdjustWallet}
                             className="btn btn-blue w-full py-10 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-electric/20 flex items-center justify-center gap-8"
                           >
                              Apply Adjustment
                           </button>
                        </div>
                     </div>

                     <div className="flex flex-col gap-12">
                        <div className="text-[9px] text-muted uppercase font-black tracking-widest ml-4">Recent Transactions</div>
                        <div className="flex flex-col divide-y divide-white/5">
                           {userDetails.purchases.length === 0 ? (
                               <p className="text-[10px] text-muted italic opacity-30 py-24 text-center">No recent transactions.</p>
                           ) : (
                               userDetails.purchases.slice(0, 5).map(p => (
                                  <div key={p.id} className="flex justify-between items-center py-10 px-4">
                                     <span className="text-[10px] text-muted font-mono">{new Date(p.created_at).toLocaleDateString()}</span>
                                     <span className="font-black text-white text-[11px] font-mono">₦{p.amount_paid.toLocaleString()}</span>
                                  </div>
                               ))
                           )}
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'referrals' && (
                  <div className="flex flex-col gap-16 animate-fade-in">
                     <div className="flex justify-between items-center mb-12">
                        <div className="text-[9px] text-muted uppercase font-black tracking-widest">Network Expansion</div>
                        <span className="badge badge-muted text-[8px] px-6 py-2">{userDetails.referrals.length} Members</span>
                     </div>
                     <div className="flex flex-col gap-6">
                        {userDetails.referrals.length === 0 ? (
                          <div className="py-60 text-center flex flex-col items-center gap-12 opacity-30">
                             <Users className="w-10 h-10 text-muted" />
                             <p className="text-[10px] text-muted font-mono italic">No referred members detected.</p>
                          </div>
                        ) : (
                          userDetails.referrals.map(r => (
                            <div key={r.id} className="p-12 bg-white/[0.03] border border-white/5 rounded-xl flex justify-between items-center group hover:border-blue-electric/20 transition-all">
                               <div className="flex items-center gap-12">
                                 <div className="w-24 h-24 rounded-lg bg-white/5 flex items-center justify-center font-black text-[10px] uppercase">{r.profiles?.username?.[0] || 'U'}</div>
                                 <div>
                                   <div className="text-xs font-bold text-white flex items-center gap-6">
                                      @{r.profiles?.username}
                                   </div>
                                   <div className="text-[9px] text-muted font-bold tracking-widest uppercase opacity-40">{new Date(r.created_at).toLocaleDateString()}</div>
                                 </div>
                               </div>
                               <span className="badge badge-success text-[7px] font-black uppercase tracking-widest">Active</span>
                            </div>
                          ))
                        )}
                     </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    
     {/* CREATE DEMO MODAL */}
     {showDemoModal && (
       <div className="fixed inset-0 z-[110] flex items-center justify-center p-24">
         <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isPending && setShowDemoModal(false)} />
         <div className="card w-full max-w-[500px] p-0 relative z-10 animate-slide-up bg-zinc-950 border-white/10 shadow-2xl">
            <div className="p-16 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
               <div className="flex items-center gap-3">
                  <div className="p-8 bg-gold/10 rounded-xl"><UserPlus className="w-4 h-4 text-gold" /></div>
                 <div>
                    <h3 className="font-display font-black text-white uppercase tracking-widest leading-none">New Demo User</h3>
                    <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-4 opacity-60">Auth & Wallet Initialization</p>
                 </div>
              </div>
           </div>
           
           <div className="p-16 flex flex-col gap-12">
              <div className="flex flex-col gap-4">
                 <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-4">Identifier (Email)</label>
                 <input 
                   type="email" 
                   value={demoData.email} 
                   onChange={e => setDemoData(prev => ({ ...prev, email: e.target.value }))}
                   className="input-premium py-10 text-xs" 
                   placeholder="demo.tester@predchain.com" 
                 />
              </div>

              <div className="grid grid-cols-2 gap-8">
                 <div className="flex flex-col gap-4">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-4">Username</label>
                    <input 
                      type="text" 
                      value={demoData.username} 
                      onChange={e => setDemoData(prev => ({ ...prev, username: e.target.value }))}
                      className="input-premium py-10 text-xs font-bold" 
                      placeholder="tester01" 
                    />
                 </div>
                 <div className="flex flex-col gap-4">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-4">Password</label>
                    <input 
                      type="text" 
                      value={demoData.password} 
                      onChange={e => setDemoData(prev => ({ ...prev, password: e.target.value }))}
                      className="input-premium py-10 text-xs font-mono" 
                      placeholder="••••••••" 
                    />
                 </div>
              </div>

              <div className="flex flex-col gap-4">
                 <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-4">Initial Funding (₦)</label>
                 <div className="relative">
                    <span className="absolute left-10 top-1/2 -translate-y-1/2 text-muted text-[10px] font-black">₦</span>
                    <input 
                      type="number" 
                      value={demoData.balance ?? ''} 
                      onChange={e => setDemoData(prev => ({ ...prev, balance: e.target.value ? Number(e.target.value) : 0 }))}
                      className="input-premium py-10 pl-20 text-xs font-mono font-black" 
                    />
                 </div>
              </div>

              <div className="p-8 bg-blue-electric/5 border border-blue-electric/10 rounded-xl flex items-center gap-8 mt-4">
                 <ShieldCheck className="w-4 h-4 text-blue-electric opacity-40" />
                 <p className="text-[9px] text-muted leading-relaxed font-bold uppercase tracking-tight">System will automatically verify and initialize a wallet for this demo user.</p>
              </div>
           </div>

           <div className="p-16 border-t border-white/5 flex gap-12 bg-white/[0.01]">
              <button 
                onClick={() => setShowDemoModal(false)}
                className="btn btn-ghost flex-1 py-10 font-black uppercase text-[10px] tracking-widest opacity-60 hover:opacity-100"
              >Cancel</button>
              <button 
                onClick={handleCreateDemo}
                disabled={isPending || !demoData.email || !demoData.username || !demoData.password}
                className="btn btn-blue flex-1 py-10 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-electric/20"
              >
                {isPending ? 'CREATING...' : 'CREATE USER'}
              </button>
           </div>
        </div>
      </div>
    )}
    </>
  );
}
