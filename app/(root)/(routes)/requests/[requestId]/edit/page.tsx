import { cookies } from 'next/headers';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { EditRequestForm } from './edit-request-form';

interface EditRequestPageProps {
  params: {
    requestId: string;
  };
}

async function getRequest(requestId: string) {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('auth');
  if (!authCookie) {
    throw new Error('認証が必要です');
  }

  const session = JSON.parse(decodeURIComponent(authCookie.value));
  if (!session?.userId) {
    throw new Error('認証が必要です');
  }

  const { data: request, error } = await supabase
    .from('contents')
    .select(`
      *,
      author:author_id(name),
      assignee:assignee_id(name),
      application:application_id(id, name)
    `)
    .eq('id', requestId)
    .single();

  if (error) {
    console.error('Request fetch error:', error);
    throw new Error('リクエストの取得に失敗しました');
  }

  return request;
}

export default async function EditRequestPage({ params }: EditRequestPageProps) {
  const request = await getRequest(params.requestId);

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link
          href="/requests"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          リクエスト一覧に戻る
        </Link>
      </div>

      <EditRequestForm
        requestId={params.requestId}
        initialData={request}
      />
    </div>
  );
}
