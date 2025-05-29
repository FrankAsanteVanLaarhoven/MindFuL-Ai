
"use client";

import React, { useRef, useEffect } from 'react';
import CurrentMoodSummary from '@/components/dashboard/current-mood-summary';
import RealTimeMoodChart from '@/components/dashboard/real-time-mood-chart';
import NavigationBar from '@/components/layout/NavigationBar';
import HeroSection from '@/components/layout/HeroSection';
import QuickActionsCard from '@/components/layout/QuickActionsCard';
import FeaturesGrid from '@/components/layout/FeaturesGrid';
import TestimonialsSection from '@/components/layout/TestimonialsSection';
import Footer from '@/components/layout/Footer';
import { gsap } from 'gsap';

const Index = () => {
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Stagger animate dashboard cards
    gsap.fromTo(cardsRef.current,
      { y: 50, opacity: 0, scale: 0.9 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 0.8, 
        ease: "back.out(1.7)",
        stagger: 0.2,
        delay: 0.5
      }
    );
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-teal-50 via-blue-50 to-mint-50 safe-area-top safe-area-bottom">
      <NavigationBar />

      <div className="responsive-container device-padding py-6 sm:py-8 lg:py-12">
        <HeroSection />

        {/* Dashboard Grid - Responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 tablet-grid desktop-grid">
          {/* Current Mood - Touch-friendly */}
          <div 
            ref={el => { if (el) cardsRef.current[0] = el; }}
            className="mobile-card touch-target gpu-accelerated"
          >
            <CurrentMoodSummary />
          </div>

          {/* Real-time Mood Chart - Responsive span */}
          <div 
            ref={el => { if (el) cardsRef.current[1] = el; }} 
            className="lg:col-span-2 mobile-card touch-target gpu-accelerated"
          >
            <RealTimeMoodChart />
          </div>
        </div>

        {/* Quick Actions - Enhanced touch targets */}
        <div 
          ref={el => { if (el) cardsRef.current[2] = el; }} 
          className="mb-8 sm:mb-12 mobile-card desktop-hover"
        >
          <QuickActionsCard />
        </div>

        {/* Features Grid - Adaptive layout */}
        <FeaturesGrid />

        {/* Testimonials Section - Device-optimized */}
        <TestimonialsSection />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
