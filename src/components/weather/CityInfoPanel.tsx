
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CityInfoPanelProps {
  selectedCity: string;
  cityData: {
    longitude: number;
    latitude: number;
    elevation: number;
    condition: string;
  };
}

const CityInfoPanel: React.FC<CityInfoPanelProps> = ({ selectedCity, cityData }) => {
  return (
    <Card className="bg-slate-700 border-slate-600 text-white">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">Forecast for {selectedCity}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-300">Longitude:</div>
            <div className="font-mono">{cityData.longitude.toFixed(2)} degr.</div>
          </div>
          <div>
            <div className="text-gray-300">Latitude:</div>
            <div className="font-mono">{cityData.latitude.toFixed(2)} degr.</div>
          </div>
          <div>
            <div className="text-gray-300">Elevation:</div>
            <div className="font-mono">{cityData.elevation} m.</div>
          </div>
          <div>
            <div className="text-gray-300">Condition:</div>
            <div>{cityData.condition}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CityInfoPanel;
