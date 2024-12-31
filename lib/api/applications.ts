"use client";

import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth/session";
import { Application } from "@/lib/types";

interface CreateApplicationData {
  name: string;
  description: string;
}

export async function createApplication(data: CreateApplicationData): Promise<Application> {
  const session = getSession();
  if (!session) {
    throw new Error("認証情報が見つかりません");
  }

  if (session.role !== 'developer') {
    throw new Error("開発者のみがアプリケーションを作成できます");
  }

  const { data: newApp, error } = await supabase
    .from("applications")
    .insert({
      name: data.name,
      description: data.description,
      developer_id: session.userId,
      status: "development",
      progress: 0
    })
    .select()
    .single();

  if (error) {
    console.error("Application creation error:", error);
    throw new Error("アプリケーションの作成に失敗しました");
  }

  return newApp;
}

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