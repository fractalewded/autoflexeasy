'use client';

import { useState, useEffect } from 'react';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Robot Control Panel</h1>
            <p className="text-gray-600">Amazon Flex Management System</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-2xl font-semibold text-gray-700">{formatTime(currentTime)}</div>
            <div className="text-gray-500">{formatDate(currentTime)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Robot Status */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Robot Status</h2>
            
            <div className="mb-4 flex items-center">
              <span className="text-gray-600 mr-2">Status:</span>
              <span className={`font-semibold ${
                status === 'active' ? 'text-green-600' : 
                status === 'paused' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {status === 'active' ? 'Active' : status === 'paused' ? 'Paused' : 'Stopped'}
              </span>
              <div className={`ml-2 w-3 h-3 rounded-full ${
                status === 'active' ? 'bg-green-500' : 
                status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
            </div>
            
            <div className="mb-4">
              <span className="text-gray-600 mr-2">Battery:</span>
              <span className="font-semibold">{batteryLevel.toFixed(1)}%</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className={`h-2.5 rounded-full ${
                    batteryLevel > 50 ? 'bg-green-500' : 
                    batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} 
                  style={{ width: `${batteryLevel}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-4">
              <span className="text-gray-600 mr-2">Connected:</span>
              <span className="font-semibold text-green-600">Yes</span>
            </div>
            
            <div className="mb-4">
              <span className="text-gray-600 mr-2">Tasks completed:</span>
              <span className="font-semibold">24/30</span>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Today's Statistics</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-600">Packages delivered</p>
                  <p className="font-semibold">18</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active time</p>
                  <p className="font-semibold">5h 22m</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Controls</h2>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <button 
                onClick={handleStart}
                className={`px-4 py-3 rounded-lg flex-1 min-w-[120px] flex items-center justify-center ${
                  status === 'active' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                } transition-colors`}
              >
                <i className="fas fa-play mr-2"></i>
                Start
              </button>
              
              <button 
                onClick={handlePause}
                className={`px-4 py-3 rounded-lg flex-1 min-w-[120px] flex items-center justify-center ${
                  status === 'paused' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                } transition-colors`}
              >
                <i className="fas fa-pause mr-2"></i>
                Pause
              </button>
              
              <button 
                onClick={handleStop}
                className={`px-4 py-3 rounded-lg flex-1 min-w-[120px] flex items-center justify-center ${
                  status === 'stopped' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                } transition-colors`}
              >
                <i className="fas fa-stop mr-2"></i>
                Stop
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                  <i className="fas fa-route mr-1"></i>
                  Optimize route
                </button>
                <button className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors">
                  <i className="fas fa-battery-bolt mr-1"></i>
                  Power saving mode
                </button>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Upcoming Tasks</h3>
              <ul className="text-sm">
                <li className="flex justify-between py-1 border-b border-gray-200">
                  <span>Delivery #45892</span>
                  <span className="text-gray-600">10:30 AM</span>
                </li>
                <li className="flex justify-between py-1 border-b border-gray-200">
                  <span>Delivery #45893</span>
                  <span className="text-gray-600">11:15 AM</span>
                </li>
                <li className="flex justify-between py-1">
                  <span>Pickup #32847</span>
                  <span className="text-gray-600">12:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Notifications */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">System Notifications</h2>
          <div className="flex items-start">
            <div className="bg-blue-100 p-3 rounded-full mr-3">
              <i className="fas fa-info-circle text-blue-500"></i>
            </div>
            <div>
              <p className="font-medium">Route optimized successfully</p>
              <p className="text-sm text-gray-600">A new route has been calculated that saves 12 minutes of travel time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}