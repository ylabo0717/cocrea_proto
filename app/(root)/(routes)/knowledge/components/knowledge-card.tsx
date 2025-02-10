"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Content } from "@/lib/types";
import { User, Calendar, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { LikeButton } from "@/components/likes/like-button";

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
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-normal">
                  {knowledge.application.name}
                </Badge>
                {(knowledge.draft_category || knowledge.category) && (
                  <Badge variant="outline" className="font-normal">
                    {knowledge.draft_category || knowledge.category}
                  </Badge>
                )}
                {knowledge.draft_title && (
                  <Badge variant="secondary">下書き</Badge>
                )}
              </div>
              <h3 className="text-xl font-bold">{knowledge.draft_title || knowledge.title}</h3>
            </div>
            <LikeButton contentId={knowledge.id} />
          </div>

          {/* 残りのコードは変更なし */}
        </div>
      </Card>
    </Link>
  );
}