"use client";

import { Content } from "@/lib/types";
import { RequestCard } from "./request-card";
import { RequestsTable } from "./requests-table";
import { useRequestsFilter } from "../hooks/use-requests-filter";
import { Skeleton } from "@/components/ui/skeleton";

interface RequestsListProps {
  requests: Content[];
  isLoading: boolean;
  view: "grid" | "table";
}

export function RequestsList({ requests, isLoading, view }: RequestsListProps) {
  const { filteredRequests } = useRequestsFilter(requests);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((request) => (
            <RequestCard key={request.id} request={request as any} />
          ))}
        </div>
      ) : (
        <RequestsTable requests={filteredRequests} />
      )}
    </div>
  );
}