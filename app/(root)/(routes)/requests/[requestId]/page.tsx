"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRequest } from "./hooks/use-request";
import { RequestForm } from "../components/request-form/request-form";
import { RequestFormData } from "../components/request-form/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, User, Calendar, RefreshCw } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { RequestStatusBadge } from "../components/request-status-badge";
import { RequestPriorityBadge } from "../components/request-priority-badge";
import { CommentForm } from "@/components/comments/comment-form";
import { CommentList } from "@/components/comments/comment-list";
import { LikeButton } from "@/components/likes/like-button";

export default function RequestDetailPage({ params }: { params: { requestId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { request, isLoading: isLoadingRequest, refreshRequest } = useRequest(params.requestId);
  const { isDeveloper, isAdmin, userId, isLoading: isLoadingSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [commentRefreshKey, setCommentRefreshKey] = useState(0);

  useEffect(() => {
    refreshRequest();
  }, [refreshRequest]);

  // ローディング中の表示
  if (isLoadingRequest || isLoadingSession) {
    return (
      <div className="h-full p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <Link href="/requests" className="text-sm hover:underline">
            要望一覧に戻る
          </Link>
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  // コンテンツが見つからない場合の表示
  if (!request) {
    return (
      <div className="h-full p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <Link href="/requests" className="text-sm hover:underline">
            要望一覧に戻る
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-lg font-semibold mb-2">要望が見つかりません</p>
          <p className="text-sm text-muted-foreground">この要望は削除されたか、アクセス権限がない可能性があります</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/contents/${params.requestId}/edit?type=request`);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (data: RequestFormData) => {
    try {
      const response = await fetch(`/api/requests/${params.requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '要望の更新に失敗しました');
      }
      
      toast({
        title: "成功",
        description: "要望を更新しました",
      });

      setIsEditing(false);
      await refreshRequest();
    } catch (error) {
      console.error('Failed to update request:', error);
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "要望の更新に失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleSaveDraft = async (data: RequestFormData) => {
    try {
      const response = await fetch(`/api/requests/${params.requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          draft_title: data.title,
          draft_body: data.body,
          draft_status: data.status,
          draft_priority: data.priority,
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

      await refreshRequest();
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
      const response = await fetch(`/api/requests/${params.requestId}`, {
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
      await refreshRequest();
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

  if (isLoadingRequest || isLoadingSession) {
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

  if (!request) {
    return (
      <div className="h-full p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-8">
          <Link href="/requests" className="hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span>要望一覧</span>
        </div>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">要望が見つかりません</h2>
          <p className="text-muted-foreground">
            指定された要望は存在しないか、削除された可能性があります。
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/requests')}
          >
            要望一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  // 下書きの内容を含めて表示
  const displayTitle = request.draft_title || request.title;
  const displayBody = request.draft_body || request.body;
  const displayStatus = request.draft_status || request.status!;
  const displayPriority = request.draft_priority || request.priority!;

  return (
    <div className="h-full p-4 space-y-8">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Link href="/requests" className="hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span>要望一覧</span>
        <span>/</span>
        <span>{request.title}</span>
      </div>

      {isEditing ? (
        <RequestForm
          initialData={{
            id: request.id,
            title: request.draft_title || request.title,
            body: request.draft_body || request.body,
            status: request.draft_status || request.status as any,
            priority: request.draft_priority || request.priority as any,
            application_id: (request as any).application?.id || '',
            assignee_id: request.assignee_id || undefined,
            draft_title: request.draft_title || undefined,
            draft_body: request.draft_body || undefined,
            draft_status: request.draft_status as any,
            draft_priority: request.draft_priority as any,
            draft_tags: request.draft_tags || undefined,
            last_draft_saved_at: request.last_draft_saved_at || undefined,
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={false}
          onSaveDraft={handleSaveDraft}
          onPublishDraft={handlePublishDraft}
          isDraft={!!request.draft_title || !!request.draft_body}
        />
      ) : (
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{displayTitle}</h1>
                <div className="flex items-center gap-2">
                  <RequestStatusBadge status={displayStatus} size="lg" />
                  <RequestPriorityBadge priority={displayPriority} size="lg" />
                  <Badge variant="outline">{(request as any).application?.name}</Badge>
                  {request.draft_title && (
                    <Badge variant="secondary">下書き</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LikeButton contentId={request.id} />
                {!isLoadingSession && (isAdmin || request.author_id === userId) && (
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    編集
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>作成者: {(request as any).author?.name}</span>
                </div>
                {(request as any).assignee && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>担当者: {(request as any).assignee.name}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>作成: {format(new Date(request.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}</span>
                </div>
                {request.updated_at !== request.created_at && (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    <span>更新: {format(new Date(request.updated_at), 'yyyy/MM/dd HH:mm', { locale: ja })}</span>
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
              contentId={request.id}
              refreshKey={commentRefreshKey}
            />
            <div className="border-t pt-6">
              <CommentForm 
                contentId={request.id}
                onSuccess={handleCommentSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}