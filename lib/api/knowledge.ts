"use server";

import { supabase } from '@/lib/supabase';
import { Content } from '@/lib/types';
import { cookies } from 'next/headers';

/**
 * ナレッジ一覧を取得する
 */
export async function fetchKnowledge(): Promise<Content[]> {
  try {
    // セッションの取得
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth');
    let userId = null;
    let isAdmin = false;

    if (authCookie) {
      const session = JSON.parse(decodeURIComponent(authCookie.value));
      if (session?.userId) {
        userId = session.userId;
        isAdmin = session.role === 'admin';
      }
    }

    const query = supabase
      .from("contents")
      .select(`
        *,
        author:author_id(name),
        application:application_id(id, name)
      `)
      .eq('type', 'knowledge')

    // 下書きの表示条件を追加
    if (userId) {
      // 管理者は全ての下書きを表示、一般ユーザーは自分の下書きのみ表示
      if (isAdmin) {
        // 制約なし - 全て表示
      } else {
        // 公開済みか、自分の下書きのみ表示
        query.or(`is_draft.eq.false,and(is_draft.eq.true,author_id.eq.${userId})`);
      }
    } else {
      // 非ログインユーザーは公開済みのみ表示
      query.eq('is_draft', false);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching knowledge:", error);
      throw new Error("ナレッジの取得に失敗しました");
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchKnowledge:", error);
    throw error;
  }
}

/**
 * 指定されたIDのナレッジを取得する
 */
export async function fetchKnowledgeById(id: string): Promise<Content> {
  const { data, error } = await supabase
    .from("contents")
    .select(`
      *,
      author:author_id(name),
      application:application_id(id, name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching knowledge:", error);
    throw new Error("ナレッジの取得に失敗しました");
  }

  if (!data) {
    throw new Error("ナレッジが見つかりません");
  }

  return data;
}

/**
 * ナレッジを作成する
 */
export async function createKnowledge(data: {
  title: string;
  body: string;
  tags?: string[];
  application_id: string;
}): Promise<Content> {
  try {
    // セッションの取得
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth');
    if (!authCookie) {
      throw new Error("認証が必要です");
    }

    const session = JSON.parse(decodeURIComponent(authCookie.value));
    if (!session || !session.userId) {
      throw new Error("認証が必要です");
    }

    // バリデーション
    if (!data.application_id) {
      throw new Error("アプリケーションを選択してください");
    }

    const { data: knowledge, error } = await supabase
      .from("contents")
      .insert({
        type: "knowledge",
        title: data.title,
        body: data.body,
        tags: data.tags,
        application_id: data.application_id,
        author_id: session.userId
      })
      .select(`
        *,
        author:author_id(name),
        application:application_id(id, name)
      `)
      .single();

    if (error) {
      console.error("Knowledge creation error:", error);
      throw new Error("ナレッジの作成に失敗しました");
    }

    return knowledge;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
}

/**
 * ナレッジを更新する
 */
export async function updateKnowledge(id: string, data: {
  title: string;
  body: string;
  tags?: string[];
  application_id: string;
}): Promise<Content> {
  try {
    // セッションの取得
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth');
    if (!authCookie) {
      throw new Error("認証が必要です");
    }

    const session = JSON.parse(decodeURIComponent(authCookie.value));
    if (!session || !session.userId) {
      throw new Error("認証が必要です");
    }

    // バリデーション
    if (!data.application_id) {
      throw new Error("アプリケーションを選択してください");
    }

    const { data: knowledge, error } = await supabase
      .from("contents")
      .update({
        title: data.title,
        body: data.body,
        tags: data.tags,
        application_id: data.application_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        author:author_id(name),
        application:application_id(id, name)
      `)
      .single();

    if (error) {
      console.error("Knowledge update error:", error);
      throw new Error("ナレッジの更新に失敗しました");
    }

    return knowledge;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
}