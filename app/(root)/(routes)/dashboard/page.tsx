import { Suspense } from "react";
import { ApplicationsListClient } from "./components/applications-list-client";
import { fetchApplications, fetchRecentContents } from "./actions";

export default async function DashboardPage() {
  const [applications, recentContents] = await Promise.all([
    fetchApplications(),
    fetchRecentContents()
  ]);

  return (
    <div className="h-full p-4 space-y-4 bg-background">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">社内アプリケーションの開発状況を一覧で確認できます</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ApplicationsListClient 
          initialApplications={applications}
          initialContents={recentContents}
        />
      </Suspense>
    </div>
  );
}