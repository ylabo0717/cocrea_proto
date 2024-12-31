"use client";

import { useState, useCallback, useMemo } from "react";
import { Content } from "@/lib/types";

interface IssuesFilter {
  statuses: string[];
}

export function useIssuesFilter(issues: Content[]) {
  const [filters, setFilters] = useState<IssuesFilter>({
    statuses: ["open", "in_progress"], // 初期値として未対応と対応中を選択
  });

  const handleStatusFilterChange = useCallback((status: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      statuses: checked
        ? [...prev.statuses, status]
        : prev.statuses.filter((s) => s !== status),
    }));
  }, []);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const statusMatch = filters.statuses.includes(issue.status || "");
      return statusMatch;
    });
  }, [issues, filters]);

  return {
    filters,
    filteredIssues,
    handleStatusFilterChange,
  };
}