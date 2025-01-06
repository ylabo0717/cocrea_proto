"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApplications } from "@/app/(root)/(routes)/dashboard/hooks/use-applications";
import { useEffect } from "react";

interface IssuesFilterProps {
  applicationId: string | null;
  onApplicationChange: (applicationId: string | null) => void;
}

export function IssuesFilter({ 
  applicationId,
  onApplicationChange,
}: IssuesFilterProps) {
  const { applications, refreshApplications } = useApplications();

  useEffect(() => {
    refreshApplications();
  }, [refreshApplications]);

  const handleChange = (value: string) => {
    // デバッグログを追加
    console.log('IssuesFilter: handleChange called with value:', value);
    onApplicationChange(value === "all" ? null : value);
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium">アプリケーション:</span>
      <Select
        value={applicationId || "all"}
        onValueChange={handleChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="全て" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全て</SelectItem>
          {applications.map((app) => (
            <SelectItem key={app.id} value={app.id}>
              {app.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
