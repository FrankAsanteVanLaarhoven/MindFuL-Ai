
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ForecastData {
  time: string;
  temperature: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
}

interface ForecastGridProps {
  forecastData: ForecastData[];
  selectedCity: string;
}

const ForecastGrid: React.FC<ForecastGridProps> = ({ forecastData, selectedCity }) => {
  return (
    <Card className="bg-slate-800 border-slate-700 text-white h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">
          Forecast for {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-2">Local Time</th>
                <th className="text-center py-2 px-2">Temp. °C</th>
                <th className="text-center py-2 px-2">Precip. mm</th>
                <th className="text-center py-2 px-2">Wind m/s</th>
                <th className="text-center py-2 px-2">Wind dir. degr.</th>
              </tr>
            </thead>
            <tbody>
              {forecastData.map((data, index) => (
                <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-2 px-2 font-mono">{data.time}</td>
                  <td className="py-2 px-2 text-center">{data.temperature.toFixed(1)}</td>
                  <td className="py-2 px-2 text-center">{data.precipitation.toFixed(1)}</td>
                  <td className="py-2 px-2 text-center">{data.windSpeed.toFixed(1)}</td>
                  <td className="py-2 px-2 text-center">{data.windDirection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastGrid;
