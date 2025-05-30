
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface TimeZoneData {
  city: string;
  timeZone: string;
  time: string;
}

const LiveWorldClock: React.FC = () => {
  const [times, setTimes] = useState<TimeZoneData[]>([]);

  const timeZones = [
    { city: 'New York', timeZone: 'America/New_York' },
    { city: 'San Diego', timeZone: 'America/Los_Angeles' },
    { city: 'Anchorage', timeZone: 'America/Anchorage' },
    { city: 'London', timeZone: 'Europe/London' }
  ];

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const newTimes = timeZones.map(tz => {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tz.timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        
        return {
          city: tz.city,
          timeZone: tz.timeZone,
          time: formatter.format(now)
        };
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-slate-800 border-slate-700 text-white h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Clock className="w-5 h-5" />
          World Clock
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {times.map((timeData) => (
            <div key={timeData.city} className="text-center">
              <div className="text-sm font-medium text-gray-300 mb-1">
                {timeData.city}
              </div>
              <div className="text-xl font-mono font-bold text-white">
                {timeData.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveWorldClock;
