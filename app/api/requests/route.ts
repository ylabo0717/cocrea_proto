import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { title, body, status, priority, application_id, assignee_id } = await req.json();

    // バリデーション
    if (!title || !body || !application_id) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // リクエストの作成
    const { data: request, error } = await supabase
      .from('contents')
      .insert({
        type: 'request',
        title,
        body,
        status: status || 'open',
        priority: priority || 'medium',
        application_id,
        assignee_id
      })
      .select(`
        *,
        author:author_id(name),
        assignee:assignee_id(name),
        application:application_id(id, name)
      `)
      .single();

    if (error) {
      console.error('Request creation error:', error);
      return NextResponse.json(
        { error: '要望の作成に失敗しました' },
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