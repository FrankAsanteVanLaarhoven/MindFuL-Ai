
import React from 'react';
import { Button } from '@/components/ui/button';
import { CloudSun } from 'lucide-react';

interface WeatherEmptyStateProps {
  onRetry: () => void;
}

const WeatherEmptyState: React.FC<WeatherEmptyStateProps> = ({ onRetry }) => {
  return (
    <div className="text-center py-6 text-gray-500">
      <CloudSun className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <p>Weather data unavailable</p>
      <Button onClick={onRetry} variant="outline" className="mt-2" size="sm">
        Try Again
      </Button>
    </div>
  );
};

export default WeatherEmptyState;
