// degustator-web-frontend/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  
  console.log('Middleware check:', { pathname, hasToken: !!token });
  
  // ✅ Защита от бесконечного цикла
  if (pathname === '/auth' && !token) {
    // Уже на странице авторизации - не редиректим
    return NextResponse.next();
  }
  
  if (pathname !== '/auth' && !token) {
    console.log('Redirect to /auth from:', pathname);
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  if (pathname === '/auth' && token) {
    console.log('Redirect to / from:', pathname);
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};