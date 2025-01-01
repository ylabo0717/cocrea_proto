"use client";

import { Attachment, getAttachmentUrl } from "@/lib/api/attachments";
import { Button } from "@/components/ui/button";
import { FileIcon, Trash2, Download } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { CopyMarkdownButton } from "./copy-markdown-button";

interface AttachmentItemProps {
  attachment: Attachment;
  onDelete?: () => void;
}

export function AttachmentItem({ attachment, onDelete }: AttachmentItemProps) {
  const publicUrl = getAttachmentUrl(attachment.file_path);
  const isImage = attachment.mime_type.startsWith('image/');

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(publicUrl);
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
            filePath={attachment.file_path}
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownload}
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