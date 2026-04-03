import { createClient } from '@/lib/supabase/server'
import LeaderboardClient from './LeaderboardClient'

export default async function LeaderboardPage() {
  const supabase = await createClient()

  // Fetch top entries with profile and tier details
  const { data: rankings } = await supabase
    .from('challenge_entries')
    .select('*, profile:profiles(*), tier:account_tiers(*)')
    .order('streak_count', { ascending: false })
    .limit(50)

  return <LeaderboardClient rankings={rankings || []} />
}
