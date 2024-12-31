"use client";

import { Content } from "@/lib/types";
import { IssueCard } from "./issue-card";
import { IssuesTable } from "./issues-table";
import { ViewToggle } from "./view-toggle";
import { IssuesFilter } from "./issues-filter";
import { useIssuesFilter } from "../hooks/use-issues-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface IssuesListProps {
  issues: Content[];
  isLoading: boolean;
}

export function IssuesList({ issues, isLoading }: IssuesListProps) {
  const [view, setView] = useState<"grid" | "table">("grid");
  const { 
    filters, 
    filteredIssues, 
    handleStatusFilterChange,
    handleApplicationFilterChange,
  } = useIssuesFilter(issues);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <IssuesFilter
          statuses={filters.statuses}
          applicationId={filters.applicationId}
          onStatusChange={handleStatusFilterChange}
          onApplicationChange={handleApplicationFilterChange}
        />
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue as any} />
          ))}
        </div>
      ) : (
        <IssuesTable issues={filteredIssues} />
      )}
    </div>
  );
}