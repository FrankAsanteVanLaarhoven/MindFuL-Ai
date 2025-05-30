
import React from 'react';
import NavigationBar from '@/components/layout/NavigationBar';
import GlobalWidgets from '@/components/layout/GlobalWidgets';

const GlobalFeatures = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <NavigationBar />
      
      {/* Enhanced glassmorphism background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 backdrop-blur-[2px]"></div>
      
      {/* Hero Section */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl mx-4 mt-8 mb-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Global Wellness Features</h1>
          <p className="text-white/80 text-lg max-w-3xl mx-auto">
            Stay connected with the world while maintaining your wellbeing. Access real-time weather information, 
            world clock, and localization features to enhance your global wellness experience.
          </p>
        </div>
      </div>

      {/* Full Global Widgets */}
      <GlobalWidgets />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse backdrop-blur-sm"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000 backdrop-blur-sm"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-pulse delay-500 backdrop-blur-sm"></div>
      </div>
    </div>
  );
};

export default GlobalFeatures;
