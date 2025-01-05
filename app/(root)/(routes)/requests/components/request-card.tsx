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
                <RequestPriorityBadge priority={request.priority!} />
                <Badge variant="secondary" className="font-normal">
                  {request.application.name}
                </Badge>
              </div>
              <h3 className="text-xl font-bold">{request.title}</h3>
            </div>
            <RequestStatusBadge status={request.status!} />
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>作成者: {request.author.name}</span>
            </div>
            {request.assignee && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>担当者: {request.assignee.name}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
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
      </Card>
    </Link>
  );
}