import { MessageSquare, Lightbulb, BookOpen } from "lucide-react";

export const contentTypeInfo = {
  request: {
    label: '要望・アイデア',
    icon: Lightbulb,
    path: '/requests',
    statusColors: {
      open: 'bg-green-500',
      in_progress: 'bg-blue-500',
      resolved: 'bg-gray-500'
    }
  },
  issue: {
    label: 'お困りごと',
    icon: MessageSquare,
    path: '/issues',
    statusColors: {
      open: 'bg-red-500',
      in_progress: 'bg-yellow-500',
      resolved: 'bg-gray-500'
    }
  },
  knowledge: {
    label: '知識共有',
    icon: BookOpen,
    path: '/knowledge',
    statusColors: {}
  }
} as const;
