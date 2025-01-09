import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hashPassword } from '@/lib/crypto-utils';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // バリデーション
    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードは必須です' },
        { status: 400 }
      );
    }

    // ユーザーの検索
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      console.error('User not found:', email);
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // パスワードの検証
    const hashedPassword = await hashPassword(password, user.salt);
    if (hashedPassword !== user.hashed_password) {
      console.error('Password mismatch for user:', email);
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // 最終ログイン日時の更新
    const { error: updateError } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to update last_login:', updateError);
    }

    // セッション情報の作成
    const session = {
      userId: user.id,
      email: user.email,
      role: user.role,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24時間
    };

    // レスポンスの作成
    const response = NextResponse.json({ success: true });
    
    // セッションCookieの設定
    response.cookies.set('auth', JSON.stringify(session), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 // 24時間（秒単位）
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'ログイン処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}