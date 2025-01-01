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
import { updateKnowledge } from "@/lib/api/knowledge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CommentForm } from "@/components/comments/comment-form";
import { CommentList } from "@/components/comments/comment-list";

export default function KnowledgeDetailPage({ params }: { params: { knowledgeId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { knowledge, isLoading: isLoadingKnowledge, refreshKnowledge } = useKnowledge(params.knowledgeId);
  const { isDeveloper, isLoading: isLoadingSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [commentRefreshKey, setCommentRefreshKey] = useState(0);

  useEffect(() => {
    refreshKnowledge();
  }, [refreshKnowledge]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (data: KnowledgeFormData) => {
    try {
      await updateKnowledge(params.knowledgeId, data);
      
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
        <p className="text-muted-foreground">ナレッジが見つかりませんでした。</p>
      </div>
    );
  }

  const canEditKnowledge = isDeveloper || knowledge.author_id === knowledge.id;

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
            application_id: (knowledge as any).application.id,
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={false}
        />
      ) : (
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{knowledge.title}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{(knowledge as any).application.name}</Badge>
                  {knowledge.category && (
                    <Badge variant="outline">{knowledge.category}</Badge>
                  )}
                </div>
                {knowledge.tags && knowledge.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {knowledge.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              {canEditKnowledge && (
                <Button variant="outline" size="sm" className="gap-2" onClick={handleEdit}>
                  <Pencil className="h-4 w-4" />
                  編集
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>作成者: {(knowledge as any).author.name}</span>
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
              <ReactMarkdown>{knowledge.body}</ReactMarkdown>
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