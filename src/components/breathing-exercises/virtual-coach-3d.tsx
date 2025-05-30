
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { addBreathingSession } from '@/lib/breathing-storage';
import { toast } from '@/hooks/use-toast';

interface VirtualCoach3DProps {
  technique: 'box' | '4-7-8' | 'triangle';
  isActive: boolean;
  currentPhase: 'inhale' | 'hold1' | 'exhale' | 'hold2';
  onSessionComplete?: () => void;
}

// Realistic 3D Avatar with breathing animations
const BreathingAvatar = ({ currentPhase, isActive }: { currentPhase: string; isActive: boolean }) => {
  const avatarRef = useRef<THREE.Group>(null);
  const chestRef = useRef<THREE.Mesh>(null);
  const armsRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (!avatarRef.current || !chestRef.current || !armsRef.current) return;
    
    if (isActive) {
      // Breathing animation for chest
      let targetScale = 1;
      let targetY = 0;
      
      switch (currentPhase) {
        case 'inhale':
          targetScale = 1.3;
          targetY = 0.1;
          break;
        case 'hold1':
          targetScale = 1.3;
          targetY = 0.1;
          break;
        case 'exhale':
          targetScale = 1;
          targetY = 0;
          break;
        case 'hold2':
          targetScale = 1;
          targetY = 0;
          break;
      }
      
      // Smooth chest breathing animation
      chestRef.current.scale.lerp(new THREE.Vector3(1, targetScale, 1), delta * 2);
      chestRef.current.position.y = THREE.MathUtils.lerp(chestRef.current.position.y, targetY, delta * 2);
      
      // Gentle arm movement with breathing
      const armRotation = (targetScale - 1) * 0.2;
      armsRef.current.rotation.z = THREE.MathUtils.lerp(armsRef.current.rotation.z, armRotation, delta * 2);
      
      // Subtle whole-body floating
      avatarRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
    
    // Gentle idle rotation
    avatarRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={avatarRef} position={[0, -1, 0]}>
      {/* Head */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#fdbcb4" />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.4, 0.3, 1, 8]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>
      
      {/* Chest (breathing part) */}
      <mesh ref={chestRef} position={[0, 1.2, 0.1]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#357abd" transparent opacity={0.8} />
      </mesh>
      
      {/* Arms */}
      <group ref={armsRef}>
        <mesh position={[-0.6, 1.2, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.1, 0.08, 0.8, 8]} />
          <meshStandardMaterial color="#fdbcb4" />
        </mesh>
        <mesh position={[0.6, 1.2, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.1, 0.08, 0.8, 8]} />
          <meshStandardMaterial color="#fdbcb4" />
        </mesh>
      </group>
      
      {/* Legs */}
      <mesh position={[-0.2, 0.2, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.8, 8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.2, 0.2, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.8, 8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  );
};

// Ambient environment particles
const AmbientParticles = ({ isActive }: { isActive: boolean }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;

  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#ffffff"
        transparent
        opacity={isActive ? 0.4 : 0.1}
        sizeAttenuation
      />
    </points>
  );
};

const VirtualCoach3D: React.FC<VirtualCoach3DProps> = ({
  technique,
  isActive,
  currentPhase,
  onSessionComplete
}) => {
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Session timer
  useEffect(() => {
    if (!isActive) return;

    if (!sessionStartTime) {
      setSessionStartTime(Date.now());
    }

    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, sessionStartTime]);

  // Voice guidance
  useEffect(() => {
    if (!voiceEnabled || !isActive) return;

    const speak = (text: string) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        utterance.volume = 0.7;
        speechSynthesis.speak(utterance);
      }
    };

    const phaseInstructions = {
      inhale: "Breathe in slowly through your nose",
      hold1: "Hold your breath gently",
      exhale: "Exhale slowly through your mouth",
      hold2: "Pause and relax"
    };

    speak(phaseInstructions[currentPhase] || "");
  }, [currentPhase, isActive, voiceEnabled]);

  const handleComplete = () => {
    if (sessionStartTime) {
      const duration = Math.round((Date.now() - sessionStartTime) / 60000);
      addBreathingSession(Math.max(1, duration), `3D Virtual Coach - ${technique}`);
      
      window.dispatchEvent(new CustomEvent('breathingStatsUpdated'));
      
      toast({
        title: "Virtual Coach Session Complete! 🧘‍♀️",
        description: `Great work! You practiced with your virtual coach for ${Math.max(1, duration)} minute${duration !== 1 ? 's' : ''}.`,
      });
    }
    
    if (onSessionComplete) {
      onSessionComplete();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseDescription = () => {
    const descriptions = {
      inhale: "Follow your coach - breathe in slowly and deeply",
      hold1: "Hold with your coach - maintain the breath gently", 
      exhale: "Exhale with your coach - release slowly and completely",
      hold2: "Pause with your coach - rest in the stillness"
    };
    return descriptions[currentPhase] || "Follow your virtual breathing coach";
  };

  return (
    <div className="space-y-6">
      {/* Coach Stats */}
      <Card className="bg-white/90 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
            🧘‍♀️ Virtual Breathing Coach
            <Badge variant="outline" className="ml-auto">
              {formatTime(sessionDuration)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
              isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                isActive ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
              }`}></div>
              <span className="font-medium">{getPhaseDescription()}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="text-xs"
            >
              🔊 Voice {voiceEnabled ? 'On' : 'Off'}
            </Button>
          </div>
          
          {sessionDuration > 0 && (
            <Button 
              onClick={handleComplete}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Complete Session
            </Button>
          )}
        </CardContent>
      </Card>

      {/* 3D Virtual Coach Scene */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 relative"
      >
        <Canvas
          camera={{ position: [0, 0, 4], fov: 60 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-5, 5, 5]} intensity={0.4} color="#87ceeb" />
          
          <BreathingAvatar currentPhase={currentPhase} isActive={isActive} />
          <AmbientParticles isActive={isActive} />
          
          {/* Ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#e8f4f8" transparent opacity={0.5} />
          </mesh>
        </Canvas>

        {/* Breathing instructions overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg p-3">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700 mb-1">
              Current Phase
            </div>
            <div className="text-lg font-bold text-blue-600 capitalize">
              {currentPhase.replace('hold1', 'Hold').replace('hold2', 'Hold')}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Instructions */}
      <Card className="bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-800 mb-2">🧘‍♀️ Virtual Coach Features:</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• 👤 <strong>Realistic 3D Avatar</strong> - Follow your coach's breathing movements</li>
            <li>• 🗣️ <strong>Voice Guidance</strong> - Spoken instructions for each phase</li>
            <li>• 🎯 <strong>Visual Cues</strong> - Watch chest movement and body language</li>
            <li>• 🌟 <strong>Ambient Environment</strong> - Calming particles and lighting</li>
            <li>• 📊 <strong>Session Tracking</strong> - Monitor your practice time and progress</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualCoach3D;
