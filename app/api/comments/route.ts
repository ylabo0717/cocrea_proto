import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const contentId = req.nextUrl.searchParams.get('contentId');
    if (!contentId) {
      return NextResponse.json(
        { error: 'コンテンツIDは必須です' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:user_id(name)
      `)
      .eq('content_id', contentId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json(
        { error: 'コメントの取得に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
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
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth');
    if (!authCookie) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const session = JSON.parse(decodeURIComponent(authCookie.value));
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const { contentId, body } = await req.json();

    if (!contentId || !body) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        content_id: contentId,
        user_id: session.userId,
        body: body.trim()
      })
      .select(`
        *,
        user:user_id(name)
      `)
      .single();

    if (error) {
      console.error('Comment creation error:', error);
      return NextResponse.json(
        { error: 'コメントの作成に失敗しました' },
        { status: 500 }
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