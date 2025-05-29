import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface MoodDataPoint {
  timestamp: string;
  mood: number;
  time: string;
}

const chartConfig = {
  mood: {
    label: "Mood Level",
    color: "#10b981",
  },
};

const RealTimeMoodChart = () => {
  const [moodData, setMoodData] = useState<MoodDataPoint[]>([]);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate realistic mood data with some variation
  const generateMoodValue = () => {
    const baseValue = 6; // Neutral mood around 6
    const variation = (Math.random() - 0.5) * 2; // Random variation between -1 and 1
    const trend = Math.sin(Date.now() / 10000) * 0.5; // Subtle sine wave trend
    return Math.max(1, Math.min(10, baseValue + variation + trend));
  };

  const addDataPoint = () => {
    const now = new Date();
    const newPoint: MoodDataPoint = {
      timestamp: now.toISOString(),
      mood: generateMoodValue(),
      time: now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
    };

    setMoodData(prev => {
      const updated = [...prev, newPoint];
      // Keep only last 20 data points for smooth visualization
      return updated.slice(-20);
    });
  };

  const startMeasurement = () => {
    setIsActive(true);
    intervalRef.current = setInterval(addDataPoint, 1000); // Update every second
  };

  const stopMeasurement = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const clearData = () => {
    setMoodData([]);
    stopMeasurement();
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getCurrentMood = () => {
    if (moodData.length === 0) return 'No data';
    const latest = moodData[moodData.length - 1];
    return latest.mood.toFixed(1);
  };

  const getMoodLabel = (value: number) => {
    if (value >= 8) return 'Great';
    if (value >= 6) return 'Good';
    if (value >= 4) return 'Okay';
    if (value >= 2) return 'Low';
    return 'Very Low';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-teal-800">
          <span className="text-2xl">📊</span>
          Real-Time Mood Monitor
        </CardTitle>
        <CardDescription>
          Live mood measurement tracking with time series visualization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={isActive ? stopMeasurement : startMeasurement}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-teal-500 hover:bg-teal-600 text-white'
              }`}
            >
              {isActive ? '⏸️ Stop' : '▶️ Start'} Monitoring
            </button>
            <button
              onClick={clearData}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white transition-all duration-200"
            >
              🗑️ Clear
            </button>
          </div>
          
          {/* Current Reading */}
          <div className="text-right">
            <div className="text-2xl font-bold text-teal-600">
              {getCurrentMood()}
            </div>
            <div className="text-xs text-gray-500">
              {moodData.length > 0 ? getMoodLabel(Number(getCurrentMood())) : 'Waiting...'}
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm text-gray-600">
            {isActive ? 'Recording live data...' : 'Measurement stopped'}
          </span>
          {moodData.length > 0 && (
            <span className="text-xs text-gray-500 ml-auto">
              {moodData.length} data points
            </span>
          )}
        </div>

        {/* Chart */}
        <div className="h-64">
          {moodData.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10 }}
                    stroke="#6b7280"
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={[0, 10]}
                    tick={{ fontSize: 10 }}
                    stroke="#6b7280"
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="var(--color-mood)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-mood)", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: "var(--color-mood)", strokeWidth: 2 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <p>Click "Start Monitoring" to begin tracking</p>
                <p className="text-sm mt-1">Real-time mood data will appear here</p>
              </div>
            </div>
          )}
        </div>

        {/* Data Summary */}
        {moodData.length > 0 && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-lg font-semibold text-teal-600">
                {Math.max(...moodData.map(d => d.mood)).toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">Peak</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-teal-600">
                {(moodData.reduce((sum, d) => sum + d.mood, 0) / moodData.length).toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">Average</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-teal-600">
                {Math.min(...moodData.map(d => d.mood)).toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">Low</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeMoodChart;
