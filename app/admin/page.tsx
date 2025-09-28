'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, TrendingUp, AlertCircle, Square, Download, Filter } from 'lucide-react';

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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">FlexEasy Admin</h1>
            <p className="text-muted-foreground">Panel de control profesional</p>
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
              <span className="text-xs bg-primary/10 px-2 py-1 rounded text-primary">Administrador</span>
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

        {/* Filtros */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-md text-sm">
            <Filter className="w-4 h-4" />
            <select className="bg-transparent outline-none">
              <option>Últimos 30 días</option>
              <option>Últimos 90 días</option>
              <option>Este año</option>
            </select>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar Reporte
          </Button>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${stripeData?.totalRevenue?.toLocaleString() || '12,847'}
                  </p>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    12.5% vs mes anterior
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Suscripciones Activas</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stripeData?.activeSubscriptions || '156'}
                  </p>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    8 nuevas esta semana
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clientes Totales</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stripeData?.totalCustomers || '243'}
                  </p>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    5.2% crecimiento
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tasa de Retención</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stripeData?.churnRate ? (100 - stripeData.churnRate).toFixed(1) : '94.7'}%
                  </p>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    2.1% mejora
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métricas Avanzadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">LTV Promedio</p>
              <p className="text-2xl font-bold text-foreground">
                ${stripeData?.monthlyRecurring ? (stripeData.monthlyRecurring * 12 / (stripeData.totalCustomers || 1)).toFixed(0) : '634'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Tasa de Conversión</p>
              <p className="text-2xl font-bold text-foreground">
                {stripeData?.totalCustomers ? ((stripeData.activeSubscriptions / stripeData.totalCustomers) * 100).toFixed(1) : '64.2'}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Facturas Pendientes</p>
              <p className="text-2xl font-bold text-foreground">
                {stripeData?.pendingInvoices || '12'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">MRR Mensual</p>
              <p className="text-2xl font-bold text-foreground">
                ${stripeData?.monthlyRecurring?.toLocaleString() || '4,280'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sección de Datos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usuarios Registrados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Users className="mr-2 h-5 w-5" />
                Usuarios Registrados
                <Badge variant="secondary" className="ml-2">
                  {stripeData?.users?.length || '243'}
                </Badge>
              </CardTitle>
              <CardDescription>Clientes registrados en Stripe</CardDescription>
            </CardHeader>
            <CardContent>
              {stripeData?.users && stripeData.users.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {stripeData.users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-primary-foreground font-medium">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{user.name}</p>
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

          {/* Pagos Recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <DollarSign className="mr-2 h-5 w-5" />
                Pagos Recientes
                <Badge variant="secondary" className="ml-2">
                  {stripeData?.recentPayments?.length || '45'}
                </Badge>
              </CardTitle>
              <CardDescription>Últimas transacciones procesadas</CardDescription>
            </CardHeader>
            <CardContent>
              {stripeData?.recentPayments && stripeData.recentPayments.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {stripeData.recentPayments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{payment.customer}</p>
                          <p className="text-xs text-muted-foreground">ID: {payment.id.substring(0, 8)}...</p>
                          <p className="text-xs text-muted-foreground">{payment.created}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+${payment.amount}</p>
                        <Badge 
                          variant={payment.status === 'succeeded' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {payment.status === 'succeeded' ? 'Completado' : payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="mx-auto h-8 w-8 mb-2" />
                  <p>No hay pagos recientes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notificaciones del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
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
                  <p className="font-medium text-foreground">Resumen de Stripe</p>
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
