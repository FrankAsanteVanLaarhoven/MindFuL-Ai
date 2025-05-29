
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle } from 'lucide-react';
import { SymptomPrediction } from './types';
import { getSeverityColor } from './utils';

interface AIPredictionsProps {
  predictions: SymptomPrediction[];
  onAnalyze: () => void;
}

const AIPredictions: React.FC<AIPredictionsProps> = ({ predictions, onAnalyze }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI Symptom Predictions</h3>
        <Button onClick={onAnalyze} size="sm" className="bg-purple-500 hover:bg-purple-600">
          <Brain className="w-4 h-4 mr-2" />
          Analyze Now
        </Button>
      </div>

      <div className="grid gap-4">
        {predictions.map((prediction) => (
          <Card key={prediction.id} className="border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-purple-800">{prediction.condition}</h4>
                  <p className="text-sm text-gray-500">{prediction.timestamp}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(prediction.severity)}>
                    {prediction.severity}
                  </Badge>
                  <span className="text-lg font-bold text-purple-600">
                    {prediction.probability}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Triggers:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {prediction.triggers.map((trigger, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    {prediction.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIPredictions;
