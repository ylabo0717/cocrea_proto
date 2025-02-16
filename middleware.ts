import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticated } from '@/lib/auth/middleware-utils';

const publicPaths = ['/login'];
const staticPaths = ['/_next', '/favicon.ico'];
const publicApiPaths = ['/api/auth/login'];

export function middleware(request: NextRequest) {
  // 静的ファイルはスキップ
  if (staticPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // APIルートの認証チェック
  if (request.nextUrl.pathname.startsWith('/api')) {
    // 公開APIはスキップ
    if (publicApiPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // 認証チェック
    if (!isAuthenticated(request)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    return NextResponse.next();
  }

  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);
  const isAuthed = isAuthenticated(request);

  // ルートパスの処理
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(
      new URL(isAuthed ? '/mypage' : '/login', request.url)
    );
  }

  // 未認証かつ保護されたパスへのアクセス
  if (!isAuthed && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 認証済みでログインページにアクセス
  if (isAuthed && isPublicPath) {
    return NextResponse.redirect(new URL('/mypage', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};