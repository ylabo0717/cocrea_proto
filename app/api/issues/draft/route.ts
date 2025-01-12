import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  try {
    // Get the current user from session
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth');
    if (!authCookie) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const session = JSON.parse(decodeURIComponent(authCookie.value));
    if (!session || !session.userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // Create a draft issue
    const { data: draft, error } = await supabase
      .from("contents")
      .insert({
        type: "issue",
        is_draft: true,
        author_id: session.userId,
        title: "",
        body: "",
        status: "open",
        priority: "medium"
      })
      .select()
      .single();

    if (error) {
      console.error("Draft creation error:", error);
      return NextResponse.json(
        { error: "下書きの作成に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json(draft);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "予期せぬエラーが発生しました" },
      { status: 500 }
    );
  }
}
