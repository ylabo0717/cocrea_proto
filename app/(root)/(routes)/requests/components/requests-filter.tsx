"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApplications } from "@/app/(root)/(routes)/dashboard/hooks/use-applications";
import { useEffect } from "react";

interface RequestsFilterProps {
  applicationId: string | null;
  onApplicationChange: (value: string | null) => void;
}

export function RequestsFilter({ applicationId, onApplicationChange }: RequestsFilterProps) {
  const { applications, refreshApplications } = useApplications();

  useEffect(() => {
    refreshApplications();
  }, [refreshApplications]);

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium">アプリケーション:</span>
      <Select
        value={applicationId || "all"}
        onValueChange={(value) => onApplicationChange(value === "all" ? null : value)}
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