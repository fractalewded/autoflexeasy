'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Bot, Battery, Cpu, HardDrive, Navigation, Zap } from 'lucide-react'; // ✅ Corregido

export default function RobotDashboard() {
  const [robotData, setRobotData] = useState({
    batteryLevel: 85,
    cpuLoad: 45,
    memoryUsage: 60,
    status: 'active',
    isActive: true,
    speed: 3.5,
    location: { x: 125, y: 240 }
  });

  // Simular datos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setRobotData(prev => ({
        ...prev,
        batteryLevel: Math.max(5, prev.batteryLevel - 0.1),
        cpuLoad: 30 + Math.random() * 40,
        memoryUsage: 50 + Math.random() * 20,
        speed: prev.isActive ? 2 + Math.random() * 4 : 0
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const toggleActivation = () => {
    setRobotData(prev => ({
      ...prev,
      isActive: !prev.isActive,
      status: !prev.isActive ? 'active' : 'inactive'
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Robot Control</h1>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            robotData.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {robotData.status === 'active' ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Tarjeta de Estado */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="activation-mode">Activation</Label>
              <Switch
                id="activation-mode"
                checked={robotData.isActive}
                onCheckedChange={toggleActivation}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta de Batería */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Battery</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{robotData.batteryLevel.toFixed(1)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${robotData.batteryLevel}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta de Velocidad */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Speed</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{robotData.speed.toFixed(1)} m/s</div>
            <Slider 
              defaultValue={[3.5]}
              max={10}
              step={0.5}
              className="mt-4"
              disabled={!robotData.isActive}
            />
          </CardContent>
        </Card>

        {/* Tarjeta de CPU */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{robotData.cpuLoad.toFixed(1)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${robotData.cpuLoad}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta de Memoria */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" /> {/* ✅ Corregido */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{robotData.memoryUsage.toFixed(1)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: `${robotData.memoryUsage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta de Navegación */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Navigation</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">Position</div>
            <div className="text-sm text-muted-foreground">
              X: {robotData.location.x}, Y: {robotData.location.y}
            </div>
            <div className="w-full h-32 bg-gray-100 rounded-md mt-2 relative">
              <div 
                className="w-4 h-4 bg-blue-600 rounded-full absolute"
                style={{
                  left: `${(robotData.location.x / 250) * 100}%`,
                  top: `${(robotData.location.y / 300) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel de Control */}
      <Card>
        <CardHeader>
          <CardTitle>Control Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button disabled={!robotData.isActive}>Start Mission</Button>
            <Button variant="outline" disabled={!robotData.isActive}>Pause</Button>
            <Button variant="outline" disabled={!robotData.isActive}>Return to Base</Button>
            <Button variant="destructive">Emergency Stop</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}