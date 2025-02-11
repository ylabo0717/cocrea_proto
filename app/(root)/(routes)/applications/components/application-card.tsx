"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Application } from "@/lib/types";
import { useRouter } from "next/navigation";

interface ApplicationCardProps {
  application: Application;
  onUpdate?: () => void;
}

export function ApplicationCard({ application, onUpdate }: ApplicationCardProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'development':
        return 'text-yellow-500';
      case 'released':
        return 'text-green-500';
      case 'discontinued':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
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
    <div
      className="cursor-pointer"
      onClick={() => router.push(`/applications/${application.id}`)}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow bg-card">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-card-foreground mb-2">{application.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{application.description}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">次回リリース予定</span>
            <span className="text-card-foreground">
              {application.next_release_date 
                ? new Date(application.next_release_date).toLocaleDateString('ja-JP') 
                : '未定'}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">開発状況</span>
            <span className={getStatusColor(application.status)}>
              {getStatusText(application.status)}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">進捗</span>
              <span className="text-card-foreground">{application.progress}%</span>
            </div>
            <Progress value={application.progress} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  );
}
