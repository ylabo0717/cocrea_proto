"use client";

import { Attachment, getAttachmentUrl } from "@/lib/api/attachments";
import { Button } from "@/components/ui/button";
import { FileIcon, Trash2, Download } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

interface AttachmentItemProps {
  attachment: Attachment;
  onDelete?: () => void;
}

export function AttachmentItem({ attachment, onDelete }: AttachmentItemProps) {
  const publicUrl = getAttachmentUrl(attachment.file_path);

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
        <Button
          variant="ghost"
          size="icon"
          asChild
        >
          <a href={publicUrl} download={attachment.file_name} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4" />
          </a>
        </Button>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}