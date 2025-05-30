
import React from 'react';

const NavigationBrand = () => {
  return (
    <div className="flex-shrink-0 flex items-center">
      <img 
        src="/lovable-uploads/8d8a81a5-f7e1-4efd-8dd0-ef4b8afa70af.png" 
        alt="Mindful AI Brain Logo" 
        className="w-8 h-8 mr-2" 
        style={{ 
          filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))',
          background: 'transparent'
        }}
      />
      <h1 className="text-xl font-bold text-white">Mindful AI</h1>
    </div>
  );
};

export default NavigationBrand;
