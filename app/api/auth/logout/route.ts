import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // セッションCookieの削除
  response.cookies.delete('auth');
  
  return response;
}