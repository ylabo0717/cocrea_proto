"use server";

import { supabase } from "@/lib/supabase";
import { Content } from "@/lib/types";

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