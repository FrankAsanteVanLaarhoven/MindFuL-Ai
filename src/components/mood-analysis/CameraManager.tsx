
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CameraManagerProps {
  onCameraChange: (hasCamera: boolean, stream: MediaStream | null) => void;
  onFrameCapture: (captureFunc: () => string | null) => void;
}

const CameraManager: React.FC<CameraManagerProps> = ({ onCameraChange, onFrameCapture }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Cleanup function
  const cleanupCamera = () => {
    if (stream) {
      console.log('🧹 Cleaning up camera stream...');
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('🛑 Track stopped:', track.kind);
      });
      setStream(null);
    }
    setHasCamera(false);
    setCameraError(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupCamera();
    };
  }, []);

  // Update parent when camera state changes
  useEffect(() => {
    onCameraChange(hasCamera, stream);
  }, [hasCamera, stream, onCameraChange]);

  const initializeCamera = async () => {
    if (isCameraLoading) return;
    
    setIsCameraLoading(true);
    setCameraError(null);
    
    try {
      // Clean up any existing stream first
      cleanupCamera();

      console.log('🎥 Requesting camera access...');
      
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('✅ Camera access granted, stream received:', mediaStream);
      
      setStream(mediaStream);
      setHasCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            console.log('📹 Video metadata loaded, starting playback...');
            videoRef.current.play()
              .then(() => {
                console.log('✅ Video is now playing');
                toast({
                  title: "Camera activated! 📹",
                  description: "Your camera is now ready for mood analysis"
                });
              })
              .catch((playError) => {
                console.error('❌ Video play error:', playError);
                toast({
                  title: "Video playback issue",
                  description: "Camera connected but video playback failed. Try refreshing.",
                  variant: "destructive"
                });
              });
          }
        };
      }
      
    } catch (error: any) {
      console.error('❌ Camera access error:', error);
      
      let errorMessage = 'Camera access failed';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is being used by another application.';
      }
      
      setCameraError(errorMessage);
      setHasCamera(false);
      
      toast({
        title: "Camera access failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsCameraLoading(false);
    }
  };

  const stopCamera = () => {
    console.log('🛑 User requested to stop camera...');
    cleanupCamera();
    toast({
      title: "Camera stopped",
      description: "Camera access has been turned off"
    });
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current || !hasCamera) return null;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.8);
    } catch (error) {
      console.error('Error capturing frame:', error);
      return null;
    }
  };

  // Expose captureFrame function to parent
  useEffect(() => {
    onFrameCapture(captureFrame);
  }, [hasCamera, onFrameCapture]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <label className="text-sm font-medium text-gray-700 mb-2 block">
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
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-2">Camera not active</p>
            <p className="text-xs text-gray-500">Click below to enable camera for enhanced mood analysis</p>
          </div>
          <Button
            onClick={initializeCamera}
            disabled={isCameraLoading}
            variant="outline"
            className="w-full"
          >
            {isCameraLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                Requesting Camera Permission...
              </div>
            ) : (
              '📹 Enable Camera'
            )}
          </Button>
        </div>
      )}
      {cameraError && (
        <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{cameraError}</p>
        </div>
      )}
    </div>
  );
};

export default CameraManager;
