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
    tags: initialData?.tags || undefined,
    application_id: initialData?.application_id || undefined,
    // 下書きフィールド
    draft_title: initialData?.draft_title || "",
    draft_body: initialData?.draft_body || "",
    draft_tags: initialData?.draft_tags || [],
    last_draft_saved_at: initialData?.last_draft_saved_at,
  });

  const handleChange = async (
    field: keyof KnowledgeFormData,
    value: string | string[] | undefined
  ) => {
    // フォームの状態を更新
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // データベースの更新
      if (initialData?.id && initialData.is_draft) {
        const draftData: any = {
          draft_title: newData.title,
          draft_body: newData.body,
          draft_tags: newData.draft_tags,
          last_draft_saved_at: new Date().toISOString(),
        };

        // フィールドに応じて下書きデータを更新
        switch (field) {
          case 'application_id':
            draftData.application_id = value;
            break;
          case 'draft_tags':
            draftData.draft_tags = value;
            break;
        }

        fetch(`/api/knowledge/${initialData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(draftData),
        }).catch((error) => {
          console.error('Failed to auto-save draft:', error);
        });
      }

      return newData;
    });
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

  // 下書きが空かどうかをチェックする
  const isDraftEmpty = () => {
    return (
      !formData.draft_title?.trim() &&
      !formData.draft_body?.trim() &&
      (!formData.draft_tags || formData.draft_tags.length === 0)
    );
  };

  // キャンセル時に空の下書きを削除する
  const handleCancel = async () => {
    if (initialData?.id && initialData.is_draft && isDraftEmpty()) {
      try {
        await fetch(`/api/knowledge/${initialData.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Failed to delete empty draft:', error);
      }
    }
  };

  return {
    formData,
    handleChange,
    validateForm,
    handleCancel,
    isDraftEmpty,
  };
}