'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Pause, Square, Battery, Clock, Package, MapPin, Bell, Settings, Calendar, Clock9, Zap } from 'lucide-react';

export default function RobotDashboard() {
  const [status, setStatus] = useState('inactive');
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isAutoSearchEnabled, setIsAutoSearchEnabled] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [selectedStations, setSelectedStations] = useState<string[]>([]);
  const [schedule, setSchedule] = useState({
    startTime: '08:00',
    endTime: '17:00',
    days: [1, 2, 3, 4, 5] // Lunes a Viernes
  });

  const stations = [
    { id: 'station1', name: 'Estación Centro' },
    { id: 'station2', name: 'Estación Norte' },
    { id: 'station3', name: 'Estación Sur' },
    { id: 'station4', name: 'Estación Este' },
    { id: 'station5', name: 'Estación Oeste' }
  ];

  const daysOfWeek = [
    { id: 0, name: 'Domingo' },
    { id: 1, name: 'Lunes' },
    { id: 2, name: 'Martes' },
    { id: 3, name: 'Miércoles' },
    { id: 4, name: 'Jueves' },
    { id: 5, name: 'Viernes' },
    { id: 6, name: 'Sábado' }
  ];

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
      case 'active': return 'Activo';
      case 'paused': return 'Pausado';
      case 'inactive': return 'Inactivo';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de Control - AutoFlex</h1>
            <p className="text-muted-foreground">Sistema automatizado para captura de bloques de Amazon Flex</p>
          </div>
          <Badge variant={getStatusVariant()} className="text-sm">
            {getStatusText()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Estado del Sistema */}
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
                    Activar para buscar bloques automáticamente
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
                    Recibir alertas de nuevos bloques
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
                <span className="text-sm font-medium">Bloques capturados</span>
                <span className="text-sm font-medium">0</span>
              </div>
            </CardContent>
          </Card>

          {/* Controles */}
          <Card>
            <CardHeader>
              <CardTitle>Controles</CardTitle>
              <CardDescription>Gestionar el funcionamiento del sistema</CardDescription>
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

          {/* Horario de Trabajo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock9 className="mr-2 h-5 w-5" />
                Horario de Trabajo
              </CardTitle>
              <CardDescription>Configura tus horarios preferidos para bloques</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Horario de activación</Label>
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
                <Label>Días de trabajo</Label>
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

          {/* Preferencias de Búsqueda */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Preferencias de Búsqueda
              </CardTitle>
              <CardDescription>Estaciones y tipos de bloques preferidos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Estaciones preferidas</Label>
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
                <Label>Tipo de bloques</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    Entrega rápida
                  </Button>
                  <Button variant="outline" size="sm">
                    Entrega programada
                  </Button>
                  <Button variant="outline" size="sm">
                    Logística
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Tarifa mínima por hora</Label>
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
        
        {/* Actividad Reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>Historial de bloques capturados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Sin actividad reciente</h3>
              <p className="text-muted-foreground">
                Una vez que comiences a capturar bloques, aparecerán aquí.
              </p>
              <Button className="mt-4" onClick={handleStart} disabled={!isAutoSearchEnabled}>
                <Play className="mr-2 h-4 w-4" />
                Iniciar Búsqueda
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Notificaciones del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notificaciones del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Sistema configurado correctamente</p>
                <p className="text-sm text-muted-foreground">
                  Tu sistema está listo para comenzar a buscar bloques. Activa la búsqueda automática para empezar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}