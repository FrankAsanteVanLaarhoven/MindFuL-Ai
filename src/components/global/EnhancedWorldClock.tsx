
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Sun, Moon } from 'lucide-react';

const cities = [
  { name: "London", zone: "Europe/London", flag: "🇬🇧" },
  { name: "New York", zone: "America/New_York", flag: "🇺🇸" },
  { name: "Tokyo", zone: "Asia/Tokyo", flag: "🇯🇵" },
  { name: "Sydney", zone: "Australia/Sydney", flag: "🇦🇺" },
  { name: "Dubai", zone: "Asia/Dubai", flag: "🇦🇪" },
  { name: "São Paulo", zone: "America/Sao_Paulo", flag: "🇧🇷" },
];

const EnhancedWorldClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeInZone = (timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(currentTime);
  };

  const getDateInZone = (timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(currentTime);
  };

  const isDayTime = (timezone: string) => {
    const hour = parseInt(new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    }).format(currentTime));
    return hour >= 6 && hour < 18;
  };

  return (
    <Card className="bg-white/95 backdrop-blur-md border border-white/20 shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-800 text-xl">
          <Clock className="w-6 h-6" />
          World Clock
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map((city) => {
            const isDay = isDayTime(city.zone);
            const time = getTimeInZone(city.zone);
            const date = getDateInZone(city.zone);
            
            return (
              <div
                key={city.zone}
                className={`p-4 rounded-xl text-center transition-all duration-300 hover:scale-105 ${
                  isDay 
                    ? "bg-gradient-to-br from-blue-100 to-sky-200 text-blue-900" 
                    : "bg-gradient-to-br from-slate-700 to-slate-900 text-white"
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">{city.flag}</span>
                  {isDay ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-blue-300" />}
                </div>
                <div className="font-bold text-lg">{city.name}</div>
                <div className="text-2xl font-mono font-bold my-1">{time}</div>
                <div className="text-sm opacity-75">{date}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live time • Updated every second
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedWorldClock;
