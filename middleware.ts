// middleware.ts - CON DEBUG COMPLETO
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  console.log('🚀 [MIDDLEWARE] Iniciando middleware para ruta:', request.nextUrl.pathname);
  console.log('📋 [MIDDLEWARE] Método:', request.method);
  console.log('🌐 [MIDDLEWARE] URL completa:', request.url);

  try {
    // 1. Debug de rutas públicas
    const publicPaths = ['/signin', '/signup', '/auth', '/forgot_password'];
    const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
    
    console.log('🔍 [MIDDLEWARE] Es ruta pública?:', isPublicPath);
    console.log('📊 [MIDDLEWARE] Rutas públicas configuradas:', publicPaths);

    if (isPublicPath) {
      console.log('✅ [MIDDLEWARE] Ruta pública, permitiendo acceso sin verificación');
      const response = NextResponse.next();
      console.log('📤 [MIDDLEWARE] Retornando respuesta para ruta pública');
      return response;
    }

    // 2. Debug de updateSession
    console.log('🔄 [MIDDLEWARE] Llamando a updateSession...');
    const response = await updateSession(request);
    console.log('✅ [MIDDLEWARE] updateSession completado');
    
    // 3. Debug de headers y cookies
    console.log('🍪 [MIDDLEWARE] Cookies de request:', request.cookies.getAll());
    console.log('📨 [MIDDLEWARE] Headers de response:', Object.fromEntries(response.headers));
    
    return response;

  } catch (error) {
    console.error('❌ [MIDDLEWARE] Error crítico:', error);
    // En caso de error, permitir el acceso para no bloquear la app
    const errorResponse = NextResponse.next();
    errorResponse.headers.set('x-middleware-error', 'true');
    return errorResponse;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/signin',
    '/signup'
  ]
};