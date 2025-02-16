import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
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
      is_draft
    } = json;

    const now = new Date().toISOString();

    const data = {
      type,
      title: '',
      body: '',
      application_id: applicationId || null,
      author_id: session.userId,
      created_at: now,
      updated_at: now,
      tags: [],
      is_draft: true,
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

    // コンテンツの作成
    const { data: content, error: contentError } = await supabase
      .from('contents')
      .insert([{ ...data, ...additionalData }])
      .select(`
        *,
        author:author_id(name),
        assignee:assignee_id(name),
        application:application_id(id, name)
      `)
      .single();

    if (contentError) {
      console.error('コンテンツ作成エラー:', contentError);
      return NextResponse.json(
        { error: `コンテンツの作成に失敗しました: ${contentError.message}` },
        { status: 500 }
      );
    }

    // 添付ファイルの関連付け
    if (attachments && attachments.length > 0) {
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
      // コンテンツは作成されているので、添付ファイル情報なしで返す
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
