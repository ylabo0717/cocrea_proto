"use client";

import { supabase } from '@/lib/supabase';
import { Like } from '@/lib/types';
import { cookies } from 'next/headers';

/**
 * いいねを作成する
 */
export async function createLike(contentId: string): Promise<Like> {
  try {
    // セッションの取得
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth='));
    
    if (!authCookie) {
      throw new Error("認証が必要です");
    }

    const session = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
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
  } catch (error) {
    console.error('Error in createLike:', error);
    throw error;
  }
}

/**
 * いいねを削除する
 */
export async function deleteLike(contentId: string): Promise<void> {
  try {
    // セッションの取得
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth='));
    
    if (!authCookie) {
      throw new Error("認証が必要です");
    }

    const session = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
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
  } catch (error) {
    console.error('Error in deleteLike:', error);
    throw error;
  }
}

/**
 * いいね数を取得する
 */
export async function getLikeCount(contentId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("likes")
      .select("*", { count: 'exact', head: true })
      .eq("content_id", contentId);

    if (error) {
      console.error("Error getting like count:", error);
      throw new Error("いいね数の取得に失敗しました");
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getLikeCount:', error);
    throw error;
  }
}

/**
 * いいね済みかどうかを確認する
 */
export async function hasLiked(contentId: string): Promise<boolean> {
  try {
    // セッションの取得
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth='));
    
    if (!authCookie) {
      return false;
    }

    const session = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
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
  } catch (error) {
    console.error('Error in hasLiked:', error);
    throw error;
  }
}