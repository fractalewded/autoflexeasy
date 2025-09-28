'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, TrendingUp, AlertCircle, Square, Menu, X } from 'lucide-react';

interface StripeDashboardData {
  totalRevenue: number;
  activeSubscriptions: number;
  monthlyRecurring: number;
  totalCustomers: number;
  churnRate: number;
  pendingInvoices: number;
  users: Array<{
    id: string;
    name: string;
    email: string;
    created: string;
    status: string;
    subscription: string;
  }>;
  subscriptions: Array<{
    id: string;
    customer: {
      name: string;
      email: string;
    };
    status: string;
    amount: number;
    interval: string;
    created: string;
    current_period_end: string;
  }>;
  recentPayments: Array<{
    id: string;
    amount: number;
    status: string;
    customer: string;
    created: string;
  }>;
  recentSubscriptions: Array<{
    id: string;
    customer: {
      name: string;
      email: string;
    };
    status: string;
    amount: number;
    interval: string;
    created: string;
    current_period_end: string;
  }>;
}

export default function AdminPage() {
  const [stripeData, setStripeData] = useState<StripeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cargar datos de Stripe
  useEffect(() => {
    const fetchStripeData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stripe/dashboard');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Stripe data received:', data);
        
        setStripeData(data);
      } catch (err) {
        console.error('❌ Error loading Stripe data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStripeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Header Móvil Mejorado */}
      <div className="lg:hidden bg-card border-b border-border p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-accent"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">FlexEasy Admin</h1>
              <p className="text-sm text-muted-foreground">Panel de control</p>
            </div>
          </div>
          {error && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              Error
            </Badge>
          )}
        </div>
      </div>

      {/* Menú Móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-b border-border p-4 mb-6">
          <nav className="space-y-2">
            <a href="/admin" className="flex items-center space-x-3 py-2 px-3 text-blue-600 bg-blue-50 rounded-lg">
              <span>📊</span>
              <span>Dashboard</span>
            </a>
            <a href="/admin/users" className="flex items-center space-x-3 py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <span>👥</span>
              <span>Usuarios</span>
            </a>
            <a href="/admin/subscriptions" className="flex items-center space-x-3 py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <span>💳</span>
              <span>Suscripciones</span>
            </a>
          </nav>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
        {/* Header Desktop */}
        <div className="hidden lg:flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pt-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">FlexEasy Admin</h1>
            <p className="text-muted-foreground">Panel de control</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {error && (
              <Badge variant="destructive" className="text-sm">
                <AlertCircle className="w-3 h-3 mr-1" />
                Error API
              </Badge>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">admin@autoflexeasy.com</span>
              <span className="text-xs bg-primary/10 px-2 py-1 rounded text-primary">Administrador</span>
            </div>
          </div>
        </div>

        {/* Métricas Principales - Responsive */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="w-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Ingresos Totales</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground truncate">
                    ${stripeData?.totalRevenue?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                  <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Suscripciones Activas</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground truncate">
                    {stripeData?.activeSubscriptions || '0'}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                  <Users className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">MRR Mensual</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground truncate">
                    ${stripeData?.monthlyRecurring?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                  <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Clientes</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground truncate">
                    {stripeData?.totalCustomers || '0'}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                  <Users className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usuarios y Suscripciones - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Usuarios Registrados */}
          <Card className="w-full">
            <CardHeader className="px-4 sm:px-6 py-4">
              <CardTitle className="flex items-center text-foreground text-base sm:text-lg">
                <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Usuarios Registrados
                <Badge variant="secondary" className="ml-2 text-xs">
                  {stripeData?.users?.length || 0}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Clientes registrados en Stripe</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4">
              {stripeData?.users && stripeData.users.length > 0 ? (
                <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                  {stripeData.users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm text-foreground truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          <p className="text-xs text-muted-foreground">Reg: {user.created}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={user.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs flex-shrink-0 ml-2"
                      >
                        {user.subscription === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-muted-foreground">
                  <Users className="mx-auto h-6 w-6 sm:h-8 sm:w-8 mb-2" />
                  <p className="text-sm">No hay usuarios registrados</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Suscripciones Activas */}
          <Card className="w-full">
            <CardHeader className="px-4 sm:px-6 py-4">
              <CardTitle className="flex items-center text-foreground text-base sm:text-lg">
                <TrendingUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Suscripciones Activas
                <Badge variant="secondary" className="ml-2 text-xs">
                  {stripeData?.activeSubscriptions || 0}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Suscripciones activas en el sistema</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4">
              {stripeData?.subscriptions && stripeData.subscriptions.length > 0 ? (
                <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                  {stripeData.subscriptions.map((subscription) => (
                    <div key={subscription.id} className="p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm text-foreground truncate">{subscription.customer.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{subscription.customer.email}</p>
                        </div>
                        <Badge 
                          variant={subscription.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs flex-shrink-0 ml-2"
                        >
                          {subscription.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span className="truncate">${subscription.amount}/{subscription.interval}</span>
                        <span className="truncate ml-2">Vence: {subscription.current_period_end}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-muted-foreground">
                  <TrendingUp className="mx-auto h-6 w-6 sm:h-8 sm:w-8 mb-2" />
                  <p className="text-sm">No hay suscripciones activas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notificaciones del Sistema */}
        <Card className="w-full">
          <CardHeader className="px-4 sm:px-6 py-4">
            <CardTitle className="flex items-center text-foreground text-base sm:text-lg">
              <TrendingUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Resumen del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4">
            <div className="space-y-3">
              {error && (
                <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="bg-destructive/20 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-destructive text-sm">Error de API Stripe</p>
                    <p className="text-xs text-destructive/80 break-words">
                      {error}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="bg-primary/20 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm">Resumen de Stripe</p>
                  <p className="text-xs text-muted-foreground break-words">
                    {stripeData ? 
                      `${stripeData.totalCustomers} usuarios, ${stripeData.activeSubscriptions} suscripciones activas, $${stripeData.totalRevenue} ingresos totales` : 
                      'Conectando con Stripe...'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
