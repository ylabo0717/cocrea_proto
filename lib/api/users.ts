"use server";

import { supabase } from '@/lib/supabase';
import { User } from '@/lib/types';

/**
 * ユーザー一覧を取得する
 */
export async function fetchUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      throw new Error("ユーザーの取得に失敗しました");
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchUsers:", error);
    throw error;
  }
}

/**
 * 指定されたIDのユーザーを取得する
 */
export async function fetchUserById(id: string): Promise<User> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      throw new Error("ユーザーの取得に失敗しました");
    }

    return data;
  } catch (error) {
    console.error("Error in fetchUserById:", error);
    throw error;
  }
}

/**
 * ユーザー情報を更新する
 */
export async function updateUser(id: string, data: {
  name?: string;
  department?: string;
  contact?: string;
}): Promise<User> {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      throw new Error("ユーザー情報の更新に失敗しました");
    }

    return user;
  } catch (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
}

/**
 * 開発者ユーザーの一覧を取得する
 */
export async function fetchDevelopers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .in('role', ['developer', 'admin'])
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching developers:", error);
      throw new Error("開発者一覧の取得に失敗しました");
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchDevelopers:", error);
    throw error;
  }
}