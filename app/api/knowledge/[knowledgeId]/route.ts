import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// コンテンツを取得する
export async function GET(
  req: NextRequest,
  { params }: { params: { knowledgeId: string } }
) {
  try {
    const { data: knowledge, error } = await supabase
      .from('contents')
      .select('*')
      .eq('id', params.knowledgeId)
      .eq('type', 'knowledge')
      .single();

    if (error) {
      console.error('Knowledge fetch error:', error);
      return NextResponse.json(
        { error: 'ナレッジの取得に失敗しました' },
        { status: 500 }
      );
    }

    if (!knowledge) {
      return NextResponse.json(
        { error: 'ナレッジが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(knowledge);
  } catch (error) {
    console.error('Knowledge fetch error:', error);
    return NextResponse.json(
      { error: 'ナレッジの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 下書きを公開する
export async function POST(
  req: NextRequest,
  { params }: { params: { knowledgeId: string } }
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
      .select('draft_title, draft_body, draft_tags')
      .eq('id', params.knowledgeId)
      .single();

    if (fetchError || !currentDraft) {
      console.error('Draft fetch error:', fetchError);
      return NextResponse.json(
        { error: '下書きの取得に失敗しました' },
        { status: 500 }
      );
    }

    // 下書きを公開（メインコンテンツに反映）
    const { data: knowledge, error: updateError } = await supabase
      .from('contents')
      .update({
        title: currentDraft.draft_title,
        body: currentDraft.draft_body,
        tags: currentDraft.draft_tags,
        // 下書きフィールドをクリア
        draft_title: null,
        draft_body: null,
        draft_tags: null,
        last_draft_saved_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.knowledgeId)
      .select(`
        *,
        author:author_id(name),
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

    return NextResponse.json(knowledge);
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
  { params }: { params: { knowledgeId: string } }
) {
  try {
    const { 
      draft_title, 
      draft_body, 
      draft_tags,
      application_id,
      last_draft_saved_at 
    } = await req.json();

    // 下書きの保存
    const { data: knowledge, error } = await supabase
      .from('contents')
      .update({
        draft_title,
        draft_body,
        draft_tags,
        application_id,
        last_draft_saved_at,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.knowledgeId)
      .select(`
        *,
        author:author_id(name),
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

    return NextResponse.json(knowledge);
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
  { params }: { params: { knowledgeId: string } }
) {
  try {
    const { title, body, tags, application_id } = await req.json();

    // バリデーション
    if (!title || !body || !application_id) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // ナレッジの更新（下書きを公開）
    const { data: knowledge, error } = await supabase
      .from('contents')
      .update({
        title,
        body,
        tags,
        application_id,
        updated_at: new Date().toISOString(),
        // 下書きフィールドをクリア
        draft_title: null,
        draft_body: null,
        draft_tags: null,
        last_draft_saved_at: null,
        is_draft: false
      })
      .eq('id', params.knowledgeId)
      .select(`
        *,
        author:author_id(name),
        application:application_id(id, name)
      `)
      .single();

    if (error) {
      console.error('Knowledge update error:', error);
      return NextResponse.json(
        { error: 'ナレッジの更新に失敗しました' },
        { status: 500 }
      );
    }

    if (!knowledge) {
      return NextResponse.json(
        { error: '指定されたナレッジが見つかりません' },
        { status: 404 }
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

// コンテンツを削除する
export async function DELETE(
  req: NextRequest,
  { params }: { params: { knowledgeId: string } }
) {
  try {
    const { error } = await supabase
      .from('contents')
      .delete()
      .eq('id', params.knowledgeId);

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
