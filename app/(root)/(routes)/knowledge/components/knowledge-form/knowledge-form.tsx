"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useKnowledgeForm } from "./use-knowledge-form";
import { KnowledgeFormProps } from "./types";
import { useApplications } from "@/app/(root)/(routes)/applications/hooks/use-applications";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from 'next/dynamic';

const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: false
});
import { AttachmentUpload } from "@/components/attachments/attachment-upload";
import { AttachmentList } from "@/components/attachments/attachment-list";
import { Paperclip } from "lucide-react";
import { TagInput } from "@/components/tags/tag-input";

export function KnowledgeForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  tempId,
  onSaveDraft,
  onPublishDraft,
  isDraft
}: KnowledgeFormProps) {
  const { formData, handleChange, validateForm, handleCancel } = useKnowledgeForm(initialData);
  const { applications, refreshApplications } = useApplications();
  const [attachmentRefreshKey, setAttachmentRefreshKey] = useState(0);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    refreshApplications();
  }, [refreshApplications]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleAttachmentUpload = () => {
    setAttachmentRefreshKey(prev => prev + 1);
  };

  if (!mounted) {
    return null;
  }

  return (
    <form id="knowledge-form" onSubmit={handleSubmit} className="space-y-6 px-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">タイトル</label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="ナレッジのタイトルを入力"
            disabled={isLoading}
            required

          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">内容</label>
          <Tabs value={tab} onValueChange={(value) => setTab(value as "write" | "preview")}>
            <TabsList>
              <TabsTrigger value="write">書く</TabsTrigger>
              <TabsTrigger value="preview">プレビュー</TabsTrigger>
            </TabsList>
            <TabsContent value="write">
              <Textarea
                value={formData.body}
                onChange={(e) => handleChange("body", e.target.value)}
                placeholder="ナレッジの内容を入力（Markdown形式で記述可能）"
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
            value={formData.application_id || undefined}
            onValueChange={(value) => handleChange("application_id", value)}
            disabled={isLoading}
            required
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

        <div className="space-y-2">
          <label className="text-sm font-medium">タグ</label>
          <TagInput
            value={formData.tags || []}
            onChange={(tags) => handleChange('tags', tags)}
            disabled={isLoading}
            placeholder="タグを入力して Enter を押してください"
          />
        </div>
      </div>

      {/* 下書きの最終保存日時 */}
      {formData.last_draft_saved_at && (
        <div className="text-sm text-muted-foreground">
          下書きの最終保存日時: {new Date(formData.last_draft_saved_at).toLocaleString()}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Paperclip className="h-5 w-5" />
            添付ファイル
          </h2>
          <AttachmentUpload
            contentId={tempId || initialData?.id || ''}
            onUpload={handleAttachmentUpload}
          />
        </div>
        <AttachmentList
          contentId={tempId || initialData?.id || ''}
          canDelete={true}
          refreshKey={attachmentRefreshKey}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            await handleCancel();
            onCancel();
          }}
          disabled={isLoading}
        >
          キャンセル
        </Button>

        {/* 下書き保存ボタン */}
        {onSaveDraft && (
          <Button
            type="button"
            variant="secondary"
            form="knowledge-form"
            onClick={async (e) => {
              e.preventDefault();
              const form = document.getElementById("knowledge-form") as HTMLFormElement;
              if (!form.checkValidity()) {
                form.reportValidity();
                return;
              }
              await onSaveDraft(formData);
            }}
            disabled={isLoading}
            required
          >
            {isLoading ? "下書き保存中..." : "下書き保存"}
          </Button>
        )}

        {/* 通常の保存ボタン */}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "保存中..." : "保存"}
        </Button>
      </div>
    </form>
  );
}