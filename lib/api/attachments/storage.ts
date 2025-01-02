"use client";

import { supabase } from "@/lib/supabase";

export async function uploadFile(file: File, path: string): Promise<void> {
  const { error } = await supabase.storage
    .from('issue-attachments')
    .upload(path, file);

  if (error) {
    console.error('Storage upload error:', error);
    throw new Error("ファイルのアップロードに失敗しました");
  }
}

export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from('issue-attachments')
    .remove([path]);

  if (error) {
    console.error('Storage delete error:', error);
    throw new Error("ファイルの削除に失敗しました");
  }
}

export function getPublicUrl(path: string): string {
  const { data } = supabase.storage
    .from('issue-attachments')
    .getPublicUrl(path);
  return data.publicUrl;
}