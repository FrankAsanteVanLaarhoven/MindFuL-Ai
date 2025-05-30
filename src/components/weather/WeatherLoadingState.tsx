
import React from 'react';

const WeatherLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-6">
      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <span className="ml-2 text-sm text-gray-600">Loading...</span>
    </div>
  );
};

export default WeatherLoadingState;
