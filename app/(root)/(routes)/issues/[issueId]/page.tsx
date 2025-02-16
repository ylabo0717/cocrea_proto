"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIssue } from "./hooks/use-issue";
import { IssueForm } from "../components/issue-form/issue-form";
import { IssueFormData } from "../components/issue-form/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, User, Calendar, RefreshCw } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { IssueStatusBadge } from "../components/issue-status-badge";
import { IssuePriorityBadge } from "../components/issue-priority-badge";
import { CommentForm } from "@/components/comments/comment-form";
import { CommentList } from "@/components/comments/comment-list";
import { LikeButton } from "@/components/likes/like-button";

export default function IssueDetailPage({ params }: { params: { issueId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { issue, isLoading: isLoadingIssue, refreshIssue } = useIssue(params.issueId);
  const { isDeveloper, isAdmin, userId, isLoading: isLoadingSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [commentRefreshKey, setCommentRefreshKey] = useState(0);

  useEffect(() => {
    refreshIssue();
  }, [refreshIssue]);

  // ローディング中の表示
  if (isLoadingIssue || isLoadingSession) {
    return (
      <div className="h-full p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <Link href="/issues" className="text-sm hover:underline">
            課題一覧に戻る
          </Link>
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  // コンテンツが見つからない場合
  if (!issue) {
    return (
      <div className="h-full p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <Link href="/issues" className="text-sm hover:underline">
            課題一覧に戻る
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-lg font-semibold mb-2">課題が見つかりません</p>
          <p className="text-sm text-muted-foreground">この課題は削除されたか、アクセス権限がない可能性があります</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/contents/${params.issueId}/edit?type=issue`);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (data: IssueFormData) => {
    try {
      const response = await fetch(`/api/issues/${params.issueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '課題の更新に失敗しました');
      }
      
      toast({
        title: "成功",
        description: "課題を更新しました",
      });

      setIsEditing(false);
      await refreshIssue();
    } catch (error) {
      console.error('Failed to update issue:', error);
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "課題の更新に失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleSaveDraft = async (data: IssueFormData) => {
    try {
      const response = await fetch(`/api/issues/${params.issueId}`, {
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

      await refreshIssue();
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
      const response = await fetch(`/api/issues/${params.issueId}`, {
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
      await refreshIssue();
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

  if (isLoadingIssue || isLoadingSession) {
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

  if (!issue) {
    return (
      <div className="h-full p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-8">
          <Link href="/issues" className="hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span>課題一覧</span>
        </div>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">課題が見つかりません</h2>
          <p className="text-muted-foreground">
            指定された課題は存在しないか、削除された可能性があります。
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/issues')}
          >
            課題一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  // 下書きの内容を含めて表示
  const displayTitle = issue.draft_title || issue.title;
  const displayBody = issue.draft_body || issue.body;
  const displayStatus = issue.draft_status || issue.status!;
  const displayPriority = issue.draft_priority || issue.priority!;

  return (
    <div className="h-full p-4 space-y-8">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Link href="/issues" className="hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span>課題一覧</span>
        <span>/</span>
        <span>{issue.title}</span>
      </div>

      {isEditing ? (
        <IssueForm
          initialData={{
            id: issue.id,
            title: issue.draft_title || issue.title,
            body: issue.draft_body || issue.body,
            status: issue.draft_status || issue.status as any,
            priority: issue.draft_priority || issue.priority as any,
            application_id: (issue as any).application?.id || '',
            assignee_id: issue.assignee_id || undefined,
            draft_title: issue.draft_title || undefined,
            draft_body: issue.draft_body || undefined,
            draft_status: issue.draft_status as any,
            draft_priority: issue.draft_priority as any,
            draft_tags: issue.draft_tags || undefined,
            last_draft_saved_at: issue.last_draft_saved_at || undefined,
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={false}
          onSaveDraft={handleSaveDraft}
          onPublishDraft={handlePublishDraft}
          isDraft={!!issue.draft_title || !!issue.draft_body}
        />
      ) : (
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{displayTitle}</h1>
                <div className="flex items-center gap-2">
                  <IssueStatusBadge status={displayStatus} size="lg" />
                  <IssuePriorityBadge priority={displayPriority} size="lg" />
                  <Badge variant="outline">{(issue as any).application?.name}</Badge>
                  {issue.draft_title && (
                    <Badge variant="secondary">下書き</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LikeButton contentId={issue.id} />
                {!isLoadingSession && (isAdmin || issue.author_id === userId) && (
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
                  <span>作成者: {(issue as any).author?.name}</span>
                </div>
                {(issue as any).assignee && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>担当者: {(issue as any).assignee.name}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>作成: {format(new Date(issue.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}</span>
                </div>
                {issue.updated_at !== issue.created_at && (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    <span>更新: {format(new Date(issue.updated_at), 'yyyy/MM/dd HH:mm', { locale: ja })}</span>
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
              contentId={issue.id}
              refreshKey={commentRefreshKey}
            />
            <div className="border-t pt-6">
              <CommentForm 
                contentId={issue.id}
                onSuccess={handleCommentSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}