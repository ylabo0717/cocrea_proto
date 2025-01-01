"use client";

import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAttachmentUrl } from "@/lib/api/attachments";

interface CopyMarkdownButtonProps {
  fileName: string;
  filePath: string;
}

export function CopyMarkdownButton({ fileName, filePath }: CopyMarkdownButtonProps) {
  const { toast } = useToast();

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const publicUrl = getAttachmentUrl(filePath);
    const markdownLink = `![${fileName}](${publicUrl})`;

    try {
      await navigator.clipboard.writeText(markdownLink);
      toast({
        title: "コピー完了",
        description: "Markdown形式のリンクをコピーしました",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "クリップボードへのコピーに失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      title="Markdownリンクをコピー"
      type="button"
      className="hover:bg-accent hover:text-accent-foreground"
    >
      <FileText className="h-4 w-4" />
    </Button>
  );
}