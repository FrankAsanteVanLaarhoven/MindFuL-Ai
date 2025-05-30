
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, RefreshCw, Plus, X } from 'lucide-react';

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
  { city: 'Mumbai', timeZone: 'Asia/Kolkata' },
];

const WorldClock = () => {
  const { t } = useTranslation();
  const [selectedTimeZones, setSelectedTimeZones] = useState<string[]>([
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo'
  ]);
  const [timeData, setTimeData] = useState<TimeZoneData[]>([]);

  const updateTimes = () => {
    const now = new Date();
    
    const newTimeData = selectedTimeZones.map(timeZone => {
      const cityName = timeZones.find(tz => tz.timeZone === timeZone)?.city || timeZone;
      
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      
      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      
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
    if (!selectedTimeZones.includes(timeZone) && selectedTimeZones.length < 4) {
      setSelectedTimeZones(prev => [...prev, timeZone]);
    }
  };

  const removeTimeZone = (timeZone: string) => {
    if (selectedTimeZones.length > 1) {
      setSelectedTimeZones(prev => prev.filter(tz => tz !== timeZone));
    }
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
    <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg h-full" id="world-clock-widget">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-indigo-800 text-lg">
            <Clock className="w-5 h-5" />
            {t('worldClock.title')}
          </CardTitle>
          <Button
            onClick={updateTimes}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        </div>
        <CardDescription className="text-sm">
          {t('worldClock.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {selectedTimeZones.length < 4 && (
          <div className="space-y-2">
            <Select onValueChange={addTimeZone}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder={t('worldClock.addCity')} />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border border-white/20">
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
        )}

        <div className="space-y-2">
          {timeData.map((data) => (
            <div 
              key={data.timeZone} 
              className={`border rounded-lg p-3 ${getTimeOfDayColor(data.time)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 text-sm">{data.city}</h3>
                    {selectedTimeZones.length > 1 && (
                      <button
                        onClick={() => removeTimeZone(data.timeZone)}
                        className="text-red-500 hover:text-red-700 text-xs p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {data.time}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{data.date}</span>
                    <span className="bg-white/50 px-2 py-0.5 rounded">
                      {data.offset}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <h4 className="font-semibold text-indigo-800 mb-2 text-sm">{t('worldClock.wellnessTips')}</h4>
          <div className="text-indigo-700 text-xs space-y-1">
            <p>• {t('worldClock.scheduleTitle')}</p>
            <p>• {t('worldClock.planMeetings')}</p>
          </div>
        </div>

        <div className="text-xs text-gray-400 text-center">
          {t('worldClock.liveTime')}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorldClock;
