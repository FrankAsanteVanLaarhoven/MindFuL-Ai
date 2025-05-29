
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getMoodHistory, type MoodEntry } from '@/lib/mood-storage';
import { gsap } from 'gsap';

const getMoodIcon = (category: string) => {
  const icons: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    anxious: '😰',
    calm: '😌',
    excited: '🤩',
    tired: '😴',
    confused: '😕',
    content: '😊',
    frustrated: '😤',
    overwhelmed: '😵‍💫',
    peaceful: '😇'
  };
  return icons[category.toLowerCase()] || '😐';
};

const CurrentMoodSummary = () => {
  const [latestMood, setLatestMood] = useState<MoodEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const iconContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const loadLatestMood = () => {
    try {
      const history = getMoodHistory();
      const latest = history.length > 0 ? history[history.length - 1] : null;
      setLatestMood(latest);
    } catch (error) {
      console.error('Error loading mood data:', error);
      setLatestMood(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLatestMood();

    // Listen for mood updates
    const handleMoodUpdate = () => {
      loadLatestMood();
    };

    window.addEventListener('moodUpdated', handleMoodUpdate);
    return () => window.removeEventListener('moodUpdated', handleMoodUpdate);
  }, []);

  // Animate mood icon when it changes
  useEffect(() => {
    if (!isLoading && latestMood && iconContainerRef.current) {
      // Pop-in animation for the icon
      gsap.fromTo(iconContainerRef.current, 
        { scale: 0, rotation: -180, opacity: 0 },
        { 
          scale: 1, 
          rotation: 0, 
          opacity: 1, 
          duration: 0.6, 
          ease: "back.out(1.7)",
          delay: 0.2
        }
      );

      // Set up hover interactions
      const element = iconContainerRef.current;
      
      const handleMouseEnter = () => {
        gsap.to(element, { 
          scale: 1.2, 
          rotation: 10,
          duration: 0.3, 
          ease: "power2.out" 
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(element, { 
          scale: 1, 
          rotation: 0,
          duration: 0.3, 
          ease: "power2.out" 
        });
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
        gsap.killTweensOf(element);
      };
    }
  }, [latestMood, isLoading]);

  // Animate card entrance
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  if (isLoading) {
    return (
      <Card ref={cardRef} className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-800">
            <span className="text-2xl">😐</span>
            Current Mood
          </CardTitle>
          <CardDescription>Your most recently logged emotional state.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={cardRef} className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-teal-800">
          <span className="text-2xl">🎭</span>
          Current Mood
        </CardTitle>
        <CardDescription>Your most recently logged emotional state.</CardDescription>
      </CardHeader>
      <CardContent>
        {latestMood ? (
          <div className="text-center space-y-4">
            <div 
              ref={iconContainerRef}
              className="inline-block transform-gpu cursor-pointer"
            >
              <div className="text-6xl mb-2">
                {getMoodIcon(latestMood.moodCategory)}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 capitalize mb-1">
                {latestMood.moodCategory}
              </h3>
              <p className="text-gray-600 mb-2">
                ({latestMood.description})
              </p>
              <p className="text-sm text-gray-500">
                Logged {new Date(latestMood.timestamp).toLocaleDateString()} at{' '}
                {new Date(latestMood.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">🤔</div>
            <p>No mood entries yet.</p>
            <p className="text-sm mt-2">
              Head to Mood Analysis to log your first mood!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentMoodSummary;
