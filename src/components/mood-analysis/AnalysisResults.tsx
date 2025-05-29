
import React from 'react';

interface AnalysisResult {
  mood: string;
  confidence: number;
  emotions: {
    happiness: number;
    sadness: number;
    anxiety: number;
    anger: number;
  };
  suggestions: string[];
}

interface AnalysisResultsProps {
  analysisResult: AnalysisResult | null;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysisResult }) => {
  const getMoodIcon = (mood: string, confidence: number) => {
    const icons = {
      'Happy': '😊',
      'Calm': '😌',
      'Excited': '🤩',
      'Sad': '😢',
      'Anxious': '😰',
      'Angry': '😠',
      'Confused': '😕',
      'Tired': '😴',
      'Neutral': '😐'
    };
    return icons[mood as keyof typeof icons] || '😐';
  };

  if (!analysisResult) return null;

  return (
    <div className="mt-6 space-y-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
      <h4 className="font-semibold text-indigo-800">Analysis Results</h4>
      <div className="text-center">
        <div className="text-4xl mb-2">
          {getMoodIcon(analysisResult.mood, analysisResult.confidence)}
        </div>
        <h3 className="text-xl font-bold text-indigo-800 mb-2">
          {analysisResult.mood}
        </h3>
        <p className="text-lg text-indigo-600">
          {Math.round(analysisResult.confidence * 100)}% confidence
        </p>
      </div>
      
      <div className="space-y-3">
        <h5 className="font-medium text-gray-800">Emotion Breakdown:</h5>
        {Object.entries(analysisResult.emotions).map(([emotion, value]) => (
          <div key={emotion} className="flex justify-between items-center">
            <span className="capitalize text-gray-700">{emotion}</span>
            <span className="text-indigo-600 font-medium">{Math.round(value * 100)}%</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h5 className="font-medium text-gray-800">AI Suggestions:</h5>
        {analysisResult.suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-center gap-2 text-gray-700 text-sm">
            <span className="text-indigo-500">•</span>
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisResults;
