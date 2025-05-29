
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
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInitializingRef = useRef(false);
  const { toast } = useToast();

  // Cleanup function
  const cleanupCamera = useCallback(() => {
    console.log('🧹 Cleaning up camera stream...');
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('🛑 Track stopped:', track.kind);
      });
    }
    setStream(null);
    setHasCamera(false);
    setCameraError(null);
    setIsVideoLoaded(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    isInitializingRef.current = false;
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupCamera();
    };
  }, [cleanupCamera]);

  // Update parent when camera state changes
  useEffect(() => {
    onCameraChange(hasCamera, stream);
  }, [hasCamera, stream, onCameraChange]);

  const initializeCamera = async () => {
    if (isInitializingRef.current || isCameraLoading) {
      console.log('⚠️ Camera initialization already in progress, skipping...');
      return;
    }
    
    isInitializingRef.current = true;
    setIsCameraLoading(true);
    setCameraError(null);
    setIsVideoLoaded(false);
    
    try {
      console.log('🎥 Requesting camera access...');
      
      const constraints = {
        video: {
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          facingMode: 'user'
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('✅ Camera access granted, stream received');
      
      // Check if component is still mounted
      if (!isInitializingRef.current) {
        console.log('❌ Component unmounted during initialization');
        mediaStream.getTracks().forEach(track => track.stop());
        return;
      }
      
      const videoTracks = mediaStream.getVideoTracks();
      if (videoTracks.length === 0) {
        throw new Error('No video tracks available');
      }
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        const handleLoadedMetadata = () => {
          if (videoRef.current && isInitializingRef.current) {
            console.log('📹 Video metadata loaded');
            
            if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
              setCameraError('Camera stream has no video data');
              return;
            }
            
            videoRef.current.play()
              .then(() => {
                console.log('✅ Video playing successfully');
                setIsVideoLoaded(true);
                setHasCamera(true);
                isInitializingRef.current = false;
                toast({
                  title: "Camera activated! 📹",
                  description: "Your camera is now ready for mood analysis"
                });
              })
              .catch((playError) => {
                console.error('❌ Video play error:', playError);
                setCameraError('Video playback failed');
                isInitializingRef.current = false;
              });
          }
        };

        const handleError = () => {
          console.error('❌ Video element error');
          setCameraError('Video display error');
          isInitializingRef.current = false;
        };

        videoRef.current.onloadedmetadata = handleLoadedMetadata;
        videoRef.current.onerror = handleError;
      }
      
    } catch (error: any) {
      console.error('❌ Camera access error:', error);
      
      let errorMessage = 'Camera access failed';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and refresh.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is being used by another application';
      }
      
      setCameraError(errorMessage);
      setHasCamera(false);
      isInitializingRef.current = false;
      
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

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current || !hasCamera || !isVideoLoaded) {
      console.log('❌ Cannot capture frame: missing requirements');
      return null;
    }
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
      console.log('❌ Cannot capture: invalid video dimensions');
      return null;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      console.log('📸 Frame captured successfully');
      return dataUrl;
    } catch (error) {
      console.error('❌ Error capturing frame:', error);
      return null;
    }
  }, [hasCamera, isVideoLoaded]);

  // Expose captureFrame function to parent
  useEffect(() => {
    onFrameCapture(captureFrame);
  }, [onFrameCapture, captureFrame]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        Camera Analysis
      </label>
      
      {hasCamera && isVideoLoaded ? (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden border border-indigo-200 bg-black min-h-[200px]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-48 object-cover bg-black"
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
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center min-h-[200px] flex flex-col justify-center">
            <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">Camera not active</p>
            <p className="text-xs text-gray-500">Click below to enable camera for enhanced mood analysis</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={initializeCamera}
              disabled={isCameraLoading}
              variant="outline"
              className="flex-1"
            >
              {isCameraLoading ? (
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
            {cameraError && (
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="px-3"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
      
      {cameraError && (
        <Alert className="mt-3 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <p className="font-medium">{cameraError}</p>
            <p className="text-sm mt-1">Try refreshing the page or check camera permissions in your browser.</p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CameraManager;
