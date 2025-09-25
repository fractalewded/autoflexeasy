'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { logger } from '@/utils/logger';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github, Chrome, Download, Trash2 } from 'lucide-react';

export default function SignIn() {
  const supabase = createClientComponentClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    logger.log('🔐 === INICIANDO PROCESO DE LOGIN ===');
    logger.log('📝 Formulario enviado', { isSubmitting: true });

    try {
      const fd = new FormData(e.currentTarget);
      const email = String(fd.get('email') || '').trim();
      const password = String(fd.get('password') || '');

      logger.log('📧 Email obtenido', { email: email ? '***' + email.slice(-10) : 'VACÍO' });
      logger.log('🔒 Longitud de password', { length: password.length });
      logger.log('🌐 URL actual', { url: window.location.href });

      logger.log('🔄 Llamando a supabase.auth.signInWithPassword');
      
      const startTime = Date.now();
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      const endTime = Date.now();
      
      logger.log('⏱️ Tiempo de respuesta Supabase', { tiempo: endTime - startTime + 'ms' });
      logger.log('📨 Respuesta de Supabase', { 
        error: error ? { message: error.message, status: error.status } : null,
        dataPresente: !!data 
      });
      
      if (error) {
        logger.log('❌ ERROR DE AUTENTICACIÓN', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        setErrorMsg(error.message || 'Credenciales inválidas.');
        return;
      }
      
      logger.log('✅ LOGIN EXITOSO');
      logger.log('👤 Datos de usuario', {
        id: data.user?.id,
        email: data.user?.email,
        sesionCreada: !!data.session,
        rol: data.user?.role
      });

      // Debug de almacenamiento
      logger.log('💾 Verificando localStorage');
      try {
        const supabaseToken = localStorage.getItem('supabase.auth.token');
        logger.log('🔐 Token en localStorage', { tokenPresente: !!supabaseToken });
      } catch (storageError) {
        logger.log('⚠️ Error accediendo localStorage', { error: storageError });
      }

      logger.log('🔄 Verificando sesión persistida');
      const { data: sessionCheck, error: sessionError } = await supabase.auth.getSession();
      logger.log('🔍 Sesión después de login', {
        error: sessionError,
        sesionPresente: !!sessionCheck.session
      });

      logger.log('⏳ Esperando 2 segundos para sincronización');
      await new Promise(resolve => setTimeout(resolve, 2000));

      logger.log('🧭 REDIRIGIENDO A /dashboard');
      logger.log('📍 URL destino', { destino: window.location.origin + '/dashboard' });
      
      window.location.href = '/dashboard';
      
      // Fallback después de 5 segundos
      setTimeout(() => {
        if (window.location.pathname === '/signin') {
          logger.log('⚠️ FALLBACK ACTIVADO: Redirección anterior falló');
          logger.log('🔀 Intentando con window.location.replace');
          window.location.replace('/dashboard');
        }
      }, 5000);
      
    } catch (err: any) {
      logger.log('💥 ERROR INESPERADO', {
        message: err.message,
        name: err.name
      });
      setErrorMsg(err?.message || 'Error inesperado.');
    } finally {
      logger.log('🏁 Finalizando proceso de login');
      setIsSubmitting(false);
    }
  };

  const handleDownloadLogs = () => {
    logger.downloadLogs();
  };

  const handleClearLogs = () => {
    logger.clearLogs();
    setErrorMsg('Logs limpiados correctamente');
    setTimeout(() => setErrorMsg(null), 3000);
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    logger.log('🔗 Iniciando OAuth', { provider });
    setErrorMsg(null);
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { 
          redirectTo: `${window.location.origin}/auth/callback` 
        },
      });
      if (error) {
        logger.log('❌ Error OAuth', { error: error.message });
        setErrorMsg(error.message);
      } else {
        logger.log('✅ OAuth iniciado correctamente');
      }
    } catch (err: any) {
      logger.log('💥 Error inesperado OAuth', { error: err.message });
      setErrorMsg(err?.message || 'Error inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="rounded-md p-2 transition-colors hover:bg-muted" prefetch={false}>
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Link>
        
        {/* Botones de debug */}
        <div className="flex gap-2">
          <button
            onClick={handleDownloadLogs}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            title="Descargar logs de debug"
          >
            <Download className="h-4 w-4" />
            Descargar Logs
          </button>
          <button
            onClick={handleClearLogs}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
            title="Limpiar logs"
          >
            <Trash2 className="h-4 w-4" />
            Limpiar
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center flex-1">
        <Card className="w-full max-w-md">
          <CardContent className="grid gap-4 px-4 pb-4 my-10">
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-bold">Sign In</h2>
              <p className="text-muted-foreground my-2">
                Enter your email and password to access your account.
              </p>
            </div>

            {errorMsg && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                {errorMsg}
              </p>
            )}

            <form noValidate className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="********"
                  autoComplete="current-password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" loading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="flex justify-center">
              <Link href="/signup" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                Don&apos;t have an account? Sign up
              </Link>
            </div>

            <div className="flex justify-center">
              <Link href="/forgot_password" className="text-sm font-bold hover:underline underline-offset-4" prefetch={false}>
                Forgot your password?
              </Link>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-2">
              <button
                onClick={() => handleOAuth('github')}
                className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm w-full disabled:opacity-50"
                disabled={isSubmitting}
              >
                <Github className="mr-2 h-4 w-4" />
                Sign in with GitHub
              </button>
              <button
                onClick={() => handleOAuth('google')}
                className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm w-full disabled:opacity-50"
                disabled={isSubmitting}
              >
                <Chrome className="mr-2 h-4 w-4" />
                Sign in with Google
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ArrowLeftIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}