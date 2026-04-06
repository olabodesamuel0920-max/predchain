import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // 1. Fetch Profile & Wallet
  const [{ data: profile }, { data: wallet }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('wallets').select('*').eq('user_id', user.id).single(),
  ])

  // 2. Fetch Active Round
  const { data: activeRound } = await supabase
    .from('challenge_rounds')
    .select('*')
    .eq('status', 'active')
    .single()

  // 3. Fetch matches for active round
  const { data: matches } = await supabase
    .from('challenge_matches')
    .select('*')
    .eq('round_id', activeRound?.id)
    .order('kickoff_time', { ascending: true })

  // 4. Fetch User's Entry & Predictions for active round
  const { data: userEntry } = await supabase
    .from('challenge_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('round_id', activeRound?.id)
    .single()

  const { data: predictions } = await supabase
    .from('predictions')
    .select('*')
    .eq('entry_id', userEntry?.id)

  // 5. Fetch recent transactions
  const { data: transactions } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('wallet_id', wallet?.id)
    .order('created_at', { ascending: false })
    .limit(50)

  // 6. Fetch payout requests
  const { data: payoutRequests } = await supabase
    .from('payout_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    
  // 7. Fetch account purchases
  const { data: purchases } = await supabase
    .from('account_purchases')
    .select('*, account_tiers(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <Suspense fallback={<div className="container py-80 text-center text-muted">Loading Dashboard...</div>}>
      <DashboardClient 
        user={user} 
        profile={profile || { id: user.id }} 
        wallet={wallet || { id: '', balance_ngn: 0 }} 
        activeRound={activeRound}
        matches={matches || []}
        userEntry={userEntry}
        predictions={predictions || []}
        transactions={transactions || []}
        payoutRequests={payoutRequests || []}
        purchases={purchases || []}
      />
    </Suspense>
  )
}

