
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CloudSun, MapPin, Wind, Droplets, Eye, Thermometer, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  feelsLike: number;
  uvIndex: number;
  airQuality: string;
  lastUpdated: Date;
}

const EnhancedWeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateWeatherData = (locationName: string): WeatherData => {
    const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Sunny'];
    const airQualities = ['Good', 'Moderate', 'Unhealthy for Sensitive'];
    
    return {
      location: locationName,
      temperature: Math.round(15 + Math.random() * 20),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      humidity: Math.round(40 + Math.random() * 40),
      windSpeed: Math.round(Math.random() * 15),
      visibility: Math.round(5 + Math.random() * 15),
      feelsLike: Math.round(15 + Math.random() * 20),
      uvIndex: Math.round(Math.random() * 10),
      airQuality: airQualities[Math.floor(Math.random() * airQualities.length)],
      lastUpdated: new Date()
    };
  };

  const getConditionColor = (condition: string): string => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'partly cloudy':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cloudy':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'light rain':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAirQualityColor = (quality: string): string => {
    switch (quality.toLowerCase()) {
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const updateWeather = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newWeather = generateWeatherData('Current Location');
      setWeather(newWeather);
      
      toast({
        title: 'Weather Updated',
        description: 'Latest weather information retrieved',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Could not fetch latest weather data',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateWeather();
  }, []);

  if (!weather) {
    return (
      <Card className="bg-white/95 backdrop-blur-md border border-white/20 shadow-xl">
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Loading weather...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-md border border-white/20 shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-gray-800">
          <div className="flex items-center gap-2">
            <CloudSun className="w-6 h-6" />
            Weather & Air Quality
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={updateWeather}
            disabled={isLoading}
            className="text-gray-600 hover:text-gray-800"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Weather Display */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-lg font-semibold text-gray-800">{weather.location}</span>
          </div>
          <div className="text-5xl font-bold text-gray-800 mb-2">{weather.temperature}°C</div>
          <Badge className={`${getConditionColor(weather.condition)} border`}>
            {weather.condition}
          </Badge>
          <div className="text-sm text-gray-600 mt-2">
            Feels like {weather.feelsLike}°C
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <Wind className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <div className="text-sm text-gray-600">Wind</div>
            <div className="font-semibold text-gray-800">{weather.windSpeed} km/h</div>
          </div>
          <div className="bg-teal-50 rounded-lg p-3 text-center">
            <Droplets className="w-5 h-5 mx-auto mb-1 text-teal-600" />
            <div className="text-sm text-gray-600">Humidity</div>
            <div className="font-semibold text-gray-800">{weather.humidity}%</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <Eye className="w-5 h-5 mx-auto mb-1 text-purple-600" />
            <div className="text-sm text-gray-600">Visibility</div>
            <div className="font-semibold text-gray-800">{weather.visibility} km</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <Thermometer className="w-5 h-5 mx-auto mb-1 text-orange-600" />
            <div className="text-sm text-gray-600">UV Index</div>
            <div className="font-semibold text-gray-800">{weather.uvIndex}</div>
          </div>
        </div>

        {/* Air Quality */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Air Quality</span>
            <Badge className={`${getAirQualityColor(weather.airQuality)} border text-xs`}>
              {weather.airQuality}
            </Badge>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center text-xs text-gray-500">
          Last updated: {weather.lastUpdated.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedWeatherWidget;
