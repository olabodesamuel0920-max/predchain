import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ReferralClient from './ReferralClient'

export default async function ReferralPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch the user's referrals
  const { data: referrals } = await supabase
    .from('referrals')
    .select('*, referred_user:profiles!referred_user_id(*)')
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch real referral earnings
  const { data: rewards } = await supabase
    .from('referral_rewards')
    .select('amount')
    .in('referral_id', referrals?.map(r => r.id) || [])

  const earnings = rewards?.reduce((sum, r) => sum + r.amount, 0) || 0


  return (
    <ReferralClient 
      user={user} 
      profile={profile} 
      referrals={referrals || []} 
      totalEarnings={earnings} 
    />
  )
}
