'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Pause, Square, Battery, Clock, Package, MapPin, Bell, Settings, Calendar, Clock9, Zap, DollarSign, Users, TrendingUp, AlertCircle } from 'lucide-react';

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

export default function RobotDashboard() {
  const [status, setStatus] = useState('inactive');
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isAutoSearchEnabled, setIsAutoSearchEnabled] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [selectedStations, setSelectedStations] = useState<string[]>([]);
  const [schedule, setSchedule] = useState({
    startTime: '08:00',
    endTime: '17:00',
    days: [1, 2, 3, 4, 5] // Monday to Friday
  });

  // Estados para datos de Stripe
  const [stripeData, setStripeData] = useState<StripeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stations = [
    { id: 'station1', name: 'Downtown Station' },
    { id: 'station2', name: 'North Station' },
    { id: 'station3', name: 'South Station' },
    { id: 'station4', name: 'East Station' },
    { id: 'station5', name: 'West Station' }
  ];

  const daysOfWeek = [
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' }
  ];

  // Cargar datos de Stripe con debugging
  useEffect(() => {
    const fetchStripeData = async () => {
      try {
        setLoading(true);
        console.log('Making request to /api/stripe/dashboard');
        const response = await fetch('/api/stripe/dashboard');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Stripe data received:', data);
        console.log('Users count:', data.users?.length);
        console.log('Sample user:', data.users?.[0]);
        
        setStripeData(data);
      } catch (err) {
        console.error('Error loading Stripe data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStripeData();
  }, []);

  const handleStart = () => {
    setStatus('active');
  };

  const handlePause = () => {
    setStatus('paused');
  };

  const handleStop = () => {
    setStatus('inactive');
  };

  const toggleStation = (stationId: string) => {
    setSelectedStations(prev => 
      prev.includes(stationId) 
        ? prev.filter(id => id !== stationId) 
        : [...prev, stationId]
    );
  };

  const toggleDay = (dayId: number) => {
    setSchedule(prev => ({
      ...prev,
      days: prev.days.includes(dayId)
        ? prev.days.filter(d => d !== dayId)
        : [...prev.days, dayId]
    }));
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    // Aquí va tu lógica de logout
    // Por ejemplo, si usas NextAuth:
    // signOut();
    
    // Si usas sesiones simples, redirige al login
    if (typeof window !== 'undefined') {
      // Limpiar localStorage/sessionStorage si es necesario
      localStorage.removeItem('auth-token');
      sessionStorage.removeItem('auth-token');
      
      // Redirigir a la página principal
      window.location.href = '/';
    }
  };

  const getStatusVariant = () => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'inactive': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'active': return 'Active';
      case 'paused': return 'Paused';
      case 'inactive': return 'Inactive';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
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
            <p className="text-muted-foreground">Sistema automatizado para Amazon Flex</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={getStatusVariant()} className="text-sm">
              {getStatusText()}
            </Badge>
            {error && (
              <Badge variant="destructive" className="text-sm">
                <AlertCircle className="w-3 h-3 mr-1" />
                API Error
              </Badge>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>gerente_in@autoflexeasy.com</span>
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

        {/* Stripe Metrics Section */}
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

        {/* Users and Subscriptions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Usuarios Registrados
                <Badge variant="secondary" className="ml-2">
                  {stripeData?.users?.length || 0}
                </Badge>
              </CardTitle>
              <CardDescription>Lista de clientes registrados en Stripe</CardDescription>
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

          {/* Subscriptions List */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Estado del Sistema
              </CardTitle>
              <CardDescription>Estado actual y configuración básica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-search" className="flex flex-col space-y-1">
                  <span>Búsqueda Automática</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Habilitar para buscar bloques automáticamente
                  </span>
                </Label>
                <Switch
                  id="auto-search"
                  checked={isAutoSearchEnabled}
                  onCheckedChange={setIsAutoSearchEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="flex flex-col space-y-1">
                  <span>Notificaciones</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Recibir alertas para nuevos bloques
                  </span>
                </Label>
                <Switch
                  id="notifications"
                  checked={notificationEnabled}
                  onCheckedChange={setNotificationEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Batería</span>
                  <span className="text-sm">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bloques Capturados</span>
                <span className="text-sm font-medium">0</span>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Controles</CardTitle>
              <CardDescription>Gestionar operaciones del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={handleStart}
                  className="flex-1"
                  variant={status === 'active' ? 'default' : 'outline'}
                  disabled={!isAutoSearchEnabled}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Iniciar
                </Button>
                
                <Button 
                  onClick={handlePause}
                  className="flex-1"
                  variant={status === 'paused' ? 'secondary' : 'outline'}
                  disabled={status !== 'active'}
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Pausar
                </Button>
                
                <Button 
                  onClick={handleStop}
                  className="flex-1"
                  variant={status === 'inactive' ? 'destructive' : 'outline'}
                  disabled={status === 'inactive'}
                >
                  <Square className="mr-2 h-4 w-4" />
                  Detener
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-10">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Button>
                <Button variant="outline" className="h-10">
                  <MapPin className="mr-2 h-4 w-4" />
                  Estaciones
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Pagos Recientes
              </CardTitle>
              <CardDescription>Últimas transacciones de Stripe</CardDescription>
            </CardHeader>
            <CardContent>
              {stripeData?.recentPayments && stripeData.recentPayments.length > 0 ? (
                <div className="space-y-3">
                  {stripeData.recentPayments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{payment.customer}</p>
                        <p className="text-xs text-muted-foreground">{payment.created}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${payment.amount}</p>
                        <Badge 
                          variant={payment.status === 'succeeded' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {payment.status}
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

          {/* Recent Subscriptions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Suscripciones Recientes
              </CardTitle>
              <CardDescription>Actividad reciente de suscripciones</CardDescription>
            </CardHeader>
            <CardContent>
              {stripeData?.recentSubscriptions && stripeData.recentSubscriptions.length > 0 ? (
                <div className="space-y-3">
                  {stripeData.recentSubscriptions.slice(0, 5).map((subscription) => (
                    <div key={subscription.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{subscription.customer.name}</p>
                        <p className="text-xs text-muted-foreground">{subscription.created}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${subscription.amount}</p>
                        <Badge 
                          variant={subscription.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {subscription.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="mx-auto h-8 w-8 mb-2" />
                  <p>No hay suscripciones recientes</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Work Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock9 className="mr-2 h-5 w-5" />
                Horario de Trabajo
              </CardTitle>
              <CardDescription>Configurar horarios preferidos de bloques</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Horario de Activación</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) => setSchedule({...schedule, startTime: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                  <span>a</span>
                  <input
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) => setSchedule({...schedule, endTime: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Días de Trabajo</Label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <Button
                      key={day.id}
                      variant={schedule.days.includes(day.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleDay(day.id)}
                    >
                      {day.name.substring(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Preferencias de Búsqueda
              </CardTitle>
              <CardDescription>Estaciones preferidas y tipos de bloques</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Estaciones Preferidas</Label>
                <div className="grid grid-cols-2 gap-2">
                  {stations.map(station => (
                    <Button
                      key={station.id}
                      variant={selectedStations.includes(station.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleStation(station.id)}
                      className="justify-start"
                    >
                      {station.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Tipos de Bloques</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    Entrega Instantánea
                  </Button>
                  <Button variant="outline" size="sm">
                    Entrega Programada
                  </Button>
                  <Button variant="outline" size="sm">
                    Logística
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Tarifa Mínima por Hora</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">$</span>
                  <input
                    type="number"
                    min="18"
                    max="50"
                    defaultValue="22"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                  <span className="text-sm">USD</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* System Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notificaciones del Sistema
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