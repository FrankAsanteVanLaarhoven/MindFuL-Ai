
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CloudSun, RefreshCw, Settings, Sun, Cloud, CloudRain } from 'lucide-react';
import { WeatherService } from '@/services/weatherService';
import { WeatherData } from '@/types/weather';

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('Current Location');
  const [customLocation, setCustomLocation] = useState('');
  const [forecast, setForecast] = useState<WeatherData[]>([]);

  const updateWeather = () => {
    setIsLoading(true);
    setTimeout(() => {
      const weather = WeatherService.generateWeatherData(location);
      setWeatherData(weather);
      
      // Generate 7-day forecast
      const weekForecast = Array.from({ length: 7 }, (_, i) => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + i);
        return WeatherService.generateWeatherData(`${location} - ${futureDate.toLocaleDateString('en-US', { weekday: 'short' })}`);
      });
      setForecast(weekForecast);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    updateWeather();
    const interval = setInterval(updateWeather, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [location]);

  const getWeatherScene = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-orange-200 to-yellow-300 opacity-30">
            <Sun className="absolute top-2 right-2 w-8 h-8 text-yellow-500 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-yellow-100/50" />
          </div>
        );
      case 'partly cloudy':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-white to-gray-200 opacity-40">
            <Sun className="absolute top-2 right-2 w-6 h-6 text-yellow-500" />
            <Cloud className="absolute top-1 right-8 w-8 h-8 text-gray-400" />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-100/30" />
          </div>
        );
      case 'cloudy':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400 opacity-40">
            <Cloud className="absolute top-1 right-2 w-8 h-8 text-gray-500" />
            <Cloud className="absolute top-3 right-10 w-6 h-6 text-gray-400" />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-gray-200/50" />
          </div>
        );
      case 'light rain':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-gray-300 to-blue-500 opacity-40">
            <CloudRain className="absolute top-2 right-2 w-8 h-8 text-blue-600" />
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-px h-3 bg-blue-400 opacity-60 animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-white opacity-30">
            <CloudSun className="absolute top-2 right-2 w-8 h-8 text-orange-500" />
          </div>
        );
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-12 h-12 text-yellow-500" />;
      case 'partly cloudy':
        return <CloudSun className="w-12 h-12 text-orange-500" />;
      case 'cloudy':
        return <Cloud className="w-12 h-12 text-gray-500" />;
      case 'light rain':
        return <CloudRain className="w-12 h-12 text-blue-500" />;
      default:
        return <CloudSun className="w-12 h-12 text-orange-500" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-orange-100 backdrop-blur-lg border-2 border-orange-200/50 shadow-2xl h-full overflow-hidden relative">
      {weatherData && getWeatherScene(weatherData.condition)}
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-orange-900 text-xl font-bold">
            <CloudSun className="w-6 h-6" />
            Weather
          </CardTitle>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-orange-200/50">
                  <Settings className="w-4 h-4 text-orange-700" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Weather Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Custom Location</Label>
                    <Input
                      id="location"
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      placeholder="Enter city name"
                    />
                    <Button 
                      onClick={() => {
                        if (customLocation.trim()) {
                          setLocation(customLocation);
                          setCustomLocation('');
                        }
                      }}
                      className="w-full"
                    >
                      Update Location
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              onClick={updateWeather}
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className="h-8 w-8 p-0 hover:bg-orange-200/50"
            >
              <RefreshCw className={`w-4 h-4 text-orange-700 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        {weatherData && (
          <>
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-center mb-2">
                {getWeatherIcon(weatherData.condition)}
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {weatherData.temperature}°C
              </div>
              <div className="text-gray-700 font-medium mb-1">{location}</div>
              <Badge className={`${WeatherService.getConditionColor(weatherData.condition)} text-sm px-3 py-1`}>
                {weatherData.condition}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-100/70 backdrop-blur-sm rounded-lg p-3 shadow-md">
                <div className="text-xs text-blue-600 font-medium">Humidity</div>
                <div className="text-lg font-bold text-blue-800">
                  {weatherData.humidity}%
                </div>
              </div>
              <div className="bg-green-100/70 backdrop-blur-sm rounded-lg p-3 shadow-md">
                <div className="text-xs text-green-600 font-medium">Wind</div>
                <div className="text-lg font-bold text-green-800">
                  {weatherData.windSpeed} km/h
                </div>
              </div>
              <div className="bg-yellow-100/70 backdrop-blur-sm rounded-lg p-3 shadow-md">
                <div className="text-xs text-yellow-600 font-medium">UV Index</div>
                <div className="text-lg font-bold text-yellow-800">
                  {weatherData.uvIndex}
                </div>
              </div>
              <div className="bg-purple-100/70 backdrop-blur-sm rounded-lg p-3 shadow-md">
                <div className="text-xs text-purple-600 font-medium">Air Quality</div>
                <div className="text-sm font-bold text-purple-800">
                  {weatherData.airQuality}
                </div>
              </div>
            </div>

            {/* 7-Day Forecast */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 shadow-lg">
              <div className="text-sm font-semibold text-gray-800 mb-2">7-Day Forecast</div>
              <div className="grid grid-cols-7 gap-1">
                {forecast.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-600 mb-1">
                      {day.location.split(' - ')[1] || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {day.temperature}°
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-600 text-white px-3 py-1 rounded-full text-xs shadow-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Updated: {weatherData.lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
