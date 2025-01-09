import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 添付ファイルのcontent_idを更新する
export async function POST(req: NextRequest) {
  try {
    const { contentId } = await req.json();

    const { error } = await supabase
      .from('attachments')
      .update({ content_id: contentId })
      .is('content_id', null);

    if (error) {
      console.error('Error updating attachments:', error);
      return NextResponse.json(
        { error: '添付ファイルの更新に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in update:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}