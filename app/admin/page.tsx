export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default async function AdminPage() {
  const supabase = createClient();
  
  // Authentication check
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/signin');
  }

  // Admin role verification
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || !['admin', 'manager'].includes(profile.role)) {
    redirect('/dashboard');
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, {user.email}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {profile.role}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last login: {new Date().toLocaleDateString('en-US')}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <AdminDashboard />
      </div>
    </div>
  );
}