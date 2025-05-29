
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AnalysisFormProps {
  textInput: string;
  setTextInput: (value: string) => void;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  apiKey: string | null;
  onCameraChange: (hasCamera: boolean, stream: MediaStream | null) => void;
  onFrameCapture: (captureFunc: () => string | null) => void;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({
  textInput,
  setTextInput,
  isAnalyzing,
  onAnalyze,
  apiKey
}) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-indigo-800 flex items-center gap-2">
          <span className="text-2xl">💭</span>
          AI Analysis
          {apiKey && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              AI Enhanced
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Text-based mood analysis with AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            How are you feeling? (Text)
          </label>
          <Textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Describe your current mood, thoughts, or feelings..."
            className="resize-none border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
            rows={4}
          />
        </div>
        
        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 rounded-full transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
        >
          {isAnalyzing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {apiKey ? 'AI Analyzing...' : 'Analyzing...'}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>🔍</span>
              {apiKey ? 'AI Analyze Mood' : 'Analyze Mood'}
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AnalysisForm;
