
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ForecastData {
  time: string;
  temperature: number;
  displayTime: string;
}

interface TemperatureForecastChartProps {
  forecastData: ForecastData[];
  selectedCity: string;
}

const TemperatureForecastChart: React.FC<TemperatureForecastChartProps> = ({ forecastData, selectedCity }) => {
  return (
    <Card className="bg-gradient-to-br from-orange-600 to-red-600 border-orange-500 text-white h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">
          Temperature forecast for {selectedCity}
        </CardTitle>
        <div className="text-sm opacity-90">
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
              <XAxis 
                dataKey="displayTime" 
                stroke="white"
                fontSize={12}
              />
              <YAxis 
                stroke="white"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureForecastChart;
