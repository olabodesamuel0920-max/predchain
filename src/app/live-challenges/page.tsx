import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LiveChallengesClient from './LiveChallengesClient'

export default async function LiveChallengesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch the active round
  const { data: round } = await supabase
    .from('challenge_rounds')
    .select('*')
    .eq('status', 'active')
    .single()

  // Fetch matches for the active round
  const { data: matches } = await supabase
    .from('challenge_matches')
    .select('*')
    .eq('round_id', round?.id)
    .order('kickoff_time', { ascending: true })

  // Fetch the user's entry for the active round
  const { data: userEntry } = await supabase
    .from('challenge_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('round_id', round?.id)
    .single()

  // Fetch the user's latest valid tier purchase
  const { data: userTier } = await supabase
    .from('account_purchases')
    .select('tier_id')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('verified_at', { ascending: false })
    .limit(1)
    .single()

  // Fetch the user's predictions for these matches
  const { data: predictions } = await supabase
    .from('predictions')
    .select('*')
    .in('match_id', (matches || []).map(m => m.id))
    .eq('entry_id', userEntry?.id || '00000000-0000-0000-0000-000000000000')

  return (
    <LiveChallengesClient 
      round={round} 
      matches={matches || []} 
      userEntry={userEntry}
      predictions={predictions || []}
      hasTier={!!userTier}
    />
  )
}
