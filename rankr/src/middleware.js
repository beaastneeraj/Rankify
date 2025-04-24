import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const protectedRoutes = [
  '/admin/add',
  '/parameters',
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get('authToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next();
  } catch (err) {
    console.error('JWT Error:', err);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/add', '/parameters'],
};
