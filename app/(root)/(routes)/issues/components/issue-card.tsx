"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Content } from "@/lib/types";
import { AlertCircle, CheckCircle2, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";

interface IssueCardProps {
  issue: Content & {
    author: { name: string };
    assignee?: { name: string };
    application: { name: string };
  };
}

export function IssueCard({ issue }: IssueCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return '未対応';
      case 'in_progress':
        return '対応中';
      case 'resolved':
        return '解決済み';
      default:
        return status;
    }
  };

  return (
    <Link href={`/issues/${issue.id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getPriorityColor(issue.priority!)}>
                {issue.priority === 'high' ? '高' : issue.priority === 'medium' ? '中' : '低'}
              </Badge>
              <Badge variant="secondary" className="font-normal">
                {issue.application.name}
              </Badge>
            </div>
            <h3 className="text-xl font-bold">{issue.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(issue.status!)}
            <span className="text-sm text-muted-foreground">
              {getStatusText(issue.status!)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
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
          <div>
            {format(new Date(issue.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
          </div>
        </div>
      </Card>
    </Link>
  );
}