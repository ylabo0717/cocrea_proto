"use client";

import { supabase } from "@/lib/supabase";
import { Attachment } from "@/lib/types";

export async function createAttachment(data: {
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  content_id?: string | null;
}): Promise<Attachment> {
  const { data: attachment, error } = await supabase
    .from('attachments')
    .insert({
      content_id: data.content_id || null,
      file_name: data.file_name,
      file_path: data.file_path,
      file_size: data.file_size,
      mime_type: data.mime_type
    })
    .select()
    .single();

  if (error) {
    console.error('Database error:', error);
    throw new Error("添付ファイルの登録に失敗しました");
  }

  return attachment;
}

export async function deleteAttachmentRecord(id: string): Promise<void> {
  const { error } = await supabase
    .from('attachments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Database delete error:', error);
    throw new Error("添付ファイルの削除に失敗しました");
  }
}

export async function fetchAttachments(contentId: string | null): Promise<Attachment[]> {
  const query = supabase
    .from('attachments')
    .select('*')
    .order('created_at', { ascending: false });

  if (contentId === null) {
    query.is('content_id', null);
  } else {
    query.eq('content_id', contentId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching attachments:', error);
    throw new Error("添付ファイルの取得に失敗しました");
  }

  return data || [];
}

export async function updateAttachmentContentId(contentId: string): Promise<void> {
  const { error } = await supabase
    .from('attachments')
    .update({ content_id: contentId })
    .is('content_id', null);

  if (error) {
    console.error('Error updating attachments:', error);
    throw new Error("添付ファイルの更新に失敗しました");
  }
}