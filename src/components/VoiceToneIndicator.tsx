
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Volume2 } from 'lucide-react';

interface VoiceToneData {
  tone: 'calm' | 'stressed' | 'excited' | 'sad' | 'neutral';
  confidence: number;
  volume: number;
  pitch: number;
}

interface VoiceToneIndicatorProps {
  voiceTone: VoiceToneData;
  isListening: boolean;
}

const VoiceToneIndicator: React.FC<VoiceToneIndicatorProps> = ({
  voiceTone,
  isListening
}) => {
  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'calm': return 'bg-green-500';
      case 'stressed': return 'bg-red-500';
      case 'excited': return 'bg-yellow-500';
      case 'sad': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getToneEmoji = (tone: string) => {
    switch (tone) {
      case 'calm': return '😌';
      case 'stressed': return '😰';
      case 'excited': return '🤩';
      case 'sad': return '😢';
      default: return '😐';
    }
  };

  if (!isListening) {
    return null;
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-purple-800 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Voice Tone Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Tone */}
        <div className="text-center">
          <div className="text-3xl mb-2">{getToneEmoji(voiceTone.tone)}</div>
          <h3 className="text-lg font-semibold text-gray-800 capitalize">
            {voiceTone.tone}
          </h3>
          <p className="text-sm text-gray-600">
            {Math.round(voiceTone.confidence * 100)}% confidence
          </p>
        </div>

        {/* Voice Metrics */}
        <div className="space-y-3">
          {/* Volume */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600 flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                Volume
              </span>
              <span className="text-xs text-gray-800">
                {Math.round(voiceTone.volume * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-200"
                style={{ width: `${voiceTone.volume * 100}%` }}
              />
            </div>
          </div>

          {/* Pitch */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Pitch</span>
              <span className="text-xs text-gray-800">
                {voiceTone.pitch.toFixed(1)} kHz
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-200"
                style={{ width: `${Math.min(voiceTone.pitch * 20, 100)}%` }}
              />
            </div>
          </div>

          {/* Tone Confidence */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Tone Confidence</span>
              <span className="text-xs text-gray-800">
                {Math.round(voiceTone.confidence * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${getToneColor(voiceTone.tone)}`}
                style={{ width: `${voiceTone.confidence * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceToneIndicator;
