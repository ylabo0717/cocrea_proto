"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplication } from "../../hooks/use-application";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ApplicationEditPage() {
  const params = useParams();
  const router = useRouter();
  const { application, isLoading, fetchApplication, updateApplication } = useApplication(params.applicationId as string);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  useEffect(() => {
    if (application) {
      setName(application.name);
      setDescription(application.description || "");
    }
  }, [application]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!application) {
    return <div>アプリケーションが見つかりません</div>;
  }

  const handleSave = async () => {
    if (!name.trim()) {
      return;
    }

    await updateApplication({
      ...application,
      name,
      description,
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
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">アプリケーション名</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="アプリケーション名を入力"
            />
          </div>

          <div className="space-y-2">
            <Label>説明</Label>
            <Tabs defaultValue="write" className="w-full">
              <TabsList>
                <TabsTrigger value="write">編集</TabsTrigger>
                <TabsTrigger value="preview">プレビュー</TabsTrigger>
              </TabsList>
              <TabsContent value="write" className="mt-2">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="アプリケーションの説明を入力"
                  className="min-h-[200px]"
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-2">
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{description}</ReactMarkdown>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>保存</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
