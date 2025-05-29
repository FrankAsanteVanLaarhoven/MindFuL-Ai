
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp, Calendar, BarChart3, Activity } from 'lucide-react';
import { getMoodHistory, getMoodTrends } from '@/lib/mood-storage';

interface AnalyticsData {
  date: string;
  mood: number;
  stress: number;
  activities: number;
  journalEntries: number;
}

const chartConfig = {
  mood: {
    label: "Mood Level",
    color: "#10b981",
  },
  stress: {
    label: "Stress Level", 
    color: "#ef4444",
  },
  activities: {
    label: "Activities",
    color: "#3b82f6",
  }
};

const ProgressAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    generateAnalyticsData();
  }, [timeRange]);

  const generateAnalyticsData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const moodHistory = getMoodTrends(days);
    
    // Generate analytics data for the selected time range
    const data: AnalyticsData[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Find mood entries for this date
      const dayEntries = moodHistory.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.toDateString() === date.toDateString();
      });
      
      // Calculate averages and counts
      const avgMood = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => sum + entry.intensity, 0) / dayEntries.length
        : Math.random() * 3 + 5; // Simulate data if no real entries
      
      const stress = Math.max(0, 10 - avgMood + (Math.random() - 0.5) * 2);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: Number(avgMood.toFixed(1)),
        stress: Number(stress.toFixed(1)),
        activities: Math.floor(Math.random() * 5) + 1,
        journalEntries: dayEntries.length
      });
    }
    
    setAnalyticsData(data);
  };

  const calculateAverage = (key: keyof AnalyticsData) => {
    if (analyticsData.length === 0) return 0;
    const sum = analyticsData.reduce((acc, item) => {
      const value = item[key];
      return acc + (typeof value === 'number' ? value : 0);
    }, 0);
    return (sum / analyticsData.length).toFixed(1);
  };

  const getTrend = (key: keyof AnalyticsData) => {
    if (analyticsData.length < 2) return 'stable';
    const recent = analyticsData.slice(-3);
    const earlier = analyticsData.slice(0, 3);
    
    const recentAvg = recent.reduce((acc, item) => {
      const value = item[key];
      return acc + (typeof value === 'number' ? value : 0);
    }, 0) / recent.length;
    
    const earlierAvg = earlier.reduce((acc, item) => {
      const value = item[key];
      return acc + (typeof value === 'number' ? value : 0);
    }, 0) / earlier.length;
    
    if (recentAvg > earlierAvg + 0.5) return 'improving';
    if (recentAvg < earlierAvg - 0.5) return 'declining';
    return 'stable';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-green-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Progress Analytics
        </CardTitle>
        <CardDescription>
          Track your wellness journey over time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-xs font-medium">Avg Mood</p>
                <p className="text-green-800 text-lg font-bold">{calculateAverage('mood')}</p>
              </div>
              <span className="text-lg">{getTrendIcon(getTrend('mood'))}</span>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-xs font-medium">Avg Stress</p>
                <p className="text-red-800 text-lg font-bold">{calculateAverage('stress')}</p>
              </div>
              <span className="text-lg">{getTrendIcon(getTrend('stress') === 'improving' ? 'declining' : getTrend('stress') === 'declining' ? 'improving' : 'stable')}</span>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-xs font-medium">Activities</p>
                <p className="text-blue-800 text-lg font-bold">{calculateAverage('activities')}</p>
              </div>
              <span className="text-lg">{getTrendIcon(getTrend('activities'))}</span>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-xs font-medium">Journal Entries</p>
                <p className="text-purple-800 text-lg font-bold">{analyticsData.reduce((sum, item) => sum + item.journalEntries, 0)}</p>
              </div>
              <span className="text-lg">📝</span>
            </div>
          </div>
        </div>

        {/* Mood & Stress Trend Chart */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Mood & Stress Trends
          </h3>
          <div className="h-64">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis domain={[0, 10]} stroke="#6b7280" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="var(--color-mood)" 
                    strokeWidth={2}
                    dot={{ fill: "var(--color-mood)", strokeWidth: 2, r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="stress" 
                    stroke="var(--color-stress)" 
                    strokeWidth={2}
                    dot={{ fill: "var(--color-stress)", strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        {/* Activity Chart */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Daily Activities
          </h3>
          <div className="h-48">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="activities" 
                    fill="var(--color-activities)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressAnalytics;
