"use client";

import { useState, useCallback, useMemo } from "react";
import { Content } from "@/lib/types";

export function useRequestsFilter(requests: Content[]) {
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

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const statusMatch = filters.statuses.includes(request.status || "");
      const priorityMatch = filters.priorities.includes(request.priority || "");
      const applicationMatch = !filters.applicationId || (request as any).application.id === filters.applicationId;
      return statusMatch && priorityMatch && applicationMatch;
    });
  }, [requests, filters]);

  return {
    filters,
    filteredRequests,
    handleStatusFilterChange,
    handlePriorityFilterChange,
    handleApplicationFilterChange,
  };
}