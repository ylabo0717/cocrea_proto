"use client";

import { useState } from "react";
import { AttachmentUpload } from "@/components/attachments/attachment-upload";
import { AttachmentList } from "@/components/attachments/attachment-list";
import { Paperclip } from "lucide-react";

interface IssueFormAttachmentsProps {
  contentId: string;
  canDelete?: boolean;
}

export function IssueFormAttachments({ contentId, canDelete = true }: IssueFormAttachmentsProps) {
  const [attachmentRefreshKey, setAttachmentRefreshKey] = useState(0);

  const handleAttachmentUpload = () => {
    setAttachmentRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Paperclip className="h-4 w-4" />
          添付ファイル
        </h3>
        <AttachmentUpload
          contentId={contentId}
          onUpload={handleAttachmentUpload}
        />
      </div>
      <AttachmentList
        contentId={contentId}
        canDelete={canDelete}
        refreshKey={attachmentRefreshKey}
      />
    </div>
  );
}