
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface TimeData {
  city: string;
  time: string;
  timezone: string;
}

const WorldClockCard = () => {
  const [timeData, setTimeData] = useState<TimeData[]>([]);

  const updateTimes = () => {
    const timezones = [
      { city: 'New York', timezone: 'America/New_York' },
      { city: 'London', timezone: 'Europe/London' },
      { city: 'Tokyo', timezone: 'Asia/Tokyo' }
    ];

    const now = new Date();
    const newTimeData = timezones.map(tz => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz.timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      
      return {
        city: tz.city,
        time: formatter.format(now),
        timezone: tz.timezone
      };
    });
    
    setTimeData(newTimeData);
  };

  useEffect(() => {
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-indigo-800 text-lg">
          <Clock className="w-5 h-5" />
          World Clock
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {timeData.map((data) => (
          <div key={data.city} className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-indigo-800 text-sm">{data.city}</span>
              <span className="text-lg font-bold text-indigo-900">{data.time}</span>
            </div>
          </div>
        ))}
        <div className="text-xs text-gray-400 text-center mt-3">
          Live time • Updated every second
        </div>
      </CardContent>
    </Card>
  );
};

export default WorldClockCard;
