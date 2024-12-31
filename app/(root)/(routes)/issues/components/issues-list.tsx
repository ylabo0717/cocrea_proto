"use client";

import { Content } from "@/lib/types";
import { IssueCard } from "./issue-card";
import { IssuesTable } from "./issues-table";
import { useIssuesFilter } from "../hooks/use-issues-filter";
import { Skeleton } from "@/components/ui/skeleton";

interface IssuesListProps {
  issues: Content[];
  isLoading: boolean;
  view: "grid" | "table";
}

export function IssuesList({ issues, isLoading, view }: IssuesListProps) {
  const { filteredIssues } = useIssuesFilter(issues);

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