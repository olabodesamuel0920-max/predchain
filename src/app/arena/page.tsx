import { createClient } from '@/lib/supabase/server'
import ArenaClient from '@/components/arena/ArenaClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default async function ArenaPage() {
  const supabase = await createClient()

  // Fetch active round data
  const { data: activeRound } = await supabase
    .from('challenge_rounds')
    .select('*')
    .eq('status', 'active')
    .single()

  // Fetch matches for the active round
  const { data: matches } = await supabase
    .from('challenge_matches')
    .select('*')
    .eq('round_id', activeRound?.id)
    .order('kickoff_time', { ascending: true })

  // Fetch global stats for social proof
  const { count: activePlayers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  return (
    <ArenaClient 
      activeRound={activeRound} 
      matches={matches || []} 
      stats={{ activePlayers: activePlayers || 0 }} 
    />
  )
}
