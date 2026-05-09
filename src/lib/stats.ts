import { createClient } from '@/lib/supabase/server'
import { PlatformStats } from '@/types'

export async function fetchPlatformStats(): Promise<PlatformStats> {
  const supabase = await createClient()

  // 1. Fetch Platform Settings for mode
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

  // 3. Handle 'Launch' mode
  const mode = settings.trust_stats_mode || 'launch' // Force launch mode for public trust
  if (mode === 'launch') {
    stats = {
      activeChallengers: (stats.activeChallengers < 12840) ? 12840 + stats.activeChallengers : stats.activeChallengers,
      roundsCompleted: (stats.roundsCompleted < 142) ? 142 + stats.roundsCompleted : stats.roundsCompleted,
      totalCashPaid: (stats.totalCashPaid < 12500000) ? 12500000 + stats.totalCashPaid : stats.totalCashPaid,
      perfectStreaks: (stats.perfectStreaks < 856) ? 856 + stats.perfectStreaks : stats.perfectStreaks
    }
  } else if (mode === 'hidden') {
    stats = {
      activeChallengers: 0,
      roundsCompleted: 0,
      totalCashPaid: 0,
      perfectStreaks: 0
    }
  }

  return stats
}
