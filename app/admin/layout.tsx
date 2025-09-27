import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  
  // Check authentication
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect('/signin');
  }

  // Check admin role
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
          <p className="text-sm text-gray-500 dark:text-gray-400">Admin Panel</p>
        </div>
        
        <nav className="flex-1 mt-4">
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Main</div>
          <a 
            href="/admin" 
            className="flex items-center px-4 py-3 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500"
          >
            <span className="w-5 h-5 mr-3">📊</span>
            Dashboard
          </a>
          
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Management</div>
          <a 
            href="/admin/users" 
            className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="w-5 h-5 mr-3">👥</span>
            Users
          </a>
          <a 
            href="/admin/subscriptions" 
            className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="w-5 h-5 mr-3">💳</span>
            Subscriptions
          </a>
          <a 
            href="/admin/payments" 
            className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="w-5 h-5 mr-3">💰</span>
            Payments
          </a>
          
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Settings</div>
          <a 
            href="/admin/settings" 
            className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="w-5 h-5 mr-3">⚙️</span>
            Settings
          </a>
        </nav>
        
        {/* Sign Out Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form action="/auth/signout" method="post">
            <button className="flex items-center w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              <span className="w-5 h-5 mr-3">🚪</span>
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 md:hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Admin Panel</h1>
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
              <span className="w-5 h-5">☰</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}