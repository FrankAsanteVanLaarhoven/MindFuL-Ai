
import React from 'react';
import { WeatherData } from '@/types/weather';

interface WellnessTipsProps {
  weatherData: WeatherData;
}

const WellnessTips: React.FC<WellnessTipsProps> = ({ weatherData }) => {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
      <h4 className="font-semibold text-orange-800 mb-2 text-sm">Wellness Tips</h4>
      <div className="text-orange-700 text-xs space-y-1">
        {weatherData.condition === 'Sunny' && (
          <p>• Great weather for outdoor meditation!</p>
        )}
        {weatherData.humidity > 60 && (
          <p>• High humidity - stay hydrated</p>
        )}
        {weatherData.airQuality === 'Good' && (
          <p>• Perfect air for breathing exercises</p>
        )}
      </div>
    </div>
  );
};

export default WellnessTips;
