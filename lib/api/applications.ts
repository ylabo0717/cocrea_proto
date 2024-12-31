"use client";

import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth/session";
import { Application } from "@/lib/types";

interface CreateApplicationData {
  name: string;
  description: string;
}

interface UpdateApplicationData {
  name: string;
  description: string;
  status: 'development' | 'released' | 'discontinued';
  next_release_date?: string | null;
  progress: number;
}

export async function createApplication(data: CreateApplicationData): Promise<Application> {
  const session = getSession();
  if (!session) {
    throw new Error("認証情報が見つかりません");
  }

  if (session.role !== 'developer' && session.role !== 'admin') {
    throw new Error("開発者または管理者のみがアプリケーションを作成できます");
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

export async function updateApplication(id: string, data: UpdateApplicationData): Promise<Application> {
  const session = getSession();
  if (!session) {
    throw new Error("認証情報が見つかりません");
  }

  if (session.role !== 'developer' && session.role !== 'admin') {
    throw new Error("開発者または管理者のみがアプリケーションを更新できます");
  }

  const { data: updatedApp, error } = await supabase
    .from("applications")
    .update({
      name: data.name,
      description: data.description,
      status: data.status,
      next_release_date: data.next_release_date,
      progress: data.progress
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Application update error:", error);
    throw new Error("アプリケーションの更新に失敗しました");
  }

  return updatedApp;
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