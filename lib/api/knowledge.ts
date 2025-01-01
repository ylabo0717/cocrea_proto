"use client";

import { supabase } from "@/lib/supabase";
import { Content } from "@/lib/types";

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