import { NextRequest } from 'next/server';
import { Session } from './session';

export function getSessionFromRequest(request: NextRequest): Session | null {
  const authCookie = request.cookies.get('auth');
  if (!authCookie) return null;

  try {
    const session = JSON.parse(authCookie.value) as Session;
    return session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}

export function isAuthenticated(request: NextRequest): boolean {
  return getSessionFromRequest(request) !== null;
}