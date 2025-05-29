
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BreathingSphere3D from '@/components/breathing-exercises/breathing-sphere-3d';
import RealTimeBreathingSphere from '@/components/breathing-exercises/real-time-breathing-sphere';
import EnhancedRealTimeBreathingSphere from '@/components/breathing-exercises/enhanced-breathing-sphere';
import BreathingCircle2D from '@/components/breathing-exercises/breathing-circle-2d';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

type BreathingTechnique = 'box' | '4-7-8' | 'triangle';
type ExerciseMode = 'guided' | 'guided-2d' | 'realtime' | 'enhanced';

const Breathing = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>('box');
  const [selectedMode, setSelectedMode] = useState<ExerciseMode>('enhanced');
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  
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

  const techniques = {
    box: {
      name: 'Box Breathing',
      description: 'Equal counts for inhale, hold, exhale, hold (4-4-4-4)',
      icon: '📦',
      color: 'from-blue-500 to-teal-500',
      benefits: ['Reduces stress', 'Improves focus', 'Calms nervous system']
    },
    '4-7-8': {
      name: '4-7-8 Technique',
      description: 'Inhale 4, hold 7, exhale 8 counts',
      icon: '😴',
      color: 'from-purple-500 to-pink-500',
      benefits: ['Promotes sleep', 'Reduces anxiety', 'Lowers heart rate']
    },
    triangle: {
      name: 'Triangle Breathing',
      description: 'Three equal phases: inhale, hold, exhale (4-4-4)',
      icon: '🔺',
      color: 'from-green-500 to-emerald-500',
      benefits: ['Balances energy', 'Improves concentration', 'Builds endurance']
    }
  };

  const modes = {
    'guided-2d': {
      name: 'Simple 2D Guide',
      description: 'Clean, simple breathing circle - perfect for focus',
      icon: '⭕',
      component: BreathingCircle2D
    },
    guided: {
      name: 'Guided 3D Practice',
      description: 'Follow the animated sphere with breathing prompts',
      icon: '🧘‍♀️',
      component: BreathingSphere3D
    },
    realtime: {
      name: 'Real-Time Detection',
      description: 'AI analyzes your actual breathing patterns',
      icon: '🎤',
      component: RealTimeBreathingSphere
    },
    enhanced: {
      name: 'Enhanced Experience',
      description: 'Immersive visuals with trails, rings, and dynamic colors',
      icon: '✨',
      component: EnhancedRealTimeBreathingSphere
    }
  };

  const cycles = {
    box: { inhale: 4000, hold1: 4000, exhale: 4000, hold2: 4000 },
    '4-7-8': { inhale: 4000, hold1: 7000, exhale: 8000, hold2: 0 },
    triangle: { inhale: 4000, hold1: 4000, exhale: 4000, hold2: 0 }
  };

  const SelectedComponent = modes[selectedMode].component;

  const startExercise = () => {
    setIsActive(true);
    runCycle();
  };

  const stopExercise = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
  };

  const runCycle = () => {
    if (!isActive) return;

    const cycle = cycles[selectedTechnique];
    
    setCurrentPhase('inhale');
    setTimeout(() => {
      if (!isActive) return;
      setCurrentPhase('hold1');
      
      setTimeout(() => {
        if (!isActive) return;
        setCurrentPhase('exhale');
        
        setTimeout(() => {
          if (!isActive) return;
          if (cycle.hold2 > 0) {
            setCurrentPhase('hold2');
            setTimeout(() => {
              if (isActive) runCycle();
            }, cycle.hold2);
          } else {
            runCycle();
          }
        }, cycle.exhale);
      }, cycle.hold1);
    }, cycle.inhale);
  };

  const onSessionComplete = () => {
    setIsActive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 p-4">
      <div ref={cardRef} className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-teal-800 mb-4 flex items-center justify-center gap-3">
            <span className="text-5xl">🫁</span>
            Breathing Exercises
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Practice guided breathing exercises with interactive visualizations and real-time feedback.
          </p>
        </div>

        {/* Mode Selection */}
        <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-teal-800">Choose Your Experience</CardTitle>
            <CardDescription>Select how you'd like to practice breathing</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedMode} onValueChange={(value) => setSelectedMode(value as ExerciseMode)}>
              <TabsList className="grid w-full grid-cols-4">
                {Object.entries(modes).map(([key, mode]) => (
                  <TabsTrigger key={key} value={key} className="flex items-center gap-2 text-xs">
                    <span>{mode.icon}</span>
                    <span className="hidden sm:inline">{mode.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(modes).map(([key, mode]) => (
                <TabsContent key={key} value={key} className="mt-4">
                  <p className="text-gray-600">{mode.description}</p>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Technique Selection - Show for guided modes */}
        {(selectedMode === 'guided' || selectedMode === 'guided-2d') && (
          <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-teal-800">Choose Your Technique</CardTitle>
              <CardDescription>Select a breathing pattern that matches your goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(techniques).map(([key, technique]) => (
                  <div
                    key={key}
                    onClick={() => setSelectedTechnique(key as BreathingTechnique)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedTechnique === key
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="text-center mb-3">
                      <div className="text-3xl mb-2">{technique.icon}</div>
                      <h3 className="font-semibold text-gray-800">{technique.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{technique.description}</p>
                    </div>
                    <div className="space-y-1">
                      {technique.benefits.map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Breathing Exercise Component */}
        <SelectedComponent
          technique={selectedTechnique}
          isActive={(selectedMode === 'guided' || selectedMode === 'guided-2d') ? isActive : undefined}
          currentPhase={(selectedMode === 'guided' || selectedMode === 'guided-2d') ? currentPhase : undefined}
          onSessionComplete={onSessionComplete}
        />

        {/* Guided Controls - Show for guided modes */}
        {(selectedMode === 'guided' || selectedMode === 'guided-2d') && (
          <div className="flex justify-center gap-4">
            <Button
              onClick={isActive ? stopExercise : startExercise}
              size="lg"
              className={`${
                isActive 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-teal-500 hover:bg-teal-600'
              } text-white font-medium`}
            >
              {isActive ? '⏸️ Stop Exercise' : '▶️ Start Exercise'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Breathing;
