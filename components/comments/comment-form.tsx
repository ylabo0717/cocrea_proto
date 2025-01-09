"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import { AttachmentUpload } from "../attachments/attachment-upload";
import { AttachmentList } from "../attachments/attachment-list";
import { Paperclip } from "lucide-react";

interface CommentFormProps {
  contentId: string;
  onSuccess: () => void;
}

export function CommentForm({ contentId, onSuccess }: CommentFormProps) {
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [attachmentRefreshKey, setAttachmentRefreshKey] = useState(0);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId,
          body: body.trim()
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'コメントの投稿に失敗しました');
      }

      setBody("");
      setTab("write");
      onSuccess();
      toast({
        title: "成功",
        description: "コメントを投稿しました",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "コメントの投稿に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttachmentUpload = () => {
    setAttachmentRefreshKey(prev => prev + 1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs value={tab} onValueChange={(value) => setTab(value as "write" | "preview")}>
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            <TabsTrigger value="write">書く</TabsTrigger>
            <TabsTrigger value="preview">プレビュー</TabsTrigger>
          </TabsList>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "投稿中..." : "投稿"}
          </Button>
        </div>

        <TabsContent value="write">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="コメントを入力... (Markdown形式で記述可能)"
            className="min-h-[100px] font-mono"
            disabled={isLoading}
            required
          />
        </TabsContent>
        <TabsContent value="preview">
          <div className="min-h-[100px] p-3 border rounded-md prose prose-neutral dark:prose-invert max-w-none">
            {body ? (
              <ReactMarkdown>{body}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground">プレビューする内容がありません</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

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
          canDelete={true}
          refreshKey={attachmentRefreshKey}
        />
      </div>
    </form>
  );
}