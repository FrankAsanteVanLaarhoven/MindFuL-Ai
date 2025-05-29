
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface IoTSettingsProps {
  autoSync: boolean;
  onAutoSyncToggle: () => void;
}

const IoTSettings: React.FC<IoTSettingsProps> = ({ autoSync, onAutoSyncToggle }) => {
  return (
    <div className="space-y-4">
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
                onClick={onAutoSyncToggle}
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
    </div>
  );
};

export default IoTSettings;
