
import React from 'react';
import { Brain } from 'lucide-react';

const AnalysisLoadingState: React.FC = () => {
  return (
    <div className="text-center py-8">
      <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-3"></div>
      <p className="text-indigo-600">Analyzing your cognitive patterns...</p>
    </div>
  );
};

export default AnalysisLoadingState;
