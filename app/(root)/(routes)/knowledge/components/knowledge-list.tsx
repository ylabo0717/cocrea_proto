"use client";

import { Content } from "@/lib/types";
import { KnowledgeCard } from "./knowledge-card";
import { Skeleton } from "@/components/ui/skeleton";

interface KnowledgeListProps {
  knowledgeList: Content[];
  isLoading: boolean;
}

export function KnowledgeList({ knowledgeList, isLoading }: KnowledgeListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[200px]" />
        ))}
      </div>
    );
  }

  if (knowledgeList.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        ナレッジがありません
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {knowledgeList.map((knowledge) => (
        <KnowledgeCard key={knowledge.id} knowledge={knowledge as any} />
      ))}
    </div>
  );
}