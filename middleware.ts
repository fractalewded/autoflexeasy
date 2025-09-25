import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  // ✅ PERMITIR acceso libre a rutas de autenticación
  const publicPaths = ['/auth', '/signin', '/signup', '/forgot_password'];
  if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // ✅ Solo aplicar protección a rutas que realmente lo necesitan
  const response = await updateSession(request);
  response.headers.set('x-current-path', request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: [
    // ✅ Matcher más específico
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};