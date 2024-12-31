"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApplications } from "@/app/(root)/(routes)/dashboard/hooks/use-applications";
import { useEffect } from "react";

interface IssuesFilterProps {
  statuses: string[];
  priorities: string[];
  applicationId: string | null;
  onStatusChange: (status: string, checked: boolean) => void;
  onPriorityChange: (priority: string, checked: boolean) => void;
  onApplicationChange: (applicationId: string | null) => void;
}

export function IssuesFilter({ 
  statuses, 
  priorities,
  applicationId,
  onStatusChange,
  onPriorityChange,
  onApplicationChange,
}: IssuesFilterProps) {
  const { applications, refreshApplications } = useApplications();

  useEffect(() => {
    refreshApplications();
  }, [refreshApplications]);

  const statusOptions = [
    { value: "open", label: "未対応" },
    { value: "in_progress", label: "対応中" },
    { value: "resolved", label: "解決済み" },
  ];

  const priorityOptions = [
    { value: "high", label: "高" },
    { value: "medium", label: "中" },
    { value: "low", label: "低" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">ステータス:</span>
          <div className="flex gap-4">
            {statusOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={statuses.includes(option.value)}
                  onCheckedChange={(checked) => 
                    onStatusChange(option.value, checked as boolean)
                  }
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">優先度:</span>
          <div className="flex gap-4">
            {priorityOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={priorities.includes(option.value)}
                  onCheckedChange={(checked) => 
                    onPriorityChange(option.value, checked as boolean)
                  }
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

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
    </div>
  );
}