
import React from 'react';
import { Eye } from 'lucide-react';

interface InsightsDisplayProps {
  insights: string[];
}

const InsightsDisplay: React.FC<InsightsDisplayProps> = ({ insights }) => {
  if (insights.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Eye className="w-4 h-4 text-indigo-500" />
        <span className="font-medium">Insights</span>
      </div>
      <div className="space-y-2">
        {insights.map((insight, index) => (
          <div key={index} className="text-sm bg-indigo-50 rounded-lg p-3 border border-indigo-100">
            {insight}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsDisplay;
