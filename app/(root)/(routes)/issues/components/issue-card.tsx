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
    application: { name: string };
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
                <Badge variant="secondary" className="font-normal">
                  {issue.application.name}
                </Badge>
              </div>
              <h3 className="text-xl font-bold">{issue.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <LikeButton contentId={issue.id} />
              <IssueStatusBadge status={issue.status!} />
            </div>
          </div>

          {/* 残りのコードは変更なし */}
        </div>
      </Card>
    </Link>
  );
}