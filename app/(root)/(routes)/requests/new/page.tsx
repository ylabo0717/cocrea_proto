'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { RequestForm } from '../components/request-form/request-form';
import { useState } from 'react';
import { RequestFormData } from '../components/request-form/types';
import { useToast } from '@/hooks/use-toast';
import { updateAttachments } from '@/lib/api/attachments';

export default function NewRequestPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { v4: uuidv4 } = require('uuid');
  const [tempId] = useState(() => uuidv4());

  const handleSubmit = async (data: RequestFormData) => {
    console.log('Creating request with data:', data);
    setIsLoading(true);

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '要望の作成に失敗しました');
      }

      const request = await response.json();
      console.log('Request created:', request);

      if (request.id) {
        console.log('Updating attachments...');
        await updateAttachments(request.id);
      }

      toast({
        title: '成功',
        description: '要望を作成しました',
      });
      router.push('/requests');
    } catch (error) {
      console.error('Failed to create request:', error);
      toast({
        title: 'エラー',
        description:
          error instanceof Error ? error.message : '要望の作成に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async (data: RequestFormData) => {
    console.log('Saving draft with data:', data);
    setIsLoading(true);

    try {
      const response = await fetch('/api/requests', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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

      const request = await response.json();
      console.log('Draft saved:', request);

      if (request.id) {
        console.log('Updating attachments...');
        await updateAttachments(request.id);
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
    router.push('/requests');
  };

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Link
          href="/requests"
          className="hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span>要望一覧</span>
        <span>/</span>
        <span>新規作成</span>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-foreground">新規要望作成</h2>
        <p className="text-muted-foreground">新しい要望を作成します</p>
      </div>

      <div className="max-w-3xl">
        <RequestForm
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
