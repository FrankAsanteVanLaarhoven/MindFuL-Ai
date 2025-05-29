
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HealthMetric } from './types';
import { getMetricIcon, getStatusColor } from './utils';

interface HealthMetricsProps {
  metrics: HealthMetric[];
}

const HealthMetrics: React.FC<HealthMetricsProps> = ({ metrics }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Real-time Health Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const { icon: Icon, color } = getMetricIcon(metric.type);
          
          return (
            <Card key={index} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="font-medium capitalize">
                      {metric.type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{metric.timestamp}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
                  </div>
                  {metric.status && (
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  )}
                </div>
                {metric.normalRange && (
                  <p className="text-xs text-gray-500 mt-1">
                    Normal: {metric.normalRange}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HealthMetrics;
