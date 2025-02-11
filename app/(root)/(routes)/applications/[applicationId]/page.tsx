"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplication } from "../hooks/use-application";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export default function ApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const { application, isLoading, fetchApplication } = useApplication(params.applicationId as string);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!application) {
    return <div>アプリケーションが見つかりません</div>;
  }

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          戻る
        </Button>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{application.name}</h2>
          <p className="text-muted-foreground">作成日: {new Date(application.created_at).toLocaleDateString('ja-JP')}</p>
        </div>
        <Button onClick={() => router.push(`/applications/${application.id}/edit`)}>
          <Pencil className="w-4 h-4 mr-2" />
          編集
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>詳細情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">説明</h3>
            <div className={cn(
              "prose prose-sm max-w-none",
              "prose-headings:font-bold prose-headings:text-foreground",
              "prose-p:text-muted-foreground",
              "prose-strong:text-foreground prose-strong:font-bold",
              "prose-code:text-foreground prose-code:bg-muted prose-code:rounded prose-code:px-1",
              "prose-ul:text-muted-foreground prose-li:text-muted-foreground",
            )}>
              <ReactMarkdown>{application.description}</ReactMarkdown>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">設定情報</h3>
            <pre className="bg-muted p-4 rounded-lg">
              {JSON.stringify(application.settings, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
