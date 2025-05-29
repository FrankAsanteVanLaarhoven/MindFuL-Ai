
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Users, Settings, Shield, Battery } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FaceData {
  id: string;
  expressions: Record<string, number>;
  confidence: number;
  dominantEmotion: string;
  box: { x: number; y: number; width: number; height: number };
}

interface PrivacySettings {
  analyticsEnabled: boolean;
  dataRetention: '1day' | '7days' | '30days' | 'never';
  shareAggregatedData: boolean;
  localProcessingOnly: boolean;
}

interface AdvancedFaceDetectionProps {
  userId?: string;
  onMultiFaceDetection?: (faces: FaceData[]) => void;
  customVerdicts?: Record<string, string>;
  maxFaces?: number;
  detectionInterval?: number;
  enableBatteryOptimization?: boolean;
}

const defaultVerdicts = {
  happy: "Positive energy detected!",
  sad: "Contemplative mood observed",
  angry: "Intense emotion detected",
  surprised: "High engagement level",
  fearful: "Cautious state detected",
  disgusted: "Critical assessment mode",
  neutral: "Calm and focused"
};

const AdvancedFaceDetection: React.FC<AdvancedFaceDetectionProps> = ({
  userId = 'default-user',
  onMultiFaceDetection,
  customVerdicts = defaultVerdicts,
  maxFaces = 10,
  detectionInterval = 500,
  enableBatteryOptimization = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDetectionTime = useRef<number>(0);
  
  const [isActive, setIsActive] = useState(false);
  const [detectedFaces, setDetectedFaces] = useState<FaceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const [currentInterval, setCurrentInterval] = useState(detectionInterval);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    analyticsEnabled: false,
    dataRetention: '1day',
    shareAggregatedData: false,
    localProcessingOnly: true
  });
  const [performanceMode, setPerformanceMode] = useState<'high' | 'balanced' | 'battery'>('balanced');
  
  const { toast } = useToast();

  // Load face-api.js models with optimization
  useEffect(() => {
    const loadModels = async () => {
      try {
        // For now, simulate loading without face-api.js
        setIsLoading(false);
        setFaceApiLoaded(true);
        
        if (privacySettings.analyticsEnabled) {
          sendAnalytics("models_loaded", { performanceMode, modelsCount: 2 });
        }
        
        toast({
          title: "Demo Mode",
          description: "Running in demo mode. Face-api.js models will be loaded when available.",
        });
      } catch (error) {
        console.error('Error loading models:', error);
        setIsLoading(false);
        toast({
          title: "Model Loading Error",
          description: "Failed to load AI models. Please refresh and try again.",
          variant: "destructive"
        });
      }
    };

    loadModels();
  }, [performanceMode, privacySettings.analyticsEnabled, toast]);

  // Privacy-compliant analytics
  const sendAnalytics = useCallback((eventType: string, details: any) => {
    if (!privacySettings.analyticsEnabled || !privacySettings.localProcessingOnly) return;
    
    const analyticsData = {
      userId: privacySettings.shareAggregatedData ? userId : 'anonymous',
      eventType,
      timestamp: new Date().toISOString(),
      details: privacySettings.shareAggregatedData ? details : { count: details.count || 1 }
    };
    
    console.log('Privacy-Compliant Analytics:', analyticsData);
    
    // Store locally with retention policy
    const storageKey = 'faceDetectionAnalytics';
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    existing.push(analyticsData);
    
    // Apply retention policy
    const retentionMs = {
      '1day': 24 * 60 * 60 * 1000,
      '7days': 7 * 24 * 60 * 60 * 1000,
      '30days': 30 * 24 * 60 * 60 * 1000,
      'never': 0
    }[privacySettings.dataRetention];
    
    if (retentionMs > 0) {
      const cutoff = Date.now() - retentionMs;
      const filtered = existing.filter((item: any) => new Date(item.timestamp).getTime() > cutoff);
      localStorage.setItem(storageKey, JSON.stringify(filtered));
    } else if (privacySettings.dataRetention === 'never') {
      localStorage.removeItem(storageKey);
    }
  }, [userId, privacySettings]);

  // Dynamic interval adjustment for battery optimization
  const adjustDetectionInterval = useCallback(() => {
    if (!enableBatteryOptimization) return;
    
    const now = Date.now();
    const timeSinceLastDetection = now - lastDetectionTime.current;
    
    // Reduce frequency if no faces detected recently
    if (detectedFaces.length === 0 && timeSinceLastDetection > 5000) {
      setCurrentInterval(Math.min(currentInterval * 1.5, 2000));
    } else if (detectedFaces.length > 0) {
      setCurrentInterval(detectionInterval);
    }
  }, [detectedFaces.length, currentInterval, detectionInterval, enableBatteryOptimization]);

  // Start camera with privacy controls
  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: performanceMode === 'battery' ? 320 : 640 },
          height: { ideal: performanceMode === 'battery' ? 240 : 480 },
          frameRate: { ideal: performanceMode === 'battery' ? 15 : 30 }
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsActive(true);
      if (privacySettings.analyticsEnabled) {
        sendAnalytics("camera_started", { performanceMode });
      }
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to use face detection.",
        variant: "destructive"
      });
    }
  }, [performanceMode, privacySettings.analyticsEnabled, sendAnalytics, toast]);

  // Mock multi-face detection for demo
  useEffect(() => {
    if (!isActive || !faceApiLoaded || isLoading) return;

    const detectMultipleFaces = async () => {
      try {
        // Simulate face detection with random data
        const mockFaces: FaceData[] = [];
        const numFaces = Math.floor(Math.random() * 3); // 0-2 faces
        
        for (let i = 0; i < numFaces; i++) {
          const emotions = ['happy', 'sad', 'neutral', 'surprised'];
          const dominantEmotion = emotions[Math.floor(Math.random() * emotions.length)];
          
          mockFaces.push({
            id: `face-${i}`,
            expressions: {
              [dominantEmotion]: 0.8 + Math.random() * 0.2,
              neutral: Math.random() * 0.5
            },
            confidence: 0.7 + Math.random() * 0.3,
            dominantEmotion,
            box: {
              x: Math.random() * 200,
              y: Math.random() * 200,
              width: 100 + Math.random() * 50,
              height: 100 + Math.random() * 50
            }
          });
        }

        if (mockFaces.length > 0) {
          lastDetectionTime.current = Date.now();
          setDetectedFaces(mockFaces);
          
          if (onMultiFaceDetection) {
            onMultiFaceDetection(mockFaces);
          }

          if (privacySettings.analyticsEnabled) {
            sendAnalytics("faces_detected", { 
              count: mockFaces.length,
              emotions: mockFaces.map(f => f.dominantEmotion)
            });
          }
        } else {
          setDetectedFaces([]);
        }

        adjustDetectionInterval();
      } catch (error) {
        console.error('Face detection error:', error);
      }
    };

    intervalRef.current = setInterval(detectMultipleFaces, currentInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, faceApiLoaded, isLoading, currentInterval, maxFaces, performanceMode, privacySettings.analyticsEnabled, sendAnalytics, onMultiFaceDetection, adjustDetectionInterval]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
    setDetectedFaces([]);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-indigo-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-800">
          <Users className="w-5 h-5" />
          Advanced Multi-Face Detection
          <Badge variant="outline" className="ml-auto">
            {detectedFaces.length} faces
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Privacy Controls */}
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <h4 className="font-semibold text-blue-800">Privacy & Data Controls</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span>Enable Analytics</span>
              <Switch
                checked={privacySettings.analyticsEnabled}
                onCheckedChange={(checked) => 
                  setPrivacySettings(prev => ({ ...prev, analyticsEnabled: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>Local Processing Only</span>
              <Switch
                checked={privacySettings.localProcessingOnly}
                onCheckedChange={(checked) => 
                  setPrivacySettings(prev => ({ ...prev, localProcessingOnly: checked }))
                }
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Retention</label>
            <Select
              value={privacySettings.dataRetention}
              onValueChange={(value: any) => 
                setPrivacySettings(prev => ({ ...prev, dataRetention: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never store</SelectItem>
                <SelectItem value="1day">1 day</SelectItem>
                <SelectItem value="7days">7 days</SelectItem>
                <SelectItem value="30days">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Performance Controls */}
        <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-green-600" />
            <h4 className="font-semibold text-green-800">Performance & Battery</h4>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Performance Mode</label>
            <Select
              value={performanceMode}
              onValueChange={(value: any) => setPerformanceMode(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="battery">Battery Saver</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="high">High Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-xs text-green-700">
            Current interval: {currentInterval}ms | Max faces: {maxFaces}
          </div>
        </div>

        {/* Camera Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={isActive ? stopCamera : startCamera}
            disabled={isLoading}
            className={`px-6 py-3 rounded-full ${
              isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            <Camera className="w-4 h-4 mr-2" />
            {isLoading ? 'Loading...' : isActive ? 'Stop Detection' : 'Start Detection'}
          </Button>
        </div>

        {/* Video Display */}
        <div className="relative flex justify-center">
          <div style={{ position: "relative", width: 640, height: 480 }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              width={640}
              height={480}
              className="rounded-lg bg-gray-800 border-2 border-indigo-200"
              aria-label="Multi-face detection video feed"
            />
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="absolute top-0 left-0 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Face Analysis Results */}
        {detectedFaces.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Detected Faces Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {detectedFaces.map((face, index) => (
                <div key={face.id} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">Face {index + 1}</span>
                    <Badge className="text-xs">
                      {(face.confidence * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    {customVerdicts[face.dominantEmotion] || face.dominantEmotion}
                  </div>
                  <div className="space-y-1 text-xs">
                    {Object.entries(face.expressions)
                      .sort(([,a], [,b]) => (b as number) - (a as number))
                      .slice(0, 3)
                      .map(([emotion, value]) => (
                        <div key={emotion} className="flex justify-between">
                          <span className="capitalize">{emotion}</span>
                          <span>{((value as number) * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GDPR/CCPA Compliance Notice */}
        <div className="text-xs text-gray-600 p-3 bg-gray-50 rounded border">
          <p className="font-semibold mb-1">Privacy Notice:</p>
          <p>
            All face detection processing occurs locally in your browser. No video data is transmitted 
            to external servers unless explicitly enabled. You can control data retention and analytics 
            settings above. For more information, see our privacy policy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFaceDetection;
