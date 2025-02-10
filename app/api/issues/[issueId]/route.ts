import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 下書きを公開する
export async function POST(
  req: NextRequest,
  { params }: { params: { issueId: string } }
) {
  try {
    const { publish_draft } = await req.json();

    if (!publish_draft) {
      return NextResponse.json(
        { error: '無効なリクエストです' },
        { status: 400 }
      );
    }

    // 現在の下書きデータを取得
    const { data: currentDraft, error: fetchError } = await supabase
      .from('contents')
      .select('draft_title, draft_body, draft_status, draft_priority, draft_category, draft_tags')
      .eq('id', params.issueId)
      .single();

    if (fetchError || !currentDraft) {
      console.error('Draft fetch error:', fetchError);
      return NextResponse.json(
        { error: '下書きの取得に失敗しました' },
        { status: 500 }
      );
    }

    // 下書きを公開（メインコンテンツに反映）
    const { data: issue, error: updateError } = await supabase
      .from('contents')
      .update({
        title: currentDraft.draft_title,
        body: currentDraft.draft_body,
        status: currentDraft.draft_status,
        priority: currentDraft.draft_priority,
        category: currentDraft.draft_category,
        tags: currentDraft.draft_tags,
        // 下書きフィールドをクリア
        draft_title: null,
        draft_body: null,
        draft_status: null,
        draft_priority: null,
        draft_category: null,
        draft_tags: null,
        last_draft_saved_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.issueId)
      .select(`
        *,
        author:author_id(name),
        assignee:assignee_id(name),
        application:application_id(id, name)
      `)
      .single();

    if (updateError) {
      console.error('Draft publish error:', updateError);
      return NextResponse.json(
        { error: '下書きの公開に失敗しました' },
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

// 下書きを保存する
export async function PATCH(
  req: NextRequest,
  { params }: { params: { issueId: string } }
) {
  try {
    const { draft_title, draft_body, draft_status, draft_priority, draft_category, draft_tags, last_draft_saved_at } = await req.json();

    // 下書きの保存
    const { data: issue, error } = await supabase
      .from('contents')
      .update({
        draft_title,
        draft_body,
        draft_status,
        draft_priority,
        draft_category,
        draft_tags,
        last_draft_saved_at,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.issueId)
      .select(`
        *,
        author:author_id(name),
        assignee:assignee_id(name),
        application:application_id(id, name)
      `)
      .single();

    if (error) {
      console.error('Draft save error:', error);
      return NextResponse.json(
        { error: '下書きの保存に失敗しました' },
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

export async function PUT(
  req: NextRequest,
  { params }: { params: { issueId: string } }
) {
  try {
    const { title, body, status, priority, category, tags, application_id, assignee_id } = await req.json();

    // バリデーション
    if (!title || !body || !application_id) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // 課題の更新（下書きを公開）
    const { data: issue, error } = await supabase
      .from('contents')
      .update({
        title,
        body,
        status,
        priority,
        category,
        tags,
        application_id,
        assignee_id,
        updated_at: new Date().toISOString(),
        // 下書きフィールドをクリア
        draft_title: null,
        draft_body: null,
        draft_status: null,
        draft_priority: null,
        draft_category: null,
        draft_tags: null,
        last_draft_saved_at: null,
        is_draft: false
      })
      .eq('id', params.issueId)
      .select(`
        *,
        author:author_id(name),
        assignee:assignee_id(name),
        application:application_id(id, name)
      `)
      .single();

    if (error) {
      console.error('Issue update error:', error);
      return NextResponse.json(
        { error: '課題の更新に失敗しました' },
        { status: 500 }
      );
    }

    if (!issue) {
      return NextResponse.json(
        { error: '指定された課題が見つかりません' },
        { status: 404 }
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