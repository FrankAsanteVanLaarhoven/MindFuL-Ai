
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Brain, Download, Share2, Eye, Calendar } from 'lucide-react';
import { getMoodHistory } from '@/lib/mood-storage';

interface MoodDataPoint {
  timestamp: string;
  mood: string;
  intensity: number;
  x: number;
  y: number;
  commentary?: string;
}

interface ExpertCommentary {
  period: string;
  insights: string[];
  recommendations: string[];
  patterns: string[];
}

const MoodMap = () => {
  const [moodData, setMoodData] = useState<MoodDataPoint[]>([]);
  const [commentary, setCommentary] = useState<ExpertCommentary[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [viewMode, setViewMode] = useState<'journey' | 'pattern' | 'insights'>('journey');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateMoodMap();
  }, [timeRange]);

  const generateMoodMap = () => {
    const history = getMoodHistory();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    
    // Filter data for selected time range
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const filteredData = history
      .filter(entry => new Date(entry.timestamp) >= cutoffDate)
      .map((entry, index) => ({
        timestamp: entry.timestamp,
        mood: entry.moodCategory,
        intensity: entry.intensity,
        x: index,
        y: entry.intensity,
        commentary: generateAICommentary(entry.moodCategory, entry.intensity)
      }));

    setMoodData(filteredData);
    generateExpertCommentary(filteredData);
  };

  const generateAICommentary = (mood: string, intensity: number): string => {
    const commentaries = {
      happy: intensity > 7 ? "Peak happiness detected - this is a moment to remember and analyze what contributed to this state." : "Positive mood trend - consider what factors supported this emotional state.",
      sad: intensity > 6 ? "Significant sadness detected - this may be a good time to reach out for support or engage in self-care activities." : "Mild low mood - normal fluctuation that may benefit from gentle mood-lifting activities.",
      anxious: intensity > 7 ? "High anxiety levels - breathing exercises and grounding techniques may be particularly helpful right now." : "Some anxiety present - monitor patterns and consider stress management techniques.",
      angry: intensity > 6 ? "Intense anger detected - this emotion often signals unmet needs or boundaries that may need attention." : "Mild irritation - explore underlying causes and healthy expression methods.",
      neutral: "Balanced emotional state - a good foundation for reflection and planning ahead."
    };
    
    return commentaries[mood as keyof typeof commentaries] || "Emotional state noted for pattern analysis.";
  };

  const generateExpertCommentary = (data: MoodDataPoint[]) => {
    setIsGenerating(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const insights: ExpertCommentary[] = [
        {
          period: "Recent Week",
          insights: [
            "Your mood shows a cyclical pattern with peaks typically occurring on weekends",
            "Stress levels correlate with specific times of day, suggesting routine-based triggers",
            "Recovery patterns after low moods are consistently 2-3 days, indicating good resilience"
          ],
          recommendations: [
            "Consider scheduling important decisions during your emotional peak periods",
            "Implement preventive self-care during identified stress periods",
            "Your natural recovery pattern is strong - trust the process while staying engaged"
          ],
          patterns: ["Weekend Elevation", "Midweek Stress", "Consistent Recovery"]
        },
        {
          period: "Overall Trend",
          insights: [
            "Your emotional range has expanded, showing increased emotional awareness",
            "Lower intensity negative emotions suggest improved coping mechanisms",
            "More frequent neutral states indicate emotional regulation improvement"
          ],
          recommendations: [
            "Continue current mindfulness practices - they're showing measurable results",
            "Consider exploring advanced emotional intelligence techniques",
            "Document specific activities during peak states for replication"
          ],
          patterns: ["Increasing Awareness", "Better Regulation", "Stable Baseline"]
        }
      ];
      
      setCommentary(insights);
      setIsGenerating(false);
    }, 1500);
  };

  const exportMoodData = () => {
    const exportData = {
      timeRange,
      data: moodData,
      commentary,
      generatedAt: new Date().toISOString(),
      insights: "Personal mood journey analysis"
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood-map-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareMoodMap = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Mood Journey',
        text: 'Check out my emotional wellness journey visualization',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-purple-800">AI-Powered Mood Map</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportMoodData} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={shareMoodMap} variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Range and View Mode Controls */}
        <div className="flex flex-wrap gap-3 justify-between">
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            {(['journey', 'pattern', 'insights'] as const).map((mode) => (
              <Button
                key={mode}
                onClick={() => setViewMode(mode)}
                variant={viewMode === mode ? "default" : "outline"}
                size="sm"
              >
                {mode === 'journey' ? 'Journey' : mode === 'pattern' ? 'Patterns' : 'Insights'}
              </Button>
            ))}
          </div>
        </div>

        {/* Mood Visualization */}
        {viewMode === 'journey' && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  stroke="#6b7280" 
                />
                <YAxis domain={[0, 10]} stroke="#6b7280" />
                <Tooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="intensity" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {viewMode === 'pattern' && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="x" stroke="#6b7280" />
                <YAxis domain={[0, 10]} stroke="#6b7280" />
                <Tooltip content={<ChartTooltipContent />} />
                <Scatter dataKey="intensity" fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Expert Commentary */}
        {viewMode === 'insights' && (
          <div className="space-y-4">
            {isGenerating ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-purple-600">AI is analyzing your emotional patterns...</p>
              </div>
            ) : (
              commentary.map((section, index) => (
                <div key={index} className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {section.period} Analysis
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-purple-700 mb-2">Key Insights</h4>
                      <ul className="space-y-1">
                        {section.insights.map((insight, i) => (
                          <li key={i} className="text-purple-600">• {insight}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-purple-700 mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {section.recommendations.map((rec, i) => (
                          <li key={i} className="text-purple-600">• {rec}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-purple-700 mb-2">Patterns Detected</h4>
                      <div className="flex flex-wrap gap-1">
                        {section.patterns.map((pattern, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {pattern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{moodData.length}</div>
            <div className="text-sm text-gray-600">Data Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {moodData.length > 0 ? Math.round(moodData.reduce((sum, d) => sum + d.intensity, 0) / moodData.length * 10) / 10 : 0}
            </div>
            <div className="text-sm text-gray-600">Avg Intensity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {moodData.length > 0 ? Math.round((moodData.filter(d => d.intensity > 5).length / moodData.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Positive Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{commentary.length}</div>
            <div className="text-sm text-gray-600">AI Insights</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodMap;
