
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherKPIGaugesProps {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  selectedParameter: string;
  onParameterSelect: (parameter: string) => void;
}

const WeatherKPIGauges: React.FC<WeatherKPIGaugesProps> = ({
  temperature,
  windSpeed,
  precipitation,
  selectedParameter,
  onParameterSelect
}) => {
  const createGauge = (value: number, max: number, color: string, isSelected: boolean) => {
    const percentage = Math.min((value / max) * 100, 100);
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{value.toFixed(1)}</div>
          </div>
        </div>
        {isSelected && (
          <div className="absolute inset-0 border-2 border-white rounded-full" />
        )}
      </div>
    );
  };

  return (
    <Card className="bg-slate-800 border-slate-700 text-white">
      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-4">
          <div 
            className="text-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onParameterSelect('temperature')}
          >
            {createGauge(temperature, 40, '#10B981', selectedParameter === 'temperature')}
            <div className="mt-2 text-sm">Temperature</div>
            <div className="text-xs text-gray-400">°C</div>
          </div>
          
          <div 
            className="text-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onParameterSelect('wind')}
          >
            {createGauge(windSpeed, 25, '#3B82F6', selectedParameter === 'wind')}
            <div className="mt-2 text-sm">Wind</div>
            <div className="text-xs text-gray-400">m/s</div>
          </div>
          
          <div 
            className="text-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onParameterSelect('precipitation')}
          >
            {createGauge(precipitation, 10, '#8B5CF6', selectedParameter === 'precipitation')}
            <div className="mt-2 text-sm">Precipitation</div>
            <div className="text-xs text-gray-400">mm</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherKPIGauges;
