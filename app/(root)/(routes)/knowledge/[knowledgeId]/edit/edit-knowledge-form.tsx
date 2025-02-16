'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { KnowledgeForm } from '../../components/knowledge-form/knowledge-form';
import { KnowledgeFormData } from '../../components/knowledge-form/types';
import { updateAttachments } from '@/lib/api/attachments';

interface EditKnowledgeFormProps {
  knowledgeId: string;
  initialData: KnowledgeFormData;
}

export function EditKnowledgeForm({ knowledgeId, initialData }: EditKnowledgeFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: KnowledgeFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/knowledge/${knowledgeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'ナレッジの更新に失敗しました');
      }

      const knowledge = await response.json();
      console.log('Knowledge updated:', knowledge);

      if (knowledge.id) {
        console.log('Updating attachments...');
        await updateAttachments(knowledge.id);
      }

      toast({
        title: '成功',
        description: 'ナレッジを更新しました',
      });
      router.push('/knowledge');
    } catch (error) {
      console.error('Failed to update knowledge:', error);
      toast({
        title: 'エラー',
        description:
          error instanceof Error
            ? error.message
            : 'ナレッジの更新に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async (data: KnowledgeFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/knowledge/${knowledgeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          id: knowledgeId,
          draft_title: data.title,
          draft_body: data.body,
          draft_tags: data.draft_tags,
          last_draft_saved_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '下書きの保存に失敗しました');
      }

      const knowledge = await response.json();
      console.log('Draft saved:', knowledge);

      if (knowledge.id) {
        console.log('Updating attachments...');
        await updateAttachments(knowledge.id);
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
      const response = await fetch(`/api/knowledge/${knowledgeId}`, {
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
      router.push('/knowledge');
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
    router.push('/knowledge');
  };

  return (
    <KnowledgeForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      tempId={knowledgeId}
      onSaveDraft={handleSaveDraft}
      onPublishDraft={handlePublishDraft}
      isDraft={initialData.is_draft}
    />
  );
}
