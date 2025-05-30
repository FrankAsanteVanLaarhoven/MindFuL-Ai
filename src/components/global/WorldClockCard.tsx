
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TimeData {
  city: string;
  time: string;
  timezone: string;
  digitalTime: string;
  date: string;
  dayOfWeek: string;
}

const WorldClockCard = () => {
  const [timeData, setTimeData] = useState<TimeData[]>([]);
  const [isAnalogMode, setIsAnalogMode] = useState(false);
  const [selectedTimezones, setSelectedTimezones] = useState([
    { city: 'New York', timezone: 'America/New_York' },
    { city: 'London', timezone: 'Europe/London' },
    { city: 'Tokyo', timezone: 'Asia/Tokyo' }
  ]);

  const availableTimezones = [
    { city: 'New York', timezone: 'America/New_York' },
    { city: 'London', timezone: 'Europe/London' },
    { city: 'Tokyo', timezone: 'Asia/Tokyo' },
    { city: 'Paris', timezone: 'Europe/Paris' },
    { city: 'Sydney', timezone: 'Australia/Sydney' },
    { city: 'Dubai', timezone: 'Asia/Dubai' },
    { city: 'Los Angeles', timezone: 'America/Los_Angeles' },
    { city: 'Singapore', timezone: 'Asia/Singapore' },
    { city: 'Mumbai', timezone: 'Asia/Kolkata' },
    { city: 'São Paulo', timezone: 'America/Sao_Paulo' }
  ];

  const updateTimes = () => {
    const now = new Date();
    const newTimeData = selectedTimezones.map(tz => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz.timezone,
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });

      const digitalFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      
      return {
        city: tz.city,
        time: formatter.format(now),
        digitalTime: digitalFormatter.format(now),
        timezone: tz.timezone,
        date: dateFormatter.format(now),
        dayOfWeek: new Intl.DateTimeFormat('en-US', { timeZone: tz.timezone, weekday: 'long' }).format(now)
      };
    });
    
    setTimeData(newTimeData);
  };

  useEffect(() => {
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [selectedTimezones]);

  const AnalogClock = ({ time }: { time: string }) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const hourAngle = (hours % 12) * 30 + minutes * 0.5;
    const minuteAngle = minutes * 6;
    const secondAngle = seconds * 6;

    return (
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-200 bg-gradient-to-br from-white to-indigo-50">
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-3 bg-indigo-400"
              style={{
                top: '4px',
                left: '50%',
                transformOrigin: '50% 36px',
                transform: `translateX(-50%) rotate(${i * 30}deg)`
              }}
            />
          ))}
          
          {/* Hour hand */}
          <div
            className="absolute w-1 bg-indigo-800 rounded-full"
            style={{
              height: '24px',
              top: '16px',
              left: '50%',
              transformOrigin: '50% 24px',
              transform: `translateX(-50%) rotate(${hourAngle}deg)`
            }}
          />
          
          {/* Minute hand */}
          <div
            className="absolute w-0.5 bg-indigo-600 rounded-full"
            style={{
              height: '30px',
              top: '10px',
              left: '50%',
              transformOrigin: '50% 30px',
              transform: `translateX(-50%) rotate(${minuteAngle}deg)`
            }}
          />
          
          {/* Second hand */}
          <div
            className="absolute w-px bg-red-500 rounded-full"
            style={{
              height: '32px',
              top: '8px',
              left: '50%',
              transformOrigin: '50% 32px',
              transform: `translateX(-50%) rotate(${secondAngle}deg)`
            }}
          />
          
          {/* Center dot */}
          <div className="absolute w-2 h-2 bg-indigo-800 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-100 backdrop-blur-lg border-2 border-indigo-200/50 shadow-2xl h-full overflow-hidden relative">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 animate-pulse" />
      </div>
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-indigo-900 text-xl font-bold">
            <Clock className="w-6 h-6 animate-pulse" />
            World Clock
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-indigo-200/50">
                <Settings className="w-4 h-4 text-indigo-700" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Clock Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="analog-mode"
                    checked={isAnalogMode}
                    onCheckedChange={setIsAnalogMode}
                  />
                  <Label htmlFor="analog-mode">Analog Clock Mode</Label>
                </div>
                <div className="space-y-2">
                  <Label>Select Timezones (up to 4)</Label>
                  {availableTimezones.map((tz) => (
                    <div key={tz.timezone} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTimezones.some(selected => selected.timezone === tz.timezone)}
                        onChange={(e) => {
                          if (e.target.checked && selectedTimezones.length < 4) {
                            setSelectedTimezones([...selectedTimezones, tz]);
                          } else if (!e.target.checked) {
                            setSelectedTimezones(selectedTimezones.filter(selected => selected.timezone !== tz.timezone));
                          }
                        }}
                        disabled={!selectedTimezones.some(selected => selected.timezone === tz.timezone) && selectedTimezones.length >= 4}
                      />
                      <Label className="text-sm">{tz.city}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        {timeData.map((data, index) => (
          <div key={data.city} className="bg-white/70 backdrop-blur-sm border border-indigo-300/50 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/80">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-bold text-indigo-900 text-lg">{data.city}</div>
                <div className="text-indigo-700 text-sm">{data.dayOfWeek}</div>
                <div className="text-indigo-600 text-xs">{data.date}</div>
              </div>
              
              {isAnalogMode ? (
                <div className="flex flex-col items-center">
                  <AnalogClock time={data.digitalTime} />
                  <div className="text-indigo-800 text-sm font-mono mt-1">{data.time}</div>
                </div>
              ) : (
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-900 font-mono">{data.time}</div>
                  <div className="text-indigo-700 text-sm font-mono">{data.digitalTime}</div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs shadow-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live • Updates every second
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorldClockCard;
