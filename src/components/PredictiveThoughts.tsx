
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Lightbulb, TrendingUp, Zap, Clock } from 'lucide-react';

interface PredictiveThoughtsProps {
  currentText?: string;
  onRecommendation?: (thought: string) => void;
}

interface ThoughtPrediction {
  id: string;
  thought: string;
  confidence: number;
  category: 'positive' | 'neutral' | 'challenging';
  reasoning: string;
}

const PredictiveThoughts: React.FC<PredictiveThoughtsProps> = ({ 
  currentText = '', 
  onRecommendation 
}) => {
  const [predictions, setPredictions] = useState<ThoughtPrediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    if (currentText.length > 30) {
      analyzePredictiveThoughts(currentText);
    } else {
      setPredictions([]);
    }
  }, [currentText]);

  const analyzePredictiveThoughts = async (text: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    setTimeout(() => {
      const newPredictions = generateThoughtPredictions(text);
      setPredictions(newPredictions);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      clearInterval(progressInterval);
    }, 2000);
  };

  const generateThoughtPredictions = (text: string): ThoughtPrediction[] => {
    const lowerText = text.toLowerCase();
    const predictions: ThoughtPrediction[] = [];

    // Analyze for negative thought patterns
    if (lowerText.includes('i can\'t') || lowerText.includes('impossible') || lowerText.includes('never')) {
      predictions.push({
        id: '1',
        thought: 'What if I approached this challenge one small step at a time?',
        confidence: 85,
        category: 'positive',
        reasoning: 'Breaking down overwhelming tasks into manageable pieces can reduce anxiety and increase success likelihood.'
      });
    }

    if (lowerText.includes('everyone') || lowerText.includes('always') || lowerText.includes('never')) {
      predictions.push({
        id: '2',
        thought: 'Are there specific examples where this isn\'t always true?',
        confidence: 78,
        category: 'challenging',
        reasoning: 'All-or-nothing thinking can be challenged by finding exceptions to absolute statements.'
      });
    }

    if (lowerText.includes('worry') || lowerText.includes('anxious') || lowerText.includes('scared')) {
      predictions.push({
        id: '3',
        thought: 'What evidence do I have that this fear is likely to happen?',
        confidence: 90,
        category: 'challenging',
        reasoning: 'Examining evidence can help distinguish between realistic concerns and anxiety-driven fears.'
      });
    }

    if (lowerText.includes('fail') || lowerText.includes('mistake') || lowerText.includes('wrong')) {
      predictions.push({
        id: '4',
        thought: 'What can I learn from this experience to grow stronger?',
        confidence: 82,
        category: 'positive',
        reasoning: 'Reframing failures as learning opportunities builds resilience and growth mindset.'
      });
    }

    if (lowerText.includes('should') || lowerText.includes('must') || lowerText.includes('have to')) {
      predictions.push({
        id: '5',
        thought: 'What would I tell a good friend in this same situation?',
        confidence: 88,
        category: 'neutral',
        reasoning: 'Self-compassion exercises help reduce harsh self-criticism and perfectionist thinking.'
      });
    }

    // If no specific patterns, provide general positive thoughts
    if (predictions.length === 0) {
      const generalPredictions = [
        {
          id: 'g1',
          thought: 'I am capable of handling whatever comes my way.',
          confidence: 75,
          category: 'positive' as const,
          reasoning: 'Affirmations of personal capability can boost confidence and resilience.'
        },
        {
          id: 'g2',
          thought: 'What am I grateful for in this moment?',
          confidence: 80,
          category: 'positive' as const,
          reasoning: 'Gratitude practices can shift focus from problems to positive aspects of life.'
        },
        {
          id: 'g3',
          thought: 'How can I be kind to myself right now?',
          confidence: 85,
          category: 'neutral' as const,
          reasoning: 'Self-compassion is a foundation for emotional wellbeing and resilience.'
        }
      ];
      
      return [generalPredictions[Math.floor(Math.random() * generalPredictions.length)]];
    }

    return predictions.slice(0, 3); // Limit to 3 predictions
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'challenging': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'positive': return <TrendingUp className="w-3 h-3" />;
      case 'challenging': return <Zap className="w-3 h-3" />;
      default: return <Lightbulb className="w-3 h-3" />;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-indigo-800 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Predictive Thoughts AI
        </CardTitle>
        <CardDescription>
          AI-powered thought recommendations based on your current expression
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="space-y-3">
            <div className="text-center">
              <div className="animate-pulse flex items-center justify-center gap-2 text-indigo-600 mb-3">
                <Brain className="w-5 h-5" />
                <span>Analyzing thought patterns...</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
          </div>
        ) : predictions.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-indigo-700">
              <Lightbulb className="w-4 h-4" />
              <span>Recommended thoughts based on your expression:</span>
            </div>
            
            {predictions.map((prediction) => (
              <div key={prediction.id} className="space-y-3 p-4 border border-indigo-100 rounded-lg bg-indigo-50/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`text-xs ${getCategoryColor(prediction.category)}`}>
                        {getCategoryIcon(prediction.category)}
                        <span className="ml-1">{prediction.category}</span>
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {prediction.confidence}% confidence
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium text-gray-800 mb-2">
                      "{prediction.thought}"
                    </p>
                    
                    <p className="text-xs text-gray-600">
                      {prediction.reasoning}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => onRecommendation?.(prediction.thought)}
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                  >
                    Use This
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Start typing to receive thought recommendations...</p>
            <p className="text-xs mt-2">AI will analyze your expression patterns and suggest helpful thoughts</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictiveThoughts;
