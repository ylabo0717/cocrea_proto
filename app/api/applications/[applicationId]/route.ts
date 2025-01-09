import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
  req: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  try {
    const { name, description, status, next_release_date, progress } = await req.json();

    // バリデーション
    if (!name) {
      return NextResponse.json(
        { error: 'アプリケーション名は必須です' },
        { status: 400 }
      );
    }

    // アプリケーションの更新
    const { data: application, error } = await supabase
      .from('applications')
      .update({
        name,
        description,
        status,
        next_release_date,
        progress,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.applicationId)
      .select()
      .single();

    if (error) {
      console.error('Application update error:', error);
      return NextResponse.json(
        { error: 'アプリケーションの更新に失敗しました' },
        { status: 500 }
      );
    }

    if (!application) {
      return NextResponse.json(
        { error: '指定されたアプリケーションが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
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
  { params }: { params: { applicationId: string } }
) {
  try {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', params.applicationId);

    if (error) {
      console.error('Application deletion error:', error);
      return NextResponse.json(
        { error: 'アプリケーションの削除に失敗しました' },
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