"use client";

import { Attachment } from "@/lib/types";
import * as storage from "./storage";
import * as database from "./database";

export async function uploadAttachment(file: File, contentId?: string): Promise<Attachment> {
  try {
    // Create file path
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = contentId ? `${contentId}/${fileName}` : `temp/${fileName}`;

    // Upload to storage
    await storage.uploadFile(file, filePath);

    try {
      // Create database record
      return await database.createAttachment({
        content_id: contentId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type
      });
    } catch (dbError) {
      // If database insert fails, clean up the uploaded file
      await storage.deleteFile(filePath);
      throw dbError;
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function deleteAttachment(attachment: Attachment): Promise<void> {
  try {
    // Delete from storage first
    await storage.deleteFile(attachment.file_path);
    // Then delete database record
    await database.deleteAttachmentRecord(attachment.id);
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}

export async function updateAttachments(contentId: string): Promise<void> {
  await database.updateAttachmentContentId(contentId);
}

export const fetchAttachments = database.fetchAttachments;
export const getAttachmentUrl = storage.getPublicUrl;