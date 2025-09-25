// middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

// Función para enviar logs a una API
async function sendLogToAPI(message: string, data?: any) {
  try {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      message,
      data: data || null,
      path: process.env.NODE_ENV,
      type: 'middleware'
    };

    // Enviar a una API route que guarde en base de datos o retorne los logs
    await fetch('/api/debug-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData),
    });
  } catch (error) {
    console.error('Error enviando log a API:', error);
  }
}

export async function middleware(request: NextRequest) {
  const logData = {
    ruta: request.nextUrl.pathname,
    metodo: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent')?.slice(0, 100),
    ip: request.ip || request.headers.get('x-forwarded-for')
  };

  console.log('🚀 [MIDDLEWARE] Iniciando:', logData);
  await sendLogToAPI('🚀 [MIDDLEWARE] Iniciando', logData);

  try {
    const publicPaths = ['/signin', '/signup', '/auth', '/forgot_password'];
    const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
    
    console.log('🔍 [MIDDLEWARE] Es ruta pública?:', isPublicPath);
    await sendLogToAPI('🔍 [MIDDLEWARE] Es ruta pública?', { isPublicPath, ruta: request.nextUrl.pathname });

    if (isPublicPath) {
      console.log('✅ [MIDDLEWARE] Ruta pública, permitiendo acceso');
      const response = NextResponse.next();
      return response;
    }

    console.log('🔄 [MIDDLEWARE] Llamando a updateSession...');
    const response = await updateSession(request);
    console.log('✅ [MIDDLEWARE] updateSession completado');
    
    console.log('📨 [MIDDLEWARE] Headers de response:', Object.fromEntries(response.headers));
    await sendLogToAPI('📨 [MIDDLEWARE] Headers de response', {
      headers: Object.fromEntries(response.headers),
      location: response.headers.get('location')
    });
    
    return response;

  } catch (error) {
    console.error('❌ [MIDDLEWARE] Error crítico:', error);
    await sendLogToAPI('❌ [MIDDLEWARE] Error crítico', { error: error instanceof Error ? error.message : error });
    
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