"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadAttachment } from "@/lib/api/attachments";

interface AttachmentUploadProps {
  contentId: string;
  onUpload: () => void;
}

export function AttachmentUpload({ contentId, onUpload }: AttachmentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadAttachment(file, contentId);
      toast({
        title: "成功",
        description: "ファイルをアップロードしました",
      });
      onUpload();
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "アップロードに失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
      />
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        {isUploading ? "アップロード中..." : "ファイルを添付"}
      </Button>
    </div>
  );
}