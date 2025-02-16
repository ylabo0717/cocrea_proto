"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/hooks/use-toast";

export function CreateIssueButton() {
  const { userId, isLoading } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  if (isLoading || !userId) {
    return null;
  }

  const handleCreate = async () => {
    try {
      // 空の仮データを作成
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: '',
          body: '',
          status: 'open',
          priority: 'medium',
          application_id: '',
          draft_title: '',
          draft_body: '',
          draft_status: 'open',
          draft_priority: 'medium',
        }),
      });

      if (!response.ok) {
        throw new Error('イシューの作成に失敗しました');
      }

      const issue = await response.json();
      // 作成された仮データの編集ページにリダイレクト
      router.push(`/issues/${issue.id}/edit`);
    } catch (error) {
      console.error('Failed to create issue:', error);
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : 'イシューの作成に失敗しました',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button className="gap-2" onClick={handleCreate}>
      <Plus className="h-4 w-4" />
      新規作成
    </Button>
  );
}