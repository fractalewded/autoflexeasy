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
    days: [1, 2, 3, 4, 5] // Monday to Friday
  });

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
      case 'active': return 'Active';
      case 'paused': return 'Paused';
      case 'inactive': return 'Inactive';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Control Panel - AutoFlex</h1>
            <p className="text-muted-foreground">Automated system for Amazon Flex block capture</p>
          </div>
          <Badge variant={getStatusVariant()} className="text-sm">
            {getStatusText()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                System Status
              </CardTitle>
              <CardDescription>Current status and basic configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-search" className="flex flex-col space-y-1">
                  <span>Auto Search</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Enable to automatically search for blocks
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
                  <span>Notifications</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Receive alerts for new blocks
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
                  <span className="text-sm font-medium">Battery</span>
                  <span className="text-sm">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Blocks Captured</span>
                <span className="text-sm font-medium">0</span>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
              <CardDescription>Manage system operations</CardDescription>
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
                  Start
                </Button>
                
                <Button 
                  onClick={handlePause}
                  className="flex-1"
                  variant={status === 'paused' ? 'secondary' : 'outline'}
                  disabled={status !== 'active'}
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
                
                <Button 
                  onClick={handleStop}
                  className="flex-1"
                  variant={status === 'inactive' ? 'destructive' : 'outline'}
                  disabled={status === 'inactive'}
                >
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-10">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button variant="outline" className="h-10">
                  <MapPin className="mr-2 h-4 w-4" />
                  Stations
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Work Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock9 className="mr-2 h-5 w-5" />
                Work Schedule
              </CardTitle>
              <CardDescription>Configure preferred block schedules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Activation Schedule</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) => setSchedule({...schedule, startTime: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) => setSchedule({...schedule, endTime: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Work Days</Label>
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
                Search Preferences
              </CardTitle>
              <CardDescription>Preferred stations and block types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred Stations</Label>
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
                <Label>Block Types</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    Instant Delivery
                  </Button>
                  <Button variant="outline" size="sm">
                    Scheduled Delivery
                  </Button>
                  <Button variant="outline" size="sm">
                    Logistics
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Minimum Rate per Hour</Label>
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
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Block capture history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No recent activity</h3>
              <p className="text-muted-foreground">
                Once you start capturing blocks, they will appear here.
              </p>
              <Button className="mt-4" onClick={handleStart} disabled={!isAutoSearchEnabled}>
                <Play className="mr-2 h-4 w-4" />
                Start Search
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* System Notifications */}
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
                <p className="font-medium">System configured successfully</p>
                <p className="text-sm text-muted-foreground">
                  Your system is ready to start searching for blocks. Enable auto search to begin.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}