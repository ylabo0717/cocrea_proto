"use client";

import { useState } from "react";
import { RequestFormData } from "./types";

export function useRequestForm(initialData?: Partial<RequestFormData>) {
  const [formData, setFormData] = useState<RequestFormData>({
    title: initialData?.title || "",
    body: initialData?.body || "",
    status: initialData?.status || "open",
    priority: initialData?.priority || "medium",
    application_id: initialData?.application_id || "",
    assignee_id: initialData?.assignee_id,
  });

  const handleChange = (
    field: keyof RequestFormData,
    value: string | undefined
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