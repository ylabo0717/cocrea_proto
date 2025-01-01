"use client";

import { useEffect, useState } from "react";
import { Comment } from "@/lib/types";
import { fetchComments } from "@/lib/api/comments";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { User } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
      const data = await fetchComments(contentId);
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
        <div key={comment.id} className="border rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{(comment as any).user.name}</span>
            <span>•</span>
            <span>{format(new Date(comment.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}</span>
          </div>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown>{comment.body}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}