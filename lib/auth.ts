import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
const COOKIE = 'auth_token';
const key = () => new TextEncoder().encode(process.env.AUTH_SECRET || 'development-only-secret-change-in-production-12345');
export type Session = { id: string; username: string; role: string };
export async function createToken(user: Session) { return new SignJWT(user).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(key()); }
export async function getSession(): Promise<Session | null> { const token = cookies().get(COOKIE)?.value; if (!token) return null; try { return (await jwtVerify(token, key())).payload as unknown as Session; } catch { return null; } }
export function setSession(response: NextResponse, token: string) { response.cookies.set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 }); }
export function clearSession(response: NextResponse) { response.cookies.set(COOKIE, '', { path: '/', maxAge: 0 }); }
