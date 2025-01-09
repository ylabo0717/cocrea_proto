import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      return NextResponse.json(
        { error: "アプリケーションの取得に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "予期せぬエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();

    // バリデーション
    if (!name) {
      return NextResponse.json(
        { error: "アプリケーション名は必須です" },
        { status: 400 }
      );
    }

    // アプリケーションの作成
    const { data: application, error } = await supabase
      .from("applications")
      .insert({
        name,
        description,
        status: "development",
        progress: 0
      })
      .select()
      .single();

    if (error) {
      console.error("Application creation error:", error);
      return NextResponse.json(
        { error: "アプリケーションの作成に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "予期せぬエラーが発生しました" },
      { status: 500 }
    );
  }
}