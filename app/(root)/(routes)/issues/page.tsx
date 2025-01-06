"use client";

import { useEffect, useState } from "react";
import { IssuesList } from "./components/issues-list";
import { CreateIssueButton } from "./components/create-issue-button";
import { IssuesFilter } from "./components/issues-filter";
import { ViewToggle } from "@/components/view-toggle";
import { fetchIssues } from "./actions";
import { Content } from "@/lib/types";

export default function IssuesPage() {
  const [issues, setIssues] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const data = await fetchIssues();
        setIssues(data);
      } catch (error) {
        console.error('Failed to load issues:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadIssues();
  }, []);

  const filteredIssues = applicationId
    ? issues.filter((issue) => (issue as any).application.id === applicationId)
    : issues;

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
              onApplicationChange={setApplicationId}
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