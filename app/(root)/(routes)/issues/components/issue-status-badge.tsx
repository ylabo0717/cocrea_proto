"use client";

import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface IssueStatusBadgeProps {
  status: string;
  size?: "sm" | "lg";
}

export function IssueStatusBadge({ status, size = "sm" }: IssueStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open':
        return {
          icon: AlertCircle,
          text: '未対応',
          variant: 'warning' as const,
        };
      case 'in_progress':
        return {
          icon: Clock,
          text: '対応中',
          variant: 'info' as const,
        };
      case 'resolved':
        return {
          icon: CheckCircle2,
          text: '解決済み',
          variant: 'success' as const,
        };
      default:
        return {
          icon: AlertCircle,
          text: status,
          variant: 'default' as const,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  const iconSize = size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className={iconSize} />
      <span>{config.text}</span>
    </Badge>
  );
}