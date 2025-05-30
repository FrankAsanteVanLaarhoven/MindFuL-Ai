
import React from 'react';
import { Brain } from 'lucide-react';

const NavigationBrand = () => {
  return (
    <div className="flex-shrink-0 flex items-center">
      <Brain className="w-8 h-8 text-white mr-2" />
      <h1 className="text-xl font-bold text-white">Mindful AI</h1>
    </div>
  );
};

export default NavigationBrand;
