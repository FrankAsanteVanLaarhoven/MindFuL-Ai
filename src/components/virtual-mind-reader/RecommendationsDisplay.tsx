
import React from 'react';
import { Heart } from 'lucide-react';

interface RecommendationsDisplayProps {
  recommendations: string[];
}

const RecommendationsDisplay: React.FC<RecommendationsDisplayProps> = ({ recommendations }) => {
  if (recommendations.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Heart className="w-4 h-4 text-green-500" />
        <span className="font-medium">Recommendations</span>
      </div>
      <div className="space-y-2">
        {recommendations.map((rec, index) => (
          <div key={index} className="text-sm bg-green-50 rounded-lg p-3 border border-green-100">
            {rec}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsDisplay;
