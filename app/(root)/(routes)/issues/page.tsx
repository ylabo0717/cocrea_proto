"use client";

import { useEffect } from "react";
import { IssuesList } from "./components/issues-list";
import { CreateIssueButton } from "./components/create-issue-button";
import { useIssues } from "./hooks/use-issues";

export default function IssuesPage() {
  const { issues, isLoading, refreshIssues } = useIssues();

  useEffect(() => {
    refreshIssues();
  }, [refreshIssues]);

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Issues</h2>
          <p className="text-muted-foreground">アプリケーションの課題を一覧で確認できます</p>
        </div>
        <CreateIssueButton />
      </div>

      <IssuesList issues={issues} isLoading={isLoading} />
    </div>
  );
}