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
  const [description, setDescription] = useState("");

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
          description,
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
