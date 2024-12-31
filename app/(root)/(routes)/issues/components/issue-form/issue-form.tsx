"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIssueForm } from "./use-issue-form";
import { IssueFormProps } from "./types";
import { useApplications } from "@/app/(root)/(routes)/dashboard/hooks/use-applications";
import { useEffect } from "react";

export function IssueForm({ initialData, onSubmit, onCancel, isLoading }: IssueFormProps) {
  const { formData, handleChange } = useIssueForm(initialData);
  const { applications, refreshApplications } = useApplications();

  useEffect(() => {
    refreshApplications();
  }, [refreshApplications]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          placeholder="# 課題の内容を入力

## 現状の問題点

## 改善案

## 期待される効果"
          className="min-h-[300px] font-mono"
          disabled={isLoading}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">ステータス</label>
          <Select
            value={formData.status}
            onValueChange={(value: 'open' | 'in_progress' | 'resolved') => 
              handleChange("status", value)
            }
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
            onValueChange={(value: 'low' | 'medium' | 'high') => 
              handleChange("priority", value)
            }
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

      <div className="space-y-2">
        <label className="text-sm font-medium">関連アプリケーション</label>
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
          {isLoading ? "作成中..." : "作成"}
        </Button>
      </div>
    </form>
  );
}