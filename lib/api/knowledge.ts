"use client";

import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth/session";
import { Content } from "@/lib/types";

interface CreateKnowledgeData {
  title: string;
  body: string;
  category?: string;
  tags?: string[];
  application_id: string;
}

interface UpdateKnowledgeData {
  title: string;
  body: string;
  category?: string;
  tags?: string[];
  application_id: string;
}

export async function createKnowledge(data: CreateKnowledgeData): Promise<Content> {
  const session = getSession();
  if (!session) {
    throw new Error("認証情報が見つかりません");
  }

  if (!data.application_id) {
    throw new Error("アプリケーションを選択してください");
  }

  const { data: knowledge, error } = await supabase
    .from("contents")
    .insert({
      type: "knowledge",
      title: data.title,
      body: data.body,
      category: data.category,
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
}

export async function fetchKnowledge(): Promise<Content[]> {
  const { data, error } = await supabase
    .from("contents")
    .select(`
      *,
      author:author_id(name),
      application:application_id(id, name)
    `)
    .eq('type', 'knowledge')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching knowledge:", error);
    throw new Error("ナレッジの取得に失敗しました");
  }

  return data || [];
}

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

  return data;
}

export async function updateKnowledge(id: string, data: UpdateKnowledgeData): Promise<Content> {
  const session = getSession();
  if (!session) {
    throw new Error("認証情報が見つかりません");
  }

  if (!data.application_id) {
    throw new Error("アプリケーションを選択してください");
  }

  const { data: knowledge, error } = await supabase
    .from("contents")
    .update({
      title: data.title,
      body: data.body,
      category: data.category,
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
}