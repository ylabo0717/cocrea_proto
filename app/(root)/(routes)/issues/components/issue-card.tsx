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
import { LikeButton } from "@/components/likes/like-button";

interface IssueCardProps {
  issue: Content & {
    author: { name: string };
    assignee?: { name: string };
    application?: { name: string } | null;
  };
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <Link href={`/issues/${issue.id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <IssuePriorityBadge priority={issue.priority!} />
                {issue.application && (
                  <Badge variant="secondary" className="font-normal">
                    {issue.application.name}
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-bold">{issue.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <LikeButton contentId={issue.id} />
              <IssueStatusBadge status={issue.status!} />
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{issue.author?.name || '不明'}</span>
            </div>
            {issue.assignee && (
              <div className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                <span>{issue.assignee.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(issue.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
