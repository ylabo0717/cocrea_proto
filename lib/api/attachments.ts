"use client";

import { supabase } from "@/lib/supabase";
import { Attachment } from "@/lib/types";

export async function uploadAttachment(file: File, contentId?: string): Promise<Attachment> {
  try {
    // Create safe file path
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = `${contentId || 'temp'}/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('issue-attachments')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Create database record
    const { data: attachment, error: dbError } = await supabase
      .from('attachments')
      .insert({
        content_id: contentId || null,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return attachment;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error("ファイルのアップロードに失敗しました");
  }
}

export async function fetchAttachments(contentId: string | null): Promise<Attachment[]> {
  try {
    const { data, error } = await supabase
      .from('attachments')
      .select()
      .eq('content_id', contentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching attachments:', error);
    throw new Error("添付ファイルの取得に失敗しました");
  }
}

export async function updateAttachments(contentId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('attachments')
      .update({ content_id: contentId })
      .is('content_id', null);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating attachments:', error);
    throw new Error("添付ファイルの更新に失敗しました");
  }
}

export async function deleteAttachment(attachment: Attachment): Promise<void> {
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('issue-attachments')
      .remove([attachment.file_path]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: dbError } = await supabase
      .from('attachments')
      .delete()
      .eq('id', attachment.id);

    if (dbError) throw dbError;
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error("添付ファイルの削除に失敗しました");
  }
}

export function getAttachmentUrl(filePath: string): string {
  const { data } = supabase.storage
    .from('issue-attachments')
    .getPublicUrl(filePath);
  return data.publicUrl;
}