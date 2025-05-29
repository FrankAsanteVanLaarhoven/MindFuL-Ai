
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Device, HealthMetric, SymptomPrediction } from './iot/types';
import AIPredictions from './iot/AIPredictions';
import HealthMetrics from './iot/HealthMetrics';
import QuickScan from './iot/QuickScan';
import DeviceManagement from './iot/DeviceManagement';
import IoTSettings from './iot/IoTSettings';

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
    
    setTimeout(() => {
      toast({
        title: "Sync Complete",
        description: "Successfully updated health metrics from all devices.",
      });
    }, 2000);
  };

  const handleAutoSyncToggle = () => {
    setAutoSync(!autoSync);
  };

  useEffect(() => {
    if (autoSync) {
      const interval = setInterval(() => {
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
              <AIPredictions predictions={predictions} onAnalyze={handleSyncData} />
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <HealthMetrics metrics={metrics} />
            </TabsContent>

            <TabsContent value="quick-scan" className="space-y-4">
              <QuickScan 
                onQuickScan={handleQuickScan}
                onCameraAction={handleCameraAction}
                cameraMode={cameraMode}
              />
            </TabsContent>

            <TabsContent value="devices" className="space-y-4">
              <DeviceManagement
                devices={devices}
                isScanning={isScanning}
                onDeviceToggle={handleDeviceToggle}
                onScanDevices={handleScanDevices}
                onSyncData={handleSyncData}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <IoTSettings 
                autoSync={autoSync}
                onAutoSyncToggle={handleAutoSyncToggle}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IoTIntegration;
