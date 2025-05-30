
"use client";

import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, Lightbulb, Users, Settings } from 'lucide-react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/layout/NavigationBar';
import HeroSection from '@/components/layout/HeroSection';
import ModernFeaturesGrid from '@/components/layout/ModernFeaturesGrid';
import TestimonialsSection from '@/components/layout/TestimonialsSection';
import TherapyAvatar3D from '@/components/TherapyAvatar3D';
import { avatarCharacters } from '@/components/AvatarSelector';
import PersonalizationDropdown from '@/components/personalization/PersonalizationDropdown';
import { useUserProfile } from '@/hooks/useUserProfile';

const Index = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { userProfile, loading, updateUserGroups, saveUserProfile } = useUserProfile();

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
      );
    }
  }, []);

  const handleGroupSelectionComplete = (selectedGroups: string[], primaryGroup: string) => {
    const newProfile = {
      id: 'user-1',
      email: 'user@example.com',
      name: 'Wellness User',
      selectedGroups,
      primaryGroup,
      preferences: {
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        privacyMode: 'public' as const,
        notifications: {
          reminders: true,
          community: true,
          challenges: true,
          mentorship: true
        },
        accessibility: {
          highContrast: false,
          largeText: false,
          reduceMotion: false
        }
      },
      onboardingCompleted: true,
      joinedDate: new Date()
    };
    
    saveUserProfile(newProfile);
  };

  // Sample avatars to display
  const displayAvatars = [
    avatarCharacters.find(a => a.id === 'therapist-african-female'),
    avatarCharacters.find(a => a.id === 'therapist-asian-male'),
    avatarCharacters.find(a => a.id === 'grandma-jamaican'),
    avatarCharacters.find(a => a.id === 'uncle-mixed')
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your wellness journey...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <NavigationBar />
      
      {/* Enhanced glassmorphism background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 backdrop-blur-[2px]"></div>
      
      {/* Hero Section with enhanced glass effect */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl mx-4 mt-8 mb-8">
        <HeroSection />
        
        {/* Personalization Dropdown */}
        <div className="flex justify-center pb-8">
          <PersonalizationDropdown 
            userProfile={userProfile}
            onGroupSelectionComplete={handleGroupSelectionComplete}
          />
        </div>
      </div>

      {/* Compact Global Stats Section */}
      <div className="relative z-10 bg-white/8 backdrop-blur-lg border border-white/20 rounded-3xl mx-4 mb-8 p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Global Wellness Impact</h2>
          <p className="text-white/70 text-sm">Our worldwide community making a difference</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">10K+</div>
            <div className="text-white/80 text-sm">Active Users</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">50+</div>
            <div className="text-white/80 text-sm">Countries Represented</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">95%</div>
            <div className="text-white/80 text-sm">Satisfaction Rate</div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <Button
            onClick={() => {
              document.getElementById('weather-widget')?.scrollIntoView({ behavior: 'smooth' });
            }}
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10 text-sm"
          >
            View Global Features →
          </Button>
        </div>
      </div>

      {/* Animated 3D Avatars Section */}
      <div className="relative z-10 bg-white/8 backdrop-blur-lg border border-white/20 rounded-3xl mx-4 mb-8 p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Meet Your AI Companions</h2>
          <p className="text-white/80 text-lg">Choose from our diverse range of culturally-aware AI therapy companions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayAvatars.map((avatar, index) => (
            <div key={avatar?.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
              <TherapyAvatar3D
                avatar={avatar!}
                isActive={true}
                isSpeaking={index % 2 === 0}
                emotion={index === 0 ? 'happy' : index === 1 ? 'encouraging' : index === 2 ? 'thoughtful' : 'neutral'}
              />
              <div className="text-center mt-4">
                <h3 className="text-white font-semibold text-lg">{avatar?.name}</h3>
                <p className="text-white/70 text-sm">{avatar?.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button
            onClick={() => navigate('/therapy-bot')}
            className="bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-600/90 hover:to-blue-600/90 text-white font-semibold rounded-full px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20"
          >
            Start Therapy Session →
          </Button>
        </div>
      </div>
      
      {/* Animated background elements with glass effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse backdrop-blur-sm"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000 backdrop-blur-sm"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-pulse delay-500 backdrop-blur-sm"></div>
      </div>

      <div ref={cardRef} className="relative z-10">
        {/* Modern Features Grid with enhanced glass container */}
        <div className="bg-white/8 backdrop-blur-lg border border-white/20 rounded-3xl mx-4 mb-8 p-6">
          <ModernFeaturesGrid />
        </div>

        {/* Call to Action with glass effect */}
        <div className="text-center py-12 px-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mx-auto max-w-2xl">
            <p className="text-lg text-white/90 mb-6">
              Ready to embark on a journey of self-discovery and personal growth?
            </p>
            <Button
              onClick={() => navigate('/wellness-dashboard')}
              size="lg"
              className="bg-gradient-to-r from-teal-500/80 to-blue-500/80 hover:from-teal-600/90 hover:to-blue-600/90 text-white font-semibold rounded-full px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20"
            >
              Explore Your Dashboard →
            </Button>
          </div>
        </div>

        {/* Testimonials with glass container */}
        <div className="bg-white/8 backdrop-blur-lg border border-white/20 rounded-3xl mx-4 mb-8 p-6">
          <TestimonialsSection />
        </div>

        {/* Footer with glass effect */}
        <div className="text-center py-12 text-white/80">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mx-auto max-w-md">
            <p className="text-sm">
              © 2025 Mindful AI Wellness Platform. All rights reserved.
            </p>
            <p className="text-xs mt-2 text-white/60">
              Empowering Minds, Transforming Lives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
