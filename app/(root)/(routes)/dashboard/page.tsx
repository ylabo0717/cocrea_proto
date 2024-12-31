"use client";

import { useEffect } from "react";
import { ApplicationsList } from "./components/applications-list";
import { CreateApplicationDialog } from "@/components/applications/create-application-dialog";
import { useApplications } from "./hooks/use-applications";
import { useSession } from "@/hooks/use-session";

export default function DashboardPage() {
  const { applications, isLoading: isLoadingApps, refreshApplications } = useApplications();
  const { isDeveloper, isLoading: isLoadingSession } = useSession();

  useEffect(() => {
    refreshApplications();
  }, [refreshApplications]);

  return (
    <div className="h-full p-4 space-y-4 bg-background">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">ダッシュボード</h2>
          <p className="text-muted-foreground">社内アプリケーションの開発状況を一覧で確認できます</p>
        </div>
        {!isLoadingSession && isDeveloper && (
          <CreateApplicationDialog onSuccess={refreshApplications} />
        )}
      </div>

      <ApplicationsList 
        applications={applications}
        isLoading={isLoadingApps}
        onUpdate={refreshApplications}
      />
    </div>
  );
}