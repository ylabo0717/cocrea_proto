"use client";

import { useState } from "react";
import { Attachment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FileIcon, Trash2, Download } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { CopyMarkdownButton } from "./copy-markdown-button";
import { useToast } from "@/hooks/use-toast";
import { getPublicUrl } from "@/lib/api/attachments/storage";

interface AttachmentItemProps {
  attachment: Attachment;
  onDelete?: () => void;
}

export function AttachmentItem({ attachment, onDelete }: AttachmentItemProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const publicUrl = getPublicUrl(attachment.file_path);
  const isImage = attachment.mime_type.startsWith('image/');

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const response = await fetch(publicUrl);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "エラー",
        description: "ダウンロードに失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <FileIcon className="h-5 w-5 text-muted-foreground" />
        <div>
          <div className="font-medium">{attachment.file_name}</div>
          <div className="text-sm text-muted-foreground">
            {formatFileSize(attachment.file_size)}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isImage && (
          <CopyMarkdownButton
            fileName={attachment.file_name}
            filePath={publicUrl}
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownload}
          disabled={isDownloading}
          className="hover:bg-accent hover:text-accent-foreground"
        >
          <Download className="h-4 w-4" />
        </Button>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}