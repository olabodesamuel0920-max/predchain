import { createClient } from '@/lib/supabase/server'
import HomeClient from './HomeClient'
import { PlatformStats } from '@/types'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch real platform stats (excluding demo users)
  const { count: activeChallengers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_demo', false)

  const { data: winners } = await supabase
    .from('winners')
    .select('payout_amount')

  const { count: roundsCompleted } = await supabase
    .from('challenge_rounds')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')

  const totalCashPaid = (winners || []).reduce((sum: number, w: { payout_amount: number }) => sum + w.payout_amount, 0)

  const stats: PlatformStats = {
    activeChallengers: activeChallengers || 0,
    roundsCompleted: roundsCompleted || 0,
    totalCashPaid: totalCashPaid,
    perfectStreaks: winners?.length || 0
  }

  return <HomeClient stats={stats} />
}

