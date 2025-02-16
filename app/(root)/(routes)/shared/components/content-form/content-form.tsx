'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useContentForm } from './use-content-form';
import { ContentFormProps } from './types';
import { useApplications } from '@/app/(root)/(routes)/applications/hooks/use-applications';
import { useUsers } from '@/app/(root)/(routes)/users/hooks/use-users';
import { useEffect, useState } from 'react';
import { AttachmentUpload } from '@/components/attachments/attachment-upload';
import { AttachmentList } from '@/components/attachments/attachment-list';
import { Paperclip } from 'lucide-react';
import { TagInput } from '@/components/tags/tag-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import dynamic from 'next/dynamic';

const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: false
});

export function ContentForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  tempId,
  onSaveDraft,
  onPublishDraft,
  isDraft,
  contentType,
  contentId,
  onAutoSave,
}: ContentFormProps) {
  const { formData, handleChange, validateForm, handleCancel, setSubmitting } = useContentForm({
    initialData: {
      ...initialData,
      type: contentType,
      isDraft: isDraft,
    },
    contentId,
    onAutoSave,
  });
  const { applications, refreshApplications } = useApplications();
  const { users, refreshUsers } = useUsers();
  const [attachmentRefreshKey, setAttachmentRefreshKey] = useState(0);
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    Promise.all([
      refreshApplications(),
      refreshUsers()
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAttachmentUpload = () => {
    setAttachmentRefreshKey((prev) => prev + 1);
  };

  // 開発者のみをフィルタリング
  const developers = users.filter(
    (user) => user.role === 'developer' || user.role === 'admin'
  );

  if (!mounted) {
    return null;
  }

  const isKnowledge = contentType === 'knowledge';

  return (
    <form id="content-form" onSubmit={handleSubmit} className="space-y-6 px-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">タイトル</label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder={contentType === 'request' ? '要望・アイデアのタイトルを入力' : contentType === 'issue' ? 'お困りごとのタイトルを入力' : 'Knowledgeのタイトルを入力'}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">内容</label>
          <Tabs value={tab} onValueChange={(value) => setTab(value as 'write' | 'preview')}>
            <TabsList>
              <TabsTrigger value="write">書く</TabsTrigger>
              <TabsTrigger value="preview">プレビュー</TabsTrigger>
            </TabsList>
            <TabsContent value="write">
              <Textarea
                value={formData.body}
                onChange={(e) => handleChange('body', e.target.value)}
                placeholder={contentType === 'request' ? '要望・アイデアの内容を入力（Markdown形式で記述可能）' : contentType === 'issue' ? 'お困りごとの内容を入力（Markdown形式で記述可能）' : 'Knowledgeの内容を入力（Markdown形式で記述可能）'}
                className="min-h-[400px] font-mono"
                disabled={isLoading}
                required
              />
            </TabsContent>
            <TabsContent value="preview">
              <div className="min-h-[400px] p-4 border rounded-md prose prose-neutral dark:prose-invert max-w-none">
                {formData.body ? (
                  <ReactMarkdown>{formData.body}</ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground">プレビューする内容がありません</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">アプリケーション</label>
          <Select
            value={formData.applicationId}
            onValueChange={(value) => handleChange('applicationId', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="アプリケーションを選択" />
            </SelectTrigger>
            <SelectContent>
              {applications.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!isKnowledge && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">ステータス</label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ステータスを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">優先度</label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleChange('priority', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="優先度を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">担当者</label>
              <Select
                value={formData.assigneeId}
                onValueChange={(value) => handleChange('assigneeId', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="担当者を選択" />
                </SelectTrigger>
                <SelectContent>
                  {developers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">タグ</label>
          <TagInput
            value={formData.tags}
            onChange={(tags) => handleChange('tags', tags)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-x-2">
            <Paperclip className="h-4 w-4" />
            添付ファイル
          </label>
          <AttachmentUpload
            tempId={tempId}
            onUploadComplete={handleAttachmentUpload}
            disabled={isLoading}
          />
          <AttachmentList
            attachmentIds={formData.attachments}
            refreshKey={attachmentRefreshKey}
            onDelete={(id) =>
              handleChange(
                'attachments',
                formData.attachments.filter((aid) => aid !== id)
              )
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-x-2">
        {isDraft ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
              disabled={isLoading}
            >
              下書き保存
            </Button>
            <Button
              type="button"
              onClick={onPublishDraft}
              disabled={isLoading}
            >
              公開
            </Button>
          </>
        ) : (
          <>
            <Button
              type="submit"
              disabled={isLoading || !validateForm()}
            >
              {isLoading ? '保存中...' : '保存'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                キャンセル
              </Button>
            )}
          </>
        )}
      </div>
    </form>
  );
}
