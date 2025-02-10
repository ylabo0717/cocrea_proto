'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { KnowledgeForm } from '../components/knowledge-form/knowledge-form';
import { useState } from 'react';
import { KnowledgeFormData } from '../components/knowledge-form/types';
import { useToast } from '@/hooks/use-toast';
import { updateAttachments } from '@/lib/api/attachments';

export default function NewKnowledgePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { v4: uuidv4 } = require('uuid');
  const [tempId] = useState(() => uuidv4());

  const handleSubmit = async (data: KnowledgeFormData) => {
    console.log('Creating knowledge with data:', data);
    setIsLoading(true);

    try {
      const response = await fetch('/api/knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'ナレッジの作成に失敗しました');
      }

      const knowledge = await response.json();
      console.log('Knowledge created:', knowledge);

      if (knowledge.id) {
        console.log('Updating attachments...');
        await updateAttachments(knowledge.id);
      }

      toast({
        title: '成功',
        description: 'ナレッジを作成しました',
      });
      router.push('/knowledge');
    } catch (error) {
      console.error('Failed to create knowledge:', error);
      toast({
        title: 'エラー',
        description:
          error instanceof Error
            ? error.message
            : 'ナレッジの作成に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async (data: KnowledgeFormData) => {
    console.log('Saving draft with data:', data);
    setIsLoading(true);

    try {
      const response = await fetch('/api/knowledge', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          draft_title: data.title,
          draft_body: data.body,
          draft_category: data.category,
          draft_tags: data.tags,
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
          error instanceof Error ? error.message : '下書きの保存に失敗しました',
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
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Link
          href="/knowledge"
          className="hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span>ナレッジ一覧</span>
        <span>/</span>
        <span>新規作成</span>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-foreground">新規ナレッジ作成</h2>
        <p className="text-muted-foreground">新しいナレッジを作成します</p>
      </div>

      <div className="max-w-3xl">
        <KnowledgeForm
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
