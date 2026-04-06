import { createClient } from '@/lib/supabase/server'
import HomeClient from './HomeClient'
import { PlatformStats } from '@/types'

export default async function HomePage() {
  const supabase = await createClient()

  // 1. Fetch Platform Settings
  const { data: settingsData } = await supabase
    .from('platform_settings')
    .select('key, value')

  const settings: any = {}
  settingsData?.forEach(s => {
    settings[s.key] = s.value
  })

  // 2. Fetch real platform stats (excluding demo users)
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

  let stats: PlatformStats = {
    activeChallengers: activeChallengers || 0,
    roundsCompleted: roundsCompleted || 0,
    totalCashPaid: totalCashPaid,
    perfectStreaks: winners?.length || 0
  }

  // 3. Handle 'Launch' mode (Social proof for new platform)
  const mode = settings.trust_stats_mode || 'real'
  if (mode === 'launch') {
    stats = {
      activeChallengers: (stats.activeChallengers < 1240) ? 1240 + stats.activeChallengers : stats.activeChallengers,
      roundsCompleted: (stats.roundsCompleted < 42) ? 42 + stats.roundsCompleted : stats.roundsCompleted,
      totalCashPaid: (stats.totalCashPaid < 2500000) ? 2500000 + stats.totalCashPaid : stats.totalCashPaid,
      perfectStreaks: (stats.perfectStreaks < 156) ? 156 + stats.perfectStreaks : stats.perfectStreaks
    }
  } else if (mode === 'hidden') {
    stats = {
      activeChallengers: 0,
      roundsCompleted: 0,
      totalCashPaid: 0,
      perfectStreaks: 0
    }
  }

  return <HomeClient stats={stats} />
}

