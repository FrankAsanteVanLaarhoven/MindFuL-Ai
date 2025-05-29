
"use client";

import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CurrentMoodSummary from '@/components/dashboard/current-mood-summary';
import RealTimeMoodChart from '@/components/dashboard/real-time-mood-chart';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
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

    // Stagger animate cards
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

  const features = [
    {
      icon: '🧠',
      title: 'Mood Analysis',
      description: 'Real-time mood analysis using voice, text, and facial recognition via smartphone to detect emotional states.',
      href: '/mood-analysis',
      color: 'from-blue-500 to-teal-500',
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop&crop=face'
    },
    {
      icon: '🤖',
      title: 'Therapy Bot',
      description: 'Personalized Cognitive Behavioral Therapy (CBT) and Dialectical Behavior Therapy (DBT) driven therapy bots.',
      href: '/therapy-bot',
      color: 'from-purple-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face'
    },
    {
      icon: '🫁',
      title: 'Breathing Exercises',
      description: 'Guided breathing exercises with interactive animations to promote calmness and reduce stress.',
      href: '/breathing',
      color: 'from-teal-500 to-green-500',
      image: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=400&h=300&fit=crop&crop=face'
    },
    {
      icon: '📝',
      title: 'Journal',
      description: 'Write down your thoughts and feelings. Our AI can offer gentle reflections to help you gain insights.',
      href: '/journal',
      color: 'from-orange-500 to-red-500',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=300&fit=crop&crop=face'
    }
  ];

  const navigateToFeature = (href: string) => {
    navigate(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-mint-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-teal-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧠</span>
              <span className="text-xl font-bold text-teal-800">Mindful AI</span>
            </div>
            <div className="flex items-center space-x-8">
              {features.map((feature) => (
                <button
                  key={feature.title}
                  onClick={() => navigateToFeature(feature.href)}
                  className="text-gray-600 hover:text-teal-600 transition-colors duration-200 text-sm font-medium"
                >
                  {feature.icon} {feature.title}
                </button>
              ))}
              <button
                onClick={() => navigate('/wellness-dashboard')}
                className="text-gray-600 hover:text-teal-600 transition-colors duration-200 text-sm font-medium"
              >
                📊 Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16">
          <div ref={headerRef} className="text-center mb-8">
            <h1 className="text-5xl font-bold text-teal-800 mb-6">
              Welcome to Mindful AI
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Your personal companion for understanding and improving your mental well-being.
              Join a diverse community focused on mental health and personal growth.
            </p>
          </div>

          {/* Hero Image Gallery */}
          <div ref={heroImageRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=200&fit=crop&crop=face"
                alt="Diverse young woman smiling"
                className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=200&fit=crop&crop=face"
                alt="Man from diverse background"
                className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=200&fit=crop&crop=face"
                alt="Young woman with natural hair"
                className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=200&fit=crop&crop=face"
                alt="Elderly person smiling"
                className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-md">
              <div className="text-3xl font-bold text-teal-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-md">
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Countries Represented</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
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
        <div ref={el => { if (el) cardsRef.current[2] = el; }} className="mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-800">
                <span className="text-2xl">⚡</span>
                Quick Actions
              </CardTitle>
              <CardDescription>Engage with Mindful AI features designed for everyone.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <p className="text-gray-600 mb-6">
                    Ready to explore? Navigate using the menu above to analyze your mood, reflect in your journal, 
                    try breathing exercises or chat with our therapy bot. Our platform welcomes people from all 
                    backgrounds, cultures, and walks of life.
                  </p>
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => navigate('/mood-analysis')}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      Start Mood Check
                    </Button>
                    <Button 
                      onClick={() => navigate('/therapy-bot')}
                      variant="outline"
                      className="border-teal-600 text-teal-600 hover:bg-teal-50"
                    >
                      Talk to Therapist
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img 
                    src="https://images.unsplash.com/photo-1516302593371-8d5c01d69e1a?w=200&h=150&fit=crop"
                    alt="Diverse group meditation"
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              ref={el => { if (el) cardsRef.current[index + 3] = el; }}
            >
              <Card 
                className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-full overflow-hidden"
                onClick={() => navigateToFeature(feature.href)}
              >
                <div className="relative">
                  <img 
                    src={feature.image}
                    alt={`${feature.title} feature`}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-2 right-2 bg-white/90 rounded-full p-2">
                    <span className="text-xl">{feature.icon}</span>
                  </div>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-teal-800">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 text-center">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="mt-16 mb-12">
          <h2 className="text-3xl font-bold text-center text-teal-800 mb-8">
            What Our Community Says
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b194?w=60&h=60&fit=crop&crop=face"
                    alt="Sarah from Canada"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">Sarah M.</div>
                    <div className="text-sm text-gray-600">Canada</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  "Mindful AI has been a game-changer for my mental health journey. The diverse community makes me feel understood and supported."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                    alt="Marcus from USA"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">Marcus J.</div>
                    <div className="text-sm text-gray-600">USA</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  "The therapy bot really understands my cultural background. It's amazing to have AI that's inclusive and respectful."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&h=60&fit=crop&crop=face"
                    alt="Aisha from UK"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">Aisha K.</div>
                    <div className="text-sm text-gray-600">UK</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  "Finally, a mental health platform that celebrates diversity. The breathing exercises help me stay centered every day."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 bg-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Mindful AI. All rights reserved. Built for everyone, everywhere.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
