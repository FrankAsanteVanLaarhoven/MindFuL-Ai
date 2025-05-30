"use client";

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BrainCircuit, HeartPulse, BookOpenCheck, Lightbulb, GraduationCap } from 'lucide-react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div ref={cardRef} className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <span className="text-6xl">✨</span>
            Unlock Your Inner Genius
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Explore cutting-edge AI tools and personalized wellness programs designed to elevate your mind, body, and spirit.
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* AI-Powered Brain Training */}
          <Card
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200 hover:border-blue-300"
            onClick={() => navigate('/therapy-bot')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <span className="text-2xl">🧠</span>
                AI Brain Trainer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                Personalized cognitive exercises and AI-driven insights to sharpen your mind and boost productivity.
              </p>
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">⚡ Cognitive Workouts</Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">📊 Performance Tracking</Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">🤖 AI Recommendations</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Personalized Breathing Exercises */}
          <Card
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-green-50 to-teal-100 border-green-200 hover:border-green-300"
            onClick={() => navigate('/breathing')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <span className="text-2xl">🫁</span>
                Breathing Mastery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                Advanced breathing techniques with real-time biofeedback and AI guidance to reduce stress and enhance focus.
              </p>
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">🧘 Guided Exercises</Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">📈 Progress Tracking</Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">📹 Biofeedback Analysis</Badge>
              </div>
            </CardContent>
          </Card>

          {/* AI-Powered Mood Journal */}
          <Card
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-pink-50 to-rose-100 border-pink-200 hover:border-pink-300"
            onClick={() => navigate('/journal')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-800">
                <span className="text-2xl">✍️</span>
                Mood Journal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-pink-700 mb-4">
                Reflect on your day and gain deeper insights into your emotional patterns with AI-powered sentiment analysis.
              </p>
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-pink-100 text-pink-800">📝 Daily Reflections</Badge>
                <Badge variant="secondary" className="bg-pink-100 text-pink-800">🎭 Sentiment Analysis</Badge>
                <Badge variant="secondary" className="bg-pink-100 text-pink-800">📊 Mood Tracking</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Virtual Community */}
          <Card
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200 hover:border-orange-300"
            onClick={() => navigate('/community')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <span className="text-2xl">🤝</span>
                Virtual Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 mb-4">
                Connect with like-minded individuals, share your journey, and find support in a safe and inclusive virtual space.
              </p>
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">💬 Group Discussions</Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">🫂 Peer Support</Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">🌟 Shared Experiences</Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* New Enhanced Mood Analysis Card */}
          <Card 
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-purple-50 to-indigo-100 border-purple-200 hover:border-purple-300"
            onClick={() => navigate('/mood-analysis-enhanced')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <span className="text-2xl">🧠</span>
                AI Wellness Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 mb-4">
                Advanced mood mapping, open data science, public API, and world-class accessibility features.
              </p>
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">🗺️ Mood Journey Maps</Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">🔬 Open Science Mode</Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">🔧 Public API</Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">♿ Full Accessibility</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg text-gray-300 mb-6">
            Ready to embark on a journey of self-discovery and personal growth?
          </p>
          <Button
            onClick={() => navigate('/wellness-dashboard')}
            size="lg"
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold rounded-full px-8 py-3 transition-all duration-300"
          >
            Explore Your Dashboard →
          </Button>
        </div>

        {/* Testimonials */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white text-center">
            What Our Users Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="text-gray-300">
                <p className="mb-4">"This platform has completely transformed my approach to mental wellness. The AI insights are incredibly helpful, and the community support is invaluable."</p>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-teal-400" />
                  <span className="font-semibold">Dr. Emily Carter</span>, Clinical Psychologist
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="text-gray-300">
                <p className="mb-4">"I've struggled with anxiety for years, but the personalized breathing exercises and mood tracking tools have made a significant difference in my daily life."</p>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold">David Chen</span>, Software Engineer
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-12 text-gray-400">
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
