"use client";

export function getAuthCookie() {
  if (typeof window === 'undefined') return null;
  
  try {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('auth='))
      ?.split('=')[1];
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  const authCookie = getAuthCookie();
  if (!authCookie) return false;

  try {
    const session = JSON.parse(decodeURIComponent(authCookie));
    return session && session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export function clearAuthCookie() {
  document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}