
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import PredictiveThoughts from './PredictiveThoughts';
import { CognitiveAnalysis, VirtualMindReaderProps } from './virtual-mind-reader/types';
import { performCognitiveAnalysis } from './virtual-mind-reader/cognitiveAnalysis';
import EmotionDisplay from './virtual-mind-reader/EmotionDisplay';
import MetricsDisplay from './virtual-mind-reader/MetricsDisplay';
import InsightsDisplay from './virtual-mind-reader/InsightsDisplay';
import RecommendationsDisplay from './virtual-mind-reader/RecommendationsDisplay';
import AnalysisLoadingState from './virtual-mind-reader/AnalysisLoadingState';
import EmptyState from './virtual-mind-reader/EmptyState';

const VirtualMindReader: React.FC<VirtualMindReaderProps> = ({ 
  userProfile, 
  currentText = '', 
  voiceTone,
  onThoughtRecommendation
}) => {
  const [analysis, setAnalysis] = useState<CognitiveAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [perplexityApiKey, setPerplexityApiKey] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('perplexityApiKey');
    if (storedKey) {
      setPerplexityApiKey(storedKey);
    }
  }, []);

  useEffect(() => {
    if (currentText.length > 50) {
      analyzeText(currentText);
    }
  }, [currentText]);

  const analyzeText = async (text: string) => {
    setIsAnalyzing(true);
    
    // Simulate cognitive analysis
    setTimeout(() => {
      const analysis = performCognitiveAnalysis(text, voiceTone, userProfile);
      setAnalysis(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Virtual Mind Reader */}
      <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-indigo-800 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Virtual Mind Reader
          </CardTitle>
          <CardDescription>
            Cognitive and contextual analysis of your mental state
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAnalyzing ? (
            <AnalysisLoadingState />
          ) : analysis ? (
            <div className="space-y-4">
              <EmotionDisplay emotion={analysis.emotion} confidence={analysis.confidence} />
              <MetricsDisplay 
                stressLevel={analysis.stressLevel}
                cognitiveLoad={analysis.cognitiveLoad}
                engagement={analysis.engagement}
              />
              <InsightsDisplay insights={analysis.insights} />
              <RecommendationsDisplay recommendations={analysis.recommendations} />
            </div>
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>

      {/* Predictive Thoughts AI */}
      <PredictiveThoughts 
        currentText={currentText}
        onRecommendation={onThoughtRecommendation}
        therapyType="general"
        perplexityApiKey={perplexityApiKey}
      />
    </div>
  );
};

export default VirtualMindReader;
