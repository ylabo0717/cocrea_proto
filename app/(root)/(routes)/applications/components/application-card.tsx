"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface ApplicationCardProps {
  application: any;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => router.push(`/applications/${application.id}`)}
    >
      <CardHeader>
        <CardTitle className="text-xl">{application.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {application.description}
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <div>作成日: {new Date(application.createdAt).toLocaleDateString()}</div>
        </div>
      </CardContent>
    </Card>
  );
}
