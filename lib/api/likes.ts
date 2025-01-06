"use client";

import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth/session";
import { Like } from "@/lib/types";

export async function createLike(contentId: string): Promise<Like> {
  const session = getSession();
  if (!session?.userId) {
    throw new Error("認証が必要です");
  }

  const { data: like, error } = await supabase
    .from("likes")
    .insert({
      content_id: contentId,
      user_id: session.userId
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating like:", error);
    throw new Error("いいねの追加に失敗しました");
  }

  return like;
}

export async function deleteLike(contentId: string): Promise<void> {
  const session = getSession();
  if (!session?.userId) {
    throw new Error("認証が必要です");
  }

  const { error } = await supabase
    .from("likes")
    .delete()
    .match({ 
      content_id: contentId,
      user_id: session.userId
    });

  if (error) {
    console.error("Error deleting like:", error);
    throw new Error("いいねの削除に失敗しました");
  }
}

export async function getLikeCount(contentId: string): Promise<number> {
  const { count, error } = await supabase
    .from("likes")
    .select("*", { count: 'exact', head: true })
    .eq("content_id", contentId);

  if (error) {
    console.error("Error getting like count:", error);
    throw new Error("いいね数の取得に失敗しました");
  }

  return count || 0;
}

export async function hasLiked(contentId: string): Promise<boolean> {
  const session = getSession();
  if (!session?.userId) {
    return false;
  }

  const { data, error } = await supabase
    .from("likes")
    .select()
    .match({ 
      content_id: contentId,
      user_id: session.userId
    })
    .maybeSingle();

  if (error) {
    console.error("Error checking like status:", error);
    throw new Error("いいね状態の確認に失敗しました");
  }

  return !!data;
}