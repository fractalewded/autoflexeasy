'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github, Chrome } from 'lucide-react';

export default function SignIn() {
  const supabase = createClientComponentClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const form = e.target as HTMLFormElement;
      const fd = new FormData(form);
      const email = String(fd.get('email') || '').trim();
      const password = String(fd.get('password') || '');

      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        setErrorMsg(error.message || 'Credenciales inválidas.');
        setIsSubmitting(false);
        return;
      }
      
      console.log('✅ Login exitoso - Credenciales válidas');
      
      if (data.session) {
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: Date.now() + (data.session.expires_in * 1000)
        }));
        console.log('🔐 Token guardado manualmente');
      }
      
      setTimeout(() => {
        console.log('🚀 Redirigiendo al dashboard - Acceso concedido');
        window.location.href = '/dashboard?auth=success&t=' + Date.now();
      }, 500);
      
    } catch (err: any) {
      console.error('Error:', err);
      setErrorMsg('Error inesperado.');
      setIsSubmitting(false);
    }
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
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
        setErrorMsg(error.message);
      }
    } catch (err: any) {
      setErrorMsg('Error inesperado.');
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
        <div />
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
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24"
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}