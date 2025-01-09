"use client";

import { useState } from "react";
import { Comment } from "@/lib/types";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { User, Pencil, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { CommentEditForm } from "./comment-edit-form";
import { AttachmentList } from "../attachments/attachment-list";
import { useToast } from "@/hooks/use-toast";

interface CommentItemProps {
  comment: Comment & { user?: { name: string } };
  onUpdate: () => void;
}

export function CommentItem({ comment, onUpdate }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { userId } = useSession();
  const { toast } = useToast();
  const isAuthor = userId === comment.user_id;

  const handleEditSuccess = () => {
    setIsEditing(false);
    onUpdate();
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm('このコメントを削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'コメントの削除に失敗しました');
      }

      toast({
        title: "成功",
        description: "コメントを削除しました",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "コメントの削除に失敗しました",
        variant: "destructive",
      });
    }
  };

  if (isEditing) {
    return (
      <CommentEditForm
        comment={comment}
        onSuccess={handleEditSuccess}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{comment.user?.name || '不明なユーザー'}</span>
          <span>•</span>
          <span>{format(new Date(comment.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}</span>
        </div>
        {isAuthor && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown>{comment.body}</ReactMarkdown>
      </div>
      <AttachmentList contentId={comment.id} />
    </div>
  );
}