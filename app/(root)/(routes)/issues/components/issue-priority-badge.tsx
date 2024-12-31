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
          textColor: 'text-red-500',
          iconColor: 'text-red-500',
          variant: 'outline' as const,
        };
      case 'medium':
        return {
          icon: ArrowRight,
          text: '中',
          textColor: 'text-yellow-500',
          iconColor: 'text-yellow-500',
          variant: 'outline' as const,
        };
      case 'low':
        return {
          icon: ArrowDown,
          text: '低',
          textColor: 'text-green-500',
          iconColor: 'text-green-500',
          variant: 'outline' as const,
        };
      default:
        return {
          icon: ArrowRight,
          text: priority,
          textColor: 'text-gray-500',
          iconColor: 'text-gray-500',
          variant: 'outline' as const,
        };
    }
  };

  const config = getPriorityConfig(priority);
  const Icon = config.icon;
  const iconSize = size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <Badge variant={config.variant} className={`gap-1 ${config.textColor}`}>
      <Icon className={`${iconSize} ${config.iconColor}`} />
      <span>{config.text}</span>
    </Badge>
  );
}