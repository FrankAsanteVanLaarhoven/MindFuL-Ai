
"use client";

import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CurrentMoodSummary from '@/components/dashboard/current-mood-summary';
import { gsap } from 'gsap';
import { useRouter } from 'next/router';

const Index = () => {
  const router = useRouter();
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Animate header
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
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
        delay: 0.3
      }
    );
  }, []);

  const features = [
    {
      icon: '🧠',
      title: 'Mood Analysis',
      description: 'Real-time mood analysis using voice, text, and facial recognition via smartphone to detect emotional states.',
      href: '/mood-analysis',
      color: 'from-blue-500 to-teal-500'
    },
    {
      icon: '🤖',
      title: 'Therapy Bot',
      description: 'Personalized Cognitive Behavioral Therapy (CBT) and Dialectical Behavior Therapy (DBT) driven therapy bots.',
      href: '/therapy-bot',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🫁',
      title: 'Breathing Exercises',
      description: 'Guided breathing exercises with interactive animations to promote calmness and reduce stress.',
      href: '/breathing',
      color: 'from-teal-500 to-green-500'
    },
    {
      icon: '📝',
      title: 'Journal',
      description: 'Write down your thoughts and feelings. Our AI can offer gentle reflections to help you gain insights.',
      href: '/journal',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const navigateToFeature = (href: string) => {
    // Since we're using a simple SPA structure, we'll update this later
    // For now, just show a toast or log
    console.log(`Navigate to: ${href}`);
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
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <h1 className="text-5xl font-bold text-teal-800 mb-6">
            Welcome to Mindful AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your personal companion for understanding and improving your mental well-being.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Current Mood - Takes up 1 column */}
          <div ref={el => cardsRef.current[0] = el!}>
            <CurrentMoodSummary />
          </div>

          {/* Mood Trends - Takes up 2 columns */}
          <div ref={el => cardsRef.current[1] = el!} className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-800">
                  <span className="text-2xl">📊</span>
                  Mood Trends
                </CardTitle>
                <CardDescription>Your mood fluctuations based on logged entries (last 7 distinct days with logs).</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-4">📈</div>
                  <p>Mood trends chart will appear here</p>
                  <p className="text-sm mt-2">Log more moods to see patterns!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div ref={el => cardsRef.current[2] = el!} className="mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-800">
                <span className="text-2xl">⚡</span>
                Quick Actions
              </CardTitle>
              <CardDescription>Engage with Mindful AI features.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Ready to explore? Navigate using the menu above to analyze your mood, reflect in your journal, try breathing exercises or chat with our therapy bot.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              ref={el => cardsRef.current[index + 3] = el!}
            >
              <Card 
                className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-full"
                onClick={() => navigateToFeature(feature.href)}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">
                    {feature.icon}
                  </div>
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
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 bg-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Mindful AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
