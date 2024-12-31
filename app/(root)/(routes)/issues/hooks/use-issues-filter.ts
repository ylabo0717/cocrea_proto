"use client";

import { useState, useCallback, useMemo } from "react";
import { Content } from "@/lib/types";

export function useIssuesFilter(issues: Content[]) {
  const [filters, setFilters] = useState({
    statuses: ["open", "in_progress"],
    priorities: ["low", "medium", "high"],
    applicationId: null as string | null,
  });

  const handleStatusFilterChange = useCallback((status: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      statuses: checked
        ? [...prev.statuses, status]
        : prev.statuses.filter((s) => s !== status),
    }));
  }, []);

  const handlePriorityFilterChange = useCallback((priority: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      priorities: checked
        ? [...prev.priorities, priority]
        : prev.priorities.filter((p) => p !== priority),
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
      const priorityMatch = filters.priorities.includes(issue.priority || "");
      const applicationMatch = !filters.applicationId || (issue as any).application.id === filters.applicationId;
      return statusMatch && priorityMatch && applicationMatch;
    });
  }, [issues, filters]);

  return {
    filters,
    filteredIssues,
    handleStatusFilterChange,
    handlePriorityFilterChange,
    handleApplicationFilterChange,
  };
}