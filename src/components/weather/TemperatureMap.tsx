
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CityData {
  name: string;
  lat: number;
  lon: number;
  temperature: number;
  x: number;
  y: number;
}

interface TemperatureMapProps {
  onCitySelect: (city: string) => void;
  selectedCity: string;
}

const TemperatureMap: React.FC<TemperatureMapProps> = ({ onCitySelect, selectedCity }) => {
  const [cities, setCities] = useState<CityData[]>([
    { name: 'New York', lat: 40.71, lon: -74.01, temperature: 8, x: 65, y: 45 },
    { name: 'San Diego', lat: 32.71, lon: -117.16, temperature: 24, x: 15, y: 65 },
    { name: 'London', lat: 51.51, lon: -0.13, temperature: 11, x: 85, y: 35 },
    { name: 'Anchorage', lat: 61.22, lon: -149.89, temperature: -8, x: 10, y: 20 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCities(prevCities => 
        prevCities.map(city => ({
          ...city,
          temperature: city.temperature + (Math.random() - 0.5) * 2
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getTemperatureColor = (temp: number) => {
    if (temp < 0) return '#4CAFFE';
    if (temp < 10) return '#53BB6C';
    if (temp < 20) return '#DDCE16';
    if (temp < 30) return '#DF7642';
    return '#DD2323';
  };

  return (
    <Card className="bg-slate-800 border-slate-700 text-white h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Temperature Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-blue-600 rounded-lg h-48 overflow-hidden">
          {/* World map background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700" />
          
          {/* City markers */}
          {cities.map((city) => (
            <div
              key={city.name}
              className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
                selectedCity === city.name ? 'ring-2 ring-white' : ''
              }`}
              style={{ 
                left: `${city.x}%`, 
                top: `${city.y}%`,
                backgroundColor: getTemperatureColor(city.temperature)
              }}
              onClick={() => onCitySelect(city.name)}
            >
              <div className="w-12 h-12 rounded-full flex flex-col items-center justify-center text-xs font-bold text-white shadow-lg">
                <div>{Math.round(city.temperature)}</div>
              </div>
              <div className="absolute top-14 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white bg-black/50 px-2 py-1 rounded whitespace-nowrap">
                {city.name}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureMap;
