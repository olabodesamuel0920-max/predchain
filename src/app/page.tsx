import { fetchPlatformStats } from '@/lib/stats'
import HomeClient from './HomeClient'

export default async function HomePage() {
  const stats = await fetchPlatformStats()
  return <HomeClient stats={stats} />
}
