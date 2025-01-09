"use server";

import { supabase } from '@/lib/supabase';

/**
 * ファイルをストレージにアップロードする
 */
export async function uploadFile(buffer: Uint8Array, path: string, contentType: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from('issue-attachments')
      .upload(path, buffer, {
        contentType,
        cacheControl: '3600',
        upsert: false
      });

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
export async function getPublicUrl(path: string): Promise<string> {
  const { data } = await supabase.storage
    .from('issue-attachments')
    .getPublicUrl(path);
  return data.publicUrl;
}

/**
 * ファイル名をサニタイズする
 */
export async function sanitizeFilename(filename: string): Promise<string> {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}