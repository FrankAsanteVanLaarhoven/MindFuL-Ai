
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
import VirtualCoach3D from '@/components/breathing-exercises/virtual-coach-3d';
import BiofeedbackCamera from '@/components/breathing-exercises/biofeedback-camera';
import MultimodalSensing from '@/components/breathing-exercises/multimodal-sensing';
import BreathingAchievements from '@/components/breathing-exercises/breathing-achievements';
import BreathingProgress from '@/components/breathing-exercises/breathing-progress';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { addBreathingSession } from '@/lib/breathing-storage';
import { toast } from '@/hooks/use-toast';

type BreathingTechnique = 'box' | '4-7-8' | 'triangle';
type ExerciseMode = 'guided-2d' | 'guided-3d' | 'realtime' | 'enhanced' | 'virtual-coach' | 'biofeedback' | 'multimodal';

const Breathing = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>('box');
  const [selectedMode, setSelectedMode] = useState<ExerciseMode>('virtual-coach');
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  
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
      component: BreathingCircle2D,
      level: 'Beginner'
    },
    'guided-3d': {
      name: 'Guided 3D Practice',
      description: 'Follow the animated sphere with breathing prompts',
      icon: '🧘‍♀️',
      component: BreathingSphere3D,
      level: 'Beginner'
    },
    'virtual-coach': {
      name: '3D Virtual Coach',
      description: 'AI coach with realistic breathing movements and voice guidance',
      icon: '🤖',
      component: VirtualCoach3D,
      level: 'Expert'
    },
    'biofeedback': {
      name: 'Biofeedback Camera',
      description: 'AI camera analysis with real-time vital signs and mood detection',
      icon: '📹',
      component: BiofeedbackCamera,
      level: 'Expert'
    },
    'multimodal': {
      name: 'Multimodal Sensing',
      description: 'Advanced fusion of camera, microphone, and motion sensors',
      icon: '🔬',
      component: MultimodalSensing,
      level: 'Expert'
    },
    realtime: {
      name: 'Real-Time Detection',
      description: 'AI analyzes your actual breathing patterns',
      icon: '🎤',
      component: RealTimeBreathingSphere,
      level: 'Intermediate'
    },
    enhanced: {
      name: 'Enhanced Experience',
      description: 'Immersive visuals with trails, rings, and dynamic colors',
      icon: '✨',
      component: EnhancedRealTimeBreathingSphere,
      level: 'Intermediate'
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
    setSessionStartTime(Date.now());
    runCycle();
  };

  const stopExercise = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    
    // Track session if it was running for at least 30 seconds
    if (sessionStartTime && Date.now() - sessionStartTime >= 30000) {
      const duration = Math.round((Date.now() - sessionStartTime) / 60000); // Convert to minutes
      const technique = techniques[selectedTechnique].name;
      
      addBreathingSession(Math.max(1, duration), `${modes[selectedMode].name} - ${technique}`);
      
      // Dispatch custom event to update progress in real-time
      window.dispatchEvent(new CustomEvent('breathingStatsUpdated'));
      
      toast({
        title: "Session Complete! 🎉",
        description: `Great job! You practiced for ${Math.max(1, duration)} minute${duration !== 1 ? 's' : ''}.`,
      });
    }
    
    setSessionStartTime(null);
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
    
    // Track the session
    if (sessionStartTime) {
      const duration = Math.round((Date.now() - sessionStartTime) / 60000);
      const technique = techniques[selectedTechnique].name;
      
      addBreathingSession(Math.max(1, duration), `${modes[selectedMode].name} - ${technique}`);
      
      // Dispatch custom event to update progress in real-time
      window.dispatchEvent(new CustomEvent('breathingStatsUpdated'));
      
      toast({
        title: "Session Complete! 🎉",
        description: `Excellent work! You practiced for ${Math.max(1, duration)} minute${duration !== 1 ? 's' : ''}.`,
      });
    }
    
    setSessionStartTime(null);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
            Advanced Breathing Exercises
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience world-leading breathing exercises with AI-driven biofeedback, virtual coaching, and multimodal sensing technology.
          </p>
        </div>

        {/* Progress and Achievements Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BreathingProgress />
          <BreathingAchievements />
        </div>

        {/* Mode Selection */}
        <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-teal-800">Choose Your Experience Level</CardTitle>
            <CardDescription>Select from beginner-friendly to expert-level breathing technologies</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedMode} onValueChange={(value) => setSelectedMode(value as ExerciseMode)}>
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                {Object.entries(modes).map(([key, mode]) => (
                  <TabsTrigger key={key} value={key} className="flex flex-col items-center gap-1 text-xs p-2">
                    <span className="text-lg">{mode.icon}</span>
                    <span className="hidden sm:inline font-medium">{mode.name}</span>
                    <Badge variant="outline" className={`text-xs ${getLevelColor(mode.level)}`}>
                      {mode.level}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(modes).map(([key, mode]) => (
                <TabsContent key={key} value={key} className="mt-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <span className="text-2xl">{mode.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{mode.name}</h3>
                      <p className="text-gray-600">{mode.description}</p>
                    </div>
                    <Badge className={getLevelColor(mode.level)}>
                      {mode.level}
                    </Badge>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Technique Selection - Show for guided modes */}
        {(selectedMode === 'guided-3d' || selectedMode === 'guided-2d' || selectedMode === 'virtual-coach') && (
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
          isActive={(selectedMode === 'guided-3d' || selectedMode === 'guided-2d' || selectedMode === 'virtual-coach') ? isActive : undefined}
          currentPhase={(selectedMode === 'guided-3d' || selectedMode === 'guided-2d' || selectedMode === 'virtual-coach') ? currentPhase : undefined}
          onSessionComplete={onSessionComplete}
        />

        {/* Guided Controls - Show for guided modes */}
        {(selectedMode === 'guided-3d' || selectedMode === 'guided-2d' || selectedMode === 'virtual-coach') && (
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

        {/* Expert Features Information */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-lg text-purple-800">🚀 World-Leading Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h4 className="font-medium text-purple-800">3D Virtual Coach</h4>
                  <p className="text-sm text-purple-600">Realistic avatar with voice guidance and breathing demonstrations</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">📹</span>
                <div>
                  <h4 className="font-medium text-purple-800">Biofeedback Camera</h4>
                  <p className="text-sm text-purple-600">AI-powered vital signs monitoring and mood detection</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔬</span>
                <div>
                  <h4 className="font-medium text-purple-800">Multimodal Sensing</h4>
                  <p className="text-sm text-purple-600">Advanced sensor fusion with gamification and real-time feedback</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Breathing;
