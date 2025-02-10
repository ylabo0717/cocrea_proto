import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 下書きを保存するエンドポイント
export async function PATCH(req: NextRequest) {
  try {
    // セッションの取得
    const cookieStore = req.cookies;
    const authCookie = cookieStore.get('auth');
    if (!authCookie) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const session = JSON.parse(decodeURIComponent(authCookie.value));
    if (!session?.userId) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const {
      id,
      draft_title,
      draft_body,
      draft_status,
      draft_priority,
      draft_category,
      draft_tags,
      application_id,
      assignee_id
    } = await req.json();

    const now = new Date().toISOString();
    const draftData = {
      draft_title,
      draft_body,
      draft_status,
      draft_priority,
      draft_category,
      draft_tags,
      application_id,
      assignee_id,
      last_draft_saved_at: now
    };

    let result;

    if (id) {
      // 既存のコンテンツの下書きを更新
      const { data: draft, error } = await supabase
        .from('contents')
        .update(draftData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Draft update error:', error);
        return NextResponse.json(
          { error: '下書きの保存に失敗しました' },
          { status: 500 }
        );
      }

      result = draft;
    } else {
      // 新規コンテンツの下書きを作成
      const { data: draft, error } = await supabase
        .from('contents')
        .insert({
          ...draftData,
          type: 'issue',
          status: 'open',
          priority: 'medium',
          created_at: now,
          updated_at: now,
          author_id: session.userId,
          is_draft: true
        })
        .select()
        .single();

      if (error) {
        console.error('Draft creation error:', error);
        return NextResponse.json(
          { error: '下書きの作成に失敗しました' },
          { status: 500 }
        );
      }

      result = draft;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // セッションの取得
    const cookieStore = req.cookies;
    const authCookie = cookieStore.get('auth');
    if (!authCookie) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const session = JSON.parse(decodeURIComponent(authCookie.value));
    if (!session?.userId) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const { title, body, status, priority, application_id, assignee_id } = await req.json();

    // バリデーション
    if (!title || !body || !application_id) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // 課題の作成
    const { data: issue, error } = await supabase
      .from('contents')
      .insert({
        type: 'issue',
        title,
        body,
        status: status || 'open',
        priority: priority || 'medium',
        application_id,
        assignee_id,
        author_id: session.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        author:author_id(name),
        assignee:assignee_id(name),
        application:application_id(id, name)
      `)
      .single();

    if (error) {
      console.error('Issue creation error:', error);
      return NextResponse.json(
        { error: '課題の作成に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(issue);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}