"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createComment } from "@/lib/api/comments";

interface CommentFormProps {
  contentId: string;
  onSuccess: () => void;
}

export function CommentForm({ contentId, onSuccess }: CommentFormProps) {
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setIsLoading(true);
    try {
      await createComment(contentId, body);
      setBody("");
      onSuccess();
      toast({
        title: "成功",
        description: "コメントを投稿しました",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "コメントの投稿に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="コメントを入力..."
        className="min-h-[100px]"
        disabled={isLoading}
        required
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "投稿中..." : "投稿"}
        </Button>
      </div>
    </form>
  );
}