'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Application } from '@/lib/types'

export async function fetchApplications(): Promise<Application[]> {
  const supabase = createServerComponentClient({ cookies })
  
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
    throw new Error('アプリケーションの取得に失敗しました')
  }

  return data || []
}

export async function updateApplication(
  id: string,
  data: Partial<Application>
): Promise<Application> {
  const supabase = createServerComponentClient({ cookies })

  const { data: updatedApp, error } = await supabase
    .from('applications')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Application update error:', error)
    throw new Error('アプリケーションの更新に失敗しました')
  }

  return updatedApp
}
