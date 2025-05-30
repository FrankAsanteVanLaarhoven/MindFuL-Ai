
import React, { useState, useEffect } from 'react';
import NavigationBar from '@/components/layout/NavigationBar';
import TemperatureMap from '@/components/weather/TemperatureMap';
import WeatherKPIGauges from '@/components/weather/WeatherKPIGauges';
import LiveWorldClock from '@/components/weather/LiveWorldClock';
import ForecastGrid from '@/components/weather/ForecastGrid';
import TemperatureForecastChart from '@/components/weather/TemperatureForecastChart';
import CityInfoPanel from '@/components/weather/CityInfoPanel';

const AdvancedWeatherDashboard = () => {
  const [selectedCity, setSelectedCity] = useState('New York');
  const [selectedParameter, setSelectedParameter] = useState('temperature');
  const [currentWeatherData, setCurrentWeatherData] = useState({
    temperature: 8.0,
    windSpeed: 4.1,
    precipitation: 0.0
  });

  const cityDatabase = {
    'New York': { longitude: -74.01, latitude: 40.71, elevation: 10, condition: 'Partly Cloudy' },
    'San Diego': { longitude: -117.16, latitude: 32.71, elevation: 36, condition: 'Sunny' },
    'London': { longitude: -0.13, latitude: 51.51, elevation: 24, condition: 'Cloudy' },
    'Anchorage': { longitude: -149.89, latitude: 61.22, elevation: 0, condition: 'Clear' }
  };

  // Generate realistic forecast data
  const generateForecastData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 0; i < 8; i++) {
      const futureTime = new Date(now.getTime() + i * 3600000); // Add i hours
      const baseTemp = currentWeatherData.temperature;
      const tempVariation = (Math.sin(i * 0.5) * 3) + (Math.random() - 0.5) * 2;
      
      data.push({
        time: futureTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        displayTime: futureTime.getHours() === 0 ? '12 AM' : 
                    futureTime.getHours() === 12 ? '12 PM' :
                    futureTime.getHours() > 12 ? `${futureTime.getHours() - 12} PM` :
                    `${futureTime.getHours()} AM`,
        temperature: baseTemp + tempVariation,
        precipitation: Math.max(0, Math.random() * 3),
        windSpeed: 2 + Math.random() * 4,
        windDirection: Math.floor(Math.random() * 360)
      });
    }
    return data;
  };

  const [forecastData, setForecastData] = useState(generateForecastData());

  // Update weather data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWeatherData(prev => ({
        temperature: prev.temperature + (Math.random() - 0.5) * 0.5,
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 0.3),
        precipitation: Math.max(0, prev.precipitation + (Math.random() - 0.5) * 0.1)
      }));
      setForecastData(generateForecastData());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [currentWeatherData.temperature]);

  // Update data when city changes
  useEffect(() => {
    // Simulate different weather for different cities
    const cityWeatherVariations = {
      'New York': { temp: 8, wind: 4.1, precip: 0.5 },
      'San Diego': { temp: 24, wind: 2.3, precip: 0.0 },
      'London': { temp: 11, wind: 6.2, precip: 1.2 },
      'Anchorage': { temp: -8, wind: 3.1, precip: 0.3 }
    };

    const cityWeather = cityWeatherVariations[selectedCity as keyof typeof cityWeatherVariations];
    if (cityWeather) {
      setCurrentWeatherData({
        temperature: cityWeather.temp + (Math.random() - 0.5) * 2,
        windSpeed: cityWeather.wind + (Math.random() - 0.5),
        precipitation: cityWeather.precip + Math.random() * 0.5
      });
    }
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Advanced Weather Dashboard</h1>
          <p className="text-white/80 text-lg">
            Real-time weather monitoring with interactive visualizations and global forecasting
          </p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Temperature Map */}
          <TemperatureMap 
            onCitySelect={setSelectedCity} 
            selectedCity={selectedCity} 
          />
          
          {/* City Info and KPI Gauges */}
          <div className="space-y-4">
            <CityInfoPanel 
              selectedCity={selectedCity}
              cityData={cityDatabase[selectedCity as keyof typeof cityDatabase]}
            />
            <WeatherKPIGauges
              temperature={currentWeatherData.temperature}
              windSpeed={currentWeatherData.windSpeed}
              precipitation={currentWeatherData.precipitation}
              selectedParameter={selectedParameter}
              onParameterSelect={setSelectedParameter}
            />
          </div>
        </div>

        {/* World Clock */}
        <div className="mb-6">
          <LiveWorldClock />
        </div>

        {/* Forecast Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Forecast Grid */}
          <ForecastGrid 
            forecastData={forecastData}
            selectedCity={selectedCity}
          />
          
          {/* Temperature Chart */}
          <TemperatureForecastChart 
            forecastData={forecastData}
            selectedCity={selectedCity}
          />
        </div>

        {/* Live Data Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live Data • Updates every minute • Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedWeatherDashboard;
