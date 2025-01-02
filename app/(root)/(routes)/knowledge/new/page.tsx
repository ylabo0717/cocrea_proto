"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { KnowledgeForm } from "../components/knowledge-form/knowledge-form";
import { useState } from "react";
import { KnowledgeFormData } from "../components/knowledge-form/types";
import { useToast } from "@/hooks/use-toast";
import { createKnowledge } from "@/lib/api/knowledge";
import { updateAttachments } from "@/lib/api/attachments";

export default function NewKnowledgePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tempId] = useState(() => crypto.randomUUID());

  const handleSubmit = async (data: KnowledgeFormData) => {
    console.log('Creating knowledge with data:', data); // デバッグログ
    setIsLoading(true);

    try {
      const knowledge = await createKnowledge(data);
      console.log('Knowledge created:', knowledge); // デバッグログ

      if (knowledge.id) {
        console.log('Updating attachments...'); // デバッグログ
        await updateAttachments(knowledge.id);
      }

      toast({
        title: "成功",
        description: "ナレッジを作成しました",
      });
      router.push("/knowledge");
    } catch (error) {
      console.error('Failed to create knowledge:', error);
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "ナレッジの作成に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/knowledge");
  };

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Link href="/knowledge" className="hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span>ナレッジ一覧</span>
        <span>/</span>
        <span>新規作成</span>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-foreground">新規ナレッジ作成</h2>
        <p className="text-muted-foreground">新しいナレッジを作成します</p>
      </div>

      <div className="max-w-3xl">
        <KnowledgeForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          tempId={tempId}
        />
      </div>
    </div>
  );
}