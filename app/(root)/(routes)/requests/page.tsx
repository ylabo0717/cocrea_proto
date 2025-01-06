"use client";

import { useEffect, useState } from "react";
import { RequestsList } from "./components/requests-list";
import { CreateRequestButton } from "./components/create-request-button";
import { RequestsFilter } from "./components/requests-filter";
import { ViewToggle } from "@/components/view-toggle";
import { useRequests } from "./hooks/use-requests";
import { useRequestsFilter } from "./hooks/use-requests-filter";

export default function RequestsPage() {
  const { requests, isLoading, refreshRequests } = useRequests();
  const {
    applicationId,
    filteredRequests,
    handleApplicationFilterChange,
  } = useRequestsFilter(requests);
  const [view, setView] = useState<"grid" | "table">("grid");

  useEffect(() => {
    refreshRequests();
  }, [refreshRequests]);

  return (
    <div className="h-full">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Requests</h2>
              <p className="text-muted-foreground">アプリケーションへの要望やアイデアを共有できます</p>
            </div>
            <div className="flex items-center gap-4">
              <ViewToggle view={view} onViewChange={setView} />
              <CreateRequestButton />
            </div>
          </div>
          <div className="py-2">
            <RequestsFilter
              applicationId={applicationId}
              onApplicationChange={handleApplicationFilterChange}
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        <RequestsList 
          requests={filteredRequests}
          isLoading={isLoading} 
          view={view}
        />
      </div>
    </div>
  );
}