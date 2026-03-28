import { NextResponse } from 'next/server';

// Protected routes that require login
const PROTECTED_PATHS = ['/', '/attendance', '/leave'];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('hrms_session');

  const isProtected = PROTECTED_PATHS.some(p =>
    pathname === p || pathname.startsWith(p + '/')
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
