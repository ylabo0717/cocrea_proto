"use client";

import { useState, useCallback, useMemo } from "react";
import { Content } from "@/lib/types";

interface IssuesFilter {
  statuses: string[];
  applicationId: string | null; // nullを許可
}

export function useIssuesFilter(issues: Content[]) {
  const [filters, setFilters] = useState<IssuesFilter>({
    statuses: ["open", "in_progress"],
    applicationId: null, // 初期値はnull（フィルタなし）
  });

  const handleStatusFilterChange = useCallback((status: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      statuses: checked
        ? [...prev.statuses, status]
        : prev.statuses.filter((s) => s !== status),
    }));
  }, []);

  const handleApplicationFilterChange = useCallback((applicationId: string | null) => {
    setFilters((prev) => ({
      ...prev,
      applicationId,
    }));
  }, []);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const statusMatch = filters.statuses.includes(issue.status || "");
      const applicationMatch = !filters.applicationId || (issue as any).application.id === filters.applicationId;
      return statusMatch && applicationMatch;
    });
  }, [issues, filters]);

  return {
    filters,
    filteredIssues,
    handleStatusFilterChange,
    handleApplicationFilterChange,
  };
}