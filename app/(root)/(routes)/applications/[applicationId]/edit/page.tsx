"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplication } from "../../hooks/use-application";
import { Editor } from "@/components/editor";

export default function ApplicationEditPage() {
  const params = useParams();
  const router = useRouter();
  const { application, isLoading, fetchApplication, updateApplication } = useApplication(params.applicationId as string);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!application) {
    return <div>アプリケーションが見つかりません</div>;
  }

  const handleSave = async (content: string) => {
    await updateApplication({
      ...application,
      description: content,
    });
    router.push(`/applications/${application.id}`);
  };

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          戻る
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-foreground">{application.name}の編集</h2>
      </div>

      <Card className="min-h-[600px]">
        <CardHeader>
          <CardTitle>アプリケーション情報の編集</CardTitle>
        </CardHeader>
        <CardContent>
          <Editor
            content={application.description}
            onSave={handleSave}
          />
        </CardContent>
      </Card>
    </div>
  );
}
