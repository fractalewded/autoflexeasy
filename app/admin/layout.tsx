import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin-login');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile as any).role !== 'admin') {
    redirect('/admin-login');
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Admin Mejorado */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">FlexEasy Admin</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Panel de Control</p>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <a href="/admin" className="flex items-center space-x-3 py-2 px-3 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span>📊</span>
              <span>Dashboard</span>
            </a>
            <a href="/admin/users" className="flex items-center space-x-3 py-2 px-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <span>👥</span>
              <span>Usuarios</span>
            </a>
            <a href="/admin/subscriptions" className="flex items-center space-x-3 py-2 px-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <span>💳</span>
              <span>Suscripciones</span>
            </a>
          </div>
        </nav>

        {/* Información del usuario */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                {user.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Administrador
              </p>
            </div>
          </div>
          <form action="/auth/signout" method="post">
            <button className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm">
              <span>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Panel Administrativo</h1>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}