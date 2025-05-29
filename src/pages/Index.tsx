
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-mint-50">
      <NavigationBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <HeroSection />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {/* Current Mood - Takes up 1 column */}
          <div ref={el => { if (el) cardsRef.current[0] = el; }}>
            <CurrentMoodSummary />
          </div>

          {/* Real-time Mood Chart - Takes up 2 columns */}
          <div ref={el => { if (el) cardsRef.current[1] = el; }} className="lg:col-span-2">
            <RealTimeMoodChart />
          </div>
        </div>

        {/* Quick Actions */}
        <div ref={el => { if (el) cardsRef.current[2] = el; }} className="mb-8 sm:mb-12">
          <QuickActionsCard />
        </div>

        {/* Features Grid */}
        <FeaturesGrid />

        {/* Testimonials Section */}
        <TestimonialsSection />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
