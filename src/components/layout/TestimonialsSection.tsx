
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialsSection = () => {
  return (
    <div className="mt-16 mb-12">
      <h2 className="text-3xl font-bold text-center text-teal-800 mb-8">
        What Our Community Says
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b194?w=60&h=60&fit=crop&crop=face"
                alt="Sarah from Canada"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-gray-800">Sarah M.</div>
                <div className="text-sm text-gray-600">Canada</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              "Mindful AI has been a game-changer for my mental health journey. The diverse community makes me feel understood and supported."
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                alt="Marcus from USA"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-gray-800">Marcus J.</div>
                <div className="text-sm text-gray-600">USA</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              "The therapy bot really understands my cultural background. It's amazing to have AI that's inclusive and respectful."
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&h=60&fit=crop&crop=face"
                alt="Aisha from UK"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-gray-800">Aisha K.</div>
                <div className="text-sm text-gray-600">UK</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              "Finally, a mental health platform that celebrates diversity. The breathing exercises help me stay centered every day."
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestimonialsSection;
