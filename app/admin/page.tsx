import { createClient } from '@/utils/supabase/server';

export default async function AdminPage() {
  const supabase = createClient();

  // Obtener datos REALES de Supabase
  const [
    usersResponse,
    subscriptionsResponse,
    activeSubsResponse,
    pricesResponse
  ] = await Promise.all([
    // Total de usuarios
    supabase
      .from('users')
      .select('*', { count: 'exact', head: true }),
    
    // Todas las suscripciones para calcular ingresos
    supabase
      .from('subscriptions')
      .select('*'),
    
    // Solo suscripciones activas para el contador
    supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    
    // Precios para calcular ingresos
    supabase
      .from('prices')
      .select('id, unit_amount, currency')
  ]);

  // Calcular métricas REALES
  const totalUsers = usersResponse.count || 0;
  const activeSubscriptions = activeSubsResponse.count || 0;
  
  // Calcular ingresos mensuales REALES
  const monthlyRevenue = (subscriptionsResponse.data || []).reduce((total, sub) => {
    if (sub.status === 'active') {
      const price = pricesResponse.data?.find(p => p.id === sub.price_id);
      // Convertir de centavos a dólares
      return total + ((price?.unit_amount || 0) / 100);
    }
    return total;
  }, 0);

  // Obtener usuarios recientes para mostrar en la tabla
  const { data: recentUsers } = await supabase
    .from('users')
    .select('id, email, role, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  // Obtener suscripciones recientes
  const { data: recentSubscriptions } = await supabase
    .from('subscriptions')
    .select('id, status, price_id, created')
    .order('created', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard Administrativo</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Usuarios Registrados</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mr-4">
                <span className="text-xl">💳</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Suscripciones Activas</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{activeSubscriptions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mr-4">
                <span className="text-xl">💰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos Mensuales</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  ${monthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tablas de datos recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usuarios Recientes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Usuarios Recientes</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {recentUsers && recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-600 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white text-sm">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(user.created_at).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No hay usuarios registrados
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Suscripciones Recientes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Suscripciones Recientes</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {recentSubscriptions && recentSubscriptions.length > 0 ? (
                recentSubscriptions.map((subscription) => (
                  <div key={subscription.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-600 last:border-0">
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white text-sm">
                        ID: {subscription.id.substring(0, 8)}...
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(subscription.created).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      subscription.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : subscription.status === 'canceled'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {subscription.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No hay suscripciones
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}