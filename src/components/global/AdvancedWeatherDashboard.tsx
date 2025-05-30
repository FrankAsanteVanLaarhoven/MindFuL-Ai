
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CloudSun, MapPin, Wind, CloudRain, Settings, Clock } from 'lucide-react';

interface WeatherStation {
  id: string;
  name: string;
  lat: number;
  lon: number;
  elevation: number;
  timezone: string;
  temperature: number;
  windSpeed: number;
  precipitation: number;
  windDirection: number;
  humidity: number;
  condition: string;
}

interface ForecastData {
  time: string;
  temperature: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
}

const AdvancedWeatherDashboard = () => {
  const [activeStation, setActiveStation] = useState<WeatherStation | null>(null);
  const [activeParameter, setActiveParameter] = useState<'temperature' | 'wind' | 'precipitation'>('temperature');
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [isAnalogClock, setIsAnalogClock] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const weatherStations: WeatherStation[] = [
    {
      id: 'ny',
      name: 'New York',
      lat: 40.71,
      lon: -74.01,
      elevation: 10,
      timezone: 'America/New_York',
      temperature: 8,
      windSpeed: 4.1,
      precipitation: 0,
      windDirection: 138,
      humidity: 65,
      condition: 'Partly Cloudy'
    },
    {
      id: 'sd',
      name: 'San Diego',
      lat: 32.71,
      lon: -117.16,
      elevation: 36,
      timezone: 'America/Los_Angeles',
      temperature: 24,
      windSpeed: 3.2,
      precipitation: 0,
      windDirection: 180,
      humidity: 72,
      condition: 'Sunny'
    },
    {
      id: 'anchorage',
      name: 'Anchorage',
      lat: 61.22,
      lon: -149.89,
      elevation: 0,
      timezone: 'America/Anchorage',
      temperature: 5,
      windSpeed: 2.8,
      precipitation: 0,
      windDirection: 45,
      humidity: 58,
      condition: 'Cloudy'
    },
    {
      id: 'london',
      name: 'London',
      lat: 51.51,
      lon: -0.13,
      elevation: 25,
      timezone: 'Europe/London',
      temperature: 11,
      windSpeed: 5.6,
      precipitation: 2.4,
      windDirection: 220,
      humidity: 82,
      condition: 'Light Rain'
    }
  ];

  useEffect(() => {
    if (!activeStation) {
      setActiveStation(weatherStations[0]);
    }
    
    // Generate forecast data
    const forecastData: ForecastData[] = [];
    for (let i = 0; i < 24; i++) {
      const time = new Date();
      time.setHours(time.getHours() + i);
      forecastData.push({
        time: time.toISOString(),
        temperature: Math.round((activeStation?.temperature || 20) + Math.random() * 6 - 3),
        precipitation: Math.random() * 3,
        windSpeed: Math.round((activeStation?.windSpeed || 5) + Math.random() * 4 - 2),
        windDirection: Math.round(Math.random() * 360)
      });
    }
    setForecast(forecastData);

    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeStation]);

  const getParameterColor = (parameter: string, value: number) => {
    switch (parameter) {
      case 'temperature':
        if (value < 0) return '#4CAFFE';
        if (value < 10) return '#53BB6C';
        if (value < 20) return '#DDCE16';
        if (value < 30) return '#DF7642';
        return '#DD2323';
      case 'wind':
        if (value < 5) return '#C0CCC0';
        if (value < 10) return '#CCCC99';
        if (value < 20) return '#99CC66';
        return '#336633';
      case 'precipitation':
        if (value < 1) return '#CCCCCC';
        if (value < 3) return '#CCCCAA';
        if (value < 6) return '#9999AA';
        return '#0000CC';
      default:
        return '#CCCCCC';
    }
  };

  const GaugeComponent = ({ title, value, unit, parameter, max }: { 
    title: string; 
    value: number; 
    unit: string; 
    parameter: 'temperature' | 'wind' | 'precipitation';
    max: number;
  }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const isActive = activeParameter === parameter;
    
    return (
      <div 
        className={`relative w-32 h-32 cursor-pointer transition-all duration-300 ${
          isActive ? 'scale-105 ring-2 ring-blue-400' : 'hover:scale-102'
        }`}
        onClick={() => setActiveParameter(parameter)}
      >
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={getParameterColor(parameter, value)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 314} 314`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {value.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{unit}</div>
        </div>
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-center text-gray-600 dark:text-gray-300">
          {title}
        </div>
      </div>
    );
  };

  const WorldClock = () => {
    const getLocalTime = (timezone: string) => {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(currentTime);
    };

    const AnalogClock = ({ time, size = 60 }: { time: string; size?: number }) => {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      const hourAngle = (hours % 12) * 30 + minutes * 0.5;
      const minuteAngle = minutes * 6;
      const secondAngle = seconds * 6;

      return (
        <div className={`relative mx-auto`} style={{ width: size, height: size }}>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="white" stroke="#333" strokeWidth="2"/>
            {[...Array(12)].map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="10"
                x2="50"
                y2="15"
                stroke="#333"
                strokeWidth="2"
                transform={`rotate(${i * 30} 50 50)`}
              />
            ))}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="25"
              stroke="#333"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${hourAngle} 50 50)`}
            />
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="15"
              stroke="#666"
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle} 50 50)`}
            />
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="12"
              stroke="#ff0000"
              strokeWidth="1"
              strokeLinecap="round"
              transform={`rotate(${secondAngle} 50 50)`}
            />
            <circle cx="50" cy="50" r="2" fill="#333"/>
          </svg>
        </div>
      );
    };

    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            World Clock
          </h3>
          <Switch
            checked={isAnalogClock}
            onCheckedChange={setIsAnalogClock}
            className="scale-75"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {weatherStations.slice(0, 4).map((station) => (
            <div key={station.id} className="text-center">
              <div className="text-white text-sm mb-2">{station.name}</div>
              {isAnalogClock ? (
                <div>
                  <AnalogClock time={getLocalTime(station.timezone)} size={50} />
                  <div className="text-white text-xs mt-1 font-mono">
                    {getLocalTime(station.timezone)}
                  </div>
                </div>
              ) : (
                <div className="text-white text-lg font-mono">
                  {getLocalTime(station.timezone)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Interactive Weather Visualization</h2>
        <p className="text-white/80 text-lg max-w-4xl mx-auto">
          Advanced weather data visualization with real-time IoT monitoring, interactive maps, and comprehensive forecasting. 
          Visualizations help identify patterns and anomalies in climate data for improved decision-making across agriculture, 
          transportation, energy management, and emergency response.
        </p>
      </div>

      {/* Top Row - Map and KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Map */}
        <Card className="bg-gradient-to-br from-blue-900/80 to-slate-800/80 backdrop-blur-lg border-2 border-blue-300/30 shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-xl">
              {activeParameter.charAt(0).toUpperCase() + activeParameter.slice(1)} Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg overflow-hidden">
              {/* Simplified map background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-700/40"></div>
              
              {/* Weather stations */}
              {weatherStations.map((station) => {
                const value = station[activeParameter as keyof WeatherStation] as number;
                return (
                  <div
                    key={station.id}
                    className={`absolute w-8 h-8 rounded-full border-2 border-white cursor-pointer transition-all duration-300 ${
                      activeStation?.id === station.id ? 'scale-125 ring-2 ring-yellow-400' : 'hover:scale-110'
                    }`}
                    style={{
                      backgroundColor: getParameterColor(activeParameter, value),
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                    }}
                    onClick={() => setActiveStation(station)}
                  >
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs whitespace-nowrap bg-black/50 px-1 rounded">
                      {station.name}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                      {Math.round(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* KPIs and Info */}
        <div className="space-y-4">
          {/* Geographic Info */}
          <Card className="bg-gradient-to-br from-gray-900/80 to-slate-900/80 backdrop-blur-lg border-2 border-gray-300/30">
            <CardContent className="p-4">
              <div className="text-white">
                <h3 className="text-lg font-semibold mb-2">Forecast for {activeStation?.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-300">Longitude:</span>
                    <div className="font-mono">{activeStation?.lon.toFixed(2)} degr.</div>
                  </div>
                  <div>
                    <span className="text-gray-300">Latitude:</span>
                    <div className="font-mono">{activeStation?.lat.toFixed(2)} degr.</div>
                  </div>
                  <div>
                    <span className="text-gray-300">Elevation:</span>
                    <div className="font-mono">{activeStation?.elevation} m.</div>
                  </div>
                  <div>
                    <span className="text-gray-300">Condition:</span>
                    <div>{activeStation?.condition}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI Gauges */}
          <Card className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 backdrop-blur-lg border-2 border-purple-300/30">
            <CardContent className="p-6">
              <div className="flex justify-around items-center">
                <GaugeComponent
                  title="Temperature (latest)"
                  value={activeStation?.temperature || 0}
                  unit="°C"
                  parameter="temperature"
                  max={40}
                />
                <GaugeComponent
                  title="Wind speed (latest)"
                  value={activeStation?.windSpeed || 0}
                  unit="m/s"
                  parameter="wind"
                  max={30}
                />
                <GaugeComponent
                  title="Precipitation (next 24h)"
                  value={activeStation?.precipitation || 0}
                  unit="mm"
                  parameter="precipitation"
                  max={20}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Middle Row - World Clock */}
      <WorldClock />

      {/* Bottom Row - Forecast Grid and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forecast Grid */}
        <Card className="bg-gradient-to-br from-green-900/80 to-emerald-900/80 backdrop-blur-lg border-2 border-green-300/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">
              Forecast for {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-white text-sm">
                <thead className="sticky top-0 bg-green-900/90">
                  <tr>
                    <th className="text-left p-2">Local Time</th>
                    <th className="text-left p-2">Temp. °C</th>
                    <th className="text-left p-2">Precip. mm</th>
                    <th className="text-left p-2">Wind m/s</th>
                    <th className="text-left p-2">Wind dir. degr.</th>
                  </tr>
                </thead>
                <tbody>
                  {forecast.slice(0, 12).map((item, index) => (
                    <tr key={index} className="border-b border-green-700/30 hover:bg-green-800/30">
                      <td className="p-2">
                        {new Date(item.time).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true
                        })}
                      </td>
                      <td className="p-2">{item.temperature.toFixed(1)}</td>
                      <td className="p-2">{item.precipitation.toFixed(1)}</td>
                      <td className="p-2">{item.windSpeed.toFixed(1)}</td>
                      <td className="p-2">{item.windDirection}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Forecast Chart */}
        <Card className="bg-gradient-to-br from-orange-900/80 to-red-900/80 backdrop-blur-lg border-2 border-orange-300/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">
              {activeParameter.charAt(0).toUpperCase() + activeParameter.slice(1)} forecast for {activeStation?.name}
            </CardTitle>
            <div className="text-white/70 text-sm">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-48">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {/* Chart grid */}
                {[...Array(5)].map((_, i) => (
                  <line
                    key={i}
                    x1="40"
                    y1={40 + i * 30}
                    x2="360"
                    y2={40 + i * 30}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Chart line */}
                <polyline
                  fill="none"
                  stroke={getParameterColor(activeParameter, activeStation?.[activeParameter] || 0)}
                  strokeWidth="3"
                  strokeLinecap="round"
                  points={forecast.slice(0, 12).map((item, index) => {
                    const x = 40 + (index * 25);
                    const value = item[activeParameter as keyof ForecastData] as number;
                    const y = 170 - (value / 30) * 120;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                
                {/* Data points */}
                {forecast.slice(0, 12).map((item, index) => {
                  const x = 40 + (index * 25);
                  const value = item[activeParameter as keyof ForecastData] as number;
                  const y = 170 - (value / 30) * 120;
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="4"
                      fill={getParameterColor(activeParameter, value)}
                      className="hover:r-6 transition-all duration-200"
                    />
                  );
                })}
                
                {/* Time labels */}
                {forecast.slice(0, 12).map((item, index) => {
                  if (index % 3 === 0) {
                    const x = 40 + (index * 25);
                    return (
                      <text
                        key={index}
                        x={x}
                        y="190"
                        fill="white"
                        fontSize="10"
                        textAnchor="middle"
                      >
                        {new Date(item.time).toLocaleTimeString('en-US', { 
                          hour: 'numeric',
                          hour12: true
                        })}
                      </text>
                    );
                  }
                  return null;
                })}
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Section */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Benefits of Interactive Weather Visualizations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/90">
          <div>
            <h4 className="font-semibold mb-2">• Improved Decision-Making</h4>
            <p className="text-sm text-white/70">Visualizations make it easier to understand complex data, leading to better-informed decisions across agriculture, transportation, and energy sectors.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">• Pattern Recognition</h4>
            <p className="text-sm text-white/70">Visual representations help identify trends and patterns that might not be apparent in raw meteorological data.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">• Accessibility</h4>
            <p className="text-sm text-white/70">Well-designed visualizations make weather information accessible to users of all technical backgrounds and expertise levels.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">• Real-Time Engagement</h4>
            <p className="text-sm text-white/70">Interactive elements encourage users to explore data, leading to deeper understanding and actionable insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedWeatherDashboard;
