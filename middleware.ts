// middleware.ts - CON ESPERAS DE 4 SEGUNDOS
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

// Función con espera para ver mensajes en consola
function logWithDelay(message: string, data?: any, delay = 4000) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`[${new Date().toISOString()}] ${message}`, data || '');
      resolve(null);
    }, delay);
  });
}

export async function middleware(request: NextRequest) {
  await logWithDelay('🚀 [MIDDLEWARE] INICIANDO MIDDLEWARE', {
    ruta: request.nextUrl.pathname,
    metodo: request.method,
    url: request.url
  });

  try {
    // 1. Debug de rutas públicas
    const publicPaths = ['/signin', '/signup', '/auth', '/forgot_password'];
    const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
    
    await logWithDelay('🔍 [MIDDLEWARE] ANALIZANDO RUTA', {
      esRutaPublica: isPublicPath,
      rutaSolicitada: request.nextUrl.pathname,
      rutasPublicas: publicPaths
    });

    if (isPublicPath) {
      await logWithDelay('✅ [MIDDLEWARE] RUTA PÚBLICA - ACCESO PERMITIDO');
      const response = NextResponse.next();
      await logWithDelay('📤 [MIDDLEWARE] RETORNANDO RESPUESTA');
      return response;
    }

    // 2. Debug de cookies
    const cookies = request.cookies.getAll();
    await logWithDelay('🍪 [MIDDLEWARE] COOKIES DE REQUEST', {
      totalCookies: cookies.length,
      cookiesSupabase: cookies.filter(c => c.name.includes('supabase') || c.name.includes('sb-')).map(c => c.name)
    });

    // 3. Llamar a updateSession
    await logWithDelay('🔄 [MIDDLEWARE] LLAMANDO A updateSession...');
    const response = await updateSession(request);
    await logWithDelay('✅ [MIDDLEWARE] updateSession COMPLETADO');

    // 4. Debug de respuesta
    await logWithDelay('📨 [MIDDLEWARE] HEADERS DE RESPUESTA', {
      location: response.headers.get('location'),
      status: response.status,
      tieneRedireccion: !!response.headers.get('location')
    });

    await logWithDelay('🏁 [MIDDLEWARE] FINALIZADO EXITOSAMENTE');
    return response;

  } catch (error) {
    await logWithDelay('❌ [MIDDLEWARE] ERROR CRÍTICO', {
      error: error instanceof Error ? error.message : error
    });
    
    const errorResponse = NextResponse.next();
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