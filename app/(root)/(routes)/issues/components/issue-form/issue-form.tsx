"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIssueForm } from "./use-issue-form";
import { IssueFormProps } from "./types";
import { useApplications } from "@/app/(root)/(routes)/dashboard/hooks/use-applications";
import { useUsers } from "@/app/(root)/(routes)/users/hooks/use-users";
import { useEffect, useState } from "react";
import { AttachmentUpload } from "../attachments/attachment-upload";
import { AttachmentList } from "../attachments/attachment-list";
import { Paperclip } from "lucide-react";

export function IssueForm({ initialData, onSubmit, onCancel, isLoading }: IssueFormProps) {
  const { formData, handleChange } = useIssueForm(initialData);
  const { applications, refreshApplications } = useApplications();
  const { users, refreshUsers } = useUsers();
  const [attachmentRefreshKey, setAttachmentRefreshKey] = useState(0);

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
            placeholder="課題のタイトルを入力"
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">内容</label>
          <Textarea
            value={formData.body}
            onChange={(e) => handleChange("body", e.target.value)}
            placeholder="課題の詳細を入力（Markdown形式で記述可能）"
            className="min-h-[200px] font-mono"
            disabled={isLoading}
            required
          />
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
              value={formData.application_id}
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

      {initialData?.id && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Paperclip className="h-5 w-5" />
              添付ファイル
            </h2>
            <AttachmentUpload
              contentId={initialData.id}
              onUpload={handleAttachmentUpload}
            />
          </div>
          <AttachmentList
            contentId={initialData.id}
            canDelete={true}
            refreshKey={attachmentRefreshKey}
          />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          キャンセル
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "保存中..." : "保存"}
        </Button>
      </div>
    </form>
  );
}