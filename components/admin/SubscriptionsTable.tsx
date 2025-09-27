'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  price_id: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created: string;
  user_email?: string;
  plan_name?: string;
  amount?: number;
}

interface SubscriptionsTableProps {
  initialSubscriptions?: Subscription[];
}

export default function SubscriptionsTable({ initialSubscriptions }: SubscriptionsTableProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions || []);
  const [loading, setLoading] = useState(!initialSubscriptions);
  const [statusFilter, setStatusFilter] = useState('all');
  const supabase = createClient();

  useEffect(() => {
    if (initialSubscriptions) return;

    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        
        // Fetch subscriptions
        const { data: subscriptionsData, error } = await supabase
          .from('subscriptions')
          .select('*')
          .order('created', { ascending: false })
          .limit(50);

        if (error) throw error;

        // Fetch user emails and enrich subscription data
        const enrichedSubscriptions = await Promise.all(
          (subscriptionsData || []).map(async (sub) => {
            const { data: userData } = await supabase
              .from('users')
              .select('email')
              .eq('id', sub.user_id)
              .single();

            // Fetch plan details (you might need to adjust this based on your prices table)
            const { data: priceData } = await supabase
              .from('prices')
              .select('product_id, unit_amount, currency')
              .eq('id', sub.price_id)
              .single();

            return {
              ...sub,
              user_email: userData?.email || 'Unknown',
              plan_name: priceData?.product_id || 'Unknown Plan',
              amount: priceData?.unit_amount ? priceData.unit_amount / 100 : 0
            };
          })
        );

        setSubscriptions(enrichedSubscriptions);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [initialSubscriptions, supabase]);

  const filteredSubscriptions = subscriptions.filter(sub => {
    return statusFilter === 'all' || sub.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case 'canceled':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      case 'past_due':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      case 'incomplete':
        return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200`;
      case 'trialing':
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  const getCancelationBadge = (cancelAtPeriodEnd: boolean) => {
    if (cancelAtPeriodEnd) {
      return "px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    }
    return "";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const daysDiff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7 && daysDiff > 0;
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 animate-pulse">
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
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Subscriptions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {filteredSubscriptions.length} of {subscriptions.length} subscriptions
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="canceled">Canceled</option>
              <option value="past_due">Past Due</option>
              <option value="trialing">Trialing</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">Customer</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">Plan</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">Renews</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No subscriptions found
                </td>
              </tr>
            ) : (
              filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="border-b border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white text-sm">
                        {subscription.user_email}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ID: {subscription.id.substring(0, 8)}...
                      </div>
                      {subscription.cancel_at_period_end && (
                        <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                          Cancels at period end
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-800 dark:text-white">
                      {subscription.plan_name}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className={getStatusBadge(subscription.status)}>
                        {subscription.status}
                      </span>
                      {subscription.cancel_at_period_end && (
                        <span className={getCancelationBadge(subscription.cancel_at_period_end)}>
                          Ending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-gray-800 dark:text-white">
                      {subscription.amount ? formatCurrency(subscription.amount) : 'N/A'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className={
                        isExpired(subscription.current_period_end) 
                          ? 'text-red-600 dark:text-red-400'
                          : isExpiringSoon(subscription.current_period_end)
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }>
                        {formatDate(subscription.current_period_end)}
                      </div>
                      {isExpiringSoon(subscription.current_period_end) && !isExpired(subscription.current_period_end) && (
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                          Expiring soon
                        </div>
                      )}
                      {isExpired(subscription.current_period_end) && (
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Expired
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {filteredSubscriptions.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Showing {filteredSubscriptions.length} subscriptions</span>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              View all subscriptions →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}