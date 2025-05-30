
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Heart, Users, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PersonalizationDropdown from '../personalization/PersonalizationDropdown';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/20" />
        {/* Animated floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Brain className="w-20 h-20 text-purple-300 animate-pulse" />
            <Heart className="w-8 h-8 text-pink-300 absolute -top-2 -right-2 animate-bounce" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-blue-200">
          {t('app.title', 'Mindful AI')}
        </h1>
        
        <p className="text-xl md:text-2xl text-purple-200 mb-12 leading-relaxed">
          {t('app.subtitle', 'Global wellness app with AI-powered features')}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Link to="/breathing">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
              {t('navigation.startSession', 'Start Breathing Session')}
            </Button>
          </Link>
          
          <Link to="/mood-analysis">
            <Button variant="outline" size="lg" className="border-2 border-purple-300 text-purple-100 px-8 py-4 text-lg font-semibold rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              {t('navigation.analyzeMood', 'Analyze Your Mood')}
            </Button>
          </Link>
        </div>

        <PersonalizationDropdown />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Brain className="w-12 h-12 text-purple-300 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-white mb-2">{t('features.aiPowered', 'AI-Powered')}</h3>
            <p className="text-purple-200">{t('features.aiDescription', 'Advanced AI for personalized wellness guidance')}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Users className="w-12 h-12 text-blue-300 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-white mb-2">{t('features.community', 'Community')}</h3>
            <p className="text-purple-200">{t('features.communityDescription', 'Connect with others on your wellness journey')}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Globe className="w-12 h-12 text-green-300 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-white mb-2">{t('features.global', 'Global')}</h3>
            <p className="text-purple-200">{t('features.globalDescription', 'Wellness tools for users worldwide')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
