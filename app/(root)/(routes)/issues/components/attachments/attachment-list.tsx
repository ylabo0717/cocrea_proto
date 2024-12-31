"use client";

import { useEffect, useState } from "react";
import { Attachment, fetchAttachments, deleteAttachment } from "@/lib/api/attachments";
import { AttachmentItem } from "./attachment-item";
import { useToast } from "@/hooks/use-toast";

interface AttachmentListProps {
  contentId: string;
  canDelete?: boolean;
  onDelete?: () => void;
}

export function AttachmentList({ contentId, canDelete = false, onDelete }: AttachmentListProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadAttachments = async () => {
    try {
      const data = await fetchAttachments(contentId);
      setAttachments(data);
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "添付ファイルの取得に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAttachments();
  }, [contentId]);

  const handleDelete = async (attachment: Attachment) => {
    try {
      await deleteAttachment(attachment);
      toast({
        title: "成功",
        description: "添付ファイルを削除しました",
      });
      await loadAttachments();
      onDelete?.();
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "添付ファイルの削除に失敗しました",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-12 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (attachments.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        添付ファイルはありません
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <AttachmentItem
          key={attachment.id}
          attachment={attachment}
          onDelete={canDelete ? () => handleDelete(attachment) : undefined}
        />
      ))}
    </div>
  );
}