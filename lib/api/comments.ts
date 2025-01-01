"use client";

import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth/session";
import { Comment } from "@/lib/types";

export async function createComment(contentId: string, body: string): Promise<Comment> {
  const session = getSession();
  if (!session) {
    throw new Error("認証情報が見つかりません");
  }

  const { data: comment, error } = await supabase
    .from("comments")
    .insert({
      content_id: contentId,
      user_id: session.userId,
      body: body
    })
    .select(`
      *,
      user:user_id(name)
    `)
    .single();

  if (error) {
    console.error("Comment creation error:", error);
    throw new Error("コメントの作成に失敗しました");
  }

  return comment;
}

export async function fetchComments(contentId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      user:user_id(name)
    `)
    .eq('content_id', contentId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    throw new Error("コメントの取得に失敗しました");
  }

  return data || [];
}