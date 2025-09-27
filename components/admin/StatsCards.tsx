'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface StatsData {
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  pendingPayments?: number;
}

interface StatsCardsProps {
  initialData?: StatsData;
}

export default function StatsCards({ initialData }: StatsCardsProps) {
  const [stats, setStats] = useState<StatsData>(initialData || {
    totalUsers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    pendingPayments: 0
  });
  const [loading, setLoading] = useState(!initialData);
  const supabase = createClient();

  useEffect(() => {
    if (initialData) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch users count
        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        // Fetch active subscriptions
        const { count: activeSubsCount } = await supabase
          .from('subscriptions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Fetch revenue data (you'll need to adjust this based on your Stripe setup)
        const { data: payments } = await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'completed')
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

        const monthlyRevenue = payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

        // Fetch pending payments
        const { count: pendingPaymentsCount } = await supabase
          .from('payments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        setStats({
          totalUsers: usersCount || 0,
          activeSubscriptions: activeSubsCount || 0,
          monthlyRevenue,
          pendingPayments: pendingPaymentsCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [initialData, supabase]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const statsConfig = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'blue',
      description: 'Registered users'
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: '💳',
      color: 'green',
      description: 'Active subscriptions'
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(stats.monthlyRevenue),
      icon: '💰',
      color: 'purple',
      description: 'Current month'
    },
    {
      title: 'Pending Payments',
      value: stats.pendingPayments || 0,
      icon: '⏳',
      color: 'yellow',
      description: 'Awaiting processing'
    }
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      icon: 'bg-blue-100 dark:bg-blue-800'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      icon: 'bg-green-100 dark:bg-green-800'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      icon: 'bg-purple-100 dark:bg-purple-800'
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400',
      icon: 'bg-yellow-100 dark:bg-yellow-800'
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-3 sm:mr-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-20 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-6 w-12 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {statsConfig.map((stat, index) => (
        <div 
          key={stat.title}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md"
        >
          <div className="flex items-center">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4 ${colorClasses[stat.color as keyof typeof colorClasses].icon}`}>
              <span className="text-lg sm:text-xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </p>
              <p className={`text-2xl sm:text-3xl font-bold ${colorClasses[stat.color as keyof typeof colorClasses].text}`}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}