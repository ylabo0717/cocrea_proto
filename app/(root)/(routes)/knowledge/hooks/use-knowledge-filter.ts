"use client";

import { useState, useCallback } from "react";
import { Content } from "@/lib/types";

export function useKnowledgeFilter() {
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const handleApplicationFilterChange = useCallback((value: string | null) => {
    setApplicationId(value);
  }, []);

  return {
    applicationId,
    handleApplicationFilterChange,
  };
}