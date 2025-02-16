'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ContentForm } from './content-form/content-form';
import { ContentType } from './content-form/types';
import { toast } from 'sonner';

export function CreateContentDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsOpen(false);
      router.refresh();

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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setContentType(null);
    }
  };

  const contentTypeLabels: Record<ContentType, string> = {
    request: '要望・アイデア',
    issue: 'お困りごと',
    knowledge: 'Knowledge'
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新規作成
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {contentType ? `${contentTypeLabels[contentType]}の新規作成` : '新規作成'}
          </DialogTitle>
        </DialogHeader>

        {!contentType ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                作成するコンテンツの種類を選択してください
              </label>
              <Select onValueChange={(value) => setContentType(value as ContentType)}>
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
            onCancel={() => setContentType(null)}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
