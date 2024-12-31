"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { IssueForm } from "../components/issue-form/issue-form";
import { useState } from "react";
import { IssueFormData } from "../components/issue-form/types";
import { useToast } from "@/hooks/use-toast";
import { createIssue } from "@/lib/api/issues";

export default function NewIssuePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: IssueFormData) => {
    setIsLoading(true);
    try {
      await createIssue(data);
      toast({
        title: "成功",
        description: "課題を作成しました",
      });
      router.push("/issues");
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "課題の作成に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/issues");
  };

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Link href="/issues" className="hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span>課題一覧</span>
        <span>/</span>
        <span>新規作成</span>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-foreground">新規課題作成</h2>
        <p className="text-muted-foreground">新しい課題を作成します</p>
      </div>

      <div className="max-w-3xl">
        <IssueForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}