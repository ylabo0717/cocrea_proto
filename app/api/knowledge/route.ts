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
      draft_category,
      draft_tags,
      application_id
    } = await req.json();

    const now = new Date().toISOString();
    const draftData = {
      draft_title,
      draft_body,
      draft_category,
      draft_tags,
      application_id,
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
          type: 'knowledge',
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

    const {
      title,
      body,
      category,
      tags,
      application_id,
      draft_title,
      draft_body,
      draft_category,
      draft_tags
    } = await req.json();

    const now = new Date().toISOString();

    // ナレッジの作成
    const { data: knowledge, error } = await supabase
      .from('contents')
      .insert({
        type: 'knowledge',
        title: title || '',
        body: body || '',
        category: category || '',
        tags: tags || [],
        application_id: application_id || null,
        author_id: session.userId,
        created_at: now,
        updated_at: now,
        // 下書きフィールド
        draft_title: draft_title || title || '',
        draft_body: draft_body || body || '',
        draft_category: draft_category || category || '',
        draft_tags: draft_tags || tags || [],
        is_draft: true,
        last_draft_saved_at: now
      })
      .select(`
        *,
        author:author_id(name),
        application:application_id(id, name)
      `)
      .single();

    if (error) {
      console.error('Knowledge creation error:', error);
      return NextResponse.json(
        { error: 'ナレッジの作成に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(knowledge);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}