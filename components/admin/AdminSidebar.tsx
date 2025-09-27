'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  };

  const menuItems = [
    {
      href: '/admin',
      icon: '📊',
      label: 'Dashboard',
      description: 'Overview and analytics'
    },
    {
      href: '/admin/users',
      icon: '👥',
      label: 'Users',
      description: 'Manage user accounts'
    },
    {
      href: '/admin/subscriptions',
      icon: '💳',
      label: 'Subscriptions',
      description: 'Subscription management'
    },
    {
      href: '/admin/payments',
      icon: '💰',
      label: 'Payments',
      description: 'Payment history and tracking'
    },
    {
      href: '/admin/services',
      icon: '⚙️',
      label: 'Services',
      description: 'Service configuration'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 hidden md:flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">FlexEasy Admin</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Admin Panel</p>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 mt-4">
        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Main</div>
        
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 transition-colors group ${
                active 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="w-5 h-5 mr-3 text-lg">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{item.label}</div>
                <div className={`text-xs mt-0.5 ${
                  active 
                    ? 'text-blue-500 dark:text-blue-300' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
        >
          <span className="w-5 h-5 mr-3">🚪</span>
          Sign Out
        </button>
        
        {/* Version Info */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
          <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Admin Panel v1.0
          </div>
        </div>
      </div>
    </aside>
  );
}