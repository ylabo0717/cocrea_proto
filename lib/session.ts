import { cookies } from 'next/headers';
import { AuthUser } from './auth';
import { ResponseCookies } from 'next/dist/server/web/spec-extension/cookies';

export function setSessionCookie(cookies: ResponseCookies, user: AuthUser) {
  const session = {
    userId: user.id,
    email: user.email,
    role: user.role,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24時間
  };

  cookies.set('auth', JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 // 24時間（秒単位）
  });
}

export function clearSessionCookie(cookies: ResponseCookies) {
  cookies.delete('auth');
}

export function getSession(): { userId: string; email: string; role: string } | null {
  const sessionCookie = cookies().get('auth');
  if (!sessionCookie) return null;

  try {
    const session = JSON.parse(sessionCookie.value);
    if (session.expiresAt < Date.now()) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}