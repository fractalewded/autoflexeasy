'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, Battery, Clock, Package, MapPin, Bell } from 'lucide-react';

export default function RobotDashboard() {
  const [status, setStatus] = useState('active');
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate battery drain
    const batteryTimer = setInterval(() => {
      if (status === 'active') {
        setBatteryLevel(prev => Math.max(prev - 0.1, 0));
      }
    }, 60000);

    return () => {
      clearInterval(timer);
      clearInterval(batteryTimer);
    };
  }, [status]);

  const handleStart = () => {
    setStatus('active');
  };

  const handlePause = () => {
    setStatus('paused');
  };

  const handleStop = () => {
    setStatus('stopped');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusVariant = () => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'stopped': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'active': return 'Active';
      case 'paused': return 'Paused';
      case 'stopped': return 'Stopped';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Robot Control Panel</h1>
            <p className="text-muted-foreground">Amazon Flex Management System</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold">{formatTime(currentTime)}</div>
            <div className="text-sm text-muted-foreground">{formatDate(currentTime)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Robot Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Robot Status</CardTitle>
              <CardDescription>Current status and performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant={getStatusVariant()}>{getStatusText()}</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Battery</span>
                  <span className="text-sm">{batteryLevel.toFixed(1)}%</span>
                </div>
                <Progress value={batteryLevel} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Connected</span>
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Yes</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tasks completed</span>
                <span className="text-sm font-medium">24/30</span>
              </div>
            </CardContent>
          </Card>

          {/* Controls Card */}
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
              <CardDescription>Manage robot operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={handleStart}
                  className="flex-1"
                  variant={status === 'active' ? 'default' : 'outline'}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start
                </Button>
                
                <Button 
                  onClick={handlePause}
                  className="flex-1"
                  variant={status === 'paused' ? 'secondary' : 'outline'}
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
                
                <Button 
                  onClick={handleStop}
                  className="flex-1"
                  variant={status === 'stopped' ? 'destructive' : 'outline'}
                >
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-10">
                  <MapPin className="mr-2 h-4 w-4" />
                  Optimize
                </Button>
                <Button variant="outline" className="h-10">
                  <Battery className="mr-2 h-4 w-4" />
                  Power Save
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                  <Package className="h-6 w-6 mb-2" />
                  <span className="text-sm">Packages</span>
                  <span className="font-semibold">18</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                  <Clock className="h-6 w-6 mb-2" />
                  <span className="text-sm">Active Time</span>
                  <span className="font-semibold">5h 22m</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks Card */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Scheduled deliveries and pickups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">Delivery #45892</p>
                    <p className="text-sm text-muted-foreground">123 Main St</p>
                  </div>
                  <span className="text-sm font-medium">10:30 AM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">Delivery #45893</p>
                    <p className="text-sm text-muted-foreground">456 Oak Ave</p>
                  </div>
                  <span className="text-sm font-medium">11:15 AM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">Pickup #32847</p>
                    <p className="text-sm text-muted-foreground">789 Pine Rd</p>
                  </div>
                  <span className="text-sm font-medium">12:00 PM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Notifications Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              System Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Route optimized successfully</p>
                <p className="text-sm text-muted-foreground">
                  A new route has been calculated that saves 12 minutes of travel time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}