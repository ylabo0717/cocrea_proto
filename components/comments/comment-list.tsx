"use client";

import { useEffect, useState } from "react";
import { Comment } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { CommentItem } from "./comment-item";

interface CommentListProps {
  contentId: string;
  refreshKey?: number;
}

export function CommentList({ contentId, refreshKey = 0 }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/comments?contentId=${contentId}`);
      if (!response.ok) {
        throw new Error('コメントの取得に失敗しました');
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "コメントの取得に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [contentId, refreshKey]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-muted rounded w-32 mb-2" />
            <div className="h-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        コメントはありません
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment as any}
          onUpdate={loadComments}
        />
      ))}
    </div>
  );
}