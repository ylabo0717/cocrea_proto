"use client";

import { useEffect, useState } from "react";
import { IssuesList } from "./components/issues-list";
import { CreateIssueButton } from "./components/create-issue-button";
import { IssuesFilter } from "./components/issues-filter";
import { ViewToggle } from "@/components/view-toggle";
import { useIssues } from "./hooks/use-issues";
import { useIssuesFilter } from "./hooks/use-issues-filter";

try {
  console.log('==== IssuesPage Debug ====');
  console.log('Module loaded at:', new Date().toISOString());
} catch (error) {
  console.error('Debug log error:', error);
}

export default function IssuesPage() {
  try {
    console.log('==== IssuesPage Component ====');
    console.log('Component rendered at:', new Date().toISOString());
  } catch (error) {
    console.error('Component debug error:', error);
  }

  const { issues, isLoading, refreshIssues } = useIssues();
  const {
    applicationId,
    filteredIssues,
    handleApplicationFilterChange,
  } = useIssuesFilter(issues);
  const [view, setView] = useState<"grid" | "table">("grid");

  useEffect(() => {
    try {
      console.log('==== IssuesPage Effect ====');
      console.log('Effect triggered at:', new Date().toISOString());
      console.log('Current issues:', issues.length);
      refreshIssues();
    } catch (error) {
      console.error('Effect error:', error);
    }
  }, [refreshIssues, issues.length]);

  // Render debug
  try {
    console.log('==== IssuesPage Render ====');
    console.log('State:', {
      isLoading,
      issuesCount: issues.length,
      filteredCount: filteredIssues.length,
      applicationId,
      view,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Render debug error:', error);
  }

  return (
    <div className="h-full">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Issues</h2>
              <p className="text-muted-foreground">アプリケーションのIssueを一覧で確認できます</p>
            </div>
            <div className="flex items-center gap-4">
              <ViewToggle view={view} onViewChange={setView} />
              <CreateIssueButton />
            </div>
          </div>
          <div className="py-2">
            <IssuesFilter
              applicationId={applicationId}
              onApplicationChange={handleApplicationFilterChange}
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        <IssuesList 
          issues={filteredIssues}
          isLoading={isLoading} 
          view={view}
        />
      </div>
    </div>
  );
}
