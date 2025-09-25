// middleware.ts - VERSIÓN OPTIMIZADA
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  console.log('🚀 [MIDDLEWARE] Ruta:', request.nextUrl.pathname);

  try {
    // 1. Rutas públicas - acceso inmediato
    const publicPaths = ['/signin', '/signup', '/auth', '/forgot_password'];
    const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
    
    if (isPublicPath) {
      console.log('✅ [MIDDLEWARE] Ruta pública - acceso directo');
      return NextResponse.next();
    }

    // 2. Para rutas protegidas, verificar sesión rápidamente
    console.log('🔄 [MIDDLEWARE] Verificando sesión...');
    
    // Timeout para evitar bloqueos
    const timeoutPromise = new Promise<NextResponse>((_, reject) => {
      setTimeout(() => reject(new Error('Middleware timeout')), 10000); // 10 segundos max
    });

    const sessionPromise = updateSession(request);
    
    const response = await Promise.race([sessionPromise, timeoutPromise]);
    
    console.log('✅ [MIDDLEWARE] Verificación completada');
    return response;

  } catch (error) {
    console.error('❌ [MIDDLEWARE] Error:', error);
    
    // En caso de error o timeout, permitir acceso
    const errorResponse = NextResponse.next();
    errorResponse.headers.set('x-middleware-error', 'true');
    return errorResponse;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*'
  ]
};