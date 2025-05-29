
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SwitchCamera, Camera, CameraOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CameraFaceMoodProps {
  userId?: string;
  onMoodChange?: (mood: string, confidence: number) => void;
  isActive?: boolean;
}

const verdictMap: Record<string, string> = {
  happy: "You look happy!",
  sad: "You seem sad.",
  angry: "You appear angry.",
  surprised: "You look surprised!",
  disgusted: "You look disgusted.",
  fearful: "You seem fearful.",
  neutral: "You look calm and neutral."
};

const CameraFaceMood: React.FC<CameraFaceMoodProps> = ({ 
  userId = 'default-user', 
  onMoodChange,
  isActive = true 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [verdict, setVerdict] = useState("Initializing mood detection...");
  const [loading, setLoading] = useState(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [currentMood, setCurrentMood] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);
  const [faceDetected, setFaceDetected] = useState(false);

  const { toast } = useToast();

  // Analytics event sender
  const sendAnalytics = useCallback((eventType: string, details: any) => {
    const analyticsData = {
      userId,
      eventType,
      timestamp: new Date().toISOString(),
      details
    };
    
    console.log('Analytics Event:', analyticsData);
    
    // In a real implementation, you would send this to your backend
    // fetch("/api/analytics/events", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(analyticsData)
    // }).catch(console.error);
  }, [userId]);

  // Initialize demo mode
  useEffect(() => {
    const initializeDemo = async () => {
      try {
        setVerdict("Demo mode loaded. Starting camera...");
        setLoading(false);
        sendAnalytics("models_loaded", { success: true });
      } catch (error) {
        console.error('Error loading models:', error);
        setVerdict("Error loading AI models. Please refresh.");
        setLoading(false);
        sendAnalytics("models_load_error", { error: (error as Error).message });
      }
    };
    
    initializeDemo();
  }, [sendAnalytics]);

  // Start video stream
  const startVideo = useCallback(async () => {
    if (loading || !isActive) return;
    
    try {
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      setVerdict("Requesting camera access...");
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsVideoReady(true);
          setVerdict("Camera ready. Looking for faces...");
        };
      }
      
      sendAnalytics("camera_started", { facingMode });
      
    } catch (error) {
      console.error('Camera error:', error);
      setVerdict("Camera access denied or not available.");
      sendAnalytics("camera_error", { error: (error as Error).message, facingMode });
      
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [loading, facingMode, isActive, sendAnalytics, toast]);

  // Stop video stream
  const stopVideo = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsVideoReady(false);
    setVerdict("Camera stopped.");
    sendAnalytics("camera_stopped", {});
  }, [sendAnalytics]);

  // Start/stop video based on isActive
  useEffect(() => {
    if (isActive && !loading) {
      startVideo();
    } else {
      stopVideo();
    }
    
    return () => stopVideo();
  }, [isActive, loading, facingMode]);

  // Mock face detection for demo
  useEffect(() => {
    if (!isVideoReady || loading || !isActive) return;

    const detectFaces = async () => {
      try {
        // Simulate face detection with random mood
        const moods = ['happy', 'sad', 'neutral', 'surprised', 'angry'];
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        const randomConfidence = 0.7 + Math.random() * 0.3;
        
        // Simulate face detection occasionally
        if (Math.random() > 0.3) {
          setFaceDetected(true);
          setCurrentMood(randomMood);
          setConfidence(randomConfidence);
          
          const verdictText = `${verdictMap[randomMood] || "Expression detected."} (${(randomConfidence * 100).toFixed(1)}% confident)`;
          setVerdict(verdictText);
          
          // Call parent callback
          if (onMoodChange) {
            onMoodChange(randomMood, randomConfidence);
          }
          
          // Send analytics
          sendAnalytics("expression_detected", { 
            expression: randomMood, 
            confidence: randomConfidence
          });
        } else {
          setFaceDetected(false);
          setVerdict("No face detected. Please position your face in the camera.");
        }
      } catch (error) {
        console.error('Face detection error:', error);
        setVerdict("Error during face detection.");
      }
    };

    intervalRef.current = setInterval(detectFaces, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isVideoReady, loading, isActive, onMoodChange, sendAnalytics]);

  // Camera switcher
  const toggleFacingMode = () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    sendAnalytics("camera_switched", { from: facingMode, to: newMode });
  };

  const getMoodColor = (mood: string) => {
    switch(mood) {
      case 'happy': return 'bg-green-100 text-green-800';
      case 'sad': return 'bg-blue-100 text-blue-800';
      case 'angry': return 'bg-red-100 text-red-800';
      case 'surprised': return 'bg-yellow-100 text-yellow-800';
      case 'fearful': return 'bg-purple-100 text-purple-800';
      case 'disgusted': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className="bg-white/90 backdrop-blur-sm border-indigo-200 shadow-lg"
      role="region"
      aria-label="Camera face mood detection"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-800">
          <Camera className="w-5 h-5" />
          Real-Time Face Mood Detection
          {faceDetected && (
            <Badge className="bg-green-100 text-green-800">
              Face Detected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Video Display */}
        <div className="relative flex justify-center">
          <div style={{ position: "relative", width: 320, height: 240 }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              width={320}
              height={240}
              className="rounded-lg bg-gray-800 border-2 border-indigo-200"
              aria-label="Live camera feed for face mood detection"
            />
            <canvas
              ref={canvasRef}
              width={320}
              height={240}
              className="absolute top-0 left-0 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <Button
            onClick={toggleFacingMode}
            variant="outline"
            size="sm"
            aria-label="Switch camera"
          >
            <SwitchCamera className="w-4 h-4 mr-2" />
            Switch Camera
          </Button>
          
          <Button
            onClick={isActive ? stopVideo : startVideo}
            variant={isActive ? "destructive" : "default"}
            size="sm"
          >
            {isActive ? (
              <>
                <CameraOff className="w-4 h-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>

        {/* Status Display */}
        <div
          className="p-3 rounded-lg text-center bg-gray-50"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="text-sm font-medium text-gray-700">
            {verdict}
          </div>
          
          {currentMood && faceDetected && (
            <div className="mt-2 flex justify-center">
              <Badge className={getMoodColor(currentMood)}>
                {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)} 
                ({(confidence * 100).toFixed(1)}%)
              </Badge>
            </div>
          )}
        </div>

        {/* Demo Notice */}
        <div className="text-xs text-gray-500 text-center p-2 bg-yellow-50 rounded border border-yellow-200">
          Demo Mode: Simulated face detection. Real AI models will be loaded when face-api.js is properly configured.
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraFaceMood;
