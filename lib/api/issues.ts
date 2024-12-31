"use client";

import { supabase } from "@/lib/supabase";
import { Content } from "@/lib/types";
import { getSession } from "@/lib/auth/session";

interface CreateIssueData {
  title: string;
  body: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  application_id: string;
}

interface UpdateIssueData {
  title: string;
  body: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  application_id: string;
}

export async function createIssue(data: CreateIssueData): Promise<Content> {
  const session = getSession();
  if (!session) {
    throw new Error("認証情報が見つかりません");
  }

  if (!data.application_id) {
    throw new Error("アプリケーションを選択してください");
  }

  const { data: newIssue, error } = await supabase
    .from("contents")
    .insert({
      type: "issue",
      title: data.title,
      body: data.body,
      status: data.status,
      priority: data.priority,
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
    console.error("Issue creation error:", error);
    throw new Error("課題の作成に失敗しました");
  }

  return newIssue;
}

export async function fetchIssues(): Promise<Content[]> {
  const { data, error } = await supabase
    .from("contents")
    .select(`
      *,
      author:author_id(name),
      application:application_id(id, name)
    `)
    .eq('type', 'issue')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching issues:", error);
    throw new Error("課題の取得に失敗しました");
  }

  return data || [];
}

export async function fetchIssueById(id: string): Promise<Content> {
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
    console.error("Error fetching issue:", error);
    throw new Error("課題の取得に失敗しました");
  }

  return data;
}

export async function updateIssue(id: string, data: UpdateIssueData): Promise<Content> {
  const session = getSession();
  if (!session) {
    throw new Error("認証情報が見つかりません");
  }

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
    console.error("Issue update error:", error);
    throw new Error("課題の更新に失敗しました");
  }

  return issue;
}