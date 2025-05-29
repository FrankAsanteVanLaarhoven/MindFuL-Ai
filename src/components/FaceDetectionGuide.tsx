
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FaceDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  onMoodChange: (mood: string, confidence: number) => void;
}

interface FaceData {
  isDetected: boolean;
  eyeMovement: 'open' | 'closed' | 'squinting';
  mouthShape: 'smile' | 'frown' | 'neutral' | 'open';
  headPosition: 'center' | 'left' | 'right' | 'up' | 'down';
  engagement: number;
}

const FaceDetectionGuide: React.FC<FaceDetectionProps> = ({ videoRef, isActive, onMoodChange }) => {
  const [faceData, setFaceData] = useState<FaceData>({
    isDetected: false,
    eyeMovement: 'open',
    mouthShape: 'neutral',
    headPosition: 'center',
    engagement: 0
  });
  const [instructions, setInstructions] = useState<string[]>([]);
  const [currentMood, setCurrentMood] = useState('Analyzing...');
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateFaceData = (): FaceData => {
    // Simulate face detection data (in real implementation, this would use actual face detection)
    const eyeStates = ['open', 'closed', 'squinting'] as const;
    const mouthStates = ['smile', 'frown', 'neutral', 'open'] as const;
    const headPositions = ['center', 'left', 'right', 'up', 'down'] as const;
    
    return {
      isDetected: Math.random() > 0.1, // 90% face detection rate
      eyeMovement: eyeStates[Math.floor(Math.random() * eyeStates.length)],
      mouthShape: mouthStates[Math.floor(Math.random() * mouthStates.length)],
      headPosition: headPositions[Math.floor(Math.random() * headPositions.length)],
      engagement: Math.random() * 100
    };
  };

  const analyzeMoodFromFace = (face: FaceData): { mood: string; confidence: number } => {
    let mood = 'Neutral';
    let confidence = 0.7;

    if (face.mouthShape === 'smile' && face.eyeMovement === 'open') {
      mood = 'Happy';
      confidence = 0.85;
    } else if (face.mouthShape === 'frown') {
      mood = 'Sad';
      confidence = 0.8;
    } else if (face.eyeMovement === 'squinting' || face.mouthShape === 'open') {
      mood = 'Anxious';
      confidence = 0.75;
    } else if (face.headPosition !== 'center') {
      mood = 'Distracted';
      confidence = 0.65;
    }

    return { mood, confidence };
  };

  const generateInstructions = (face: FaceData): string[] => {
    const instructions: string[] = [];

    if (!face.isDetected) {
      instructions.push("Position your face in the camera frame");
      instructions.push("Ensure good lighting on your face");
      return instructions;
    }

    if (face.headPosition !== 'center') {
      instructions.push("Center your head in the frame");
    }

    if (face.engagement < 50) {
      instructions.push("Look directly at the camera");
      instructions.push("Try to relax your facial muscles");
    }

    if (face.eyeMovement === 'closed') {
      instructions.push("Keep your eyes open for better detection");
    }

    // Mood-specific guidance
    switch (face.mouthShape) {
      case 'frown':
        instructions.push("Take a deep breath and try to relax");
        instructions.push("Think of something positive");
        break;
      case 'smile':
        instructions.push("Great! Your positive expression is detected");
        break;
      case 'neutral':
        instructions.push("Try expressing how you truly feel");
        break;
    }

    if (instructions.length === 0) {
      instructions.push("Perfect positioning! Continue as you are");
      instructions.push("Your facial expressions are being analyzed");
    }

    return instructions;
  };

  useEffect(() => {
    if (!isActive) {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      return;
    }

    detectionIntervalRef.current = setInterval(() => {
      const newFaceData = generateFaceData();
      setFaceData(newFaceData);
      
      const newInstructions = generateInstructions(newFaceData);
      setInstructions(newInstructions);

      if (newFaceData.isDetected) {
        const { mood, confidence } = analyzeMoodFromFace(newFaceData);
        setCurrentMood(mood);
        onMoodChange(mood, confidence);
      }
    }, 1500);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [isActive, onMoodChange]);

  if (!isActive) {
    return null;
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-200">
      <CardHeader>
        <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
          <span className="text-xl">👁️</span>
          Face Detection Guide
          <Badge variant={faceData.isDetected ? "default" : "destructive"}>
            {faceData.isDetected ? "Face Detected" : "No Face"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Analysis */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Current Mood:</span>
            <p className="text-blue-600 font-semibold">{currentMood}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Engagement:</span>
            <p className="text-blue-600 font-semibold">{Math.round(faceData.engagement)}%</p>
          </div>
        </div>

        {/* Face Status Indicators */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 rounded bg-gray-50">
            <div className="font-medium">Eyes</div>
            <div className={`capitalize ${
              faceData.eyeMovement === 'open' ? 'text-green-600' : 
              faceData.eyeMovement === 'closed' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {faceData.eyeMovement}
            </div>
          </div>
          <div className="text-center p-2 rounded bg-gray-50">
            <div className="font-medium">Mouth</div>
            <div className={`capitalize ${
              faceData.mouthShape === 'smile' ? 'text-green-600' : 
              faceData.mouthShape === 'frown' ? 'text-red-600' : 'text-blue-600'
            }`}>
              {faceData.mouthShape}
            </div>
          </div>
          <div className="text-center p-2 rounded bg-gray-50">
            <div className="font-medium">Position</div>
            <div className={`capitalize ${
              faceData.headPosition === 'center' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {faceData.headPosition}
            </div>
          </div>
        </div>

        {/* Real-time Instructions */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-800 flex items-center gap-2">
            <span className="text-blue-500">💡</span>
            Real-time Guidance:
          </h4>
          <div className="space-y-1">
            {instructions.map((instruction, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded border-l-2 border-blue-300"
              >
                <span className="text-blue-500 text-xs">→</span>
                {instruction}
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Meter */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-700">Engagement Level</span>
            <span className="text-blue-600 font-semibold">{Math.round(faceData.engagement)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                faceData.engagement > 70 ? 'bg-green-500' :
                faceData.engagement > 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${faceData.engagement}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FaceDetectionGuide;
