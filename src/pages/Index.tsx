
"use client";

import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, Lightbulb } from 'lucide-react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '@/components/layout/NavigationBar';
import HeroSection from '@/components/layout/HeroSection';
import ModernFeaturesGrid from '@/components/layout/ModernFeaturesGrid';
import TestimonialsSection from '@/components/layout/TestimonialsSection';

const Index = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <NavigationBar />
      
      {/* Hero Section with Community Images */}
      <HeroSection />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div ref={cardRef} className="relative z-10">
        {/* Modern Features Grid */}
        <ModernFeaturesGrid />

        {/* Call to Action */}
        <div className="text-center py-12 px-6">
          <p className="text-lg text-white/80 mb-6">
            Ready to embark on a journey of self-discovery and personal growth?
          </p>
          <Button
            onClick={() => navigate('/wellness-dashboard')}
            size="lg"
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold rounded-full px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Explore Your Dashboard →
          </Button>
        </div>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Footer */}
        <div className="text-center py-12 text-white/60">
          <p className="text-sm">
            © 2024 AI Wellness Platform. All rights reserved.
          </p>
          <p className="text-xs mt-2">
            Empowering Minds, Transforming Lives.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
