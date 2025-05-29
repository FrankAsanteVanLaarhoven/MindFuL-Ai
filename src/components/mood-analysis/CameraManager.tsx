
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Camera, RefreshCw } from 'lucide-react';

interface CameraManagerProps {
  onCameraChange: (hasCamera: boolean, stream: MediaStream | null) => void;
  onFrameCapture: (captureFunc: () => string | null) => void;
}

const CameraManager: React.FC<CameraManagerProps> = ({ onCameraChange, onFrameCapture }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('🧹 Cleaning up camera...');
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setHasCamera(false);
    setError(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  // Initialize camera
  const initCamera = async () => {
    console.log('📹 Initializing camera...');
    setIsLoading(true);
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });

      console.log('✅ Got media stream');
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log('📺 Video loaded');
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              console.log('▶️ Video playing');
              setHasCamera(true);
              toast({
                title: "Camera activated! 📹",
                description: "Your camera is ready for analysis"
              });
            }).catch(err => {
              console.error('❌ Play error:', err);
              setError('Could not start video playback');
            });
          }
        };

        videoRef.current.onerror = () => {
          console.error('❌ Video error');
          setError('Video playback error');
        };
      }
    } catch (err: any) {
      console.error('❌ Camera error:', err);
      let errorMsg = 'Camera access failed';
      
      if (err.name === 'NotAllowedError') {
        errorMsg = 'Camera permission denied. Please allow camera access.';
      } else if (err.name === 'NotFoundError') {
        errorMsg = 'No camera found on this device';
      } else if (err.name === 'NotReadableError') {
        errorMsg = 'Camera is being used by another application';
      }
      
      setError(errorMsg);
      toast({
        title: "Camera error",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    console.log('🛑 Stopping camera...');
    cleanup();
    toast({
      title: "Camera stopped",
      description: "Camera access has been turned off"
    });
  };

  // Capture frame function
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current || !hasCamera) {
      console.log('❌ Cannot capture: missing requirements');
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.videoWidth === 0) {
      console.log('❌ Cannot capture: invalid video');
      return null;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    console.log('📸 Frame captured');
    return dataUrl;
  }, [hasCamera]);

  // Notify parent of camera state changes
  useEffect(() => {
    onCameraChange(hasCamera, stream);
  }, [hasCamera, stream, onCameraChange]);

  // Provide capture function to parent
  useEffect(() => {
    onFrameCapture(captureFrame);
  }, [captureFrame, onFrameCapture]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <label className="text-sm font-medium text-gray-700 block">
        Camera Analysis
      </label>

      {hasCamera ? (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden border border-indigo-200 bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-48 object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Live
            </div>
          </div>
          <Button
            onClick={stopCamera}
            variant="outline"
            className="w-full"
          >
            🛑 Stop Camera
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center h-48 flex flex-col justify-center">
            <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">Camera not active</p>
            <p className="text-xs text-gray-500">Enable camera for enhanced mood analysis</p>
          </div>
          
          <Button
            onClick={initCamera}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                Starting Camera...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Enable Camera
              </div>
            )}
          </Button>
        </div>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <p className="font-medium">{error}</p>
            <div className="text-sm mt-2">
              <p><strong>Try:</strong></p>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li>Check browser permissions (click lock icon in address bar)</li>
                <li>Close other apps using the camera</li>
                <li>Refresh the page and try again</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CameraManager;
