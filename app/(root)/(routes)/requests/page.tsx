"use client";

import { useEffect, useState } from "react";
import { RequestsList } from "./components/requests-list";
import { CreateRequestButton } from "./components/create-request-button";
import { RequestsFilter } from "./components/requests-filter";
import { ViewToggle } from "@/components/view-toggle";
import { fetchRequests } from "./actions";
import { Content } from "@/lib/types";

export default function RequestsPage() {
  const [requests, setRequests] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchRequests();
        setRequests(data);
      } catch (error) {
        console.error('Failed to load requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  const filteredRequests = applicationId
    ? requests.filter((request) => (request as any).application.id === applicationId)
    : requests;

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
              onApplicationChange={setApplicationId}
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