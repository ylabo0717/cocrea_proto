"use client";

import { useEffect, useState } from "react";
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
import { updateIssue } from "@/lib/api/issues";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { IssueStatusBadge } from "../components/issue-status-badge";
import { IssuePriorityBadge } from "../components/issue-priority-badge";

export default function IssueDetailPage({ params }: { params: { issueId: string } }) {
  const { issue, isLoading: isLoadingIssue, refreshIssue } = useIssue(params.issueId);
  const { isDeveloper, isLoading: isLoadingSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    refreshIssue();
  }, [refreshIssue]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (data: IssueFormData) => {
    try {
      await updateIssue(params.issueId, {
        title: data.title,
        body: data.body,
        status: data.status,
        priority: data.priority,
        application_id: data.application_id,
        assignee_id: data.assignee_id
      });
      
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
        <p className="text-muted-foreground">課題が見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="h-full p-4 space-y-4">
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
            title: issue.title,
            body: issue.body,
            status: issue.status as any,
            priority: issue.priority as any,
            application_id: (issue as any).application.id,
            assignee_id: issue.assignee_id || undefined
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={false}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{issue.title}</h1>
              <div className="flex items-center gap-2">
                <IssueStatusBadge status={issue.status!} size="lg" />
                <IssuePriorityBadge priority={issue.priority!} size="lg" />
                <Badge variant="outline">{(issue as any).application.name}</Badge>
              </div>
            </div>
            {!isLoadingSession && isDeveloper && (
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
                <span>作成者: {(issue as any).author.name}</span>
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
            <ReactMarkdown>{issue.body}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}