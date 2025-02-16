import { cookies } from 'next/headers';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { EditIssueForm } from './edit-issue-form';

interface EditIssuePageProps {
  params: {
    issueId: string;
  };
}

async function getIssue(issueId: string) {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('auth');
  if (!authCookie) {
    throw new Error('認証が必要です');
  }

  const session = JSON.parse(decodeURIComponent(authCookie.value));
  if (!session?.userId) {
    throw new Error('認証が必要です');
  }

  const { data: issue, error } = await supabase
    .from('contents')
    .select(`
      *,
      author:author_id(name),
      assignee:assignee_id(name),
      application:application_id(id, name)
    `)
    .eq('id', issueId)
    .single();

  if (error) {
    console.error('Issue fetch error:', error);
    throw new Error('課題の取得に失敗しました');
  }

  return issue;
}

export default async function EditIssuePage({ params }: EditIssuePageProps) {
  const issue = await getIssue(params.issueId);

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link
          href="/issues"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          課題一覧に戻る
        </Link>
      </div>

      <EditIssueForm
        issueId={params.issueId}
        initialData={issue}
      />
    </div>
  );
}
