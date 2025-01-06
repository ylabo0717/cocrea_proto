"use server";

import { supabase } from "@/lib/supabase";
import { Application, Content } from "@/lib/types";

export async function fetchApplications(): Promise<Application[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching applications:", error);
    throw new Error("アプリケーションの取得に失敗しました");
  }

  return data || [];
}

export async function fetchRecentContents(): Promise<Content[]> {
  const { data, error } = await supabase
    .from("contents")
    .select(`
      *,
      author:author_id(name),
      assignee:assignee_id(name),
      application:application_id(id, name)
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching recent contents:", error);
    throw new Error("最近の更新の取得に失敗しました");
  }

  return data || [];
}