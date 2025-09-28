import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  
  // Verificación simple de admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin-login'); // Redirige al login admin específico
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile as any).role !== 'admin') {
    redirect('/admin-login'); // Vuelve al login admin si no es admin
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">FlexEasy Admin</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Panel de Control</p>
        </div>
        
        <nav className="p-4">
          <a href="/admin" className="block py-2 text-blue-600 dark:text-blue-400">Dashboard</a>
          <a href="/admin/users" className="block py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900">Usuarios</a>
          <a href="/admin/subscriptions" className="block py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900">Suscripciones</a>
        </nav>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Panel Administrativo</h1>
            <form action="/auth/signout" method="post">
              <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900">
                Cerrar Sesión
              </button>
            </form>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}