"use client";

import { useEffect } from "react";
import { KnowledgeList } from "./components/knowledge-list";
import { CreateKnowledgeButton } from "./components/create-knowledge-button";
import { useKnowledge } from "./hooks/use-knowledge";

export default function KnowledgePage() {
  const { knowledgeList, isLoading, refreshKnowledge } = useKnowledge();

  useEffect(() => {
    refreshKnowledge();
  }, [refreshKnowledge]);

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Knowledge</h2>
          <p className="text-muted-foreground">開発に関するナレッジを共有・管理できます</p>
        </div>
        <CreateKnowledgeButton />
      </div>

      <KnowledgeList 
        knowledgeList={knowledgeList}
        isLoading={isLoading}
      />
    </div>
  );
}