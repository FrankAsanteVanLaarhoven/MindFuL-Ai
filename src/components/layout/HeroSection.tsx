
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const HeroSection = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate header
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
      );
    }

    // Animate hero image
    if (heroImageRef.current) {
      gsap.fromTo(heroImageRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.3 }
      );
    }
  }, []);

  return (
    <div className="mb-8 sm:mb-12 lg:mb-16 p-6">
      <div ref={headerRef} className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
          Welcome to Mindful AI
        </h1>
        <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto mb-6 sm:mb-8 px-4 leading-relaxed">
          Your personal companion for understanding and improving your mental well-being.
          Join a diverse community focused on mental health and personal growth.
        </p>
      </div>

      {/* Hero Image Gallery with enhanced glass effect */}
      <div ref={heroImageRef} className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8 px-4">
        <div className="overflow-hidden rounded-lg shadow-lg bg-white/10 backdrop-blur-sm border border-white/20">
          <img 
            src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=200&fit=crop&crop=face"
            alt="Diverse young woman smiling"
            className="w-full h-24 sm:h-32 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="overflow-hidden rounded-lg shadow-lg bg-white/10 backdrop-blur-sm border border-white/20">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=200&fit=crop&crop=face"
            alt="Man from diverse background"
            className="w-full h-24 sm:h-32 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="overflow-hidden rounded-lg shadow-lg bg-white/10 backdrop-blur-sm border border-white/20">
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=200&fit=crop&crop=face"
            alt="Young woman with natural hair"
            className="w-full h-24 sm:h-32 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="overflow-hidden rounded-lg shadow-lg bg-white/10 backdrop-blur-sm border border-white/20">
          <img 
            src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=200&fit=crop&crop=face"
            alt="Elderly person smiling"
            className="w-full h-24 sm:h-32 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Community Stats with enhanced glass effect */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 px-4">
        <div className="text-center bg-white/15 backdrop-blur-md border border-white/30 rounded-lg p-4 sm:p-6 shadow-md">
          <div className="text-2xl sm:text-3xl font-bold text-white mb-2">10K+</div>
          <div className="text-sm sm:text-base text-white/80">Active Users</div>
        </div>
        <div className="text-center bg-white/15 backdrop-blur-md border border-white/30 rounded-lg p-4 sm:p-6 shadow-md">
          <div className="text-2xl sm:text-3xl font-bold text-white mb-2">50+</div>
          <div className="text-sm sm:text-base text-white/80">Countries Represented</div>
        </div>
        <div className="text-center bg-white/15 backdrop-blur-md border border-white/30 rounded-lg p-4 sm:p-6 shadow-md">
          <div className="text-2xl sm:text-3xl font-bold text-white mb-2">95%</div>
          <div className="text-sm sm:text-base text-white/80">Satisfaction Rate</div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
