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
import { updateRequest } from "@/lib/api/requests";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { RequestStatusBadge } from "../components/request-status-badge";
import { RequestPriorityBadge } from "../components/request-priority-badge";
import { CommentForm } from "@/components/comments/comment-form";
import { CommentList } from "@/components/comments/comment-list";

export default function RequestDetailPage({ params }: { params: { requestId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { request, isLoading: isLoadingRequest, refreshRequest } = useRequest(params.requestId);
  const { isDeveloper, isLoading: isLoadingSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [commentRefreshKey, setCommentRefreshKey] = useState(0);

  useEffect(() => {
    refreshRequest();
  }, [refreshRequest]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (data: RequestFormData) => {
    try {
      await updateRequest(params.requestId, {
        title: data.title,
        body: data.body,
        status: data.status,
        priority: data.priority,
        application_id: data.application_id,
        assignee_id: data.assignee_id
      });
      
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
        <p className="text-muted-foreground">要望が見つかりませんでした。</p>
      </div>
    );
  }

  const canEditRequest = isDeveloper || request.author_id === request.id;

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
            title: request.title,
            body: request.body,
            status: request.status as any,
            priority: request.priority as any,
            application_id: (request as any).application.id,
            assignee_id: request.assignee_id || undefined
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
                <h1 className="text-3xl font-bold">{request.title}</h1>
                <div className="flex items-center gap-2">
                  <RequestStatusBadge status={request.status!} size="lg" />
                  <RequestPriorityBadge priority={request.priority!} size="lg" />
                  <Badge variant="outline">{(request as any).application.name}</Badge>
                </div>
              </div>
              {canEditRequest && (
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
                  <span>作成者: {(request as any).author.name}</span>
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
              <ReactMarkdown>{request.body}</ReactMarkdown>
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