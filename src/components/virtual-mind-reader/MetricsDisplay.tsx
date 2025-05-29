
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Zap, Brain, TrendingUp } from 'lucide-react';

interface MetricsDisplayProps {
  stressLevel: number;
  cognitiveLoad: number;
  engagement: number;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  stressLevel,
  cognitiveLoad,
  engagement
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Stress Level
          </span>
          <span className="text-sm">{stressLevel}%</span>
        </div>
        <Progress value={stressLevel} className="h-2" />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium flex items-center gap-1">
            <Brain className="w-3 h-3" />
            Cognitive Load
          </span>
          <span className="text-sm">{cognitiveLoad}%</span>
        </div>
        <Progress value={cognitiveLoad} className="h-2" />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Engagement
          </span>
          <span className="text-sm">{engagement}%</span>
        </div>
        <Progress value={engagement} className="h-2" />
      </div>
    </div>
  );
};

export default MetricsDisplay;
