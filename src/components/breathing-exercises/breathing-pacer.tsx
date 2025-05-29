
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';

interface BreathingPacerProps {
  technique: 'box' | '4-7-8' | 'triangle';
  onSessionComplete?: () => void;
}

const BreathingPacer: React.FC<BreathingPacerProps> = ({ 
  technique = 'box',
  onSessionComplete 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  
  const circleRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const phaseTextRef = useRef<HTMLDivElement>(null);

  const techniques = {
    box: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    '4-7-8': { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
    triangle: { inhale: 4, hold1: 0, exhale: 4, hold2: 0 }
  };

  const currentTechnique = techniques[technique];

  const createBreathingAnimation = () => {
    if (!circleRef.current || !phaseTextRef.current) return;

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline({
      repeat: -1,
      onRepeat: () => {
        setCycleCount(prev => prev + 1);
        if (cycleCount >= 4) { // Complete after 5 cycles
          handleStop();
          onSessionComplete?.();
        }
      }
    });

    // Inhale phase
    tl.to(circleRef.current, {
      scale: 1.5,
      duration: currentTechnique.inhale,
      ease: "power2.inOut",
      onStart: () => setCurrentPhase('inhale')
    });

    // Add text animation for inhale
    tl.to(phaseTextRef.current, {
      opacity: 1,
      scale: 1.1,
      duration: 0.3,
      ease: "back.out(1.7)"
    }, "<");

    // Hold 1 phase (if exists)
    if (currentTechnique.hold1 > 0) {
      tl.to(circleRef.current, {
        scale: 1.5,
        duration: currentTechnique.hold1,
        onStart: () => setCurrentPhase('hold1')
      });
    }

    // Exhale phase
    tl.to(circleRef.current, {
      scale: 1,
      duration: currentTechnique.exhale,
      ease: "power2.inOut",
      onStart: () => setCurrentPhase('exhale')
    });

    // Hold 2 phase (if exists)
    if (currentTechnique.hold2 > 0) {
      tl.to(circleRef.current, {
        scale: 1,
        duration: currentTechnique.hold2,
        onStart: () => setCurrentPhase('hold2')
      });
    }

    timelineRef.current = tl;
    return tl;
  };

  const handleStart = () => {
    setIsActive(true);
    setCycleCount(0);
    const timeline = createBreathingAnimation();
    timeline?.play();
  };

  const handlePause = () => {
    setIsActive(false);
    timelineRef.current?.pause();
  };

  const handleStop = () => {
    setIsActive(false);
    setCycleCount(0);
    setCurrentPhase('inhale');
    timelineRef.current?.kill();
    
    // Reset to initial state
    if (circleRef.current) {
      gsap.set(circleRef.current, { scale: 1 });
    }
    if (phaseTextRef.current) {
      gsap.set(phaseTextRef.current, { opacity: 1, scale: 1 });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return 'Inhale';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Exhale';
      case 'hold2': return 'Hold';
      default: return 'Breathe';
    }
  };

  const getPhaseDescription = () => {
    const times = currentTechnique;
    switch (currentPhase) {
      case 'inhale': return `Breathe in slowly for ${times.inhale} seconds`;
      case 'hold1': return times.hold1 > 0 ? `Hold your breath for ${times.hold1} seconds` : '';
      case 'exhale': return `Breathe out slowly for ${times.exhale} seconds`;
      case 'hold2': return times.hold2 > 0 ? `Hold your breath for ${times.hold2} seconds` : '';
      default: return 'Follow the visual guide to control your breathing';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      <div className="relative">
        {/* Main breathing circle */}
        <div
          ref={circleRef}
          className="w-48 h-48 rounded-full bg-gradient-to-br from-teal-200 to-teal-400 shadow-2xl flex items-center justify-center transform-gpu"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
        >
          <div
            ref={phaseTextRef}
            className="text-2xl font-semibold text-teal-800 select-none"
          >
            {getPhaseText()}
          </div>
        </div>

        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full border-2 border-teal-300 opacity-30 animate-ping" />
        <div className="absolute inset-4 rounded-full border border-teal-200 opacity-50 animate-pulse" />
      </div>

      {/* Instructions */}
      <div className="text-center max-w-md">
        <p className="text-lg text-gray-700 mb-2">
          {getPhaseDescription()}
        </p>
        <p className="text-sm text-gray-500">
          Cycle {cycleCount + 1} of 5
        </p>
      </div>

      {/* Controls */}
      <div className="flex space-x-4">
        {!isActive ? (
          <Button
            onClick={handleStart}
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            Start
          </Button>
        ) : (
          <Button
            onClick={handlePause}
            variant="outline"
            className="border-teal-500 text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-full text-lg font-medium transition-all duration-200"
          >
            Pause
          </Button>
        )}
        
        <Button
          onClick={handleStop}
          variant="outline"
          className="border-gray-400 text-gray-600 hover:bg-gray-50 px-8 py-3 rounded-full text-lg font-medium transition-all duration-200"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default BreathingPacer;
