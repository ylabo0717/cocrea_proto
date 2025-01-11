"use client";

import { Attachment } from '@/lib/types';

/**
 * ファイルをアップロードする
 */
export async function uploadAttachment(file: File, contentId?: string): Promise<Attachment> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (contentId) {
      formData.append('contentId', contentId);
    }

    const response = await fetch('/api/attachments', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'ファイルのアップロードに失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in uploadAttachment:', error);
    throw error;
  }
}

/**
 * 添付ファイルを削除する
 */
export async function deleteAttachment(attachment: Attachment): Promise<void> {
  try {
    const response = await fetch(`/api/attachments/${attachment.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '添付ファイルの削除に失敗しました');
    }
  } catch (error) {
    console.error('Error in deleteAttachment:', error);
    throw error;
  }
}

/**
 * 添付ファイルのcontent_idを更新する
 */
export async function updateAttachments(contentId: string): Promise<void> {
  try {
    const response = await fetch('/api/attachments/update-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contentId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '添付ファイルの更新に失敗しました');
    }
  } catch (error) {
    console.error('Error in updateAttachments:', error);
    throw error;
  }
}

/**
 * 添付ファイル一覧を取得する
 */
export async function fetchAttachments(contentId: string | null): Promise<Attachment[]> {
  try {
    const url = new URL('/api/attachments', window.location.origin);
    if (contentId !== undefined) {
      url.searchParams.set('contentId', contentId || '');
    }

    const response = await fetch(url);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '添付ファイルの取得に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchAttachments:', error);
    throw error;
  }
}

/**
 * 添付ファイルの公開URLを取得する
 */
export function getAttachmentUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/issue-attachments/${path}`;
}

export type { Attachment };
