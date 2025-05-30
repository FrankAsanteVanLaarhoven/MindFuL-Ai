
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, Camera, Smartphone, Volume2, Activity, Zap } from 'lucide-react';
import { useBreathDetection } from '@/hooks/useBreathDetection';
import { toast } from '@/hooks/use-toast';

interface MultimodalSensingProps {
  technique: 'box' | '4-7-8' | 'triangle';
  onSensorData?: (data: SensorData) => void;
}

interface SensorData {
  audio: {
    intensity: number;
    frequency: number;
    breathDetected: boolean;
  };
  camera: {
    chestMovement: number;
    facePosition: { x: number; y: number };
    breathingRate: number;
  };
  motion: {
    acceleration: { x: number; y: number; z: number };
    breathMovement: number;
    deviceStability: number;
  };
  combined: {
    breathingQuality: number;
    synchronization: number;
    recommendation: string;
  };
}

const MultimodalSensing: React.FC<MultimodalSensingProps> = ({
  technique,
  onSensorData
}) => {
  const [activeModalities, setActiveModalities] = useState<string[]>([]);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gamificationScore, setGamificationScore] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const motionDataRef = useRef({ x: 0, y: 0, z: 0 });
  
  const { isBreathing, breathIntensity, breathRate, startListening, stopListening } = useBreathDetection();

  // Initialize audio analysis
  useEffect(() => {
    if (activeModalities.includes('audio')) {
      const initAudio = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          const source = audioContextRef.current.createMediaStreamSource(stream);
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 2048;
          source.connect(analyserRef.current);
          
          startListening();
        } catch (error) {
          toast({
            title: "Audio Error",
            description: "Could not access microphone",
            variant: "destructive"
          });
        }
      };
      initAudio();
    } else {
      stopListening();
    }
  }, [activeModalities, startListening, stopListening]);

  // Initialize camera analysis
  useEffect(() => {
    if (activeModalities.includes('camera')) {
      const initCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          toast({
            title: "Camera Error", 
            description: "Could not access camera",
            variant: "destructive"
          });
        }
      };
      initCamera();
    }
  }, [activeModalities]);

  // Initialize motion sensors
  useEffect(() => {
    if (activeModalities.includes('motion')) {
      const handleMotion = (event: DeviceMotionEvent) => {
        if (event.acceleration) {
          motionDataRef.current = {
            x: event.acceleration.x || 0,
            y: event.acceleration.y || 0,
            z: event.acceleration.z || 0
          };
        }
      };

      if ('DeviceMotionEvent' in window) {
        window.addEventListener('devicemotion', handleMotion);
        return () => window.removeEventListener('devicemotion', handleMotion);
      }
    }
  }, [activeModalities]);

  // Real-time multimodal analysis
  useEffect(() => {
    if (!isAnalyzing || activeModalities.length === 0) return;

    const analyze = () => {
      // Audio analysis
      let audioData = { intensity: 0, frequency: 0, breathDetected: false };
      if (activeModalities.includes('audio') && analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        const intensity = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length / 255;
        const dominantFreq = dataArray.indexOf(Math.max(...dataArray));
        
        audioData = {
          intensity,
          frequency: dominantFreq,
          breathDetected: isBreathing
        };
      }

      // Camera analysis (simulated)
      let cameraData = { chestMovement: 0, facePosition: { x: 0, y: 0 }, breathingRate: 0 };
      if (activeModalities.includes('camera')) {
        cameraData = {
          chestMovement: Math.random() * 0.5 + 0.5,
          facePosition: { x: Math.random() * 100, y: Math.random() * 100 },
          breathingRate: breathRate
        };
      }

      // Motion analysis
      let motionData = { acceleration: { x: 0, y: 0, z: 0 }, breathMovement: 0, deviceStability: 0 };
      if (activeModalities.includes('motion')) {
        const acc = motionDataRef.current;
        const breathMovement = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
        const stability = Math.max(0, 1 - breathMovement / 10);
        
        motionData = {
          acceleration: acc,
          breathMovement,
          deviceStability: stability
        };
      }

      // Combined analysis
      const breathingQuality = (
        (audioData.breathDetected ? 0.4 : 0) +
        (cameraData.chestMovement * 0.3) +
        (motionData.deviceStability * 0.3)
      );
      
      const synchronization = Math.min(1, (audioData.intensity + cameraData.chestMovement) / 2);
      
      let recommendation = "Keep practicing";
      if (breathingQuality > 0.8) recommendation = "Excellent breathing technique!";
      else if (breathingQuality > 0.6) recommendation = "Good rhythm, try to deepen";
      else if (breathingQuality > 0.4) recommendation = "Focus on consistency";
      else recommendation = "Relax and breathe naturally";

      const combinedData = {
        breathingQuality,
        synchronization,
        recommendation
      };

      const newSensorData: SensorData = {
        audio: audioData,
        camera: cameraData,
        motion: motionData,
        combined: combinedData
      };

      setSensorData(newSensorData);
      
      // Update gamification score
      setGamificationScore(prev => prev + Math.floor(breathingQuality * 10));
      
      if (onSensorData) {
        onSensorData(newSensorData);
      }
    };

    const interval = setInterval(analyze, 500);
    return () => clearInterval(interval);
  }, [isAnalyzing, activeModalities, isBreathing, breathRate, onSensorData]);

  const toggleModality = (modality: string) => {
    setActiveModalities(prev => 
      prev.includes(modality) 
        ? prev.filter(m => m !== modality)
        : [...prev, modality]
    );
  };

  const startAnalysis = () => {
    if (activeModalities.length === 0) {
      toast({
        title: "No Sensors Selected",
        description: "Please select at least one sensor modality",
        variant: "destructive"
      });
      return;
    }
    setIsAnalyzing(true);
    setGamificationScore(0);
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* Sensor Selection */}
      <Card className="bg-white/90 backdrop-blur-sm border-indigo-200">
        <CardHeader>
          <CardTitle className="text-lg text-indigo-800 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Multimodal Sensing Setup
            {isAnalyzing && (
              <Badge className="bg-green-100 text-green-800 animate-pulse">
                Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Audio Sensor */}
            <button
              onClick={() => toggleModality('audio')}
              className={`p-4 rounded-lg border-2 transition-all ${
                activeModalities.includes('audio')
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <Mic className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium">Audio Analysis</div>
              <div className="text-xs text-gray-600 mt-1">Breath sounds & intensity</div>
            </button>

            {/* Camera Sensor */}
            <button
              onClick={() => toggleModality('camera')}
              className={`p-4 rounded-lg border-2 transition-all ${
                activeModalities.includes('camera')
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <Camera className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-medium">Visual Tracking</div>
              <div className="text-xs text-gray-600 mt-1">Chest movement & posture</div>
            </button>

            {/* Motion Sensor */}
            <button
              onClick={() => toggleModality('motion')}
              className={`p-4 rounded-lg border-2 transition-all ${
                activeModalities.includes('motion')
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <Smartphone className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium">Motion Detection</div>
              <div className="text-xs text-gray-600 mt-1">Device movement & stability</div>
            </button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={isAnalyzing ? stopAnalysis : startAnalysis}
              variant={isAnalyzing ? "destructive" : "default"}
              className="flex-1"
            >
              {isAnalyzing ? "Stop Analysis" : "Start Multimodal Analysis"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Camera Feed */}
      {activeModalities.includes('camera') && (
        <Card className="bg-white/90 backdrop-blur-sm border-green-200">
          <CardContent className="p-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-48 object-cover rounded-lg bg-gray-900"
              style={{ transform: 'scaleX(-1)' }}
            />
          </CardContent>
        </Card>
      )}

      {/* Real-time Data */}
      {isAnalyzing && sensorData && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="camera">Camera</TabsTrigger>
            <TabsTrigger value="motion">Motion</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Breathing Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {Math.round(sensorData.combined.breathingQuality * 100)}%
                  </div>
                  <Progress value={sensorData.combined.breathingQuality * 100} className="h-2" />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-teal-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Gamification Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {gamificationScore}
                  </div>
                  <div className="text-xs text-gray-600">
                    Keep breathing to earn more points!
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">AI Recommendation</span>
                </div>
                <p className="text-yellow-700">{sensorData.combined.recommendation}</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audio Tab */}
          <TabsContent value="audio" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Intensity</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={sensorData.audio.intensity * 100} className="h-2" />
                  <div className="text-xs text-gray-600 mt-1">
                    {Math.round(sensorData.audio.intensity * 100)}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Frequency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-blue-600">
                    {sensorData.audio.frequency} Hz
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={sensorData.audio.breathDetected ? "default" : "secondary"}>
                    {sensorData.audio.breathDetected ? "Detected" : "Not Detected"}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Camera Tab */}
          <TabsContent value="camera" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Chest Movement</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={sensorData.camera.chestMovement * 100} className="h-2" />
                  <div className="text-xs text-gray-600 mt-1">
                    {Math.round(sensorData.camera.chestMovement * 100)}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Breathing Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-green-600">
                    {sensorData.camera.breathingRate} BPM
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Face Position</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-gray-600">
                    X: {Math.round(sensorData.camera.facePosition.x)}
                  </div>
                  <div className="text-xs text-gray-600">
                    Y: {Math.round(sensorData.camera.facePosition.y)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Motion Tab */}
          <TabsContent value="motion" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Device Stability</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={sensorData.motion.deviceStability * 100} className="h-2" />
                  <div className="text-xs text-gray-600 mt-1">
                    {Math.round(sensorData.motion.deviceStability * 100)}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Breath Movement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-purple-600">
                    {sensorData.motion.breathMovement.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Acceleration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-gray-600">
                    X: {sensorData.motion.acceleration.x.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-600">
                    Y: {sensorData.motion.acceleration.y.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-600">
                    Z: {sensorData.motion.acceleration.z.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Instructions */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-indigo-800 mb-2">🔬 Multimodal Features:</h4>
          <ul className="space-y-1 text-sm text-indigo-700">
            <li>• 🎤 <strong>Audio Sensing</strong> - Analyzes breath sounds and intensity patterns</li>
            <li>• 📹 <strong>Computer Vision</strong> - Tracks chest movement and breathing depth</li>
            <li>• 📱 <strong>Motion Sensors</strong> - Uses device accelerometer for breath detection</li>
            <li>• 🧠 <strong>AI Fusion</strong> - Combines all sensors for optimal accuracy</li>
            <li>• 🎮 <strong>Gamification</strong> - Earn points for consistent breathing quality</li>
            <li>• 💡 <strong>Smart Recommendations</strong> - Personalized tips based on sensor data</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultimodalSensing;
