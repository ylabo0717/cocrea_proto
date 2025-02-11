"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";

export default function NewApplicationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"development" | "released" | "discontinued">("development");
  const [progress, setProgress] = useState(0);
  const [nextReleaseDate, setNextReleaseDate] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "エラー",
        description: "アプリケーション名を入力してください",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          summary,
          description,
          status,
          progress,
          next_release_date: nextReleaseDate ? new Date(nextReleaseDate).toISOString() : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create application");
      }

      toast({
        title: "作成完了",
        description: "アプリケーションを作成しました",
      });

      router.push("/applications");
      router.refresh();
    } catch (error) {
      toast({
        title: "エラー",
        description: "アプリケーションの作成に失敗しました",
        variant: "destructive",
      });
    }
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
        <h2 className="text-3xl font-bold text-foreground">新規アプリケーション</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>アプリケーション情報</CardTitle>
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
            <Label htmlFor="summary">概要</Label>
            <Input
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="アプリケーションの概要を入力"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">ステータス</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "development" | "released" | "discontinued")}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="development">開発中</option>
                <option value="released">リリース済み</option>
                <option value="discontinued">開発終了</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">進捗状況</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                />
                <span>%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextReleaseDate">次回リリース予定日</Label>
            <Input
              id="nextReleaseDate"
              type="date"
              value={nextReleaseDate}
              onChange={(e) => setNextReleaseDate(e.target.value)}
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
            <Button onClick={handleSave}>作成</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
