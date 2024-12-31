"use client";

import { Content } from "@/lib/types";
import { IssueCard } from "./issue-card";
import { IssuesTable } from "./issues-table";
import { ViewToggle } from "./view-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface IssuesListProps {
  issues: Content[];
  isLoading: boolean;
}

export function IssuesList({ issues, isLoading }: IssuesListProps) {
  const [view, setView] = useState<"grid" | "table">("grid");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue as any} />
          ))}
        </div>
      ) : (
        <IssuesTable issues={issues} />
      )}
    </div>
  );
}