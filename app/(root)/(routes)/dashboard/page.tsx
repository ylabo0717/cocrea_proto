"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "./components/project-card";
import { Application } from "@/lib/types";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    async function fetchApplications() {
      const { data } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setApplications(data);
    }

    fetchApplications();
  }, []);

  return (
    <div className="h-full p-4 space-y-4 bg-background">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">ダッシュボード</h2>
          <p className="text-muted-foreground">社内アプリケーションの開発状況を一覧で確認できます</p>
        </div>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg">
          アプリ追加
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map((app) => (
          <ProjectCard key={app.id} project={app} />
        ))}
      </div>
    </div>
  );
}