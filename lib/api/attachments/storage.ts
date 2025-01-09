"use server";

import { supabase } from '@/lib/supabase';

/**
 * ファイルをストレージにアップロードする
 */
export async function uploadFile(file: File, path: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from('issue-attachments')
      .upload(path, file);

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error("ファイルのアップロードに失敗しました");
    }
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
}

/**
 * ファイルをストレージから削除する
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from('issue-attachments')
      .remove([path]);

    if (error) {
      console.error('Storage delete error:', error);
      throw new Error("ファイルの削除に失敗しました");
    }
  } catch (error) {
    console.error('Error in deleteFile:', error);
    throw error;
  }
}

/**
 * ファイルの公開URLを取得する
 */
export function getPublicUrl(path: string): string {
  const { data } = supabase.storage
    .from('issue-attachments')
    .getPublicUrl(path);
  return data.publicUrl;
}

/**
 * ファイル名をサニタイズする
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}