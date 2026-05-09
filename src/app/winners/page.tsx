import { createClient } from '@/lib/supabase/server'
import WinnersClient from './WinnersClient'
import { fetchPlatformStats } from '@/lib/stats'

export default async function WinnersPage() {
  const supabase = await createClient()

  // Fetch verified winners
  const { data: winners } = await supabase
    .from('winners')
    .select('*, profile:profiles(*), round:challenge_rounds(*)')
    .order('created_at', { ascending: false })

  const stats = await fetchPlatformStats()
  return <WinnersClient winners={winners || []} stats={stats} />
}
