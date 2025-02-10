"use client";

import { useState } from "react";
import { KnowledgeFormData } from "./types";

export function useKnowledgeForm(initialData?: Partial<KnowledgeFormData>) {
  const [formData, setFormData] = useState<KnowledgeFormData>({
    // メインフィールド
    title: initialData?.draft_title || initialData?.title || "",
    body: initialData?.draft_body || initialData?.body || "",
    category: initialData?.draft_category || initialData?.category || "",
    tags: initialData?.draft_tags || initialData?.tags || [],
    application_id: initialData?.application_id || "",
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

  return {
    formData,
    handleChange,
  };
}