import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { title, body, category, tags, application_id } = await req.json();

    // バリデーション
    if (!title || !body || !application_id) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // ナレッジの作成
    const { data: knowledge, error } = await supabase
      .from('contents')
      .insert({
        type: 'knowledge',
        title,
        body,
        category,
        tags,
        application_id
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