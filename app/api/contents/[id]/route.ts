import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // セッションの取得
    const cookieStore = req.cookies;
    const authCookie = cookieStore.get('auth');
    if (!authCookie) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const session = JSON.parse(decodeURIComponent(authCookie.value));
    if (!session?.userId) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const json = await req.json();
    const {
      title,
      body,
      applicationId,
      status,
      priority,
      assigneeId,
      tags,
      attachments,
      type,
      isDraft
    } = json;

    const now = new Date().toISOString();

    const data = {
      updated_at: now,
      draft_title: title || '',
      draft_body: body || '',
      draft_status: status || 'open',
      draft_priority: priority || 'medium',
      draft_tags: tags || [],
      last_draft_saved_at: now,
    };

    // type別の违加データ
    const additionalData = type === 'knowledge' ? {} : {
      status: status || 'open',
      priority: priority || 'medium',
      assignee_id: assigneeId || null,
    };

    // コンテンツの更新
    const { data: content, error: contentError } = await supabase
      .from('contents')
      .update({ ...data, ...additionalData })
      .eq('id', params.id)
      .select(`
        *,
        author:author_id(name),
        assignee:assignee_id(name),
        application:application_id(id, name)
      `)
      .single();

    if (contentError) {
      console.error('コンテンツ更新エラー:', contentError);
      return NextResponse.json(
        { error: 'コンテンツの更新に失敗しました' },
        { status: 500 }
      );
    }

    // 添付ファイルの関連付け
    if (attachments && attachments.length > 0) {
      // 既存の添付ファイルを解除
      await supabase
        .from('attachments')
        .update({ content_id: null })
        .eq('content_id', params.id);

      // 新しい添付ファイルを関連付け
      const { error: attachmentError } = await supabase
        .from('attachments')
        .update({ content_id: content.id })
        .in('id', attachments);

      if (attachmentError) {
        console.error('添付ファイル更新エラー:', attachmentError);
      }
    }

    // 添付ファイル情報を含めて返す
    const { data: result, error: selectError } = await supabase
      .from('contents')
      .select(`
        *,
        author:author_id(name),
        assignee:assignee_id(name),
        application:application_id(id, name),
        attachments(*)
      `)
      .eq('id', content.id)
      .single();

    if (selectError) {
      console.error('コンテンツ取得エラー:', selectError);
      // コンテンツは更新されているので、添付ファイル情報なしで返す
      return NextResponse.json(content);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('予期せぬエラー:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}
