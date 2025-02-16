import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// コンテンツを取得する
export async function GET(
  req: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const { data: request, error } = await supabase
      .from('contents')
      .select('*')
      .eq('id', params.requestId)
      .eq('type', 'request')
      .single();

    if (error) {
      console.error('Request fetch error:', error);
      return NextResponse.json(
        { error: 'リクエストの取得に失敗しました' },
        { status: 500 }
      );
    }

    if (!request) {
      return NextResponse.json(
        { error: 'リクエストが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(request);
  } catch (error) {
    console.error('Request fetch error:', error);
    return NextResponse.json(
      { error: 'リクエストの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 下書きを公開する
export async function POST(
  req: NextRequest,
  { params }: { params: { requestId: string } }
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
      .select('draft_title, draft_body, draft_status, draft_priority, draft_tags')
      .eq('id', params.requestId)
      .single();

    if (fetchError || !currentDraft) {
      console.error('Draft fetch error:', fetchError);
      return NextResponse.json(
        { error: '下書きの取得に失敗しました' },
        { status: 500 }
      );
    }

    // 下書きを公開（メインコンテンツに反映）
    const { data: request, error: updateError } = await supabase
      .from('contents')
      .update({
        title: currentDraft.draft_title,
        body: currentDraft.draft_body,
        status: currentDraft.draft_status,
        priority: currentDraft.draft_priority,
        tags: currentDraft.draft_tags,
        // 下書きフィールドをクリア
        draft_title: null,
        draft_body: null,
        draft_status: null,
        draft_priority: null,
        draft_tags: null,
        last_draft_saved_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.requestId)
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

    return NextResponse.json(request);
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
  { params }: { params: { requestId: string } }
) {
  try {
    const { 
      draft_title, 
      draft_body, 
      draft_status, 
      draft_priority, 
      draft_tags,
      application_id,
      assignee_id,
      last_draft_saved_at 
    } = await req.json();

    // 下書きの保存
    const { data: request, error } = await supabase
      .from('contents')
      .update({
        draft_title,
        draft_body,
        draft_status,
        draft_priority,
        draft_tags,
        application_id,
        assignee_id,
        last_draft_saved_at,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.requestId)
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

    return NextResponse.json(request);
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
  { params }: { params: { requestId: string } }
) {
  try {
    const { title, body, status, priority, tags, application_id, assignee_id } = await req.json();

    // バリデーション
    if (!title || !body || !application_id) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // 要望の更新（下書きを公開）
    const { data: request, error } = await supabase
      .from('contents')
      .update({
        title,
        body,
        status,
        priority,
        tags,
        application_id,
        assignee_id,
        updated_at: new Date().toISOString(),
        // 下書きフィールドをクリア
        draft_title: null,
        draft_body: null,
        draft_status: null,
        draft_priority: null,
        draft_tags: null,
        last_draft_saved_at: null,
        is_draft: false
      })
      .eq('id', params.requestId)
      .select(`
        *,
        author:author_id(name),
        assignee:assignee_id(name),
        application:application_id(id, name)
      `)
      .single();

    if (error) {
      console.error('Request update error:', error);
      return NextResponse.json(
        { error: '要望の更新に失敗しました' },
        { status: 500 }
      );
    }

    if (!request) {
      return NextResponse.json(
        { error: '指定された要望が見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(request);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}

// コンテンツを削除する
export async function DELETE(
  req: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const { error } = await supabase
      .from('contents')
      .delete()
      .eq('id', params.requestId);

    if (error) {
      console.error('Content delete error:', error);
      return NextResponse.json(
        { error: 'コンテンツの削除に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}