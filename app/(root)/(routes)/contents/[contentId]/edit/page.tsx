'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { ContentForm } from '@/app/(root)/(routes)/shared/components/content-form/content-form';
import { updateAttachments } from '@/lib/api/attachments';
import { ContentType } from '@/types';

interface EditContentPageProps {
  params: {
    contentId: string;
  };
  searchParams: {
    type: ContentType;
  };
}

export default function EditContentPage({ params, searchParams }: EditContentPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const contentType = searchParams.type;
  const contentId = params.contentId;

  // 初期データの取得
  const fetchInitialData = async () => {
    try {
      // knowledgeの場合は複数形にしない
      const apiPath = contentType === 'knowledge' ? contentType : `${contentType}s`;
      const response = await fetch(`/api/${apiPath}/${contentId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'コンテンツの取得に失敗しました');
      }

      const data = await response.json();
      setInitialData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'エラーが発生しました');
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : 'エラーが発生しました',
        variant: 'destructive',
      });
    }
  };

  // コンポーネントのマウント時に初期データを取得
  useState(() => {
    fetchInitialData();
  }, [contentId, contentType]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const apiPath = contentType === 'knowledge' ? contentType : `${contentType}s`;
      const response = await fetch(`/api/${apiPath}/${contentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'コンテンツの更新に失敗しました');
      }

      const content = await response.json();

      if (content.id) {
        await updateAttachments(content.id);
      }

      toast({
        title: '成功',
        description: 'コンテンツを更新しました',
      });
      router.push(`/${contentType}s`);
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : 'エラーが発生しました',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <ContentForm
        contentType={contentType}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        initialData={initialData}
        contentId={contentId}
      />
    </div>
  );
}
