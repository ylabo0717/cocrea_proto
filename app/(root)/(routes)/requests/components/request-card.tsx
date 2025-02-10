"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Content } from "@/lib/types";
import { User, Calendar, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { RequestStatusBadge } from "./request-status-badge";
import { RequestPriorityBadge } from "./request-priority-badge";
import { LikeButton } from "@/components/likes/like-button";
import { useSession } from "@/hooks/use-session";

interface RequestCardProps {
  request: Content & {
    author: { name: string };
    assignee?: { name: string };
    application: { name: string };
  };
}

export function RequestCard({ request }: RequestCardProps) {
  const { isDeveloper, userId } = useSession();
  
  const canViewDraft = isDeveloper || request.author_id === userId;
  
  // 下書きの内容を表示するかどうかを判定
  const displayTitle = canViewDraft ? (request.draft_title || request.title) : request.title;
  const displayStatus = canViewDraft ? (request.draft_status || request.status!) : request.status!;
  const displayPriority = canViewDraft ? (request.draft_priority || request.priority!) : request.priority!;
  return (
    <Link href={`/requests/${request.id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <RequestPriorityBadge priority={displayPriority} />
                <Badge variant="secondary" className="font-normal">
                  {request.application.name}
                </Badge>
                {canViewDraft && request.draft_title && (
                  <Badge variant="secondary">下書き</Badge>
                )}
              </div>
              <h3 className="text-xl font-bold">{displayTitle}</h3>
            </div>
            <div className="flex items-center gap-2">
              <LikeButton contentId={request.id} />
              <RequestStatusBadge status={displayStatus} />
            </div>
          </div>

          {/* 残りのコードは変更なし */}
        </div>
      </Card>
    </Link>
  );
}