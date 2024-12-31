"use client";

import { Content } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface IssueFormProps {
  issue: Content & {
    author: { name: string };
    application: { name: string };
  };
  onCancel: () => void;
  onSubmit: (data: Partial<Content>) => Promise<void>;
}

export function IssueForm({ issue, onCancel, onSubmit }: IssueFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: issue.title,
    body: issue.body,
    status: issue.status,
    priority: issue.priority,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">タイトル</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">内容</label>
        <Textarea
          value={formData.body}
          onChange={(e) => setFormData((prev) => ({ ...prev, body: e.target.value }))}
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
              setFormData((prev) => ({ ...prev, status: value }))
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
              setFormData((prev) => ({ ...prev, priority: value }))
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
          {isLoading ? "更新中..." : "更新"}
        </Button>
      </div>
    </form>
  );
}