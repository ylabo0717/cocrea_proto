"use client";

import { useEffect } from "react";
import { useIssue } from "./hooks/use-issue";
import { IssueStatusBadge } from "./components/issue-status-badge";
import { IssuePriorityBadge } from "./components/issue-priority-badge";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function IssueDetailPage({ params }: { params: { issueId: string } }) {
  const { issue, isLoading, refreshIssue } = useIssue(params.issueId);

  useEffect(() => {
    refreshIssue();
  }, [refreshIssue]);

  if (isLoading) {
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
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{issue.title}</h1>
          <div className="flex items-center gap-2">
            <IssueStatusBadge status={issue.status} size="lg" />
            <IssuePriorityBadge priority={issue.priority} size="lg" />
            <Badge variant="outline">{issue.application.name}</Badge>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div>作成者: {issue.author.name}</div>
          <div>作成日時: {format(new Date(issue.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}</div>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown>{issue.body}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}