import { NextResponse } from 'next/server';
import { clearSession } from '../../../../lib/auth';

/** 清除登录态后返回登录页，避免用户停留在 API JSON 响应页面。 */
export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/login', request.url), 303);
  clearSession(response);
  return response;
}
