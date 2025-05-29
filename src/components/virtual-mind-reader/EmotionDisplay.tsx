
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

interface EmotionDisplayProps {
  emotion: string;
  confidence: number;
}

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ emotion, confidence }) => {
  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happy': return 'text-green-600';
      case 'sad': return 'text-blue-600';
      case 'angry': return 'text-red-600';
      case 'anxious': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-pink-500" />
        <span className="font-medium">Detected Emotion:</span>
      </div>
      <Badge className={`${getEmotionColor(emotion)} bg-transparent border-current`}>
        {emotion} ({confidence}%)
      </Badge>
    </div>
  );
};

export default EmotionDisplay;
