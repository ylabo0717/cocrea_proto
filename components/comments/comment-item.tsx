"use client";

import { useState } from "react";
import { Comment } from "@/lib/types";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { User, Pencil } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { CommentEditForm } from "./comment-edit-form";

interface CommentItemProps {
  comment: Comment & { user: { name: string } };
  onUpdate: () => void;
}

export function CommentItem({ comment, onUpdate }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { userId } = useSession();
  const isAuthor = userId === comment.user_id;

  const handleEditSuccess = () => {
    setIsEditing(false);
    onUpdate();
  };

  const handleCancel = () => {
    setIsEditing(false);
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
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{comment.user.name}</span>
          <span>•</span>
          <span>{format(new Date(comment.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}</span>
        </div>
        {isAuthor && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown>{comment.body}</ReactMarkdown>
      </div>
    </div>
  );
}