"use client";

import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth/session";
import { Content } from "@/lib/types";

interface CreateRequestData {
  title: string;
  body: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  application_id: string;
  assignee_id?: string;
}

export async function createRequest(data: CreateRequestData): Promise<Content> {
  const session = getSession();
  if (!session) {
    throw new Error("認証情報が見つかりません");
  }

  if (!data.application_id) {
    throw new Error("アプリケーションを選択してください");
  }

  const { data: request, error } = await supabase
    .from("contents")
    .insert({
      type: "request",
      title: data.title,
      body: data.body,
      status: data.status,
      priority: data.priority,
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
}

export async function fetchRequests(): Promise<Content[]> {
  const { data, error } = await supabase
    .from("contents")
    .select(`
      *,
      author:author_id(name),
      assignee:assignee_id(name),
      application:application_id(id, name)
    `)
    .eq('type', 'request')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching requests:", error);
    throw new Error("要望の取得に失敗しました");
  }

  return data || [];
}

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

export async function updateRequest(id: string, data: CreateRequestData): Promise<Content> {
  const session = getSession();
  if (!session) {
    throw new Error("認証情報が見つかりません");
  }

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
}