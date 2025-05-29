
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, RefreshCw } from 'lucide-react';

interface TimeZoneData {
  city: string;
  timeZone: string;
  time: string;
  date: string;
  offset: string;
}

const timeZones = [
  { city: 'New York', timeZone: 'America/New_York' },
  { city: 'Los Angeles', timeZone: 'America/Los_Angeles' },
  { city: 'London', timeZone: 'Europe/London' },
  { city: 'Paris', timeZone: 'Europe/Paris' },
  { city: 'Tokyo', timeZone: 'Asia/Tokyo' },
  { city: 'Sydney', timeZone: 'Australia/Sydney' },
  { city: 'Dubai', timeZone: 'Asia/Dubai' },
  { city: 'Singapore', timeZone: 'Asia/Singapore' },
  { city: 'Moscow', timeZone: 'Europe/Moscow' },
  { city: 'Mumbai', timeZone: 'Asia/Kolkata' },
];

const WorldClock = () => {
  const [selectedTimeZones, setSelectedTimeZones] = useState<string[]>([
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo'
  ]);
  const [timeData, setTimeData] = useState<TimeZoneData[]>([]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const updateTimes = () => {
    const now = new Date();
    setCurrentTime(now);
    
    const newTimeData = selectedTimeZones.map(timeZone => {
      const cityName = timeZones.find(tz => tz.timeZone === timeZone)?.city || timeZone;
      
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      
      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      
      // Calculate offset
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const targetTime = new Date(utcTime + (getTimezoneOffset(timeZone, now) * 3600000));
      const offsetHours = getTimezoneOffset(timeZone, now);
      const offsetString = `UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}`;
      
      return {
        city: cityName,
        timeZone,
        time: formatter.format(now),
        date: dateFormatter.format(now),
        offset: offsetString,
      };
    });
    
    setTimeData(newTimeData);
  };

  const getTimezoneOffset = (timeZone: string, date: Date) => {
    const utc1 = new Date(date.toLocaleString("en-US", {timeZone: "UTC"})).getTime();
    const utc2 = new Date(date.toLocaleString("en-US", {timeZone})).getTime();
    return (utc2 - utc1) / (1000 * 60 * 60);
  };

  const addTimeZone = (timeZone: string) => {
    if (!selectedTimeZones.includes(timeZone)) {
      setSelectedTimeZones(prev => [...prev, timeZone]);
    }
  };

  const removeTimeZone = (timeZone: string) => {
    setSelectedTimeZones(prev => prev.filter(tz => tz !== timeZone));
  };

  useEffect(() => {
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [selectedTimeZones]);

  const getTimeOfDayColor = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 12) return 'bg-yellow-100 border-yellow-300';
    if (hour >= 12 && hour < 18) return 'bg-orange-100 border-orange-300';
    if (hour >= 18 && hour < 22) return 'bg-purple-100 border-purple-300';
    return 'bg-blue-100 border-blue-300';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-indigo-800">
              <Clock className="w-5 h-5" />
              World Clock
            </CardTitle>
            <CardDescription>
              Track time across different zones for global wellness scheduling
            </CardDescription>
          </div>
          <Button
            onClick={updateTimes}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Sync
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Add Time Zone
          </label>
          <Select onValueChange={addTimeZone}>
            <SelectTrigger>
              <SelectValue placeholder="Select a city to add" />
            </SelectTrigger>
            <SelectContent>
              {timeZones
                .filter(tz => !selectedTimeZones.includes(tz.timeZone))
                .map((tz) => (
                  <SelectItem key={tz.timeZone} value={tz.timeZone}>
                    {tz.city}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {timeData.map((data, index) => (
            <div 
              key={data.timeZone} 
              className={`border rounded-lg p-4 ${getTimeOfDayColor(data.time)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800">{data.city}</h3>
                    <button
                      onClick={() => removeTimeZone(data.timeZone)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      disabled={selectedTimeZones.length <= 1}
                    >
                      ×
                    </button>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {data.time}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{data.date}</span>
                    <span className="text-xs bg-white/50 px-2 py-1 rounded">
                      {data.offset}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h4 className="font-semibold text-indigo-800 mb-2">Wellness Scheduling Tips</h4>
          <div className="text-indigo-700 text-sm space-y-1">
            <p>• Schedule meditation sessions during peaceful morning hours</p>
            <p>• Plan virtual wellness meetings considering all time zones</p>
            <p>• Track optimal times for global mental health check-ins</p>
          </div>
        </div>

        <div className="text-xs text-gray-400 text-center">
          Live time • Updated every second
        </div>
      </CardContent>
    </Card>
  );
};

export default WorldClock;
