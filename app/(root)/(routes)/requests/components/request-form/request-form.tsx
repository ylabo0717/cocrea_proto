"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRequestForm } from "./use-request-form";
import { RequestFormProps } from "./types";
import { useApplications } from "@/app/(root)/(routes)/dashboard/hooks/use-applications";
import { useUsers } from "@/app/(root)/(routes)/users/hooks/use-users";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import { AttachmentUpload } from "@/components/attachments/attachment-upload";
import { AttachmentList } from "@/components/attachments/attachment-list";
import { Paperclip } from "lucide-react";

export function RequestForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  tempId,
  onSaveDraft,
  onPublishDraft,
  isDraft
}: RequestFormProps) {
  const { formData, handleChange, validateForm } = useRequestForm(initialData);
  const { applications, refreshApplications } = useApplications();
  const { users, refreshUsers } = useUsers();
  const [attachmentRefreshKey, setAttachmentRefreshKey] = useState(0);
  const [tab, setTab] = useState<"write" | "preview">("write");

  useEffect(() => {
    refreshApplications();
    refreshUsers();
  }, [refreshApplications, refreshUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleAttachmentUpload = () => {
    setAttachmentRefreshKey(prev => prev + 1);
  };

  // 開発者のみをフィルタリング
  const developers = users.filter(user => 
    user.role === 'developer' || user.role === 'admin'
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">タイトル</label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="要望のタイトルを入力"
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
                placeholder="要望の詳細を入力（Markdown形式で記述可能）"
                className="min-h-[200px] font-mono"
                disabled={isLoading}
                required
              />
            </TabsContent>
            <TabsContent value="preview">
              <div className="min-h-[200px] p-4 border rounded-md prose prose-neutral dark:prose-invert max-w-none">
                {formData.body ? (
                  <ReactMarkdown>{formData.body}</ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground">プレビューする内容がありません</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">ステータス</label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">未対応</SelectItem>
                <SelectItem value="in_progress">対応中</SelectItem>
                <SelectItem value="resolved">解決済み</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">優先度</label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleChange("priority", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">低</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="high">高</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            <label className="text-sm font-medium">担当者</label>
            <Select
              value={formData.assignee_id || "unassigned"}
              onValueChange={(value) => handleChange("assignee_id", value === "unassigned" ? undefined : value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="担当者を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">未割り当て</SelectItem>
                {developers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
          onClick={onCancel}
          disabled={isLoading}
        >
          キャンセル
        </Button>

        {/* 下書き保存ボタン */}
        {onSaveDraft && (
          <Button
            type="button"
            variant="secondary"
            onClick={async (e) => {
              e.preventDefault();
              if (!validateForm()) return;
              await onSaveDraft(formData);
            }}
            disabled={isLoading}
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