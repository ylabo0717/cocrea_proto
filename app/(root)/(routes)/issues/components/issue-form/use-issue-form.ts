"use client";

import { useState } from "react";
import { IssueFormData } from "./types";

export function useIssueForm(initialData?: Partial<IssueFormData>) {
  const [formData, setFormData] = useState<IssueFormData>({
    title: initialData?.title || "",
    body: initialData?.body || "",
    status: initialData?.status || "open",
    priority: initialData?.priority || "medium",
    application_id: initialData?.application_id || "",
    assignee_id: initialData?.assignee_id,
  });

  const handleChange = (
    field: keyof IssueFormData,
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