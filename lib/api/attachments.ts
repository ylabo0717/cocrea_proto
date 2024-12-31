"use client";

import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth/session";

export interface Attachment {
  id: string;
  content_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function uploadAttachment(file: File, contentId: string): Promise<Attachment> {
  const session = getSession();
  if (!session) {
    throw new Error("認証情報が見つかりません");
  }

  // Validate file size (50MB limit)
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("ファイルサイズは50MB以下にしてください");
  }

  // Validate file type
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("このファイル形式はサポートされていません");
  }

  // Create safe file path
  const timestamp = new Date().getTime();
  const sanitizedName = sanitizeFileName(file.name);
  const fileName = `${timestamp}_${sanitizedName}`;
  const filePath = `${contentId}/${fileName}`;

  try {
    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('issue-attachments')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error("ファイルのアップロードに失敗しました");
    }

    // Create database record
    const { data: attachment, error: dbError } = await supabase
      .from('attachments')
      .insert({
        content_id: contentId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type
      })
      .select()
      .single();

    if (dbError) {
      // Cleanup uploaded file if database insert fails
      await supabase.storage
        .from('issue-attachments')
        .remove([filePath]);
      
      console.error('Database error:', dbError);
      throw new Error("添付ファイルの登録に失敗しました");
    }

    return attachment;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function fetchAttachments(contentId: string): Promise<Attachment[]> {
  const { data, error } = await supabase
    .from('attachments')
    .select('*')
    .eq('content_id', contentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching attachments:', error);
    throw new Error("添付ファイルの取得に失敗しました");
  }

  return data || [];
}

export async function deleteAttachment(attachment: Attachment): Promise<void> {
  try {
    // Delete from storage first
    const { error: storageError } = await supabase.storage
      .from('issue-attachments')
      .remove([attachment.file_path]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
      throw new Error("ファイルの削除に失敗しました");
    }

    // Then delete database record
    const { error: dbError } = await supabase
      .from('attachments')
      .delete()
      .eq('id', attachment.id);

    if (dbError) {
      console.error('Database delete error:', dbError);
      throw new Error("添付ファイルの削除に失敗しました");
    }
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}

export function getAttachmentUrl(filePath: string): string {
  const { data } = supabase.storage
    .from('issue-attachments')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}