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
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルサイズのチェック (50MB)
    if (file.size > 52428800) {
      toast({
        title: "エラー",
        description: "ファイルサイズは50MB以下にしてください",
        variant: "destructive",
      });
      return;
    }

    // MIMEタイプのチェック
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      toast({
        title: "エラー",
        description: "許可されていないファイル形式です",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await uploadAttachment(file, contentId);
      toast({
        title: "成功",
        description: "ファイルをアップロードしました",
      });
      onUpload();
    } catch (error) {
      console.error('Upload error:', error);
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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
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
        type="button"
        variant="outline"
        onClick={handleClick}
        disabled={isUploading}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        {isUploading ? "アップロード中..." : "ファイルを添付"}
      </Button>
    </div>
  );
}