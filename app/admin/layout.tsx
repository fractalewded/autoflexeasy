import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  
  // Verificar autenticación
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect('/signin');
  }

  // Verificar rol de administrador
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || !['admin', 'manager'].includes(profile.role)) {
    redirect('/dashboard');
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">FlexEasy Admin</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Panel de Administración</p>
        </div>
        
        <nav className="flex-1 mt-4">
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Principal</div>
          <a 
            href="/admin" 
            className="flex items-center px-4 py-3 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500"
          >
            <span className="w-5 h-5 mr-3">📊</span>
            Dashboard
          </a>
          
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">