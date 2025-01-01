"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createComment } from "@/lib/api/comments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";

interface CommentFormProps {
  contentId: string;
  onSuccess: () => void;
}

export function CommentForm({ contentId, onSuccess }: CommentFormProps) {
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setIsLoading(true);
    try {
      await createComment(contentId, body);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs value={tab} onValueChange={(value) => setTab(value as "write" | "preview")}>
        <TabsList className="mb-2">
          <TabsTrigger value="write">書く</TabsTrigger>
          <TabsTrigger value="preview">プレビュー</TabsTrigger>
        </TabsList>
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
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "投稿中..." : "投稿"}
        </Button>
      </div>
    </form>
  );
}