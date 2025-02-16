'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ContentForm } from '../../shared/components/content-form/content-form';
import { ContentType } from '../../shared/components/content-form/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useState } from 'react';

export default function NewContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const contentType = searchParams.get('type') as ContentType | null;

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/contents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('保存に失敗しました');
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
      toast.error('エラーが発生しました');
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
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
