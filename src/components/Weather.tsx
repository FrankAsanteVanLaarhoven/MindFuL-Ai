
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useWeatherLocation } from '@/hooks/useWeatherLocation';
import WeatherHeader from '@/components/weather/WeatherHeader';
import WeatherDisplay from '@/components/weather/WeatherDisplay';
import WellnessTips from '@/components/weather/WellnessTips';
import WeatherLoadingState from '@/components/weather/WeatherLoadingState';
import WeatherEmptyState from '@/components/weather/WeatherEmptyState';

const Weather = () => {
  const { weatherData, isLoading, getCurrentLocation, refreshWeather } = useWeatherLocation();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg h-full">
      <WeatherHeader onRefresh={refreshWeather} isLoading={isLoading} />
      <CardContent className="space-y-3">
        {isLoading ? (
          <WeatherLoadingState />
        ) : weatherData ? (
          <div className="space-y-3">
            <WeatherDisplay weatherData={weatherData} />
            <WellnessTips weatherData={weatherData} />
          </div>
        ) : (
          <WeatherEmptyState onRetry={getCurrentLocation} />
        )}
      </CardContent>
    </Card>
  );
};

export default Weather;
