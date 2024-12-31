"use client";

import { useEffect, useState } from "react";
import { IssuesList } from "./components/issues-list";
import { CreateIssueButton } from "./components/create-issue-button";
import { IssuesFilter } from "./components/issues-filter";
import { ViewToggle } from "./components/view-toggle";
import { useIssues } from "./hooks/use-issues";
import { useIssuesFilter } from "./hooks/use-issues-filter";

export default function IssuesPage() {
  const { issues, isLoading, refreshIssues } = useIssues();
  const {
    filters,
    handleStatusFilterChange,
    handlePriorityFilterChange,
    handleApplicationFilterChange,
  } = useIssuesFilter(issues);
  const [view, setView] = useState<"grid" | "table">("grid");

  useEffect(() => {
    refreshIssues();
  }, [refreshIssues]);

  return (
    <div className="h-full">
      {/* ヘッダー部分を固定 */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Issues</h2>
              <p className="text-muted-foreground">アプリケーションの課題を一覧で確認できます</p>
            </div>
            <div className="flex items-center gap-4">
              <ViewToggle view={view} onViewChange={setView} />
              <CreateIssueButton />
            </div>
          </div>
          <div className="py-2">
            <IssuesFilter
              statuses={filters.statuses}
              priorities={filters.priorities}
              applicationId={filters.applicationId}
              onStatusChange={handleStatusFilterChange}
              onPriorityChange={handlePriorityFilterChange}
              onApplicationChange={handleApplicationFilterChange}
            />
          </div>
        </div>
      </div>

      {/* コンテンツ部分 */}
      <div className="p-4">
        <IssuesList 
          issues={issues} 
          isLoading={isLoading} 
          view={view}
        />
      </div>
    </div>
  );
}