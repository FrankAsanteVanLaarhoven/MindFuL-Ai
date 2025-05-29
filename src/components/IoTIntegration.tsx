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
  Settings,
  Brain,
  Zap,
  Droplets,
  AlertTriangle,
  CheckCircle,
  Camera,
  Scan,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Device {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness_tracker' | 'phone' | 'sleep_tracker' | 'heart_monitor' | 'glucose_monitor' | 'bp_monitor';
  connected: boolean;
  battery?: number;
  lastSync: string;
}

interface HealthMetric {
  type: 'heart_rate' | 'steps' | 'sleep' | 'stress' | 'temperature' | 'blood_pressure' | 'glucose' | 'headache_intensity';
  value: number | string;
  unit: string;
  timestamp: string;
  deviceId: string;
  normalRange?: string;
  status?: 'normal' | 'warning' | 'critical';
}

interface SymptomPrediction {
  id: string;
  condition: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  triggers: string[];
  recommendations: string[];
  timestamp: string;
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
    },
    {
      id: 'glucose_1',
      name: 'FreeStyle Libre',
      type: 'glucose_monitor',
      connected: true,
      battery: 78,
      lastSync: '5 minutes ago'
    },
    {
      id: 'bp_1',
      name: 'Omron Blood Pressure',
      type: 'bp_monitor',
      connected: true,
      battery: 60,
      lastSync: '10 minutes ago'
    }
  ]);

  const [metrics, setMetrics] = useState<HealthMetric[]>([
    {
      type: 'heart_rate',
      value: 72,
      unit: 'bpm',
      timestamp: '5 minutes ago',
      deviceId: 'watch_1',
      normalRange: '60-100 bpm',
      status: 'normal'
    },
    {
      type: 'blood_pressure',
      value: '120/80',
      unit: 'mmHg',
      timestamp: '10 minutes ago',
      deviceId: 'bp_1',
      normalRange: '<120/80',
      status: 'normal'
    },
    {
      type: 'glucose',
      value: 95,
      unit: 'mg/dL',
      timestamp: '5 minutes ago',
      deviceId: 'glucose_1',
      normalRange: '70-100 mg/dL',
      status: 'normal'
    },
    {
      type: 'headache_intensity',
      value: 3,
      unit: '/10',
      timestamp: '15 minutes ago',
      deviceId: 'phone_1',
      normalRange: '0-2/10',
      status: 'warning'
    }
  ]);

  const [predictions, setPredictions] = useState<SymptomPrediction[]>([
    {
      id: '1',
      condition: 'Stress-induced Headache',
      probability: 75,
      severity: 'medium',
      triggers: ['Elevated heart rate', 'Poor sleep quality', 'High stress levels'],
      recommendations: ['Take a 10-minute break', 'Practice deep breathing', 'Stay hydrated'],
      timestamp: '2 minutes ago'
    },
    {
      id: '2',
      condition: 'Dehydration Risk',
      probability: 60,
      severity: 'low',
      triggers: ['Low water intake', 'Increased activity'],
      recommendations: ['Drink 16oz of water', 'Monitor fluid intake'],
      timestamp: '5 minutes ago'
    }
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [cameraMode, setCameraMode] = useState<'scan' | 'record' | null>(null);

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
      case 'glucose_monitor':
        return <Droplets className="w-5 h-5" />;
      case 'bp_monitor':
        return <TrendingUp className="w-5 h-5" />;
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
      case 'blood_pressure':
        return <TrendingUp className="w-4 h-4 text-indigo-500" />;
      case 'glucose':
        return <Droplets className="w-4 h-4 text-blue-600" />;
      case 'headache_intensity':
        return <Brain className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleQuickScan = (type: 'glucose' | 'bp' | 'headache') => {
    toast({
      title: "🔍 Quick Scan Started",
      description: `Scanning ${type === 'bp' ? 'blood pressure' : type === 'glucose' ? 'glucose levels' : 'headache symptoms'}...`,
    });

    setTimeout(() => {
      toast({
        title: "✅ Scan Complete",
        description: `${type === 'bp' ? 'Blood pressure' : type === 'glucose' ? 'Glucose' : 'Headache'} reading updated successfully.`,
      });
    }, 3000);
  };

  const handleCameraAction = (mode: 'scan' | 'record') => {
    setCameraMode(mode);
    toast({
      title: mode === 'scan' ? "📷 Camera Scanner" : "🎥 Recording Started",
      description: mode === 'scan' ? "Position device over area to scan" : "Recording symptoms for analysis",
    });

    setTimeout(() => {
      setCameraMode(null);
      toast({
        title: "✅ Complete",
        description: mode === 'scan' ? "Scan analysis complete" : "Recording saved for review",
      });
    }, 5000);
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
            <Brain className="w-6 h-6" />
            Smart Health Monitoring & Symptoms Predictor
          </CardTitle>
          <CardDescription>
            AI-powered health tracking with symptom prediction through IoT devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="predictions" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
              <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
              <TabsTrigger value="quick-scan">Quick Scan</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="predictions" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">AI Symptom Predictions</h3>
                <Button onClick={handleSyncData} size="sm" className="bg-purple-500 hover:bg-purple-600">
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze Now
                </Button>
              </div>

              <div className="grid gap-4">
                {predictions.map((prediction) => (
                  <Card key={prediction.id} className="border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-purple-800">{prediction.condition}</h4>
                          <p className="text-sm text-gray-500">{prediction.timestamp}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(prediction.severity)}>
                            {prediction.severity}
                          </Badge>
                          <span className="text-lg font-bold text-purple-600">
                            {prediction.probability}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Triggers:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {prediction.triggers.map((trigger, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {trigger}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                          <ul className="text-sm text-gray-600 mt-1 space-y-1">
                            {prediction.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {rec}
                              </li>
                            ))}
                          </ul>
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
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-2xl font-bold">{metric.value}</span>
                          <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
                        </div>
                        {metric.status && (
                          <Badge className={getStatusColor(metric.status)}>
                            {metric.status}
                          </Badge>
                        )}
                      </div>
                      {metric.normalRange && (
                        <p className="text-xs text-gray-500 mt-1">
                          Normal: {metric.normalRange}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="quick-scan" className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Health Scans</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Instant Measurements</h4>
                    <div className="space-y-2">
                      <Button 
                        onClick={() => handleQuickScan('glucose')}
                        className="w-full bg-blue-500 hover:bg-blue-600"
                      >
                        <Droplets className="w-4 h-4 mr-2" />
                        Glucose Scan
                      </Button>
                      <Button 
                        onClick={() => handleQuickScan('bp')}
                        className="w-full bg-indigo-500 hover:bg-indigo-600"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Blood Pressure
                      </Button>
                      <Button 
                        onClick={() => handleQuickScan('headache')}
                        className="w-full bg-red-500 hover:bg-red-600"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Headache Check
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Camera & Recording</h4>
                    <div className="space-y-2">
                      <Button 
                        onClick={() => handleCameraAction('scan')}
                        disabled={cameraMode === 'scan'}
                        className="w-full bg-green-500 hover:bg-green-600"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {cameraMode === 'scan' ? 'Scanning...' : 'Camera Scan'}
                      </Button>
                      <Button 
                        onClick={() => handleCameraAction('record')}
                        disabled={cameraMode === 'record'}
                        className="w-full bg-purple-500 hover:bg-purple-600"
                      >
                        <Scan className="w-4 h-4 mr-2" />
                        {cameraMode === 'record' ? 'Recording...' : 'Record Symptoms'}
                      </Button>
                    </div>
                    {cameraMode && (
                      <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          {cameraMode === 'scan' ? 'Camera active - Position over area' : 'Recording symptoms...'}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

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
                      <div className="font-medium">AI Prediction Settings</div>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p>• Predictions based on real-time health data</p>
                        <p>• Machine learning analyzes patterns and trends</p>
                        <p>• Personalized recommendations for your health profile</p>
                        <p>• Emergency alerts for critical conditions</p>
                      </div>
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
