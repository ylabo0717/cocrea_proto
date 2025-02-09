import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";

export type ContentType = 'request' | 'issue' | 'knowledge';

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchUserContentCounts() {
  const session = getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('contents')
    .select('type', { count: 'exact' })
    .eq('author_id', session.userId)
    .not('is_draft', 'eq', true)
    .then(result => {
      if (result.error) throw result.error;
      
      // 各タイプごとの投稿数をカウント
      const counts = {
        request: 0,
        issue: 0,
        knowledge: 0,
        total: result.data.length
      };
      
      result.data.forEach(content => {
        counts[content.type as keyof typeof counts] += 1;
      });
      
      return { data: counts, error: null };
    })
    .catch(error => ({ data: null, error }));

  if (error) {
    console.error('Error fetching content counts:', error);
    return null;
  }

  return data;
}

export async function fetchUserContents(type: ContentType) {
  const session = getSession();
  if (!session) return [];

  const { data, error } = await supabase
    .from('contents')
    .select('id, type, title, status, created_at, updated_at')
    .eq('author_id', session.userId)
    .eq('type', type)
    .not('is_draft', 'eq', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user contents:', error);
    return [];
  }

  return data as Content[];
}
