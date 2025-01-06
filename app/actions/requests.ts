'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Content } from '@/lib/types'

export async function fetchRequests(): Promise<Content[]> {
  const supabase = createServerComponentClient({ cookies })
  
  const { data, error } = await supabase
    .from('contents')
    .select(`
      *,
      author:author_id(name),
      assignee:assignee_id(name),
      application:application_id(id, name)
    `)
    .eq('type', 'request')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching requests:', error)
    throw new Error('要望の取得に失敗しました')
  }

  return data || []
}

export async function updateRequest(
  id: string, 
  data: Partial<Content>
): Promise<Content> {
  const supabase = createServerComponentClient({ cookies })

  const { data: updatedRequest, error } = await supabase
    .from('contents')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select(`
      *,
      author:author_id(name),
      assignee:assignee_id(name),
      application:application_id(id, name)
    `)
    .single()

  if (error) {
    console.error('Request update error:', error)
    throw new Error('要望の更新に失敗しました')
  }

  return updatedRequest
}
