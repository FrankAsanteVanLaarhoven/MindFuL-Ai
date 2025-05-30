
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BreathingCircle2D from '@/components/breathing-exercises/breathing-circle-2d';
import RealTimeBreathingSphere from '@/components/breathing-exercises/real-time-breathing-sphere';
import EnhancedRealTimeBreathingSphere from '@/components/breathing-exercises/enhanced-breathing-sphere';
import VirtualCoach3D from '@/components/breathing-exercises/virtual-coach-3d';
import BiofeedbackCamera from '@/components/breathing-exercises/biofeedback-camera';
import MultimodalSensing from '@/components/breathing-exercises/multimodal-sensing';
import BreathingMoodApp from '@/components/breathing-exercises/BreathingMoodApp';
import BreathingAchievements from '@/components/breathing-exercises/breathing-achievements';
import BreathingProgress from '@/components/breathing-exercises/breathing-progress';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { addBreathingSession } from '@/lib/breathing-storage';
import { toast } from '@/hooks/use-toast';

type BreathingTechnique = 'box' | '4-7-8' | 'triangle';
type ExerciseMode = 'guided-2d' | 'realtime' | 'enhanced' | 'virtual-coach' | 'biofeedback' | 'multimodal' | 'mood-analysis' | 'analytics';

const Breathing = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>('box');
  const [selectedMode, setSelectedMode] = useState<ExerciseMode>('guided-2d');
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
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      benefits: ['Reduces stress', 'Improves focus', 'Calms nervous system']
    },
    '4-7-8': {
      name: '4-7-8 Technique',
      description: 'Inhale 4, hold 7, exhale 8 counts',
      icon: '😴',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      benefits: ['Promotes sleep', 'Reduces anxiety', 'Lowers heart rate']
    },
    triangle: {
      name: 'Triangle Breathing',
      description: 'Three equal phases: inhale, hold, exhale (4-4-4)',
      icon: '🔺',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      benefits: ['Balances energy', 'Improves concentration', 'Builds endurance']
    }
  };

  // Reordered modes from easy to expert with analytics card added
  const modes = {
    'guided-2d': {
      name: 'Simple 2D Guide',
      description: 'Clean, simple breathing circle - perfect for focus',
      icon: '⭕',
      component: BreathingCircle2D,
      level: 'Easy',
      gradient: 'from-emerald-400 to-cyan-400'
    },
    'realtime': {
      name: 'Real-Time Detection',
      description: 'AI analyzes your actual breathing patterns',
      icon: '🎤',
      component: RealTimeBreathingSphere,
      level: 'Beginner',
      gradient: 'from-cyan-500 to-blue-500'
    },
    'enhanced': {
      name: 'Enhanced Experience',
      description: 'Immersive visuals with trails, rings, and dynamic colors',
      icon: '✨',
      component: EnhancedRealTimeBreathingSphere,
      level: 'Intermediate',
      gradient: 'from-pink-500 to-rose-500'
    },
    'virtual-coach': {
      name: '3D Virtual Coach',
      description: 'AI coach with realistic breathing movements and voice guidance',
      icon: '🤖',
      component: VirtualCoach3D,
      level: 'Advanced',
      gradient: 'from-violet-500 to-purple-500'
    },
    'biofeedback': {
      name: 'Biofeedback Camera',
      description: 'AI camera analysis with real-time vital signs and mood detection',
      icon: '📹',
      component: BiofeedbackCamera,
      level: 'Expert',
      gradient: 'from-red-500 to-pink-500'
    },
    'multimodal': {
      name: 'Multimodal Sensing',
      description: 'Advanced fusion of camera, microphone, and motion sensors',
      icon: '🔬',
      component: MultimodalSensing,
      level: 'Expert',
      gradient: 'from-indigo-500 to-blue-500'
    },
    'mood-analysis': {
      name: '3D Breathing & Mood Analysis',
      description: 'Complete implementation with 3D scene, face detection, and speech sentiment',
      icon: '🎭',
      component: BreathingMoodApp,
      level: 'Expert',
      gradient: 'from-orange-500 to-amber-500'
    },
    'analytics': {
      name: 'Live Breath Analysis',
      description: 'Track your breathing journey with detailed insights and achievements',
      icon: '📊',
      component: null, // Special case for analytics view
      level: 'Info',
      gradient: 'from-teal-500 to-green-500'
    }
  };

  const cycles = {
    box: { inhale: 4000, hold1: 4000, exhale: 4000, hold2: 4000 },
    '4-7-8': { inhale: 4000, hold1: 7000, exhale: 8000, hold2: 0 },
    triangle: { inhale: 4000, hold1: 4000, exhale: 4000, hold2: 0 }
  };

  const SelectedComponent = selectedMode === 'analytics' ? null : modes[selectedMode].component;

  const startExercise = () => {
    setIsActive(true);
    setSessionStartTime(Date.now());
    runCycle();
  };

  const stopExercise = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    
    if (sessionStartTime && Date.now() - sessionStartTime >= 30000) {
      const duration = Math.round((Date.now() - sessionStartTime) / 60000);
      const technique = techniques[selectedTechnique].name;
      
      addBreathingSession(Math.max(1, duration), `${modes[selectedMode].name} - ${technique}`);
      
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
    
    if (sessionStartTime) {
      const duration = Math.round((Date.now() - sessionStartTime) / 60000);
      const technique = techniques[selectedTechnique].name;
      
      addBreathingSession(Math.max(1, duration), `${modes[selectedMode].name} - ${technique}`);
      
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
      case 'Easy': return 'bg-green-100/80 text-green-800 border-green-200';
      case 'Beginner': return 'bg-emerald-100/80 text-emerald-800 border-emerald-200';
      case 'Intermediate': return 'bg-amber-100/80 text-amber-800 border-amber-200';
      case 'Advanced': return 'bg-orange-100/80 text-orange-800 border-orange-200';
      case 'Expert': return 'bg-rose-100/80 text-rose-800 border-rose-200';
      case 'Info': return 'bg-teal-100/80 text-teal-800 border-teal-200';
      default: return 'bg-slate-100/80 text-slate-800 border-slate-200';
    }
  };

  const renderAnalyticsView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full p-6">
      <div className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20">
        <BreathingProgress />
      </div>
      <div className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20">
        <BreathingAchievements />
      </div>
    </div>
  );

  // Helper function to get props for each component type
  const getComponentProps = () => {
    const baseProps = {
      technique: selectedTechnique,
      onSessionComplete
    };

    // Only add isActive and currentPhase for guided modes that support them
    if (selectedMode === 'guided-2d' || selectedMode === 'virtual-coach') {
      return {
        ...baseProps,
        isActive,
        currentPhase
      };
    }

    return baseProps;
  };

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
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="mb-6 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <span className="text-6xl">🫁</span>
            Advanced Breathing Mastery
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Experience cutting-edge breathing exercises with AI-driven biofeedback, virtual coaching, and advanced sensing technology.
          </p>
        </div>

        {/* Experience Level Selection - Arranged from Easy to Expert */}
        <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-white mb-2">Choose Your Experience Level</CardTitle>
            <CardDescription className="text-gray-300 text-lg">Select from easy to expert-level breathing technologies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(modes).map(([key, mode]) => (
                <div
                  key={key}
                  onClick={() => setSelectedMode(key as ExerciseMode)}
                  className={`group relative p-2 rounded-xl border-2 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 ${
                    selectedMode === key
                      ? 'border-white/50 bg-white/20 shadow-xl'
                      : 'border-white/20 bg-white/5 hover:bg-white/15 hover:border-white/40'
                  }`}
                  style={{
                    background: selectedMode === key ? 
                      `linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))` :
                      undefined
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${mode.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10 text-center space-y-1">
                    <div className="text-xl mb-1 transform group-hover:scale-110 transition-transform duration-300">
                      {mode.icon}
                    </div>
                    <h3 className="font-bold text-white text-xs leading-tight">{mode.name}</h3>
                    <p className="text-gray-300 text-xs leading-relaxed">{mode.description}</p>
                    <Badge className={`${getLevelColor(mode.level)} font-medium px-1 py-0.5 text-xs`}>
                      {mode.level}
                    </Badge>
                  </div>
                  
                  {/* Selection indicator */}
                  {selectedMode === key && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technique Selection - Show for guided modes */}
        {(selectedMode === 'guided-2d' || selectedMode === 'virtual-coach') && (
          <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white mb-2">Choose Your Technique</CardTitle>
              <CardDescription className="text-gray-300">Select a breathing pattern that matches your goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(techniques).map(([key, technique]) => (
                  <div
                    key={key}
                    onClick={() => setSelectedTechnique(key as BreathingTechnique)}
                    className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                      selectedTechnique === key
                        ? 'border-white/50 bg-white/20 shadow-2xl'
                        : 'border-white/20 bg-white/5 hover:bg-white/15 hover:border-white/40'
                    }`}
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${technique.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    
                    <div className="relative z-10 text-center mb-4">
                      <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{technique.icon}</div>
                      <h3 className="font-bold text-white text-lg mb-2">{technique.name}</h3>
                      <p className="text-gray-300 text-sm mb-4">{technique.description}</p>
                    </div>
                    <div className="relative z-10 space-y-2">
                      {technique.benefits.map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
        )}

        {/* Breathing Exercise Component - Enhanced container with increased height */}
        <div className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/20 shadow-2xl p-2" style={{ aspectRatio: '16/9', minHeight: '800px' }}>
          {selectedMode === 'analytics' ? renderAnalyticsView() : (
            SelectedComponent && (
              <SelectedComponent {...getComponentProps()} />
            )
          )}
        </div>

        {/* Guided Controls - Enhanced for guided modes */}
        {(selectedMode === 'guided-2d' || selectedMode === 'virtual-coach') && (
          <div className="flex justify-center">
            <Button
              onClick={isActive ? stopExercise : startExercise}
              size="lg"
              className={`px-12 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                isActive 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/25' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25'
              } text-white border-0 backdrop-blur-md`}
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
