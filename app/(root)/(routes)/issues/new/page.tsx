'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { IssueForm } from '../components/issue-form/issue-form';
import { useState } from 'react';
import { IssueFormData } from '../components/issue-form/types';
import { useToast } from '@/hooks/use-toast';
import { updateAttachments } from '@/lib/api/attachments';

export default function NewIssuePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { v4: uuidv4 } = require('uuid');
  const [tempId] = useState(() => uuidv4());

  const handleSubmit = async (data: IssueFormData) => {
    console.log('Form submission started:', data);

    if (!data.title || !data.body || !data.application_id) {
      console.log('Validation failed:', { data });
      toast({
        title: 'エラー',
        description: '必須項目を入力してください',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '課題の作成に失敗しました');
      }

      const issue = await response.json();
      console.log('Issue created:', issue);

      if (issue.id) {
        console.log('Updating attachments...');
        await updateAttachments(issue.id);
      }

      toast({
        title: '成功',
        description: '課題を作成しました',
      });
      router.push('/issues');
    } catch (error) {
      console.error('Failed to create issue:', error);
      toast({
        title: 'エラー',
        description:
          error instanceof Error ? error.message : '課題の作成に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async (data: IssueFormData) => {
    console.log('Saving draft with data:', data);
    setIsLoading(true);

    try {
      const response = await fetch('/api/issues', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          draft_title: data.title,
          draft_body: data.body,
          draft_status: data.status,
          draft_priority: data.priority,
          last_draft_saved_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '下書きの保存に失敗しました');
      }

      const issue = await response.json();
      console.log('Draft saved:', issue);

      if (issue.id) {
        console.log('Updating attachments...');
        await updateAttachments(issue.id);
      }

      toast({
        title: '成功',
        description: '下書きを保存しました',
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast({
        title: 'エラー',
        description:
          error instanceof Error ? error.message : '下書きの保存に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/issues');
  };

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Link
          href="/issues"
          className="hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span>課題一覧</span>
        <span>/</span>
        <span>新規作成</span>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-foreground">新規課題作成</h2>
        <p className="text-muted-foreground">新しい課題を作成します</p>
      </div>

      <div className="max-w-3xl">
        <IssueForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          tempId={tempId}
          onSaveDraft={handleSaveDraft}
        />
      </div>
    </div>
  );
}
