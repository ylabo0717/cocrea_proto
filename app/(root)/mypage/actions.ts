import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";

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
