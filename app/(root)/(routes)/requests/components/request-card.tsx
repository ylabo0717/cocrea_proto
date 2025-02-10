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

interface RequestCardProps {
  request: Content & {
    author: { name: string };
    assignee?: { name: string };
    application: { name: string };
  };
}

export function RequestCard({ request }: RequestCardProps) {
  return (
    <Link href={`/requests/${request.id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <RequestPriorityBadge priority={request.draft_priority || request.priority!} />
                <Badge variant="secondary" className="font-normal">
                  {request.application.name}
                </Badge>
                {request.draft_title && (
                  <Badge variant="secondary">下書き</Badge>
                )}
              </div>
              <h3 className="text-xl font-bold">{request.draft_title || request.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <LikeButton contentId={request.id} />
              <RequestStatusBadge status={request.draft_status || request.status!} />
            </div>
          </div>

          {/* 残りのコードは変更なし */}
        </div>
      </Card>
    </Link>
  );
}