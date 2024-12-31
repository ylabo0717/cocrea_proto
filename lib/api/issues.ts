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