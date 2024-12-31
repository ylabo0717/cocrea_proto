"use client";

import { supabase } from "@/lib/supabase";
import { User } from "@/lib/types";

export async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    throw new Error("ユーザーの取得に失敗しました");
  }

  return data || [];
}