import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the user is trying to access the login page
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next();
  }

  // Check if the user is trying to access the root page
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // For all other routes, let them through (authentication will be handled by the client-side context)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};