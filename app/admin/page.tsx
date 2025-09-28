'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  Square,
  Menu,
  X,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';

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
}

export default function AdminPage() {
  const [stripeData, setStripeData] = useState<StripeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar para móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-card border-r border-border overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-foreground">FlexEasy Admin</h1>
                <p className="text-xs text-muted-foreground">Panel de Control</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="p-2 space-y-1">
              <a
                href="/admin"
                className="flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground"
              >
                <span>📊</span>
                Dashboard
              </a>
              <a
                href="/admin/users"
                className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <span>👥</span>
                Usuarios
              </a>
              <a
                href="/admin/subscriptions"
                className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <span>💳</span>
                Suscripciones
              </a>
            </nav>
          </div>
        </div>
      )}

      {/* Sidebar para desktop */}
      <div className="hidden lg:block w-64 bg-card border-r border-border">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">FlexEasy Admin</h1>
          <p className="text-sm text-muted-foreground">Panel de Control</p>
        </div>
        <nav className="p-4 space-y-2">
          <a
            href="/admin"
            className="flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground"
          >
            <span>📊</span>
            Dashboard
          </a>
          <a
            href="/admin/users"
            className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <span>👥</span>
            Usuarios
          </a>
          <a
            href="/admin/subscriptions"
            className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <span>💳</span>
            Suscripciones
          </a>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header responsive */}
        <header className="bg-card border-b border-border p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden h-8 w-8 p-0"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl lg:text-3xl font-bold tracking-tight text-foreground">
                  FlexEasy Admin
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Panel de control
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              {/* Indicador de dispositivo */}
              <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                {isMobile ? (
                  <Smartphone className="h-3 w-3" />
                ) : window.innerWidth < 1024 ? (
                  <Tablet className="h-3 w-3" />
                ) : (
                  <Monitor className="h-3 w-3" />
                )}
              </div>

              {error && (
                <Badge variant="destructive" className="text-xs hidden sm:flex">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Error API
                </Badge>
              )}
              
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hidden lg:inline">admin@autoflexeasy.com</span>
                <span className="text-xs bg-primary/10 px-2 py-1 rounded text-primary">
                  Admin
                </span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm"
              >
                <Square className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">Cerrar</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Contenido del dashboard */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
            {/* Métricas Principales - Responsive */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              <Card className="min-w-0">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs lg:text-sm font-medium text-muted-foreground truncate">
                        Ingresos Totales
                      </p>
                      <p className="text-lg lg:text-2xl font-bold text-foreground truncate">
                        ${stripeData?.totalRevenue?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="w-8 h-8 lg:w-12 lg:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                      <DollarSign className="h-4 w-4 lg:h-6 lg:w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="min-w-0">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs lg:text-sm font-medium text-muted-foreground truncate">
                        Suscripciones Activas
                      </p>
                      <p className="text-lg lg:text-2xl font-bold text-foreground">
                        {stripeData?.activeSubscriptions || '0'}
                      </p>
                    </div>
                    <div className="w-8 h-8 lg:w-12 lg:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                      <Users className="h-4 w-4 lg:h-6 lg:w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="min-w-0">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs lg:text-sm font-medium text-muted-foreground truncate">
                        MRR Mensual
                      </p>
                      <p className="text-lg lg:text-2xl font-bold text-foreground truncate">
                        ${stripeData?.monthlyRecurring?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="w-8 h-8 lg:w-12 lg:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                      <TrendingUp className="h-4 w-4 lg:h-6 lg:w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="min-w-0">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs lg:text-sm font-medium text-muted-foreground truncate">
                        Total Clientes
                      </p>
                      <p className="text-lg lg:text-2xl font-bold text-foreground">
                        {stripeData?.totalCustomers || '0'}
                      </p>
                    </div>
                    <div className="w-8 h-8 lg:w-12 lg:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                      <Users className="h-4 w-4 lg:h-6 lg:w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usuarios y Suscripciones - Stack en móvil */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              {/* Usuarios Registrados */}
              <Card>
                <CardHeader className="p-4 lg:p-6">
                  <CardTitle className="flex items-center text-foreground text-base lg:text-lg">
                    <Users className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                    Usuarios Registrados
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {stripeData?.users?.length || 0}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs lg:text-sm">
                    Clientes registrados en Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                  {stripeData?.users && stripeData.users.length > 0 ? (
                    <div className="space-y-2 lg:space-y-3 max-h-80 lg:max-h-96 overflow-y-auto">
                      {stripeData.users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-2 lg:p-3 border border-border rounded-lg">
                          <div className="flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1">
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <Users className="h-3 w-3 lg:h-4 lg:w-4 text-primary" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm text-foreground truncate">
                                {user.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {user.email}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Registro: {user.created}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant={user.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs ml-2 flex-shrink-0"
                          >
                            {user.subscription === 'active' ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 lg:py-8 text-muted-foreground">
                      <Users className="mx-auto h-6 w-6 lg:h-8 lg:w-8 mb-2" />
                      <p className="text-sm">No hay usuarios registrados</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Suscripciones Activas */}
              <Card>
                <CardHeader className="p-4 lg:p-6">
                  <CardTitle className="flex items-center text-foreground text-base lg:text-lg">
                    <TrendingUp className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                    Suscripciones Activas
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {stripeData?.activeSubscriptions || 0}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs lg:text-sm">
                    Suscripciones activas en el sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                  {stripeData?.subscriptions && stripeData.subscriptions.length > 0 ? (
                    <div className="space-y-2 lg:space-y-3 max-h-80 lg:max-h-96 overflow-y-auto">
                      {stripeData.subscriptions.map((subscription) => (
                        <div key={subscription.id} className="p-2 lg:p-3 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-1 lg:mb-2">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm text-foreground truncate">
                                {subscription.customer.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {subscription.customer.email}
                              </p>
                            </div>
                            <Badge 
                              variant={subscription.status === 'active' ? 'default' : 'secondary'}
                              className="text-xs ml-2 flex-shrink-0"
                            >
                              {subscription.status}
                            </Badge>
                          </div>
                          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-1 text-xs text-muted-foreground">
                            <span>${subscription.amount}/{subscription.interval}</span>
                            <span className="text-right">Vence: {subscription.current_period_end}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 lg:py-8 text-muted-foreground">
                      <TrendingUp className="mx-auto h-6 w-6 lg:h-8 lg:w-8 mb-2" />
                      <p className="text-sm">No hay suscripciones activas</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Notificaciones del Sistema */}
            <Card>
              <CardHeader className="p-4 lg:p-6">
                <CardTitle className="flex items-center text-foreground text-base lg:text-lg">
                  <TrendingUp className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                  Resumen del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <div className="space-y-2 lg:space-y-3">
                  {error && (
                    <div className="flex items-start gap-2 lg:gap-3 p-2 lg:p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="bg-destructive/20 p-1 lg:p-2 rounded-full flex-shrink-0 mt-0.5">
                        <AlertCircle className="h-3 w-3 lg:h-4 lg:w-4 text-destructive" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-destructive text-sm">Error de API Stripe</p>
                        <p className="text-xs text-destructive/80 break-words">
                          {error}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-2 lg:gap-3 p-2 lg:p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="bg-primary/20 p-1 lg:p-2 rounded-full flex-shrink-0 mt-0.5">
                      <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-primary" />
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
        </main>
      </div>
    </div>
  );
}
