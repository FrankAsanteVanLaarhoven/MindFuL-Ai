
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CloudSun, RefreshCw } from 'lucide-react';

interface WeatherHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

const WeatherHeader: React.FC<WeatherHeaderProps> = ({ onRefresh, isLoading }) => {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-orange-800 text-lg">
          <CloudSun className="w-5 h-5" />
          Weather & Air Quality
        </CardTitle>
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      <CardDescription className="text-sm">
        Current weather conditions and wellness-related environmental data
      </CardDescription>
    </CardHeader>
  );
};

export default WeatherHeader;
