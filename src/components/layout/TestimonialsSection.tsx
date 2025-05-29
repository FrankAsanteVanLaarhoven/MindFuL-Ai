
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialsSection = () => {
  return (
    <div className="mt-12 sm:mt-16 mb-8 sm:mb-12 px-4 sm:px-0">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-teal-800 mb-6 sm:mb-8">
        What Our Community Says
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b194?w=60&h=60&fit=crop&crop=face"
                alt="Sarah from Canada"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-gray-800 text-sm sm:text-base">Sarah M.</div>
                <div className="text-xs sm:text-sm text-gray-600">Canada</div>
              </div>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              "Mindful AI has been a game-changer for my mental health journey. The diverse community makes me feel understood and supported."
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                alt="Marcus from USA"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-gray-800 text-sm sm:text-base">Marcus J.</div>
                <div className="text-xs sm:text-sm text-gray-600">USA</div>
              </div>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              "The therapy bot really understands my cultural background. It's amazing to have AI that's inclusive and respectful."
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg md:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <img 
                src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&h=60&fit=crop&crop=face"
                alt="Aisha from UK"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-gray-800 text-sm sm:text-base">Aisha K.</div>
                <div className="text-xs sm:text-sm text-gray-600">UK</div>
              </div>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              "Finally, a mental health platform that celebrates diversity. The breathing exercises help me stay centered every day."
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestimonialsSection;
