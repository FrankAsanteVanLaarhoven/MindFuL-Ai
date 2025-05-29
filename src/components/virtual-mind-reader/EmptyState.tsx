
import React from 'react';
import { Brain } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-8 text-gray-500">
      <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p>Start typing or speaking to begin cognitive analysis...</p>
    </div>
  );
};

export default EmptyState;
