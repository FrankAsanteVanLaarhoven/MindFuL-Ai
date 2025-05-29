
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Watch, 
  Activity, 
  Heart, 
  Thermometer, 
  Moon, 
  Wifi, 
  WifiOff,
  Battery,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Device {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness_tracker' | 'phone' | 'sleep_tracker' | 'heart_monitor';
  connected: boolean;
  battery?: number;
  lastSync: string;
}

interface HealthMetric {
  type: 'heart_rate' | 'steps' | 'sleep' | 'stress' | 'temperature';
  value: number;
  unit: string;
  timestamp: string;
  deviceId: string;
}

const IoTIntegration = () => {
  const { toast } = useToast();
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 'watch_1',
      name: 'Apple Watch Series 8',
      type: 'smartwatch',
      connected: true,
      battery: 85,
      lastSync: '2 minutes ago'
    },
    {
      id: 'tracker_1',
      name: 'Fitbit Charge 5',
      type: 'fitness_tracker',
      connected: false,
      battery: 45,
      lastSync: '1 hour ago'
    },
    {
      id: 'phone_1',
      name: 'iPhone Health App',
      type: 'phone',
      connected: true,
      battery: 92,
      lastSync: 'Just now'
    }
  ]);

  const [metrics, setMetrics] = useState<HealthMetric[]>([
    {
      type: 'heart_rate',
      value: 72,
      unit: 'bpm',
      timestamp: '5 minutes ago',
      deviceId: 'watch_1'
    },
    {
      type: 'steps',
      value: 8543,
      unit: 'steps',
      timestamp: '10 minutes ago',
      deviceId: 'tracker_1'
    },
    {
      type: 'sleep',
      value: 7.5,
      unit: 'hours',
      timestamp: 'Last night',
      deviceId: 'watch_1'
    },
    {
      type: 'stress',
      value: 35,
      unit: '%',
      timestamp: '15 minutes ago',
      deviceId: 'watch_1'
    }
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'smartwatch':
        return <Watch className="w-5 h-5" />;
      case 'fitness_tracker':
        return <Activity className="w-5 h-5" />;
      case 'phone':
        return <Smartphone className="w-5 h-5" />;
      case 'sleep_tracker':
        return <Moon className="w-5 h-5" />;
      case 'heart_monitor':
        return <Heart className="w-5 h-5" />;
      default:
        return <Settings className="w-5 h-5" />;
    }
  };

  const getMetricIcon = (type: HealthMetric['type']) => {
    switch (type) {
      case 'heart_rate':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'steps':
        return <Activity className="w-4 h-4 text-blue-500" />;
      case 'sleep':
        return <Moon className="w-4 h-4 text-purple-500" />;
      case 'stress':
        return <Thermometer className="w-4 h-4 text-orange-500" />;
      case 'temperature':
        return <Thermometer className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const handleDeviceToggle = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, connected: !device.connected }
        : device
    ));
    
    const device = devices.find(d => d.id === deviceId);
    toast({
      title: device?.connected ? "Device Disconnected" : "Device Connected",
      description: `${device?.name} has been ${device?.connected ? 'disconnected' : 'connected'}.`,
    });
  };

  const handleScanDevices = () => {
    setIsScanning(true);
    toast({
      title: "Scanning for Devices",
      description: "Looking for nearby IoT devices...",
    });
    
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "Scan Complete",
        description: "Found 2 new devices available for connection.",
      });
    }, 3000);
  };

  const handleSyncData = () => {
    toast({
      title: "Syncing Data",
      description: "Fetching latest health metrics from connected devices...",
    });
    
    // Simulate data sync
    setTimeout(() => {
      toast({
        title: "Sync Complete",
        description: "Successfully updated health metrics from all devices.",
      });
    }, 2000);
  };

  useEffect(() => {
    if (autoSync) {
      const interval = setInterval(() => {
        // Auto-sync connected devices every 5 minutes
        console.log('Auto-syncing device data...');
      }, 300000);
      
      return () => clearInterval(interval);
    }
  }, [autoSync]);

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <span className="text-2xl">🔗</span>
            IoT Device Integration
          </CardTitle>
          <CardDescription>
            Connect and monitor your health devices for comprehensive wellness tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="devices" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="devices" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Connected Devices</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={handleScanDevices}
                    disabled={isScanning}
                    variant="outline"
                    size="sm"
                  >
                    {isScanning ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Wifi className="w-4 h-4 mr-2" />
                    )}
                    {isScanning ? 'Scanning...' : 'Scan'}
                  </Button>
                  <Button onClick={handleSyncData} size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync All
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {devices.map((device) => (
                  <Card key={device.id} className="border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getDeviceIcon(device.type)}
                          <div>
                            <div className="font-medium">{device.name}</div>
                            <div className="text-sm text-gray-500">
                              Last sync: {device.lastSync}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {device.battery && (
                            <div className="flex items-center gap-1 text-sm">
                              <Battery className="w-4 h-4" />
                              {device.battery}%
                            </div>
                          )}
                          <Badge variant={device.connected ? "default" : "secondary"}>
                            {device.connected ? (
                              <Wifi className="w-3 h-3 mr-1" />
                            ) : (
                              <WifiOff className="w-3 h-3 mr-1" />
                            )}
                            {device.connected ? 'Connected' : 'Disconnected'}
                          </Badge>
                          <Button
                            onClick={() => handleDeviceToggle(device.id)}
                            size="sm"
                            variant={device.connected ? "destructive" : "default"}
                          >
                            {device.connected ? 'Disconnect' : 'Connect'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <h3 className="text-lg font-semibold">Real-time Health Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metrics.map((metric, index) => (
                  <Card key={index} className="border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getMetricIcon(metric.type)}
                          <span className="font-medium capitalize">
                            {metric.type.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{metric.timestamp}</span>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold">{metric.value}</span>
                        <span className="text-sm text-gray-500 mb-1">{metric.unit}</span>
                      </div>
                      {metric.type === 'stress' && (
                        <Progress value={metric.value} className="mt-2" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <h3 className="text-lg font-semibold">IoT Settings</h3>
              <div className="space-y-4">
                <Card className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Auto-sync Data</div>
                        <div className="text-sm text-gray-500">
                          Automatically sync data from connected devices every 5 minutes
                        </div>
                      </div>
                      <Button
                        onClick={() => setAutoSync(!autoSync)}
                        variant={autoSync ? "default" : "outline"}
                        size="sm"
                      >
                        {autoSync ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="font-medium">Data Privacy</div>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p>• All health data is stored locally and encrypted</p>
                        <p>• Device connections use secure protocols</p>
                        <p>• You can disconnect devices at any time</p>
                        <p>• Data is only shared with your explicit consent</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IoTIntegration;
