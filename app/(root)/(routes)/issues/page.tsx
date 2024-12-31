"use client";

import { useEffect } from "react";
import { IssuesList } from "./components/issues-list";
import { useIssues } from "./hooks/use-issues";

export default function IssuesPage() {
  const { issues, isLoading, refreshIssues } = useIssues();

  useEffect(() => {
    refreshIssues();
  }, [refreshIssues]);

  return (
    <div className="h-full p-4 space-y-4">
      <div>
        <h2 className="text-3xl font-bold text-foreground">課題一覧</h2>
        <p className="text-muted-foreground">アプリケーションの課題を一覧で確認できます</p>
      </div>

      <IssuesList issues={issues} isLoading={isLoading} />
    </div>
  );
}