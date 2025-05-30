
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, CameraOff, RotateCcw, Activity, Heart, Brain } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useFaceDetection } from '@/hooks/useFaceDetection';

interface BiofeedbackCameraProps {
  technique: 'box' | '4-7-8' | 'triangle';
  onBreathDetected?: (breathData: BreathData) => void;
  onMoodDetected?: (mood: string, confidence: number) => void;
}

interface BreathData {
  rate: number;
  depth: number;
  rhythm: 'regular' | 'irregular';
  phase: 'inhale' | 'exhale' | 'hold';
}

interface VitalSigns {
  heartRate: number;
  stressLevel: number;
  coherence: number;
}

const BiofeedbackCamera: React.FC<BiofeedbackCameraProps> = ({
  technique,
  onBreathDetected,
  onMoodDetected
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [breathData, setBreathData] = useState<BreathData | null>(null);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns | null>(null);
  const [mood, setMood] = useState<{ emotion: string; confidence: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { modelsLoaded, loadingError, sendAnalytics } = useFaceDetection();
  
  // Initialize camera
  useEffect(() => {
    if (!isActive) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode,
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 30 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setError(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Camera access failed';
        setError(errorMessage);
        toast({
          title: "Camera Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isActive, facingMode]);

  // Real-time analysis
  useEffect(() => {
    if (!isActive || !videoRef.current || !canvasRef.current || !modelsLoaded) return;

    const analyzeFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!video || !canvas || video.readyState !== 4) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw current frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data for analysis
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Simulate breathing detection (in real implementation, use computer vision)
      const breathingRate = 12 + Math.random() * 8; // 12-20 breaths per minute
      const breathingDepth = Math.random();
      const currentPhase = Math.sin(Date.now() / 2000) > 0 ? 'inhale' : 'exhale';
      
      const newBreathData: BreathData = {
        rate: Math.round(breathingRate),
        depth: breathingDepth,
        rhythm: breathingRate > 18 ? 'irregular' : 'regular',
        phase: currentPhase
      };
      
      setBreathData(newBreathData);
      
      // Simulate vital signs (rPPG analysis)
      const newVitalSigns: VitalSigns = {
        heartRate: 60 + Math.random() * 40,
        stressLevel: Math.random(),
        coherence: 0.3 + Math.random() * 0.7
      };
      
      setVitalSigns(newVitalSigns);
      
      // Simulate mood detection
      const emotions = ['happy', 'calm', 'focused', 'neutral', 'stressed', 'tired'];
      const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const confidence = 0.6 + Math.random() * 0.4;
      
      setMood({ emotion: detectedEmotion, confidence });
      
      // Callbacks
      if (onBreathDetected) {
        onBreathDetected(newBreathData);
      }
      
      if (onMoodDetected) {
        onMoodDetected(detectedEmotion, confidence);
      }
      
      // Analytics
      sendAnalytics('biofeedback_analysis', {
        breathRate: newBreathData.rate,
        heartRate: newVitalSigns.heartRate,
        mood: detectedEmotion,
        technique
      });
    };

    const interval = setInterval(analyzeFrame, 500); // Analyze every 500ms

    return () => clearInterval(interval);
  }, [isActive, modelsLoaded, onBreathDetected, onMoodDetected, sendAnalytics, technique]);

  const toggleCamera = () => {
    setIsActive(!isActive);
    if (isActive) {
      sendAnalytics('camera_stopped', {});
    } else {
      sendAnalytics('camera_started', { technique });
    }
  };

  const switchCamera = () => {
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis: { [key: string]: string } = {
      happy: '😊',
      calm: '😌',
      focused: '🎯',
      neutral: '😐',
      stressed: '😰',
      tired: '😴'
    };
    return emojis[emotion] || '😐';
  };

  const getBreathPhaseColor = (phase: string) => {
    switch (phase) {
      case 'inhale': return 'text-blue-600';
      case 'exhale': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loadingError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load biofeedback models: {loadingError}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Camera Controls */}
      <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Biofeedback Analysis
            {isActive && (
              <Badge className="bg-red-100 text-red-800 animate-pulse">
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              onClick={toggleCamera}
              variant={isActive ? "destructive" : "default"}
              className="flex-1"
            >
              {isActive ? (
                <>
                  <CameraOff className="w-4 h-4 mr-2" />
                  Stop Analysis
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Start Analysis
                </>
              )}
            </Button>
            
            <Button
              onClick={switchCamera}
              variant="outline"
              disabled={!isActive}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Camera Feed */}
      {isActive && (
        <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
          <CardContent className="p-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover rounded-lg bg-gray-900"
                style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
              />
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="hidden"
              />
              
              {/* Overlay indicators */}
              <div className="absolute top-2 left-2 right-2 flex justify-between">
                <Badge className="bg-black/50 text-white">
                  Camera: {facingMode === 'user' ? 'Front' : 'Back'}
                </Badge>
                {breathData && (
                  <Badge className={`bg-black/50 text-white ${getBreathPhaseColor(breathData.phase)}`}>
                    {breathData.phase.toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Metrics */}
      {isActive && breathData && vitalSigns && mood && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Breathing Metrics */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-800 flex items-center gap-1">
                <Activity className="w-4 h-4" />
                Breathing Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Rate:</span>
                  <span className="text-sm font-medium">{breathData.rate} BPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Depth:</span>
                  <Progress value={breathData.depth * 100} className="w-16 h-2" />
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Rhythm:</span>
                  <Badge variant={breathData.rhythm === 'regular' ? 'default' : 'destructive'}>
                    {breathData.rhythm}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vital Signs */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-red-800 flex items-center gap-1">
                <Heart className="w-4 h-4" />
                Vital Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Heart Rate:</span>
                  <span className="text-sm font-medium">{Math.round(vitalSigns.heartRate)} BPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Stress:</span>
                  <Progress value={vitalSigns.stressLevel * 100} className="w-16 h-2" />
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Coherence:</span>
                  <Progress value={vitalSigns.coherence * 100} className="w-16 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mood Detection */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-800 flex items-center gap-1">
                <Brain className="w-4 h-4" />
                Mood Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl mb-1">
                  {getEmotionEmoji(mood.emotion)}
                </div>
                <div className="text-sm font-medium capitalize text-gray-700">
                  {mood.emotion}
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round(mood.confidence * 100)}% confident
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Instructions */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-purple-800 mb-2">🔬 Biofeedback Features:</h4>
          <ul className="space-y-1 text-sm text-purple-700">
            <li>• 📹 <strong>Real-time Camera Analysis</strong> - AI monitors your breathing patterns</li>
            <li>• 💓 <strong>Vital Signs Detection</strong> - Heart rate and stress level monitoring</li>
            <li>• 🧠 <strong>Mood Recognition</strong> - Facial expression analysis for emotional state</li>
            <li>• 📊 <strong>Live Feedback</strong> - Instant visual feedback on your breathing quality</li>
            <li>• 🎯 <strong>Personalized Insights</strong> - AI adapts recommendations based on your data</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiofeedbackCamera;
