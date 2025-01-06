"use client";

import { useState, useCallback, useMemo } from "react";
import { Content } from "@/lib/types";

export function useIssuesFilter(issues: Content[]) {
  console.log('useIssuesFilter hook initialized at:', new Date().toISOString());
  
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const handleApplicationFilterChange = useCallback((value: string | null) => {
    // デバッグログを追加
    console.log('useIssuesFilter: handleApplicationFilterChange called with value:', value);
    setApplicationId(value);
  }, []);

  const filteredIssues = useMemo(() => {
    // デバッグログを追加
    console.log('useIssuesFilter: filtering issues', {
      totalIssues: issues.length,
      applicationId,
      issues
    });

    if (!applicationId) {
      return issues;
    }

    return issues.filter((issue) => 
      (issue as any).application.id === applicationId
    );
  }, [issues, applicationId]);

  return {
    applicationId,
    filteredIssues,
    handleApplicationFilterChange,
  };
}
