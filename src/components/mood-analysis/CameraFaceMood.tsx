
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
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

const verdictMap = {
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

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setVerdict("Loading AI models...");
        const MODEL_URL = "/models";
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        
        setLoading(false);
        setVerdict("Models loaded. Starting camera...");
        sendAnalytics("models_loaded", { success: true });
      } catch (error) {
        console.error('Error loading models:', error);
        setVerdict("Error loading AI models. Please refresh.");
        setLoading(false);
        sendAnalytics("models_load_error", { error: error.message });
      }
    };
    
    loadModels();
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
      sendAnalytics("camera_error", { error: error.message, facingMode });
      
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

  // Face detection and expression analysis
  useEffect(() => {
    if (!isVideoReady || loading || !isActive) return;

    const detectFaces = async () => {
      if (
        videoRef.current &&
        videoRef.current.readyState === 4 &&
        faceapi.nets.tinyFaceDetector.params &&
        canvasRef.current
      ) {
        try {
          const detections = await faceapi
            .detectSingleFace(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions({ inputSize: 416 })
            )
            .withFaceExpressions();

          // Clear canvas
          const context = canvasRef.current.getContext('2d');
          if (context) {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }

          if (detections && detections.expressions) {
            setFaceDetected(true);
            
            // Get the dominant expression
            const expressions = Object.entries(detections.expressions);
            const [dominantExpression, expressionConfidence] = expressions.reduce(
              (max, current) => current[1] > max[1] ? current : max
            );
            
            const mood = dominantExpression;
            const conf = expressionConfidence;
            
            setCurrentMood(mood);
            setConfidence(conf);
            
            const verdictText = `${verdictMap[mood] || "Expression detected."} (${(conf * 100).toFixed(1)}% confident)`;
            setVerdict(verdictText);
            
            // Call parent callback
            if (onMoodChange) {
              onMoodChange(mood, conf);
            }
            
            // Send analytics
            sendAnalytics("expression_detected", { 
              expression: mood, 
              confidence: conf,
              allExpressions: detections.expressions 
            });

            // Draw detection box and expressions
            const dims = faceapi.matchDimensions(canvasRef.current, videoRef.current, true);
            const resizedDetection = faceapi.resizeResults(detections, dims);
            
            faceapi.draw.drawDetections(canvasRef.current, resizedDetection);
            faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetection);
            
          } else {
            setFaceDetected(false);
            setVerdict("No face detected. Please position your face in the camera.");
          }
        } catch (error) {
          console.error('Face detection error:', error);
          setVerdict("Error during face detection.");
        }
      }
    };

    intervalRef.current = setInterval(detectFaces, 100);
    
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
    switch (mood) {
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
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 rounded-lg">
                <div className="text-white text-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p>Loading...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={toggleFacingMode}
            variant="outline"
            className="flex items-center gap-2"
            aria-label={`Switch to ${facingMode === "user" ? "rear" : "front"} camera`}
            disabled={!isVideoReady}
          >
            <SwitchCamera className="w-4 h-4" />
            Switch Camera
          </Button>
        </div>

        <div
          className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-center"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-gray-800 font-medium">{verdict}</p>
          {currentMood && confidence > 0 && (
            <div className="mt-2 flex justify-center gap-2">
              <Badge className={getMoodColor(currentMood)}>
                {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)}
              </Badge>
              <Badge variant="outline">
                {(confidence * 100).toFixed(1)}% confident
              </Badge>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h3 className="font-semibold text-blue-800 text-sm mb-1">
            Privacy & Accessibility
          </h3>
          <ul className="text-blue-700 text-xs space-y-1">
            <li>• All processing happens locally in your browser</li>
            <li>• No video data is sent to external servers</li>
            <li>• Screen reader compatible with live status updates</li>
            <li>• Keyboard accessible camera controls</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraFaceMood;
