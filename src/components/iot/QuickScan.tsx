
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, TrendingUp, Brain, Camera, Scan } from 'lucide-react';

interface QuickScanProps {
  onQuickScan: (type: 'glucose' | 'bp' | 'headache') => void;
  onCameraAction: (mode: 'scan' | 'record') => void;
  cameraMode: 'scan' | 'record' | null;
}

const QuickScan: React.FC<QuickScanProps> = ({ onQuickScan, onCameraAction, cameraMode }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Quick Health Scans</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Instant Measurements</h4>
            <div className="space-y-2">
              <Button 
                onClick={() => onQuickScan('glucose')}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                <Droplets className="w-4 h-4 mr-2" />
                Glucose Scan
              </Button>
              <Button 
                onClick={() => onQuickScan('bp')}
                className="w-full bg-indigo-500 hover:bg-indigo-600"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Blood Pressure
              </Button>
              <Button 
                onClick={() => onQuickScan('headache')}
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
                onClick={() => onCameraAction('scan')}
                disabled={cameraMode === 'scan'}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                <Camera className="w-4 h-4 mr-2" />
                {cameraMode === 'scan' ? 'Scanning...' : 'Camera Scan'}
              </Button>
              <Button 
                onClick={() => onCameraAction('record')}
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
    </div>
  );
};

export default QuickScan;
