
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudSun, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WeatherService } from '@/services/weatherService';
import { WeatherData } from '@/types/weather';

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateWeather = () => {
    setIsLoading(true);
    setTimeout(() => {
      setWeatherData(WeatherService.generateWeatherData('Current Location'));
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    updateWeather();
  }, []);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-orange-800 text-lg">
            <CloudSun className="w-5 h-5" />
            Weather
          </CardTitle>
          <Button
            onClick={updateWeather}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {weatherData && (
          <>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {weatherData.temperature}°C
              </div>
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
