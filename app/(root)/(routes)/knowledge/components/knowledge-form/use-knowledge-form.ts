"use client";

import { useState } from "react";
import { KnowledgeFormData } from "./types";

export function useKnowledgeForm(initialData?: Partial<KnowledgeFormData>) {
  const [formData, setFormData] = useState<KnowledgeFormData>({
    title: initialData?.title || "",
    body: initialData?.body || "",
    category: initialData?.category || "",
    tags: initialData?.tags || [],
    application_id: initialData?.application_id || "",
  });

  const handleChange = (
    field: keyof KnowledgeFormData,
    value: string | string[]
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