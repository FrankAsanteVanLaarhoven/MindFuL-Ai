import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Eye, Heart, Zap, TrendingUp } from 'lucide-react';
import PredictiveThoughts from './PredictiveThoughts';

interface CognitiveAnalysis {
  emotion: string;
  confidence: number;
  stressLevel: number;
  cognitiveLoad: number;
  engagement: number;
  insights: string[];
  recommendations: string[];
}

interface VirtualMindReaderProps {
  userProfile?: any;
  currentText?: string;
  voiceTone?: string;
  onThoughtRecommendation?: (thought: string) => void;
}

const VirtualMindReader: React.FC<VirtualMindReaderProps> = ({ 
  userProfile, 
  currentText = '', 
  voiceTone,
  onThoughtRecommendation
}) => {
  const [analysis, setAnalysis] = useState<CognitiveAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const performCognitiveAnalysis = (text: string, tone?: string, profile?: any): CognitiveAnalysis => {
    const lowerText = text.toLowerCase();
    
    // Emotion detection
    let emotion = 'neutral';
    let confidence = 70;
    
    if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('depressed')) {
      emotion = 'sad';
      confidence = 85;
    } else if (lowerText.includes('angry') || lowerText.includes('frustrated') || lowerText.includes('mad')) {
      emotion = 'angry';
      confidence = 80;
    } else if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('excited')) {
      emotion = 'happy';
      confidence = 90;
    } else if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('nervous')) {
      emotion = 'anxious';
      confidence = 88;
    }
    
    // Stress level analysis
    let stressLevel = 30;
    const stressWords = ['stress', 'pressure', 'overwhelm', 'chaos', 'deadline', 'urgent'];
    stressWords.forEach(word => {
      if (lowerText.includes(word)) stressLevel += 15;
    });
    stressLevel = Math.min(stressLevel, 100);
    
    // Cognitive load
    const complexWords = text.split(' ').filter(word => word.length > 8).length;
    let cognitiveLoad = Math.min(30 + (complexWords * 5), 100);
    
    // Engagement level
    const questionMarks = (text.match(/\?/g) || []).length;
    const exclamations = (text.match(/!/g) || []).length;
    const engagement = Math.min(50 + (questionMarks * 10) + (exclamations * 8), 100);
    
    // Voice tone influence
    if (tone) {
      if (tone === 'stressed') {
        stressLevel += 20;
        emotion = emotion === 'neutral' ? 'anxious' : emotion;
      } else if (tone === 'calm') {
        stressLevel = Math.max(stressLevel - 15, 0);
      }
    }
    
    // Profile-based adjustments
    if (profile) {
      if (profile.workStress === 'high') {
        stressLevel += 10;
      }
      if (profile.sleepQuality === 'poor') {
        cognitiveLoad += 15;
        stressLevel += 10;
      }
    }
    
    // Generate insights
    const insights = [];
    if (stressLevel > 70) {
      insights.push('High stress indicators detected in your communication patterns');
    }
    if (cognitiveLoad > 80) {
      insights.push('Complex thought patterns suggest mental fatigue');
    }
    if (engagement < 40) {
      insights.push('Low engagement may indicate disconnection or overwhelm');
    }
    if (emotion === 'anxious' && profile?.currentChallenges?.includes('anxiety')) {
      insights.push('Anxiety patterns align with your reported challenges');
    }
    
    // Generate recommendations
    const recommendations = [];
    if (stressLevel > 60) {
      recommendations.push('Consider a 5-minute breathing exercise');
      recommendations.push('Try progressive muscle relaxation');
    }
    if (cognitiveLoad > 70) {
      recommendations.push('Take a mental break with some light stretching');
      recommendations.push('Practice mindfulness meditation');
    }
    if (emotion === 'sad') {
      recommendations.push('Gentle self-compassion exercises might help');
      recommendations.push('Consider talking to a supportive friend');
    }
    
    return {
      emotion,
      confidence,
      stressLevel: Math.max(0, Math.min(100, stressLevel)),
      cognitiveLoad: Math.max(0, Math.min(100, cognitiveLoad)),
      engagement: Math.max(0, Math.min(100, engagement)),
      insights,
      recommendations
    };
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happy': return 'text-green-600';
      case 'sad': return 'text-blue-600';
      case 'angry': return 'text-red-600';
      case 'anxious': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (value: number) => {
    if (value < 40) return 'bg-green-500';
    if (value < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Original Virtual Mind Reader */}
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
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-3"></div>
              <p className="text-indigo-600">Analyzing your cognitive patterns...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              {/* Emotion Detection */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span className="font-medium">Detected Emotion:</span>
                </div>
                <Badge className={`${getEmotionColor(analysis.emotion)} bg-transparent border-current`}>
                  {analysis.emotion} ({analysis.confidence}%)
                </Badge>
              </div>
              
              {/* Metrics */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Stress Level
                    </span>
                    <span className="text-sm">{analysis.stressLevel}%</span>
                  </div>
                  <Progress value={analysis.stressLevel} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Brain className="w-3 h-3" />
                      Cognitive Load
                    </span>
                    <span className="text-sm">{analysis.cognitiveLoad}%</span>
                  </div>
                  <Progress value={analysis.cognitiveLoad} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Engagement
                    </span>
                    <span className="text-sm">{analysis.engagement}%</span>
                  </div>
                  <Progress value={analysis.engagement} className="h-2" />
                </div>
              </div>
              
              {/* Insights */}
              {analysis.insights.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium">Insights</span>
                  </div>
                  <div className="space-y-2">
                    {analysis.insights.map((insight, index) => (
                      <div key={index} className="text-sm bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Recommendations */}
              {analysis.recommendations.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Recommendations</span>
                  </div>
                  <div className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} className="text-sm bg-green-50 rounded-lg p-3 border border-green-100">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Start typing or speaking to begin cognitive analysis...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Predictive Thoughts AI */}
      <PredictiveThoughts 
        currentText={currentText}
        onRecommendation={onThoughtRecommendation}
      />
    </div>
  );
};

export default VirtualMindReader;
