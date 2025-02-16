import { cookies } from 'next/headers';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { EditKnowledgeForm } from './edit-knowledge-form';

interface EditKnowledgePageProps {
  params: {
    knowledgeId: string;
  };
}

async function getKnowledge(knowledgeId: string) {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('auth');
  if (!authCookie) {
    throw new Error('認証が必要です');
  }

  const session = JSON.parse(decodeURIComponent(authCookie.value));
  if (!session?.userId) {
    throw new Error('認証が必要です');
  }

  const { data: knowledge, error } = await supabase
    .from('contents')
    .select(`
      *,
      author:author_id(name),
      application:application_id(id, name)
    `)
    .eq('id', knowledgeId)
    .single();

  if (error) {
    console.error('Knowledge fetch error:', error);
    throw new Error('ナレッジの取得に失敗しました');
  }

  return knowledge;
}

export default async function EditKnowledgePage({ params }: EditKnowledgePageProps) {
  const knowledge = await getKnowledge(params.knowledgeId);

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link
          href="/knowledge"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ナレッジ一覧に戻る
        </Link>
      </div>

      <EditKnowledgeForm
        knowledgeId={params.knowledgeId}
        initialData={knowledge}
      />
    </div>
  );
}
