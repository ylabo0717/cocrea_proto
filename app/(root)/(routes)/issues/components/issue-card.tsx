'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Content } from '@/lib/types';
import { User, Calendar, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Link from 'next/link';
import { IssueStatusBadge } from './issue-status-badge';
import { IssuePriorityBadge } from './issue-priority-badge';
import { LikeButton } from '@/components/likes/like-button';
import { useSession } from '@/hooks/use-session';

interface IssueCardProps {
  issue: Content & {
    author: { name: string };
    assignee?: { name: string };
    application: { name: string };
  };
}

export function IssueCard({ issue }: IssueCardProps) {
  const { isAdmin, userId } = useSession();
  
  const canViewDraft = isAdmin || issue.author_id === userId;
  
  // 下書きのみで、かつ閲覧権限がない場合は表示しない
  const isDraftOnly = !issue.title && issue.draft_title;
  if (isDraftOnly && !canViewDraft) {
    return null;
  }
  
  // 下書きの内容を表示するかどうかを判定
  const displayTitle = canViewDraft ? (issue.draft_title || issue.title) : issue.title;
  const displayStatus = canViewDraft ? (issue.draft_status || issue.status!) : issue.status!;
  const displayPriority = canViewDraft ? (issue.draft_priority || issue.priority!) : issue.priority!;
  return (
    <Link href={`/issues/${issue.id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <IssuePriorityBadge priority={displayPriority} />
                <Badge variant="secondary" className="font-normal">
                  {issue.application?.name}
                </Badge>
                {canViewDraft && issue.draft_title && (
                  <Badge variant="secondary">下書き</Badge>
                )}
              </div>
              <h3 className="text-xl font-bold">{displayTitle}</h3>
            </div>
            <div className="flex items-center gap-2">
              <LikeButton contentId={issue.id} />
              <IssueStatusBadge status={displayStatus} />
            </div>
          </div>

          {/* 残りのコードは変更なし */}
        </div>
      </Card>
    </Link>
  );
}
