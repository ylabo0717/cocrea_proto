"use client";

import { supabase } from "@/lib/supabase";
import { Content } from "@/lib/types";

export async function fetchIssues(): Promise<Content[]> {
  const { data, error } = await supabase
    .from("contents")
    .select(`
      *,
      author:author_id(name),
      application:application_id(name)
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
      application:application_id(name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching issue:", error);
    throw new Error("課題の取得に失敗しました");
  }

  return data;
}