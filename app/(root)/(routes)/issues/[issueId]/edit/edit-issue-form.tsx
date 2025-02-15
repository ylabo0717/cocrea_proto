'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { IssueForm } from '../../components/issue-form/issue-form';
import { IssueFormData } from '../../components/issue-form/types';
import { updateAttachments } from '@/lib/api/attachments';

interface EditIssueFormProps {
  issueId: string;
  initialData: IssueFormData;
}

export function EditIssueForm({ issueId, initialData }: EditIssueFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: IssueFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '課題の更新に失敗しました');
      }

      const issue = await response.json();
      console.log('Issue updated:', issue);

      if (issue.id) {
        console.log('Updating attachments...');
        await updateAttachments(issue.id);
      }

      toast({
        title: '成功',
        description: '課題を更新しました',
      });
      router.push('/issues');
    } catch (error) {
      console.error('Failed to update issue:', error);
      toast({
        title: 'エラー',
        description:
          error instanceof Error
            ? error.message
            : '課題の更新に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async (data: IssueFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          id: issueId,
          draft_title: data.title,
          draft_body: data.body,
          draft_status: data.status,
          draft_priority: data.priority,
          draft_tags: data.draft_tags,
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
          error instanceof Error
            ? error.message
            : '下書きの保存に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishDraft = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '下書きの公開に失敗しました');
      }

      toast({
        title: '成功',
        description: '下書きを公開しました',
      });
      router.push('/issues');
    } catch (error) {
      console.error('Failed to publish draft:', error);
      toast({
        title: 'エラー',
        description:
          error instanceof Error
            ? error.message
            : '下書きの公開に失敗しました',
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
    <IssueForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      tempId={issueId}
      onSaveDraft={handleSaveDraft}
      onPublishDraft={handlePublishDraft}
      isDraft={initialData.is_draft}
    />
  );
}
