"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKnowledge } from "./hooks/use-knowledge";
import { KnowledgeForm } from "../components/knowledge-form/knowledge-form";
import { KnowledgeFormData } from "../components/knowledge-form/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, User, Calendar, RefreshCw } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CommentForm } from "@/components/comments/comment-form";
import { CommentList } from "@/components/comments/comment-list";
import { LikeButton } from "@/components/likes/like-button";

export default function KnowledgeDetailPage({ params }: { params: { knowledgeId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { knowledge, isLoading: isLoadingKnowledge, refreshKnowledge } = useKnowledge(params.knowledgeId);
  const { isDeveloper, isAdmin, isLoading: isLoadingSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [commentRefreshKey, setCommentRefreshKey] = useState(0);

  useEffect(() => {
    refreshKnowledge();
  }, [refreshKnowledge]);

  // ローディング中の表示
  if (isLoadingKnowledge || isLoadingSession) {
    return (
      <div className="h-full p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <Link href="/knowledge" className="text-sm hover:underline">
            ナレッジ一覧に戻る
          </Link>
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  // コンテンツが見つからない場合の表示
  if (!knowledge) {
    return (
      <div className="h-full p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <Link href="/knowledge" className="text-sm hover:underline">
            ナレッジ一覧に戻る
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-lg font-semibold mb-2">ナレッジが見つかりません</p>
          <p className="text-sm text-muted-foreground">このナレッジは削除されたか、アクセス権限がない可能性があります</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (data: KnowledgeFormData) => {
    try {
      const response = await fetch(`/api/knowledge/${params.knowledgeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'ナレッジの更新に失敗しました');
      }
      
      toast({
        title: "成功",
        description: "ナレッジを更新しました",
      });

      setIsEditing(false);
      await refreshKnowledge();
    } catch (error) {
      console.error('Failed to update knowledge:', error);
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "ナレッジの更新に失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleSaveDraft = async (data: KnowledgeFormData) => {
    try {
      const response = await fetch(`/api/knowledge/${params.knowledgeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          draft_title: data.title,
          draft_body: data.body,
          draft_category: data.category,
          draft_tags: data.tags,
          last_draft_saved_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '下書きの保存に失敗しました');
      }

      toast({
        title: "成功",
        description: "下書きを保存しました",
      });

      await refreshKnowledge();
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "下書きの保存に失敗しました",
        variant: "destructive",
      });
    }
  };

  const handlePublishDraft = async () => {
    try {
      const response = await fetch(`/api/knowledge/${params.knowledgeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '下書きの公開に失敗しました');
      }

      toast({
        title: "成功",
        description: "下書きを公開しました",
      });

      setIsEditing(false);
      await refreshKnowledge();
    } catch (error) {
      console.error('Failed to publish draft:', error);
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "下書きの公開に失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleCommentSuccess = () => {
    setCommentRefreshKey(prev => prev + 1);
  };

  if (isLoadingKnowledge || isLoadingSession) {
    return (
      <div className="h-full p-4 space-y-4">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!knowledge) {
    return (
      <div className="h-full p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-8">
          <Link href="/knowledge" className="hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span>ナレッジ一覧</span>
        </div>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">ナレッジが見つかりません</h2>
          <p className="text-muted-foreground">
            指定されたナレッジは存在しないか、削除された可能性があります。
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/knowledge')}
          >
            ナレッジ一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  // 下書きの内容を含めて表示
  const displayTitle = knowledge.draft_title || knowledge.title;
  const displayBody = knowledge.draft_body || knowledge.body;
  const displayCategory = knowledge.draft_category || knowledge.category;
  const displayTags = knowledge.draft_tags || knowledge.tags;

  return (
    <div className="h-full p-4 space-y-8">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Link href="/knowledge" className="hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span>ナレッジ一覧</span>
        <span>/</span>
        <span>{knowledge.title}</span>
      </div>

      {isEditing ? (
        <KnowledgeForm
          initialData={{
            id: knowledge.id,
            title: knowledge.title,
            body: knowledge.body,
            category: knowledge.category || undefined,
            tags: knowledge.tags || undefined,
            application_id: (knowledge as any).application?.id,
            draft_title: knowledge.draft_title || undefined,
            draft_body: knowledge.draft_body || undefined,
            draft_category: knowledge.draft_category || undefined,
            draft_tags: knowledge.draft_tags || undefined,
            last_draft_saved_at: knowledge.last_draft_saved_at || undefined,
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={false}
          onSaveDraft={handleSaveDraft}
          onPublishDraft={handlePublishDraft}
          isDraft={!!knowledge.draft_title || !!knowledge.draft_body}
        />
      ) : (
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{displayTitle}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{(knowledge as any).application?.name}</Badge>
                  {displayCategory && (
                    <Badge variant="outline">{displayCategory}</Badge>
                  )}
                  {knowledge.draft_title && (
                    <Badge variant="secondary">下書き</Badge>
                  )}
                </div>
                {displayTags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {displayTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <LikeButton contentId={knowledge.id} />
                <Button variant="outline" size="sm" className="gap-2" onClick={handleEdit}>
                  <Pencil className="h-4 w-4" />
                  編集
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>作成者: {(knowledge as any).author?.name}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>作成: {format(new Date(knowledge.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}</span>
                </div>
                {knowledge.updated_at !== knowledge.created_at && (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    <span>更新: {format(new Date(knowledge.updated_at), 'yyyy/MM/dd HH:mm', { locale: ja })}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown>{displayBody}</ReactMarkdown>
            </div>
          </div>

          <div className="border-t pt-8 space-y-6">
            <h2 className="text-xl font-bold">コメント</h2>
            <CommentList 
              contentId={knowledge.id}
              refreshKey={commentRefreshKey}
            />
            <div className="border-t pt-6">
              <CommentForm 
                contentId={knowledge.id}
                onSuccess={handleCommentSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}