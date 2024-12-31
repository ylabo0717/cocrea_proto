"use client";

export interface Session {
  userId: string;
  email: string;
  role: string;
  expiresAt: number;
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;

  try {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth='))
      ?.split('=')[1];

    if (!cookie) return null;

    const session = JSON.parse(decodeURIComponent(cookie)) as Session;
    return session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session) {
  const value = JSON.stringify(session);
  document.cookie = `auth=${encodeURIComponent(value)}; path=/; max-age=${24 * 60 * 60}; samesite=lax`;
}

export function clearSession() {
  document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
}