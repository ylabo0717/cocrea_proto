"use client";

import { useState, useCallback, useMemo } from "react";
import { Content } from "@/lib/types";

export function useRequestsFilter(requests: Content[]) {
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const handleApplicationFilterChange = useCallback((value: string | null) => {
    setApplicationId(value);
  }, []);

  const filteredRequests = useMemo(() => {
    if (!applicationId) {
      return requests;
    }

    return requests.filter((request) => 
      (request as any).application.id === applicationId
    );
  }, [requests, applicationId]);

  return {
    applicationId,
    filteredRequests,
    handleApplicationFilterChange,
  };
}