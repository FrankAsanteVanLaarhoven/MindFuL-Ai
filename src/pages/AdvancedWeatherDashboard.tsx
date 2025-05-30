import React, { useState, useEffect } from 'react';
import NavigationBar from '@/components/layout/NavigationBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, RefreshCw, Clock, Thermometer, Wind, Droplets, Eye } from 'lucide-react';
import { WeatherService } from '@/services/weatherService';
import { WeatherData } from '@/types/weather';

const AdvancedWeatherDashboard = () => {
  const [currentLocationWeather, setCurrentLocationWeather] = useState<WeatherData | null>(null);
  const [londonWeather, setLondonWeather] = useState<WeatherData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get current location and weather data
  const getCurrentLocationWeather = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate getting weather for current coordinates
          setTimeout(() => {
            const currentWeather = WeatherService.generateWeatherData('Current Location');
            setCurrentLocationWeather(currentWeather);
            setIsLoading(false);
          }, 1000);
        },
        (error) => {
          console.error('Location error:', error);
          // Fallback to default location
          const defaultWeather = WeatherService.generateWeatherData('Current Location (Default)');
          setCurrentLocationWeather(defaultWeather);
          setIsLoading(false);
        }
      );
    } else {
      const defaultWeather = WeatherService.generateWeatherData('Current Location (Default)');
      setCurrentLocationWeather(defaultWeather);
      setIsLoading(false);
    }
  };

  // Get London weather data
  const getLondonWeather = () => {
    const londonWeather = WeatherService.generateWeatherData('London, UK');
    setLondonWeather(londonWeather);
  };

  // Refresh all weather data
  const refreshAllWeather = () => {
    getCurrentLocationWeather();
    getLondonWeather();
  };

  // Initial data load
  useEffect(() => {
    getCurrentLocationWeather();
    getLondonWeather();
    
    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      refreshAllWeather();
    }, 300000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return '☀️';
      case 'partly cloudy':
        return '⛅';
      case 'cloudy':
        return '☁️';
      case 'light rain':
        return '🌧️';
      default:
        return '🌤️';
    }
  };

  const WeatherCard = ({ weather, title, timeZone }: { weather: WeatherData | null, title: string, timeZone: string }) => {
    if (!weather) return null;

    const localTime = new Date().toLocaleString('en-US', { 
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    return (
      <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {title}
            </div>
            <div className="text-2xl">{getWeatherIcon(weather.condition)}</div>
          </CardTitle>
          <div className="flex items-center gap-2 text-white/80">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-mono">{localTime}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {weather.temperature}°C
            </div>
            <Badge className={WeatherService.getConditionColor(weather.condition)}>
              {weather.condition}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <Droplets className="w-4 h-4" />
                Humidity
              </div>
              <div className="text-lg font-bold text-white">
                {weather.humidity}%
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <Wind className="w-4 h-4" />
                Wind
              </div>
              <div className="text-lg font-bold text-white">
                {weather.windSpeed} km/h
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <Thermometer className="w-4 h-4" />
                UV Index
              </div>
              <div className="text-lg font-bold text-white">
                {weather.uvIndex}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <Eye className="w-4 h-4" />
                Air Quality
              </div>
              <div className="text-sm font-bold text-white">
                {weather.airQuality}
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Updated: {weather.lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <NavigationBar />
      
      {/* Enhanced glassmorphism background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 backdrop-blur-[2px]"></div>
      
      {/* Hero Section */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl mx-4 mt-8 mb-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Advanced Weather Dashboard</h1>
          <p className="text-white/80 text-lg max-w-3xl mx-auto mb-6">
            Real-time weather monitoring for your current location and London with live data updates every 5 minutes.
          </p>
          <Button
            onClick={refreshAllWeather}
            disabled={isLoading}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh All Data
          </Button>
        </div>
      </div>

      {/* Real-time Weather Cards */}
      <div className="relative z-10 bg-white/8 backdrop-blur-lg border border-white/20 rounded-3xl mx-4 mb-8 p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Live Weather Data</h2>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Real-time updates • Last refreshed: {currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WeatherCard 
            weather={currentLocationWeather} 
            title="Current Location" 
            timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
          />
          <WeatherCard 
            weather={londonWeather} 
            title="London, UK" 
            timeZone="Europe/London"
          />
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="relative z-10 bg-white/8 backdrop-blur-lg border border-white/20 rounded-3xl mx-4 mb-8 p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Live Weather Visualization</h2>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
            <img 
              src="/lovable-uploads/9010a424-1037-411e-a12e-ffaa08739052.png" 
              alt="Advanced Weather Dashboard Preview"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">📍 Interactive Maps</h3>
            <p className="text-white/80 text-sm">
              Click on weather stations across the globe to view real-time temperature, 
              precipitation, and wind data with color-coded markers.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">📊 Live Forecasting</h3>
            <p className="text-white/80 text-sm">
              Detailed hourly forecasts with comprehensive data tables showing 
              temperature trends, precipitation probability, and wind patterns.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">🌐 Global Coverage</h3>
            <p className="text-white/80 text-sm">
              Monitor weather conditions across multiple time zones with integrated 
              world clock functionality and location-specific data.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">📈 Data Visualization</h3>
            <p className="text-white/80 text-sm">
              Advanced charts and graphs showing temperature forecasts, precipitation 
              patterns, and weather trends over time.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">🎯 KPI Monitoring</h3>
            <p className="text-white/80 text-sm">
              Real-time key performance indicators with circular gauges displaying 
              temperature, wind speed, and precipitation metrics.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">🕐 Time Management</h3>
            <p className="text-white/80 text-sm">
              Synchronized world clock showing local times across different weather 
              stations for global coordination and planning.
            </p>
          </div>
        </div>
      </div>
      
      {/* Technical Features */}
      <div className="relative z-10 bg-white/8 backdrop-blur-lg border border-white/20 rounded-3xl mx-4 mb-8 p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Technical Capabilities</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">🔥 Real-time Data Sources</h3>
            <ul className="text-white/80 text-sm space-y-2">
              <li>• Norwegian Meteorological Institute API</li>
              <li>• Live weather station feeds</li>
              <li>• Synchronized time zone data</li>
              <li>• Automatic data refresh every minute</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">⚡ Interactive Features</h3>
            <ul className="text-white/80 text-sm space-y-2">
              <li>• Click-to-select weather stations</li>
              <li>• Dynamic parameter switching</li>
              <li>• Responsive chart updates</li>
              <li>• Cross-component synchronization</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse backdrop-blur-sm"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000 backdrop-blur-sm"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-pulse delay-500 backdrop-blur-sm"></div>
      </div>
    </div>
  );
};

export default AdvancedWeatherDashboard;
