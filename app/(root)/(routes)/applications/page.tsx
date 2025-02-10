"use client";

import { useEffect } from "react";
import { ApplicationList } from "./components/application-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApplications } from "./hooks/use-applications";

export default function ApplicationsPage() {
  const router = useRouter();
  const { applications, isLoading, refreshApplications } = useApplications();

  useEffect(() => {
    refreshApplications();
  }, [refreshApplications]);

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Applications</h2>
          <p className="text-muted-foreground">アプリケーションの管理・設定ができます</p>
        </div>
        <Button onClick={() => router.push("/applications/new")}>
          <Plus className="w-4 h-4 mr-2" />
          新規作成
        </Button>
      </div>

      <ApplicationList
        applications={applications}
        isLoading={isLoading}
      />
    </div>
  );
}
