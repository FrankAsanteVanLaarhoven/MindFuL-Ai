
import React from 'react';
import Weather from '@/components/Weather';
import WorldClock from '@/components/WorldClock';
import Localization from '@/components/Localization';

const GlobalWidgets = () => {
  return (
    <div className="relative z-10 bg-white/8 backdrop-blur-lg border border-white/20 rounded-3xl mx-4 mb-8 p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Global Wellness Features</h2>
        <p className="text-white/80 text-lg">Connect with the world while maintaining your wellbeing</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div id="weather-widget">
          <Weather />
        </div>
        <div id="world-clock-widget">
          <WorldClock />
        </div>
        <div id="localization-widget">
          <Localization />
        </div>
      </div>
    </div>
  );
};

export default GlobalWidgets;
