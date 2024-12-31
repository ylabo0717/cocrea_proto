"use client";

import { Content } from "@/lib/types";
import { IssueCard } from "./issue-card";
import { Skeleton } from "@/components/ui/skeleton";

interface IssuesListProps {
  issues: Content[];
  isLoading: boolean;
}

export function IssuesList({ issues, isLoading }: IssuesListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[200px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue as any} />
      ))}
    </div>
  );
}