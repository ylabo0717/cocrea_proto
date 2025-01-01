"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Content } from "@/lib/types";
import { User, Calendar, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";

interface KnowledgeCardProps {
  knowledge: Content & {
    author: { name: string };
    application: { name: string };
  };
}

export function KnowledgeCard({ knowledge }: KnowledgeCardProps) {
  return (
    <Link href={`/knowledge/${knowledge.id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          {/* ヘッダー部分 */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-normal">
                  {knowledge.application.name}
                </Badge>
                {knowledge.category && (
                  <Badge variant="outline" className="font-normal">
                    {knowledge.category}
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-bold">{knowledge.title}</h3>
            </div>
          </div>

          {/* タグ */}
          {knowledge.tags && knowledge.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {knowledge.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* ユーザー情報 */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>作成者: {knowledge.author.name}</span>
            </div>
          </div>

          {/* 日時情報 */}
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>作成: {format(new Date(knowledge.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}</span>
            </div>
            {knowledge.updated_at !== knowledge.created_at && (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                <span>更新: {format(new Date(knowledge.updated_at), 'yyyy/MM/dd HH:mm', { locale: ja })}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}