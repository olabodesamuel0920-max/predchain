import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ReferralClient from '@/components/referral/ReferralClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partner Program — PredChain',
  description: 'Join the elite PredChain partner network. Scale the arena and earn automated rewards for every participant you connect.',
}

export default async function ReferralPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Note: Guest access is allowed for previewing the affiliate program

  // Fetch the user's data if authenticated
  let profile = null
  let referrals = []
  let earnings = 0

  if (user) {
    const { data: p } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    profile = p

    const { data: refs } = await supabase
      .from('referrals')
      .select('*, referred_user:profiles!referred_user_id(*)')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false })
    
    referrals = refs || []

    const { data: rewards } = await supabase
      .from('referral_rewards')
      .select('amount')
      .in('referral_id', referrals?.map(r => r.id) || [])

    earnings = rewards?.reduce((sum, r) => sum + r.amount, 0) || 0
  }


  return (
    <ReferralClient 
      user={user} 
      profile={profile} 
      referrals={referrals || []} 
      totalEarnings={earnings} 
    />
  )
}
