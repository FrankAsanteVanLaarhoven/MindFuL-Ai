
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Lightbulb, X, Check, AlertCircle } from 'lucide-react';

interface ThoughtPattern {
  id: string;
  text: string;
  type: 'positive' | 'negative' | 'neutral';
  frequency: number;
  lastUsed: string;
  effectiveness: number; // 0-100 score based on user feedback
  tags: string[];
}

interface PredictiveThoughtsProps {
  currentText?: string;
  onRecommendation?: (thought: string) => void;
}

const PredictiveThoughts: React.FC<PredictiveThoughtsProps> = ({ 
  currentText = '', 
  onRecommendation 
}) => {
  const [thoughtPatterns, setThoughtPatterns] = useState<ThoughtPattern[]>([]);
  const [recommendations, setRecommendations] = useState<ThoughtPattern[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load saved thought patterns from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('thoughtPatterns');
    if (saved) {
      setThoughtPatterns(JSON.parse(saved));
    } else {
      // Initialize with some default positive thought patterns
      const defaultPatterns: ThoughtPattern[] = [
        {
          id: '1',
          text: "I am capable of handling challenges that come my way",
          type: 'positive',
          frequency: 5,
          lastUsed: new Date().toISOString(),
          effectiveness: 85,
          tags: ['self-efficacy', 'confidence', 'resilience']
        },
        {
          id: '2',
          text: "This feeling is temporary and will pass",
          type: 'positive',
          frequency: 8,
          lastUsed: new Date().toISOString(),
          effectiveness: 90,
          tags: ['mindfulness', 'acceptance', 'temporal']
        },
        {
          id: '3',
          text: "I can learn and grow from this experience",
          type: 'positive',
          frequency: 6,
          lastUsed: new Date().toISOString(),
          effectiveness: 88,
          tags: ['growth-mindset', 'learning', 'resilience']
        }
      ];
      setThoughtPatterns(defaultPatterns);
      localStorage.setItem('thoughtPatterns', JSON.stringify(defaultPatterns));
    }
  }, []);

  // Analyze current text and generate recommendations
  useEffect(() => {
    if (currentText.length > 20) {
      analyzeAndRecommend(currentText);
    }
  }, [currentText, thoughtPatterns]);

  const analyzeAndRecommend = (text: string) => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const analysis = analyzeThoughtPattern(text);
      const recs = generateRecommendations(analysis);
      setRecommendations(recs);
      setIsAnalyzing(false);
    }, 1000);
  };

  const analyzeThoughtPattern = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Detect negative patterns
    const negativeKeywords = [
      'can\'t', 'impossible', 'never', 'always fails', 'hopeless', 
      'worthless', 'stupid', 'hate myself', 'give up', 'no point'
    ];
    
    const positiveKeywords = [
      'can do', 'possible', 'try again', 'learn from', 'grateful',
      'proud', 'accomplished', 'hopeful', 'capable', 'strong'
    ];
    
    let negativeScore = 0;
    let positiveScore = 0;
    let detectedTags: string[] = [];
    
    negativeKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        negativeScore += 10;
      }
    });
    
    positiveKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        positiveScore += 10;
      }
    });
    
    // Detect themes
    if (lowerText.includes('work') || lowerText.includes('job')) {
      detectedTags.push('work');
    }
    if (lowerText.includes('relationship') || lowerText.includes('family')) {
      detectedTags.push('relationships');
    }
    if (lowerText.includes('anxious') || lowerText.includes('worry')) {
      detectedTags.push('anxiety');
    }
    if (lowerText.includes('sad') || lowerText.includes('depressed')) {
      detectedTags.push('mood');
    }
    
    return {
      negativeScore,
      positiveScore,
      overallSentiment: positiveScore > negativeScore ? 'positive' : 'negative',
      detectedTags,
      needsIntervention: negativeScore > 30
    };
  };

  const generateRecommendations = (analysis: any): ThoughtPattern[] => {
    // Filter patterns that are effective and match the context
    let candidates = thoughtPatterns.filter(pattern => 
      pattern.type === 'positive' && 
      pattern.effectiveness > 70
    );
    
    // If negative thoughts detected, prioritize counter-narratives
    if (analysis.needsIntervention) {
      candidates = candidates.filter(pattern => 
        pattern.tags.includes('resilience') || 
        pattern.tags.includes('self-efficacy') ||
        pattern.tags.includes('acceptance')
      );
    }
    
    // Match by tags if available
    if (analysis.detectedTags.length > 0) {
      const tagMatched = candidates.filter(pattern =>
        pattern.tags.some(tag => analysis.detectedTags.includes(tag))
      );
      if (tagMatched.length > 0) {
        candidates = tagMatched;
      }
    }
    
    // Sort by effectiveness and frequency
    candidates.sort((a, b) => {
      const scoreA = a.effectiveness * 0.7 + (100 - a.frequency) * 0.3;
      const scoreB = b.effectiveness * 0.7 + (100 - b.frequency) * 0.3;
      return scoreB - scoreA;
    });
    
    return candidates.slice(0, 3);
  };

  const handleRecommendationFeedback = (thoughtId: string, helpful: boolean) => {
    setThoughtPatterns(prev => {
      const updated = prev.map(pattern => {
        if (pattern.id === thoughtId) {
          return {
            ...pattern,
            effectiveness: helpful 
              ? Math.min(pattern.effectiveness + 5, 100)
              : Math.max(pattern.effectiveness - 3, 0),
            frequency: pattern.frequency + 1,
            lastUsed: new Date().toISOString()
          };
        }
        return pattern;
      });
      
      localStorage.setItem('thoughtPatterns', JSON.stringify(updated));
      return updated;
    });
    
    // Remove from current recommendations
    setRecommendations(prev => prev.filter(rec => rec.id !== thoughtId));
  };

  const useRecommendation = (thought: ThoughtPattern) => {
    if (onRecommendation) {
      onRecommendation(thought.text);
    }
    handleRecommendationFeedback(thought.id, true);
  };

  const addNewThoughtPattern = (text: string, type: 'positive' | 'negative') => {
    const newPattern: ThoughtPattern = {
      id: crypto.randomUUID(),
      text,
      type,
      frequency: 1,
      lastUsed: new Date().toISOString(),
      effectiveness: 75, // Start with neutral effectiveness
      tags: [] // Could be enhanced with auto-tagging
    };
    
    setThoughtPatterns(prev => {
      const updated = [...prev, newPattern];
      localStorage.setItem('thoughtPatterns', JSON.stringify(updated));
      return updated;
    });
  };

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 80) return 'text-green-600';
    if (effectiveness >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-blue-800 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Predictive Thoughts AI
        </CardTitle>
        <CardDescription>
          AI-powered thought pattern analysis and positive recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="text-center py-6">
            <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-3"></div>
            <p className="text-blue-600">Analyzing thought patterns...</p>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span className="font-medium text-blue-800">Recommended Positive Thoughts</span>
            </div>
            
            {recommendations.map((thought) => (
              <div key={thought.id} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-blue-900 flex-1 mr-3">{thought.text}</p>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => useRecommendation(thought)}
                      size="sm"
                      variant="outline"
                      className="text-green-600 hover:bg-green-50"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => handleRecommendationFeedback(thought.id, false)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <div className="flex gap-2">
                    {thought.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className={`font-medium ${getEffectivenessColor(thought.effectiveness)}`}>
                    {thought.effectiveness}% effective
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : currentText.length > 20 ? (
          <div className="text-center py-6 text-gray-500">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No specific recommendations for this input.</p>
            <p className="text-xs mt-1">Keep sharing your thoughts to improve AI learning.</p>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Start typing to receive thought pattern analysis...</p>
          </div>
        )}
        
        {/* Thought Pattern Stats */}
        <div className="mt-6 pt-4 border-t border-blue-200">
          <div className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Learning Progress
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Positive patterns learned:</span>
              <span className="font-medium">{thoughtPatterns.filter(p => p.type === 'positive').length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Average effectiveness:</span>
              <span className="font-medium">
                {thoughtPatterns.length > 0 
                  ? Math.round(thoughtPatterns.reduce((acc, p) => acc + p.effectiveness, 0) / thoughtPatterns.length)
                  : 0}%
              </span>
            </div>
            <Progress 
              value={thoughtPatterns.length > 0 
                ? thoughtPatterns.reduce((acc, p) => acc + p.effectiveness, 0) / thoughtPatterns.length
                : 0} 
              className="h-2" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveThoughts;
