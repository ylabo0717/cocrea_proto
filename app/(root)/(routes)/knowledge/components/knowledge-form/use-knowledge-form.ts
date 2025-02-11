"use client";

import { useState } from "react";
import { KnowledgeFormData } from "./types";
import { toast } from "sonner";

export function useKnowledgeForm(initialData?: Partial<KnowledgeFormData>) {
  const [formData, setFormData] = useState<KnowledgeFormData>({
    // メインフィールド
    title: initialData?.draft_title || initialData?.title || "",
    body: initialData?.draft_body || initialData?.body || "",
    status: initialData?.status || "open",
    tags: initialData?.tags || [],
    application_id: initialData?.application_id || undefined,
    // 下書きフィールド
    draft_title: initialData?.draft_title || "",
    draft_body: initialData?.draft_body || "",
    draft_category: initialData?.draft_category || "",
    draft_tags: initialData?.draft_tags || [],
    last_draft_saved_at: initialData?.last_draft_saved_at,
  });

  const handleChange = (
    field: keyof KnowledgeFormData,
    value: string | string[] | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("タイトルを入力してください");
      return false;
    }
    if (!formData.body.trim()) {
      toast.error("内容を入力してください");
      return false;
    }
    if (!formData.application_id) {
      toast.error("アプリケーションを選択してください");
      return false;
    }
    return true;
  };

  return {
    formData,
    handleChange,
    validateForm,
  };
}