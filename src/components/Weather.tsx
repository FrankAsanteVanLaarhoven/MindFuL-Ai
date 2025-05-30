
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CloudSun, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  airQuality: string;
  lastUpdated: Date;
}

const Weather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<string>('');
  const { toast } = useToast();

  const generateWeatherData = (locationName: string): WeatherData => {
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
    const airQualities = ['Good', 'Moderate', 'Unhealthy for Sensitive Groups'];
    
    return {
      location: locationName,
      temperature: Math.round(15 + Math.random() * 20),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      humidity: Math.round(40 + Math.random() * 40),
      windSpeed: Math.round(Math.random() * 15),
      uvIndex: Math.round(Math.random() * 10),
      airQuality: airQualities[Math.floor(Math.random() * airQualities.length)],
      lastUpdated: new Date()
    };
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    console.log('Getting current location...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            const simulatedLocation = 'Current Location';
            setLocation(simulatedLocation);
            setWeatherData(generateWeatherData(simulatedLocation));
            setIsLoading(false);
            
            toast({
              title: "Location Updated",
              description: "Weather data refreshed for your current location",
              duration: 3000,
            });
          }, 1500);
        },
        (error) => {
          console.error('Location error:', error);
          const defaultLocation = 'Default Location';
          setLocation(defaultLocation);
          setWeatherData(generateWeatherData(defaultLocation));
          setIsLoading(false);
          
          toast({
            title: "Using Default Location",
            description: "Couldn't access your location, showing default weather",
            duration: 3000,
          });
        }
      );
    } else {
      const defaultLocation = 'Default Location';
      setLocation(defaultLocation);
      setWeatherData(generateWeatherData(defaultLocation));
      setIsLoading(false);
    }
  };

  const refreshWeather = () => {
    if (location) {
      setIsLoading(true);
      setTimeout(() => {
        setWeatherData(generateWeatherData(location));
        setIsLoading(false);
        
        toast({
          title: "Weather Updated",
          description: "Latest weather information retrieved",
          duration: 2000,
        });
      }, 1000);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return 'bg-yellow-100 text-yellow-800';
      case 'partly cloudy':
        return 'bg-blue-100 text-blue-800';
      case 'cloudy':
        return 'bg-gray-100 text-gray-800';
      case 'light rain':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAirQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-orange-800 text-lg">
            <CloudSun className="w-5 h-5" />
            Weather & Air Quality
          </CardTitle>
          <Button
            onClick={refreshWeather}
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
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="ml-2 text-sm text-gray-600">Loading...</span>
          </div>
        ) : weatherData ? (
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {weatherData.temperature}°C
              </h3>
              <p className="text-gray-600 text-sm mb-2">{weatherData.location}</p>
              <Badge className={getConditionColor(weatherData.condition)}>
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

            <div className="text-xs text-gray-400 text-center">
              Updated: {weatherData.lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <CloudSun className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Weather data unavailable</p>
            <Button onClick={getCurrentLocation} variant="outline" className="mt-2" size="sm">
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Weather;
