
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NavigationBrand } from './navigation/NavigationBrand';
import { TherapyMenu } from './navigation/TherapyMenu';
import { WellnessMenu } from './navigation/WellnessMenu';
import { CommunityMenu } from './navigation/CommunityMenu';
import { GlobalFeaturesMenu } from './navigation/GlobalFeaturesMenu';

const NavigationBar = () => {
  const { t } = useTranslation();

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavigationBrand />
          
          <div className="hidden md:flex space-x-8">
            <TherapyMenu />
            <WellnessMenu />
            <CommunityMenu />
            <GlobalFeaturesMenu />
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/personalized-dashboard"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {t('navigation.dashboard', 'Dashboard')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
