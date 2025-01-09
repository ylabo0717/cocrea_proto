import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
  req: NextRequest,
  { params }: { params: { knowledgeId: string } }
) {
  try {
    const { title, body, category, tags, application_id } = await req.json();

    // バリデーション
    if (!title || !body || !application_id) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // ナレッジの更新
    const { data: knowledge, error } = await supabase
      .from('contents')
      .update({
        title,
        body,
        category,
        tags,
        application_id,
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