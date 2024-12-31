"use client";

import { useEffect } from "react";
import { useIssue } from "./hooks/use-issue";
import { IssueStatusBadge } from "./components/issue-status-badge";
import { IssuePriorityBadge } from "./components/issue-priority-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useSession } from "@/hooks/use-session";

export default function IssueDetailPage({ params }: { params: { issueId: string } }) {
  const { issue, isLoading: isLoadingIssue, refreshIssue } = useIssue(params.issueId);
  const { isDeveloper, isLoading: isLoadingSession } = useSession();

  useEffect(() => {
    refreshIssue();
  }, [refreshIssue]);

  const handleEdit = () => {
    console.log('Edit button clicked for issue:', issue?.id);
  };

  if (isLoadingIssue || isLoadingSession) {
    return (
      <div className="h-full p-4 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
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

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{issue.title}</h1>
            <div className="flex items-center gap-2">
              <IssueStatusBadge status={issue.status} size="lg" />
              <IssuePriorityBadge priority={issue.priority} size="lg" />
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

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div>作成者: {(issue as any).author.name}</div>
          <div>作成日時: {format(new Date(issue.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}</div>
          {issue.updated_at !== issue.created_at && (
            <div>更新日時: {format(new Date(issue.updated_at), 'yyyy/MM/dd HH:mm', { locale: ja })}</div>
          )}
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown>{issue.body}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}