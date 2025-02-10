"use server";

import { supabase } from '@/lib/supabase';
import { Content } from '@/lib/types';
import { cookies } from 'next/headers';

/**
 * 要望一覧を取得する
 */
export async function fetchRequests(): Promise<Content[]> {
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
        assignee:assignee_id(name),
        application:application_id(id, name)
      `)
      .eq('type', 'request')

    // 下書きの表示条件を追加
    if (userId) {
      // 管理者は全ての下書きを表示、一般ユーザーは自分の下書きのみ表示
      query.or(`is_draft.eq.false,and(is_draft.eq.true,${isAdmin ? 'id.gt.0' : `author_id.eq.${userId}`})`);
    } else {
      query.eq('is_draft', false);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching requests:", error);
      throw new Error("要望の取得に失敗しました");
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error in fetchRequests:", error);
    throw error;
  }
}

/**
 * 指定されたIDの要望を取得する
 */
export async function fetchRequestById(id: string): Promise<Content> {
  const { data, error } = await supabase
    .from("contents")
    .select(`
      *,
      author:author_id(name),
      assignee:assignee_id(name),
      application:application_id(id, name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching request:", error);
    throw new Error("要望の取得に失敗しました");
  }

  return data;
}

/**
 * 要望を作成する
 */
export async function createRequest(data: {
  title: string;
  body: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  application_id: string;
  assignee_id?: string;
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

    const { data: request, error } = await supabase
      .from("contents")
      .insert({
        type: "request",
        title: data.title,
        body: data.body,
        status: data.status || 'open',
        priority: data.priority || 'medium',
        application_id: data.application_id,
        assignee_id: data.assignee_id,
        author_id: session.userId
      })
      .select(`
        *,
        author:author_id(name),
        assignee:assignee_id(name),
        application:application_id(id, name)
      `)
      .single();

    if (error) {
      console.error("Request creation error:", error);
      throw new Error("要望の作成に失敗しました");
    }

    return request;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
}

/**
 * 要望を更新する
 */
export async function updateRequest(id: string, data: {
  title: string;
  body: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  application_id: string;
  assignee_id?: string;
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

    const { data: request, error } = await supabase
      .from("contents")
      .update({
        title: data.title,
        body: data.body,
        status: data.status,
        priority: data.priority,
        application_id: data.application_id,
        assignee_id: data.assignee_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        author:author_id(name),
        assignee:assignee_id(name),
        application:application_id(id, name)
      `)
      .single();

    if (error) {
      console.error("Request update error:", error);
      throw new Error("要望の更新に失敗しました");
    }

    return request;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
}