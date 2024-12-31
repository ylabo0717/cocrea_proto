"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Application } from "@/lib/types";
import { Pencil } from "lucide-react";

interface ProjectCardProps {
  project: Application;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'development':
        return 'text-yellow-500';
      case 'released':
        return 'text-green-500';
      case 'discontinued':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'development':
        return '開発中';
      case 'released':
        return '運用中';
      case 'discontinued':
        return '停止中';
      default:
        return status;
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2">{project.name}</h3>
          <p className="text-sm text-gray-500 mb-4">{project.description}</p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Pencil className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>次回リリース予定</span>
          <span>{project.next_release_date ? new Date(project.next_release_date).toLocaleDateString('ja-JP') : '未定'}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>開発状況</span>
          <span className={getStatusColor(project.status)}>{getStatusText(project.status)}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>進捗</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>
      </div>
    </Card>
  );
}