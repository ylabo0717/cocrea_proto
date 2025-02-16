'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ContentForm } from '../../shared/components/content-form/content-form';
import { ContentFormData, ContentType } from '../../shared/components/content-form/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export default function NewContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [contentId, setContentId] = useState<string>();
  const contentType = searchParams.get('type') as ContentType | null;

  // 新規作成時に空の下書きを作成
  useEffect(() => {
    if (!contentType) return;

    const createDraft = async () => {
      try {
        const response = await fetch('/api/contents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: '',
            body: '',
            type: contentType,
            tags: [],
            attachments: [],
            status: 'open',
            priority: 'medium',
            is_draft: true,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '下書きの作成に失敗しました');
        }

        const result = await response.json();
        setContentId(result.id);
      } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'エラーが発生しました';
        toast.error(message);
      }
    };

    createDraft();
  }, [contentType]);

  const handleAutoSave = async (data: ContentFormData) => {
    if (!contentId) return;

    try {
      const response = await fetch(`/api/contents/${contentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          is_draft: true,
        }),
      });

      if (!response.ok) {
        throw new Error('下書きの保存に失敗しました');
      }
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'エラーが発生しました';
      toast.error(message);
    }
  };

  const handleSubmit = async (data: ContentFormData) => {
    try {
      setIsLoading(true);
      // 下書きを公開に変更
      const response = await fetch(`/api/contents/${contentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          is_draft: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '保存に失敗しました');
      }

      const result = await response.json();
      toast.success('保存しました');

      // 作成したコンテンツの詳細ページに遷移
      const path = data.type === 'request'
        ? '/requests'
        : data.type === 'issue'
          ? '/issues'
          : '/knowledge';
      router.push(`${path}/${result.id}`);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'エラーが発生しました';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const contentTypeLabels: Record<ContentType, string> = {
    request: '要望・アイデア',
    issue: 'お困りごと',
    knowledge: 'Knowledge'
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {contentType ? `${contentTypeLabels[contentType]}の新規作成` : '新規作成'}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>新規作成</CardTitle>
        </CardHeader>
        <CardContent>
          {!contentType ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  作成するコンテンツの種類を選択してください
                </label>
                <Select
                  onValueChange={(value) =>
                    router.push(`/contents/new?type=${value}`)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="種類を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="request">要望・アイデア</SelectItem>
                    <SelectItem value="issue">お困りごと</SelectItem>
                    <SelectItem value="knowledge">Knowledge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <ContentForm
              contentType={contentType}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
              contentId={contentId}
              onAutoSave={handleAutoSave}
              isDraft={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
