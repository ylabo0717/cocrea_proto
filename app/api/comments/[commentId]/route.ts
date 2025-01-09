import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const { body } = await req.json();

    if (!body) {
      return NextResponse.json(
        { error: 'コメント内容は必須です' },
        { status: 400 }
      );
    }

    const { data: comment, error } = await supabase
      .from('comments')
      .update({
        body,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.commentId)
      .select(`
        *,
        user:user_id(name)
      `)
      .single();

    if (error) {
      console.error('Comment update error:', error);
      return NextResponse.json(
        { error: 'コメントの更新に失敗しました' },
        { status: 500 }
      );
    }

    if (!comment) {
      return NextResponse.json(
        { error: '指定されたコメントが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', params.commentId);

    if (error) {
      console.error('Comment deletion error:', error);
      return NextResponse.json(
        { error: 'コメントの削除に失敗しました' },
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