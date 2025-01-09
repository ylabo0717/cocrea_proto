import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 添付ファイルを削除する
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 添付ファイルの情報を取得
    const { data: attachment, error: fetchError } = await supabase
      .from('attachments')
      .select('file_path')
      .eq('id', params.id)
      .single();

    if (fetchError) {
      console.error('Error fetching attachment:', fetchError);
      return NextResponse.json(
        { error: '添付ファイルの取得に失敗しました' },
        { status: 500 }
      );
    }

    // ストレージから削除
    const { error: storageError } = await supabase.storage
      .from('issue-attachments')
      .remove([attachment.file_path]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
      return NextResponse.json(
        { error: 'ファイルの削除に失敗しました' },
        { status: 500 }
      );
    }

    // データベースから削除
    const { error: dbError } = await supabase
      .from('attachments')
      .delete()
      .eq('id', params.id);

    if (dbError) {
      console.error('Database delete error:', dbError);
      return NextResponse.json(
        { error: '添付ファイルの削除に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in delete:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}