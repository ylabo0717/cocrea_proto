"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Content } from "@/lib/types";
import { User, Calendar, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { IssueStatusBadge } from "./issue-status-badge";
import { IssuePriorityBadge } from "./issue-priority-badge";

interface IssueCardProps {
  issue: Content & {
    author: { name: string };
    assignee?: { name: string };
    application: { name: string };
  };
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <Link href={`/issues/${issue.id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          {/* ヘッダー部分 */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <IssuePriorityBadge priority={issue.priority!} />
                <Badge variant="secondary" className="font-normal">
                  {issue.application.name}
                </Badge>
              </div>
              <h3 className="text-xl font-bold">{issue.title}</h3>
            </div>
            <IssueStatusBadge status={issue.status!} />
          </div>

          {/* ユーザー情報 */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>作成者: {issue.author.name}</span>
            </div>
            {issue.assignee && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>担当者: {issue.assignee.name}</span>
              </div>
            )}
          </div>

          {/* 日時情報 */}
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
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
      </Card>
    </Link>
  );
}