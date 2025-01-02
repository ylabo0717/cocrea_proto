"use client";

import { useState, useCallback, useMemo } from "react";
import { Content } from "@/lib/types";

export function useKnowledgeFilter(knowledgeList: Content[]) {
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const handleApplicationFilterChange = useCallback((value: string | null) => {
    setApplicationId(value);
  }, []);

  const filteredKnowledge = useMemo(() => {
    return knowledgeList.filter((knowledge) => {
      const applicationMatch = !applicationId || (knowledge as any).application.id === applicationId;
      return applicationMatch;
    });
  }, [knowledgeList, applicationId]);

  return {
    applicationId,
    filteredKnowledge,
    handleApplicationFilterChange,
  };
}