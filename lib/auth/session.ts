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