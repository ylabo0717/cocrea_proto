"use client";

import { ApplicationCard } from "./application-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Application } from "@/lib/types";

interface ApplicationListProps {
  applications: Application[];
  isLoading: boolean;
  onUpdate?: () => void;
}

export function ApplicationList({ applications, isLoading, onUpdate }: ApplicationListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
        <p>アプリケーションがありません</p>
        <p>新規作成ボタンからアプリケーションを追加してください</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
