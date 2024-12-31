"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "./components/project-card";
import { Application } from "@/lib/types";
import { CreateApplicationDialog } from "@/components/applications/create-application-dialog";
import { fetchApplications } from "@/lib/api/applications";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadApplications() {
      try {
        const apps = await fetchApplications();
        setApplications(apps);
      } catch (error) {
        toast({
          title: "エラー",
          description: "アプリケーションの読み込みに失敗しました",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadApplications();
  }, [toast]);

  return (
    <div className="h-full p-4 space-y-4 bg-background">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">ダッシュボード</h2>
          <p className="text-muted-foreground">社内アプリケーションの開発状況を一覧で確認できます</p>
        </div>
        <CreateApplicationDialog onSuccess={() => fetchApplications().then(setApplications)} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[200px] bg-card animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => (
            <ProjectCard key={app.id} project={app} />
          ))}
        </div>
      )}
    </div>
  );
}