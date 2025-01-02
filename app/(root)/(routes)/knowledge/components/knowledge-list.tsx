"use client";

import { Content } from "@/lib/types";
import { KnowledgeCard } from "./knowledge-card";
import { KnowledgeTable } from "./knowledge-table";
import { Skeleton } from "@/components/ui/skeleton";

interface KnowledgeListProps {
  knowledgeList: Content[];
  isLoading: boolean;
  view: "grid" | "table";
}

export function KnowledgeList({ knowledgeList, isLoading, view }: KnowledgeListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
        </div>
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
    <div>
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {knowledgeList.map((knowledge) => (
            <KnowledgeCard key={knowledge.id} knowledge={knowledge as any} />
          ))}
        </div>
      ) : (
        <KnowledgeTable knowledgeList={knowledgeList} />
      )}
    </div>
  );
}