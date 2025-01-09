import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
  req: NextRequest,
  { params }: { params: { issueId: string } }
) {
  try {
    const { title, body, status, priority, application_id, assignee_id } = await req.json();

    // バリデーション
    if (!title || !body || !application_id) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // 課題の更新
    const { data: issue, error } = await supabase
      .from('contents')
      .update({
        title,
        body,
        status,
        priority,
        application_id,
        assignee_id,
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