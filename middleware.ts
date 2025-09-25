// mi// middleware.ts - CON DEBUG COMPLETO Y ESCRITURA A ARCHIVO
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import fs from 'fs';
import path from 'path';

// Función robusta para escribir en archivo
function writeToLog(message: string, data?: any) {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const logFile = path.join(logDir, 'middleware_debug.txt');
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}${data ? ' | ' + JSON.stringify(data, null, 2) : ''}\n`;
    
    fs.appendFileSync(logFile, logMessage, 'utf8');
    console.log(`[${timestamp}] ${message}`, data || '');
  } catch (error) {
    console.error('Error escribiendo en log:', error);
  }
}

export async function middleware(request: NextRequest) {
  writeToLog('🚀 [MIDDLEWARE] Iniciando middleware para ruta:', {
    ruta: request.nextUrl.pathname,
    metodo: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    origen: request.headers.get('origin'),
    ip: request.ip || request.headers.get('x-forwarded-for')
  });

  try {
    // 1. Debug de rutas públicas
    const publicPaths = ['/signin', '/signup', '/auth', '/forgot_password'];
    const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
    
    writeToLog('🔍 [MIDDLEWARE] Es ruta pública?:', {
      esPublica: isPublicPath,
      rutaSolicitada: request.nextUrl.pathname,
      rutasPublicasConfiguradas: publicPaths
    });

    if (isPublicPath) {
      writeToLog('✅ [MIDDLEWARE] Ruta pública, permitiendo acceso sin verificación');
      const response = NextResponse.next();
      writeToLog('📤 [MIDDLEWARE] Retornando respuesta para ruta pública', {
        status: response.status,
        headersCount: Array.from(response.headers).length
      });
      return response;
    }

    // 2. Debug de cookies antes de updateSession
    const cookies = request.cookies.getAll();
    writeToLog('🍪 [MIDDLEWARE] Cookies de request:', {
      totalCookies: cookies.length,
      cookies: cookies.map(cookie => ({
        name: cookie.name,
        tieneValor: !!cookie.value,
        esSupabase: cookie.name.includes('supabase') || cookie.name.includes('sb-'),
        tamañoValor: cookie.value?.length || 0
      }))
    });

    // 3. Debug de updateSession
    writeToLog('🔄 [MIDDLEWARE] Llamando a updateSession...');
    const startTime = Date.now();
    
    const response = await updateSession(request);
    
    const endTime = Date.now();
    writeToLog('✅ [MIDDLEWARE] updateSession completado', {
      tiempoEjecucion: `${endTime - startTime}ms`,
      status: response.status,
      urlRedireccion: response.headers.get('location')
    });
    
    // 4. Debug de headers de respuesta
    writeToLog('📨 [MIDDLEWARE] Headers de response:', {
      headers: Object.fromEntries(response.headers),
      tieneLocation: !!response.headers.get('location'),
      location: response.headers.get('location')
    });

    // 5. Verificar si hay redirección
    const locationHeader = response.headers.get('location');
    if (locationHeader) {
      writeToLog('🧭 [MIDDLEWARE] MIDDLEWARE ESTÁ REDIRIGIENDO', {
        desde: request.nextUrl.pathname,
        hacia: locationHeader
      });
    }

    writeToLog('🏁 [MIDDLEWARE] Middleware finalizado exitosamente');
    return response;

  } catch (error) {
    writeToLog('❌ [MIDDLEWARE] Error crítico:', {
      error: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : error
    });

    const errorResponse = NextResponse.next();
    errorResponse.headers.set('x-middleware-error', 'true');
    errorResponse.headers.set('x-middleware-error-time', new Date().toISOString());
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