'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Hacer login con Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('Credenciales inválidas');
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Error de autenticación');
        setLoading(false);
        return;
      }

      // 2. Verificar si es administrador
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile || (profile as any).role !== 'admin') {
        // Cerrar sesión si no es admin
        await supabase.auth.signOut();
        setError('Acceso denegado. Solo administradores pueden ingresar.');
        setLoading(false);
        return;
      }

      // 3. Redirigir al panel admin
      router.push('/admin');
      router.refresh();

    } catch (err) {
      setError('Error interno del sistema');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Acceso Administrativo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Panel de control FlexEasy
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleAdminLogin}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Ingresar como Administrador'}
            </button>
          </div>

          <div className="text-center">
            <Link 
              href="/signin" 
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              ¿Eres usuario regular? Accede aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}