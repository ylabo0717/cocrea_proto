"use client";

import { Checkbox } from "@/components/ui/checkbox";

interface IssuesFilterProps {
  statuses: string[];
  onStatusChange: (status: string, checked: boolean) => void;
}

export function IssuesFilter({ statuses, onStatusChange }: IssuesFilterProps) {
  const statusOptions = [
    { value: "open", label: "未対応" },
    { value: "in_progress", label: "対応中" },
    { value: "resolved", label: "解決済み" },
  ];

  return (
    <div className="flex items-center gap-4 mb-4">
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
  );
}