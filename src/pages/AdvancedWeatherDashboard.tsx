
import React from 'react';
import NavigationBar from '@/components/layout/NavigationBar';

const AdvancedWeatherDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <NavigationBar />
      
      {/* Enhanced glassmorphism background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 backdrop-blur-[2px]"></div>
      
      {/* Hero Section */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl mx-4 mt-8 mb-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Advanced Weather Dashboard</h1>
          <p className="text-white/80 text-lg max-w-3xl mx-auto">
            A comprehensive weather visualization platform featuring real-time data, interactive maps, 
            forecasting capabilities, and global weather station monitoring.
          </p>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="relative z-10 bg-white/8 backdrop-blur-lg border border-white/20 rounded-3xl mx-4 mb-8 p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Live Weather Visualization</h2>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
            <img 
              src="/lovable-uploads/9010a424-1037-411e-a12e-ffaa08739052.png" 
              alt="Advanced Weather Dashboard Preview"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">📍 Interactive Maps</h3>
            <p className="text-white/80 text-sm">
              Click on weather stations across the globe to view real-time temperature, 
              precipitation, and wind data with color-coded markers.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">📊 Live Forecasting</h3>
            <p className="text-white/80 text-sm">
              Detailed hourly forecasts with comprehensive data tables showing 
              temperature trends, precipitation probability, and wind patterns.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">🌐 Global Coverage</h3>
            <p className="text-white/80 text-sm">
              Monitor weather conditions across multiple time zones with integrated 
              world clock functionality and location-specific data.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">📈 Data Visualization</h3>
            <p className="text-white/80 text-sm">
              Advanced charts and graphs showing temperature forecasts, precipitation 
              patterns, and weather trends over time.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibent text-white mb-3">🎯 KPI Monitoring</h3>
            <p className="text-white/80 text-sm">
              Real-time key performance indicators with circular gauges displaying 
              temperature, wind speed, and precipitation metrics.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">🕐 Time Management</h3>
            <p className="text-white/80 text-sm">
              Synchronized world clock showing local times across different weather 
              stations for global coordination and planning.
            </p>
          </div>
        </div>
      </div>
      
      {/* Technical Features */}
      <div className="relative z-10 bg-white/8 backdrop-blur-lg border border-white/20 rounded-3xl mx-4 mb-8 p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Technical Capabilities</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">🔥 Real-time Data Sources</h3>
            <ul className="text-white/80 text-sm space-y-2">
              <li>• Norwegian Meteorological Institute API</li>
              <li>• Live weather station feeds</li>
              <li>• Synchronized time zone data</li>
              <li>• Automatic data refresh every minute</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">⚡ Interactive Features</h3>
            <ul className="text-white/80 text-sm space-y-2">
              <li>• Click-to-select weather stations</li>
              <li>• Dynamic parameter switching</li>
              <li>• Responsive chart updates</li>
              <li>• Cross-component synchronization</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse backdrop-blur-sm"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000 backdrop-blur-sm"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-pulse delay-500 backdrop-blur-sm"></div>
      </div>
    </div>
  );
};

export default AdvancedWeatherDashboard;
