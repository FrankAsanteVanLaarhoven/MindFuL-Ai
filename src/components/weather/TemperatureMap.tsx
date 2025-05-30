
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
    { name: 'New York', lat: 40.71, lon: -74.01, temperature: 8, x: 25, y: 40 },
    { name: 'San Diego', lat: 32.71, lon: -117.16, temperature: 24, x: 15, y: 55 },
    { name: 'London', lat: 51.51, lon: -0.13, temperature: 11, x: 50, y: 30 },
    { name: 'Anchorage', lat: 61.22, lon: -149.89, temperature: -8, x: 8, y: 20 }
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
        <div className="relative rounded-lg h-64 overflow-hidden bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900">
          {/* World map SVG */}
          <svg
            viewBox="0 0 1000 500"
            className="absolute inset-0 w-full h-full"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
          >
            {/* Continents - simplified world map paths */}
            <g fill="#1e293b" stroke="#334155" strokeWidth="1" opacity="0.8">
              {/* North America */}
              <path d="M 50 120 Q 80 100 120 110 Q 160 100 200 120 Q 220 140 210 180 Q 200 200 180 210 Q 140 220 100 200 Q 60 180 50 150 Z" />
              <path d="M 80 200 Q 120 190 150 200 Q 180 210 170 240 Q 150 260 120 250 Q 90 240 80 220 Z" />
              
              {/* South America */}
              <path d="M 180 240 Q 200 230 220 250 Q 240 280 230 320 Q 220 360 200 380 Q 180 400 160 390 Q 150 370 155 340 Q 160 300 170 270 Z" />
              
              {/* Europe */}
              <path d="M 450 100 Q 480 90 510 100 Q 530 110 525 130 Q 520 150 500 160 Q 470 165 450 150 Q 440 130 445 115 Z" />
              
              {/* Africa */}
              <path d="M 480 160 Q 520 150 550 170 Q 570 200 565 240 Q 560 280 540 320 Q 520 350 500 360 Q 480 365 460 350 Q 450 320 455 280 Q 460 240 470 200 Z" />
              
              {/* Asia */}
              <path d="M 550 80 Q 600 70 650 80 Q 700 90 750 100 Q 800 110 820 130 Q 830 150 820 170 Q 800 180 760 175 Q 720 170 680 165 Q 640 160 600 155 Q 570 150 550 130 Z" />
              <path d="M 600 180 Q 650 170 700 180 Q 750 190 780 210 Q 800 230 790 250 Q 770 260 740 255 Q 700 250 660 245 Q 620 240 600 220 Z" />
              
              {/* Australia */}
              <path d="M 700 350 Q 750 340 800 350 Q 830 360 825 380 Q 820 400 800 405 Q 760 410 720 405 Q 700 400 695 385 Q 690 370 695 360 Z" />
              
              {/* Additional landmasses for better geography */}
              <path d="M 350 200 Q 380 190 410 200 Q 430 210 425 230 Q 420 250 400 255 Q 370 260 350 245 Q 340 225 345 210 Z" />
            </g>
            
            {/* Ocean effects */}
            <defs>
              <radialGradient id="oceanGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                <stop offset="100%" stopColor="rgba(30, 58, 138, 0.1)" />
              </radialGradient>
            </defs>
            <rect width="1000" height="500" fill="url(#oceanGradient)" />
          </svg>
          
          {/* City markers */}
          {cities.map((city) => (
            <div
              key={city.name}
              className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
                selectedCity === city.name ? 'ring-2 ring-white scale-110' : ''
              }`}
              style={{ 
                left: `${city.x}%`, 
                top: `${city.y}%`,
              }}
              onClick={() => onCitySelect(city.name)}
            >
              <div 
                className="w-16 h-16 rounded-lg flex flex-col items-center justify-center text-sm font-bold text-white shadow-lg border-2 border-white/20"
                style={{ backgroundColor: getTemperatureColor(city.temperature) }}
              >
                <div className="text-lg">{Math.round(city.temperature)}</div>
                <div className="text-xs opacity-90">°C</div>
              </div>
              <div className="absolute top-18 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white bg-black/70 px-2 py-1 rounded whitespace-nowrap backdrop-blur-sm">
                {city.name}
              </div>
            </div>
          ))}
          
          {/* Grid lines for better geographical reference */}
          <svg
            viewBox="0 0 1000 500"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <defs>
              <pattern id="grid" width="100" height="50" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="1000" height="500" fill="url(#grid)" />
          </svg>
          
          {/* Coordinate labels */}
          <div className="absolute top-2 left-2 text-xs text-white/60 font-mono">90°N</div>
          <div className="absolute bottom-2 left-2 text-xs text-white/60 font-mono">90°S</div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-white/60 font-mono">0°</div>
          <div className="absolute bottom-2 right-2 text-xs text-white/60 font-mono">180°E</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureMap;
