
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Battery, RefreshCw } from 'lucide-react';
import { Device } from './types';
import { getDeviceIcon } from './utils';

interface DeviceManagementProps {
  devices: Device[];
  isScanning: boolean;
  onDeviceToggle: (deviceId: string) => void;
  onScanDevices: () => void;
  onSyncData: () => void;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({
  devices,
  isScanning,
  onDeviceToggle,
  onScanDevices,
  onSyncData
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Connected Devices</h3>
        <div className="flex gap-2">
          <Button
            onClick={onScanDevices}
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
          <Button onClick={onSyncData} size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync All
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {devices.map((device) => {
          const DeviceIcon = getDeviceIcon(device.type);
          
          return (
            <Card key={device.id} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DeviceIcon className="w-5 h-5" />
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
                      onClick={() => onDeviceToggle(device.id)}
                      size="sm"
                      variant={device.connected ? "destructive" : "default"}
                    >
                      {device.connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DeviceManagement;
