
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WeatherService } from '@/services/weatherService';
import { WeatherData } from '@/types/weather';

export const useWeatherLocation = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<string>('');
  const { toast } = useToast();

  const getCurrentLocation = () => {
    setIsLoading(true);
    console.log('Getting current location...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            const simulatedLocation = 'Current Location';
            setLocation(simulatedLocation);
            setWeatherData(WeatherService.generateWeatherData(simulatedLocation));
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
          setWeatherData(WeatherService.generateWeatherData(defaultLocation));
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
      setWeatherData(WeatherService.generateWeatherData(defaultLocation));
      setIsLoading(false);
    }
  };

  const refreshWeather = () => {
    if (location) {
      setIsLoading(true);
      setTimeout(() => {
        setWeatherData(WeatherService.generateWeatherData(location));
        setIsLoading(false);
        
        toast({
          title: "Weather Updated",
          description: "Latest weather information retrieved",
          duration: 2000,
        });
      }, 1000);
    }
  };

  return {
    weatherData,
    isLoading,
    location,
    getCurrentLocation,
    refreshWeather
  };
};
