import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/lib/api/attachments/storage';

// ファイルをアップロードする
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const contentId = formData.get('contentId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが選択されていません' },
        { status: 400 }
      );
    }

    // ファイルサイズのチェック (50MB)
    if (file.size > 52428800) {
      return NextResponse.json(
        { error: 'ファイルサイズは50MB以下にしてください' },
        { status: 400 }
      );
    }

    // MIMEタイプのチェック
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '許可されていないファイル形式です' },
        { status: 400 }
      );
    }

    // ファイルパスの作成
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = contentId ? `${contentId}/${fileName}` : `temp/${fileName}`;

    // ArrayBufferに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // ストレージにアップロード
    await uploadFile(buffer, filePath, file.type);

    // データベースに登録
    const { data: attachment, error: dbError } = await supabase
      .from('attachments')
      .insert({
        content_id: contentId || null,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type
      })
      .select()
      .single();

    if (dbError) {
      // データベース登録に失敗した場合、アップロードしたファイルを削除
      await supabase.storage
        .from('issue-attachments')
        .remove([filePath]);

      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: '添付ファイルの登録に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('Error in upload:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}

// 添付ファイル一覧を取得する
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get('contentId');

    const query = supabase
      .from('attachments')
      .select('*')
      .order('created_at', { ascending: false });

    if (contentId === null) {
      query.is('content_id', null);
    } else if (contentId) {
      query.eq('content_id', contentId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching attachments:', error);
      return NextResponse.json(
        { error: '添付ファイルの取得に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in fetch:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
}