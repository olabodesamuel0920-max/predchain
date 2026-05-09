import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LiveChallengesClient from './LiveChallengesClient'

export default async function LiveChallengesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Note: Guest access is allowed for previewing matches

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

  // Fetch the user's entry for the active round if authenticated
  let userEntry = null
  let predictions = []

  if (user) {
    const { data: entry } = await supabase
      .from('challenge_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('round_id', round?.id)
      .single()
    
    userEntry = entry

    if (userEntry) {
      const { data: preds } = await supabase
        .from('predictions')
        .select('*')
        .in('match_id', matches?.map(m => m.id) || [])
        .eq('entry_id', userEntry?.id)
      
      predictions = preds || []
    }
  }

  return (
    <LiveChallengesClient 
      user={user}
      round={round} 
      matches={matches || []} 
      userEntry={userEntry}
      predictions={predictions}
    />
  )
}
