"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateApplication } from "@/lib/api/applications";
import { Application } from "@/lib/types";
import { Pencil } from "lucide-react";

interface EditApplicationDialogProps {
  application: Application;
  onSuccess: () => void;
}

export function EditApplicationDialog({ application, onSuccess }: EditApplicationDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: application.name,
    description: application.description || "",
    status: application.status,
    next_release_date: application.next_release_date ? application.next_release_date.split('T')[0] : "",
    progress: application.progress
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateApplication(application.id, {
        ...formData,
        next_release_date: formData.next_release_date ? `${formData.next_release_date}T00:00:00Z` : null
      });
      
      toast({
        title: "成功",
        description: "アプリケーションを更新しました",
      });

      setOpen(false);
      onSuccess();
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "アプリケーションの更新に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-accent">
          <Pencil className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>アプリケーション編集</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">アプリケーション名</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="例: 営業管理システム"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">説明</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="アプリケーションの説明を入力してください"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">ステータス</label>
            <Select
              value={formData.status}
              onValueChange={(value: 'development' | 'released' | 'discontinued') => 
                setFormData((prev) => ({ ...prev, status: value }))
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">開発中</SelectItem>
                <SelectItem value="released">運用中</SelectItem>
                <SelectItem value="discontinued">停止中</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">次回リリース予定日</label>
            <Input
              type="date"
              value={formData.next_release_date}
              onChange={(e) => setFormData((prev) => ({ 
                ...prev, 
                next_release_date: e.target.value
              }))}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">進捗 (%)</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData((prev) => ({ 
                ...prev, 
                progress: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
              }))}
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "更新中..." : "更新"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}