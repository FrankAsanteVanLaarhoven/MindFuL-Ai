
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BreathingCircle2DProps {
  technique: 'box' | '4-7-8' | 'triangle';
  onSessionComplete?: () => void;
}

const BreathingCircle2D: React.FC<BreathingCircle2DProps> = ({
  technique,
  onSessionComplete
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const techniques = {
    box: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    '4-7-8': { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
    triangle: { inhale: 4, hold1: 0, exhale: 4, hold2: 0 }
  };

  const currentTechnique = techniques[technique];

  const runCycle = () => {
    const cycle = currentTechnique;
    const phases: Array<{ phase: typeof currentPhase; duration: number }> = [
      { phase: 'inhale', duration: cycle.inhale },
      ...(cycle.hold1 > 0 ? [{ phase: 'hold1' as const, duration: cycle.hold1 }] : []),
      { phase: 'exhale', duration: cycle.exhale },
      ...(cycle.hold2 > 0 ? [{ phase: 'hold2' as const, duration: cycle.hold2 }] : [])
    ];

    let currentPhaseIndex = 0;

    const runPhase = () => {
      if (!isActive || currentPhaseIndex >= phases.length) {
        setCycleCount(prev => prev + 1);
        if (cycleCount >= 4) {
          handleStop();
          onSessionComplete?.();
          return;
        }
        currentPhaseIndex = 0;
      }

      const { phase, duration } = phases[currentPhaseIndex];
      setCurrentPhase(phase);
      setTimeRemaining(duration);

      // Countdown timer
      let remaining = duration;
      intervalRef.current = setInterval(() => {
        remaining -= 1;
        setTimeRemaining(remaining);
        if (remaining <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 1000);

      phaseTimeoutRef.current = setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        currentPhaseIndex++;
        if (isActive) runPhase();
      }, duration * 1000);
    };

    runPhase();
  };

  const handleStart = () => {
    setIsActive(true);
    setCycleCount(0);
    runCycle();
  };

  const handleStop = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeRemaining(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
  };

  useEffect(() => {
    if (isActive && cycleCount === 0) {
      runCycle();
    }
  }, [isActive]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
    };
  }, []);

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold2': return 'Hold';
      default: return 'Ready';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return '#06b6d4'; // Cyan
      case 'hold1': return '#8b5cf6'; // Purple
      case 'exhale': return '#ec4899'; // Pink
      case 'hold2': return '#f59e0b'; // Amber
      default: return '#4ade80'; // Green
    }
  };

  const getCircleScale = () => {
    switch (currentPhase) {
      case 'inhale': return 1.8;
      case 'hold1': return 1.8;
      case 'exhale': return 1;
      case 'hold2': return 1;
      default: return 1;
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Info */}
      <Card className="bg-white/90 backdrop-blur-sm border-teal-200">
        <CardHeader>
          <CardTitle className="text-lg text-teal-800 flex items-center gap-2">
            <span className="text-2xl">🫁</span>
            2D Breathing Exercise - {techniques[technique].inhale}-{techniques[technique].hold1 || 0}-{techniques[technique].exhale}-{techniques[technique].hold2 || 0}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-teal-600">{cycleCount + 1}/5</div>
              <div className="text-sm text-gray-600">Cycles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{getPhaseText()}</div>
              <div className="text-sm text-gray-600">Current Phase</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{timeRemaining}s</div>
              <div className="text-sm text-gray-600">Time Left</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2D Breathing Circle */}
      <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl">
        <div className="relative w-80 h-80 flex items-center justify-center">
          {/* Background circles for reference */}
          <div className="absolute inset-0 rounded-full border-2 border-gray-300 opacity-30"></div>
          <div className="absolute inset-8 rounded-full border border-gray-200 opacity-50"></div>
          
          {/* Main breathing circle */}
          <motion.div
            className="w-40 h-40 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-2xl"
            style={{ backgroundColor: getPhaseColor() }}
            animate={{
              scale: isActive ? getCircleScale() : 1,
              boxShadow: isActive 
                ? `0 0 40px ${getPhaseColor()}40, 0 0 80px ${getPhaseColor()}20`
                : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            transition={{
              duration: isActive ? (
                currentPhase === 'inhale' ? currentTechnique.inhale :
                currentPhase === 'hold1' ? 0.5 :
                currentPhase === 'exhale' ? currentTechnique.exhale :
                0.5
              ) : 0.3,
              ease: currentPhase === 'inhale' || currentPhase === 'exhale' ? 'easeInOut' : 'linear'
            }}
          >
            {getPhaseText()}
          </motion.div>

          {/* Pulse rings */}
          <AnimatePresence>
            {isActive && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 opacity-30"
                  style={{ borderColor: getPhaseColor() }}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border opacity-40"
                  style={{ borderColor: getPhaseColor() }}
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 1 }}
                />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center max-w-md">
          <p className="text-lg text-gray-700 mb-2">
            {isActive ? (
              currentPhase === 'inhale' ? `Breathe in slowly for ${currentTechnique.inhale} seconds` :
              currentPhase === 'hold1' ? `Hold your breath for ${currentTechnique.hold1} seconds` :
              currentPhase === 'exhale' ? `Breathe out slowly for ${currentTechnique.exhale} seconds` :
              `Hold empty for ${currentTechnique.hold2} seconds`
            ) : (
              'Click start to begin your breathing exercise'
            )}
          </p>
          <div className="text-sm text-gray-500">
            {isActive && `Time remaining: ${timeRemaining} seconds`}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {!isActive ? (
          <Button
            onClick={handleStart}
            size="lg"
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3"
          >
            Start 2D Exercise
          </Button>
        ) : (
          <Button
            onClick={handleStop}
            variant="destructive"
            size="lg"
            className="px-8 py-3"
          >
            Stop Exercise
          </Button>
        )}
      </div>

      {/* Benefits */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-800 mb-2">2D Exercise Benefits:</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• Simple, distraction-free breathing guide</li>
            <li>• Clear visual cues for timing</li>
            <li>• Less resource-intensive than 3D</li>
            <li>• Perfect for focused meditation</li>
            <li>• Works on all devices</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreathingCircle2D;
