
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  airQuality: string;
  lastUpdated: Date;
}

export interface WeatherCondition {
  name: string;
  color: string;
}
