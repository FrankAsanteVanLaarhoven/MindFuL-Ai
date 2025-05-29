
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getMoodHistory, type MoodEntry } from '@/lib/mood-storage';
import { gsap } from 'gsap';
import TherapyAvatar3D from '../TherapyAvatar3D';

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

const getMoodEmotion = (category: string): 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' => {
  const emotions: Record<string, 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful'> = {
    happy: 'happy',
    excited: 'happy',
    content: 'encouraging',
    peaceful: 'encouraging',
    calm: 'encouraging',
    sad: 'concerned',
    angry: 'concerned',
    anxious: 'concerned',
    frustrated: 'concerned',
    overwhelmed: 'concerned',
    tired: 'thoughtful',
    confused: 'thoughtful'
  };
  return emotions[category.toLowerCase()] || 'neutral';
};

const CurrentMoodSummary = () => {
  const [latestMood, setLatestMood] = useState<MoodEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarEmotion, setAvatarEmotion] = useState<'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful'>('neutral');
  
  const cardRef = useRef<HTMLDivElement>(null);

  const mockAvatar = {
    id: 'mood-companion',
    type: 'therapist' as const,
    name: 'Mood Companion',
    personality: 'Understanding and empathetic',
    skinTone: '#F4A261'
  };

  const loadLatestMood = () => {
    try {
      const history = getMoodHistory();
      const latest = history.length > 0 ? history[history.length - 1] : null;
      setLatestMood(latest);
      
      if (latest) {
        setAvatarEmotion(getMoodEmotion(latest.moodCategory));
      }
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
            <span className="text-2xl">🎭</span>
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
        <CardDescription>Your most recently logged emotional state with AI companion.</CardDescription>
      </CardHeader>
      <CardContent>
        {latestMood ? (
          <div className="space-y-4">
            {/* 3D Avatar */}
            <div className="mb-4">
              <TherapyAvatar3D
                avatar={mockAvatar}
                isActive={true}
                isSpeaking={false}
                emotion={avatarEmotion}
              />
            </div>
            
            {/* Mood Details */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl">{getMoodIcon(latestMood.moodCategory)}</span>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 capitalize">
                    {latestMood.moodCategory}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {latestMood.description}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Logged {new Date(latestMood.timestamp).toLocaleDateString()} at{' '}
                {new Date(latestMood.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 3D Avatar for empty state */}
            <div className="mb-4">
              <TherapyAvatar3D
                avatar={mockAvatar}
                isActive={true}
                isSpeaking={false}
                emotion="thoughtful"
              />
            </div>
            
            <div className="text-center text-gray-500">
              <p>No mood entries yet.</p>
              <p className="text-sm mt-2">
                Head to Mood Analysis to log your first mood!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentMoodSummary;
