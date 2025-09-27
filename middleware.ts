// middleware.ts - VERSIÓN OPTIMIZADA
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  console.log('🚀 [MIDDLEWARE] Ruta:', request.nextUrl.pathname);

  // ✅ VERIFICAR SI VIENE DEL LOGIN EXITOSO
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/admin')) {
    
    // 1. Verificar parámetros de autenticación exitosa
    const url = new URL(request.url);
    const authSuccess = url.searchParams.get('auth') === 'success';
    const fromLogin = url.searchParams.get('from') === 'login';
    
    // 2. Verificar referer (página anterior)
    const referer = request.headers.get('referer');
    const comesFromSignin = referer && referer.includes('/signin');
    
    // 3. Verificar headers personalizados del login
    const loginHeader = request.headers.get('x-from-login');
    
    if (authSuccess || fromLogin || comesFromSignin || loginHeader === 'true') {
      console.log('✅ [MIDDLEWARE] Viene del login - BYPASS activado');
      console.log('📋 Parámetros:', { authSuccess, fromLogin, comesFromSignin, loginHeader });
      
      // Crear respuesta y agregar header para el dashboard
      const response = NextResponse.next();
      response.headers.set('x-auth-bypass', 'true');
      return response;
    }
    
    console.log('🔒 [MIDDLEWARE] Acceso normal - verificando sesión');
  }

  // Para rutas públicas
  const publicPaths = ['/signin', '/signup', '/auth', '/forgot_password'];
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
  
  if (isPublicPath) {
    console.log('✅ [MIDDLEWARE] Ruta pública - acceso directo');
    return NextResponse.next();
  }

  // Verificación normal de sesión para otras rutas
  try {
    console.log('🔄 [MIDDLEWARE] Verificando sesión...');
    const response = await updateSession(request);
    console.log('✅ [MIDDLEWARE] Verificación completada');
    return response;
  } catch (error) {
    console.error('❌ [MIDDLEWARE] Error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*'
  ]
};