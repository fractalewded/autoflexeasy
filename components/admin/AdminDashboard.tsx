'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import StatsCards from './StatsCards';
import UsersTable from './UsersTable';
import SubscriptionsTable from './SubscriptionsTable';

interface DashboardData {
  stats: {
    totalUsers: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    pendingPayments: number;
  };
  users: any[];
  subscriptions: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const supabase = createClient();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel for better performance
      const [
        usersResponse,
        subscriptionsResponse,
        paymentsResponse,
        activeSubsResponse
      ] = await Promise.all([
        supabase
          .from('users')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(50),
        
        supabase
          .from('subscriptions')
          .select('*')
          .order('created', { ascending: false })
          .limit(25),
        
        supabase
          .from('payments')
          .select('amount, status, created_at')
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        
        supabase
          .from('subscriptions')
          .select('*', { count: 'exact' })
          .eq('status', 'active')
      ]);

      // Handle errors
      if (usersResponse.error) throw new Error(usersResponse.error.message);
      if (subscriptionsResponse.error) throw new Error(subscriptionsResponse.error.message);

      // Calculate monthly revenue
      const monthlyRevenue = paymentsResponse.data?.reduce((sum, payment) => {
        return payment.status === 'completed' ? sum + (payment.amount || 0) : sum;
      }, 0) || 0;

      // Enrich subscription data with user emails
      const enrichedSubscriptions = await Promise.all(
        (subscriptionsResponse.data || []).map(async (sub) => {
          const { data: userData } = await supabase
            .from('users')
            .select('email')
            .eq('id', sub.user_id)
            .single();

          return {
            ...sub,
            user_email: userData?.email || 'Unknown'
          };
        })
      );

      // Enrich user data with additional details
      const enrichedUsers = await Promise.all(
        (usersResponse.data || []).map(async (user) => {
          const { data: subscriptionData } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('user_id', user.id)
            .order('created', { ascending: false })
            .limit(1)
            .single();

          return {
            ...user,
            has_active_subscription: subscriptionData?.status === 'active'
          };
        })
      );

      const dashboardData: DashboardData = {
        stats: {
          totalUsers: usersResponse.count || 0,
          activeSubscriptions: activeSubsResponse.count || 0,
          monthlyRevenue: monthlyRevenue / 100, // Convert cents to dollars
          pendingPayments: paymentsResponse.data?.filter(p => p.status === 'pending').length || 0
        },
        users: enrichedUsers,
        subscriptions: enrichedSubscriptions
      };

      setData(dashboardData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Set up real-time subscriptions for updates
    const usersSubscription = supabase
      .channel('users-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    const subscriptionsSubscription = supabase
      .channel('subscriptions-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'subscriptions' },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      usersSubscription.unsubscribe();
      subscriptionsSubscription.unsubscribe();
    };
  }, [supabase]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading && !data) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tables Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="space-y-1">
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="space-y-1">
                    <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Error Loading Dashboard
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
          {error}
        </p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString('en-US')}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          <span>🔄</span>
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      {data && <StatsCards initialData={data.stats} />}

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data && <UsersTable initialUsers={data.users} />}
        {data && <SubscriptionsTable initialSubscriptions={data.subscriptions} />}
      </div>

      {/* Real-time Indicator */}
      <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Real-time updates active</span>
        </div>
      </div>
    </div>
  );
}