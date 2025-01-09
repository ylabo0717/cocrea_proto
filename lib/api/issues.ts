"use server";

import { supabase } from '@/lib/supabase';
import { Content } from '@/lib/types';
import { cookies } from 'next/headers';

/**
 * 課題一覧を取得する
 */
export async function fetchIssues(): Promise<Content[]> {
  try {
    const { data, error } = await supabase
      .from("contents")
      .select(`
        *,
        author:author_id(name),
        assignee:assignee_id(name),
        application:application_id(id, name)
      `)
      .eq('type', 'issue')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching issues:", error);
      throw new Error("課題の取得に失敗しました");
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error in fetchIssues:", error);
    throw error;
  }
}

/**
 * 指定されたIDの課題を取得する
 */
export async function fetchIssueById(id: string): Promise<Content> {
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
    console.error("Error fetching issue:", error);
    throw new Error("課題の取得に失敗しました");
  }

  return data;
}

/**
 * 課題を作成する
 */
export async function createIssue(data: {
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

    const { data: issue, error } = await supabase
      .from("contents")
      .insert({
        type: "issue",
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
      console.error("Issue creation error:", error);
      throw new Error("課題の作成に失敗しました");
    }

    return issue;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
}

/**
 * 課題を更新する
 */
export async function updateIssue(id: string, data: {
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

    const { data: issue, error } = await supabase
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
      console.error("Issue update error:", error);
      throw new Error("課題の更新に失敗しました");
    }

    return issue;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
}