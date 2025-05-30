
import React from 'react';
import { 
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import NavigationBrand from './navigation/NavigationBrand';
import TherapyMenu from './navigation/TherapyMenu';
import WellnessMenu from './navigation/WellnessMenu';
import CommunityMenu from './navigation/CommunityMenu';
import GlobalFeaturesMenu from './navigation/GlobalFeaturesMenu';

const NavigationBar = () => {
  return (
    <nav className="relative z-20 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <NavigationBrand />
          </div>
          
          <div className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-1">
                <TherapyMenu />
                <WellnessMenu />
                <CommunityMenu />
                <GlobalFeaturesMenu />
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
