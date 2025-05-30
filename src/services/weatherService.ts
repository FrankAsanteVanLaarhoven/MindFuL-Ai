
import { WeatherData } from '@/types/weather';

export class WeatherService {
  static generateWeatherData(locationName: string): WeatherData {
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
  }

  static getConditionColor(condition: string): string {
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
  }

  static getAirQualityColor(quality: string): string {
    switch (quality.toLowerCase()) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  }
}
