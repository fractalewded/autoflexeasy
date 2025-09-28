'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, TrendingUp, AlertCircle, Square } from 'lucide-react';

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

  // Cargar datos de Stripe
  useEffect(() => {
    const fetchStripeData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Making request to /api/stripe/dashboard');
        const response = await fetch('/api/stripe/dashboard');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Stripe data received:', data);
        console.log('👥 Users count:', data.users?.length);
        console.log('📊 Sample user:', data.users?.[0]);
        
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

  // Función para cerrar sesión
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      sessionStorage.removeItem('auth-token');
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">FlexEasy Admin - Panel de Control</h1>
            <p className="text-muted-foreground">Panel administrativo con datos de Stripe</p>
          </div>
          <div className="flex items-center gap-4">
            {error && (
              <Badge variant="destructive" className="text-sm">
                <AlertCircle className="w-3 h-3 mr-1" />
                Error API
              </Badge>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>admin@autoflexeasy.com</span>
              <span className="text-xs bg-primary/10 px-2 py-1 rounded">Administrador</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Métricas de Stripe */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
                  <p className="text-2xl font-bold">
                    ${stripeData?.totalRevenue?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Suscripciones Activas</p>
                  <p className="text-2xl font-bold">
                    {stripeData?.activeSubscriptions || '0'}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">MRR Mensual</p>
                  <p className="text-2xl font-bold">
                    ${stripeData?.monthlyRecurring?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Clientes</p>
                  <p className="text-2xl font-bold">
                    {stripeData?.totalCustomers || '0'}
                  </p>
                </div>
                <div className="p-2 bg-orange-100 rounded-full">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usuarios y Suscripciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de Usuarios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Usuarios Registrados
                <Badge variant="secondary" className="ml-2">
                  {stripeData?.users?.length || 0}
                </Badge>
              </CardTitle>
              <CardDescription>Clientes registrados en Stripe</CardDescription>
            </CardHeader>
            <CardContent>
              {stripeData?.users && stripeData.users.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {stripeData.users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">Registrado: {user.created}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={user.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {user.subscription === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="mx-auto h-8 w-8 mb-2" />
                  <p>No hay usuarios registrados</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de Suscripciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Suscripciones Activas
                <Badge variant="secondary" className="ml-2">
                  {stripeData?.activeSubscriptions || 0}
                </Badge>
              </CardTitle>
              <CardDescription>Suscripciones activas en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {stripeData?.subscriptions && stripeData.subscriptions.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {stripeData.subscriptions.map((subscription) => (
                    <div key={subscription.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{subscription.customer.name}</p>
                          <p className="text-xs text-muted-foreground">{subscription.customer.email}</p>
                        </div>
                        <Badge 
                          variant={subscription.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {subscription.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>${subscription.amount}/{subscription.interval}</span>
                        <span>Vence: {subscription.current_period_end}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="mx-auto h-8 w-8 mb-2" />
                  <p>No hay suscripciones activas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notificaciones del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Resumen del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {error && (
                <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="bg-destructive/20 p-2 rounded-full">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium text-destructive">Error de API Stripe</p>
                    <p className="text-sm text-destructive/80">
                      {error}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="bg-primary/20 p-2 rounded-full">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Resumen de Stripe</p>
                  <p className="text-sm text-muted-foreground">
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
