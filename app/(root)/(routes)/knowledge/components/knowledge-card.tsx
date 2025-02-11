"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Content } from "@/lib/types";
import { User, Calendar, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { LikeButton } from "@/components/likes/like-button";
import { useSession } from "@/hooks/use-session";

interface KnowledgeCardProps {
  knowledge: Content & {
    author: { name: string };
    application: { name: string };
  };
}

export function KnowledgeCard({ knowledge }: KnowledgeCardProps) {
  const { isAdmin, userId } = useSession();
  
  const canViewDraft = isAdmin || knowledge.author_id === userId;
  
  // 下書きのみで、かつ閲覧権限がない場合は表示しない
  const isDraftOnly = !knowledge.title && knowledge.draft_title;
  if (isDraftOnly && !canViewDraft) {
    return null;
  }
  
  // 下書きの内容を表示するかどうかを判定
  const displayTitle = canViewDraft ? (knowledge.draft_title || knowledge.title) : knowledge.title;
  const displayCategory = canViewDraft ? (knowledge.draft_category || knowledge.category) : knowledge.category;
  const displayTags = canViewDraft ? (knowledge.draft_tags || knowledge.tags) : knowledge.tags;
  return (
    <Link href={`/knowledge/${knowledge.id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-normal">
                  {knowledge.application?.name ?? "未設定"}
                </Badge>
                {displayCategory && (
                  <Badge variant="outline" className="font-normal">
                    {displayCategory}
                  </Badge>
                )}
                {canViewDraft && knowledge.draft_title && (
                  <Badge variant="secondary">下書き</Badge>
                )}
              </div>
              <h3 className="text-xl font-bold">{displayTitle}</h3>
            </div>
            <LikeButton contentId={knowledge.id} />
          </div>

          {/* 残りのコードは変更なし */}
        </div>
      </Card>
    </Link>
  );
}