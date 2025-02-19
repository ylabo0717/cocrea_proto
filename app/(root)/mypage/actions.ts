import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import { subMonths, startOfDay, parseISO, format } from 'date-fns';

export type ContentType = 'request' | 'issue' | 'knowledge';

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyContribution {
  date: string;
  count: number;
}

export async function fetchUserContentCounts() {
  const session = getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('contents')
    .select('type', { count: 'exact' })
    .eq('author_id', session.userId)
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
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user contents:', error);
    return [];
  }

  return data as Content[];
}

export async function fetchContributionData(): Promise<DailyContribution[]> {
  const session = getSession();
  if (!session) return [];

  // 過去12ヶ月のデータを取得
  const startDate = subMonths(new Date(), 12);

  const { data, error } = await supabase
    .from('contents')
    .select('created_at')
    .eq('author_id', session.userId)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching contribution data:', error);
    return [];
  }

  // 日付ごとの投稿数をカウント
  const contributionMap = new Map<string, number>();
  data.forEach(content => {
    const date = format(startOfDay(parseISO(content.created_at)), 'yyyy-MM-dd');
    contributionMap.set(date, (contributionMap.get(date) || 0) + 1);
  });

  // Map を配列に変換
  return Array.from(contributionMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));
}
