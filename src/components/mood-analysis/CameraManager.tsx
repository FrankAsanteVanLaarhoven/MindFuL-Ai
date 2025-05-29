
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Camera, RefreshCw, Settings } from 'lucide-react';

interface CameraManagerProps {
  onCameraChange: (hasCamera: boolean, stream: MediaStream | null) => void;
  onFrameCapture: (captureFunc: () => string | null) => void;
}

const CameraManager: React.FC<CameraManagerProps> = ({ onCameraChange, onFrameCapture }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('unknown');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Check camera permission status
  const checkCameraPermission = async () => {
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setPermissionState(permission.state);
        console.log('📹 Camera permission state:', permission.state);
        
        permission.onchange = () => {
          setPermissionState(permission.state);
          console.log('📹 Camera permission changed to:', permission.state);
        };
      }
    } catch (error) {
      console.log('📹 Cannot check camera permissions:', error);
      setPermissionState('unknown');
    }
  };

  useEffect(() => {
    checkCameraPermission();
  }, []);

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
    setIsVideoLoaded(false);
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
    setIsVideoLoaded(false);
    
    try {
      // Clean up any existing stream first
      cleanupCamera();

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
      console.log('✅ Camera access granted, stream received:', mediaStream);
      console.log('📹 Video tracks:', mediaStream.getVideoTracks());
      
      // Check if tracks are actually active
      const videoTracks = mediaStream.getVideoTracks();
      if (videoTracks.length === 0) {
        throw new Error('No video tracks available');
      }
      
      const videoTrack = videoTracks[0];
      if (videoTrack.readyState !== 'live') {
        throw new Error('Video track is not live');
      }
      
      setStream(mediaStream);
      setPermissionState('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video metadata to load
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            console.log('📹 Video metadata loaded, dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
            
            // Check if video has valid dimensions
            if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
              setCameraError('Camera stream has no video data. Please check if another app is using the camera.');
              return;
            }
            
            videoRef.current.play()
              .then(() => {
                console.log('✅ Video is now playing');
                setIsVideoLoaded(true);
                setHasCamera(true);
                toast({
                  title: "Camera activated! 📹",
                  description: "Your camera is now ready for mood analysis"
                });
              })
              .catch((playError) => {
                console.error('❌ Video play error:', playError);
                setHasCamera(false);
                setCameraError('Video playback failed. Please refresh the page and try again.');
              });
          }
        };

        // Handle video loading errors
        videoRef.current.onerror = (error) => {
          console.error('❌ Video element error:', error);
          setHasCamera(false);
          setCameraError('Video display error. Please check camera permissions and try again.');
        };

        // Handle video stream ended
        videoRef.current.onended = () => {
          console.log('📹 Video stream ended');
          setHasCamera(false);
          setCameraError('Camera stream ended. Another app may have taken control of the camera.');
        };
      }
      
    } catch (error: any) {
      console.error('❌ Camera access error:', error);
      
      let errorMessage = 'Camera access failed';
      let troubleshootingTips: string[] = [];
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied';
        troubleshootingTips = [
          'Click the camera icon in your browser address bar',
          'Select "Allow" for camera access',
          'Refresh the page and try again'
        ];
        setPermissionState('denied');
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device';
        troubleshootingTips = [
          'Check if your camera is properly connected',
          'Try using a different camera if available',
          'Restart your browser or computer'
        ];
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is being used by another application';
        troubleshootingTips = [
          'Close other apps that might be using the camera (Zoom, Teams, etc.)',
          'Close other browser tabs with camera access',
          'Restart your browser and try again'
        ];
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Camera constraints not supported';
        troubleshootingTips = [
          'Your camera may not support the required resolution',
          'Try using a different camera',
          'Update your camera drivers'
        ];
      } else {
        troubleshootingTips = [
          'Check system camera privacy settings',
          'Ensure browser has camera permissions',
          'Try refreshing the page'
        ];
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
    if (!videoRef.current || !canvasRef.current || !hasCamera || !isVideoLoaded) {
      console.log('❌ Cannot capture frame: missing video, canvas, or camera not active');
      return null;
    }
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.log('❌ Cannot get canvas context');
      return null;
    }
    
    // Ensure video has valid dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.log('❌ Video has no dimensions');
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
  };

  // Expose captureFrame function to parent
  useEffect(() => {
    onFrameCapture(captureFrame);
  }, [hasCamera, isVideoLoaded, onFrameCapture]);

  const TroubleshootingAlert = () => {
    if (!cameraError) return null;

    const troubleshootingSteps = [
      'Check camera permissions in your browser',
      'Close other apps that might be using the camera',
      'Check system privacy settings for camera access',
      'Test camera in another app to verify it works',
      'Refresh the page and try again'
    ];

    return (
      <Alert className="mt-3 border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <div className="space-y-2">
            <p className="font-medium">{cameraError}</p>
            <div className="text-sm">
              <p className="font-medium mb-1">Troubleshooting steps:</p>
              <ul className="list-disc list-inside space-y-1">
                {troubleshootingSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  };

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
            {/* Debug info */}
            {videoRef.current && (
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {videoRef.current.videoWidth}x{videoRef.current.videoHeight}
              </div>
            )}
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
            {permissionState === 'denied' && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                Camera permission denied. Please enable in browser settings.
              </div>
            )}
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
                  Requesting Camera...
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
      
      <TroubleshootingAlert />
    </div>
  );
};

export default CameraManager;
