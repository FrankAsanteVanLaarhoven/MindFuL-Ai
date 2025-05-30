
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { WeatherData } from '@/types/weather';
import { WeatherService } from '@/services/weatherService';

interface WeatherDisplayProps {
  weatherData: WeatherData;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData }) => {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-1">
          {weatherData.temperature}°C
        </h3>
        <p className="text-gray-600 text-sm mb-2">{weatherData.location}</p>
        <Badge className={WeatherService.getConditionColor(weatherData.condition)}>
          {weatherData.condition}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-blue-50 rounded-lg p-2">
          <div className="text-xs text-gray-600">Humidity</div>
          <div className="text-sm font-semibold text-blue-600">
            {weatherData.humidity}%
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-2">
          <div className="text-xs text-gray-600">Wind</div>
          <div className="text-sm font-semibold text-green-600">
            {weatherData.windSpeed} km/h
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center">
        Updated: {weatherData.lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default WeatherDisplay;
