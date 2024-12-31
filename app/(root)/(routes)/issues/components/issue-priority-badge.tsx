"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowRight, ArrowDown } from "lucide-react";

interface IssuePriorityBadgeProps {
  priority: string;
  size?: "sm" | "lg";
}

export function IssuePriorityBadge({ priority, size = "sm" }: IssuePriorityBadgeProps) {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          icon: ArrowUp,
          text: '高',
          variant: 'destructive' as const,
        };
      case 'medium':
        return {
          icon: ArrowRight,
          text: '中',
          variant: 'warning' as const,
        };
      case 'low':
        return {
          icon: ArrowDown,
          text: '低',
          variant: 'success' as const,
        };
      default:
        return {
          icon: ArrowRight,
          text: priority,
          variant: 'default' as const,
        };
    }
  };

  const config = getPriorityConfig(priority);
  const Icon = config.icon;
  const iconSize = size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className={iconSize} />
      <span>{config.text}</span>
    </Badge>
  );
}