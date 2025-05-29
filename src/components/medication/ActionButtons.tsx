
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Video, Mic, Scan } from 'lucide-react';

interface ActionButtonsProps {
  onTakePhoto: () => void;
  onStartRecording: () => void;
  onScanMedication: () => void;
  isTakingPhoto: boolean;
  isRecording: boolean;
  isScanning: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onTakePhoto,
  onStartRecording,
  onScanMedication,
  isTakingPhoto,
  isRecording,
  isScanning
}) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onTakePhoto}
        variant="outline"
        className="border-blue-500 text-blue-700"
        disabled={isTakingPhoto}
        size="sm"
      >
        {isTakingPhoto ? (
          <>
            <Camera className="w-3 h-3 mr-1 animate-pulse" />
            Taking...
          </>
        ) : (
          <>
            <Camera className="w-3 h-3 mr-1" />
            Photo
          </>
        )}
      </Button>
      <Button
        onClick={onStartRecording}
        variant="outline"
        className="border-red-500 text-red-700"
        disabled={isRecording}
        size="sm"
      >
        {isRecording ? (
          <>
            <Mic className="w-3 h-3 mr-1 animate-pulse" />
            Recording...
          </>
        ) : (
          <>
            <Video className="w-3 h-3 mr-1" />
            Record
          </>
        )}
      </Button>
      <Button
        onClick={onScanMedication}
        variant="outline"
        className="border-purple-500 text-purple-700"
        disabled={isScanning}
        size="sm"
      >
        {isScanning ? (
          <>
            <Scan className="w-3 h-3 mr-1 animate-pulse" />
            Scanning...
          </>
        ) : (
          <>
            <Scan className="w-3 h-3 mr-1" />
            Scan
          </>
        )}
      </Button>
    </div>
  );
};

export default ActionButtons;
