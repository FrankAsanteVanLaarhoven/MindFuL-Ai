"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBreathDetection } from '@/hooks/useBreathDetection';
import { addBreathingSession } from '@/lib/breathing-storage';
import { toast } from '@/hooks/use-toast';

interface RealTimeBreathingSphereProps {
  technique: 'box' | '4-7-8' | 'triangle';
  onSessionComplete?: () => void;
}

const NetworkParticles = ({ isBreathing }: { isBreathing: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const particleCount = 20;
  const maxDistance = 2;

  // Create particles in a sphere formation
  const particles = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.random() * Math.PI * 2;
      const costheta = Math.random() * 2 - 1;
      const u = Math.random();
      const theta = Math.acos(costheta);
      const r = 2 * Math.cbrt(u);
      
      positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(theta);
    }
    return positions;
  }, []);

  // Create connections between nearby particles
  const connections = React.useMemo(() => {
    const linePositions = [];
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const x1 = particles[i * 3];
        const y1 = particles[i * 3 + 1];
        const z1 = particles[i * 3 + 2];
        const x2 = particles[j * 3];
        const y2 = particles[j * 3 + 1];
        const z2 = particles[j * 3 + 2];
        
        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
        
        if (distance < maxDistance) {
          linePositions.push(x1, y1, z1, x2, y2, z2);
        }
      }
    }
    return new Float32Array(linePositions);
  }, [particles]);

  useFrame((state) => {
    if (pointsRef.current && lineRef.current) {
      // Very slow rotation
      const rotationSpeed = isBreathing ? 0.002 : 0.001;
      pointsRef.current.rotation.y += rotationSpeed;
      pointsRef.current.rotation.x += rotationSpeed * 0.5;
      
      lineRef.current.rotation.y += rotationSpeed;
      lineRef.current.rotation.x += rotationSpeed * 0.5;

      // Subtle floating effect
      const floatY = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      pointsRef.current.position.y = floatY;
      lineRef.current.position.y = floatY;
    }
  });

  return (
    <group>
      {/* Network lines */}
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[connections, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={isBreathing ? 0.15 : 0.05}
        />
      </lineSegments>
      
      {/* Network nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#ffffff"
          transparent
          opacity={isBreathing ? 0.4 : 0.1}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

const LiveBreathingSphere = ({ breathIntensity, isInhaling, isBreathing }: { 
  breathIntensity: number;
  isInhaling: boolean;
  isBreathing: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Balloon expansion - scale based on breathing
  const baseScale = 1;
  const targetScale = isBreathing ? baseScale + (breathIntensity * 1.5) : baseScale;
  
  // Dynamic color based on breathing state
  const getBreathColor = () => {
    if (!isBreathing) return '#4ade80'; // Green when idle
    if (isInhaling) return '#06b6d4'; // Cyan when inhaling
    return '#ec4899'; // Pink when exhaling
  };

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth scale animation - balloon expansion/contraction
      const currentScale = meshRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 2);
      meshRef.current.scale.setScalar(newScale);

      // Very gentle rotation - always slow
      meshRef.current.rotation.x += delta * 0.05;
      meshRef.current.rotation.y += delta * 0.1;

      // Minimal floating effect only when breathing
      if (isBreathing) {
        const breathFloat = Math.sin(state.clock.elapsedTime * 1) * 0.1;
        meshRef.current.position.y = breathFloat;
      } else {
        // Gently return to center when not breathing
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, delta * 2);
      }

      // Update material color smoothly
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        const targetColor = new THREE.Color(getBreathColor());
        meshRef.current.material.color.lerp(targetColor, delta * 2);
      }
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color={getBreathColor()}
          transparent
          opacity={0.8}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      
      {/* Network particles */}
      <NetworkParticles isBreathing={isBreathing} />
    </>
  );
};

const RealTimeBreathingSphere: React.FC<RealTimeBreathingSphereProps> = ({
  technique,
  onSessionComplete
}) => {
  const {
    isBreathing,
    breathIntensity,
    isInhaling,
    breathRate,
    isListening,
    error,
    startListening,
    stopListening
  } = useBreathDetection();

  const [sessionDuration, setSessionDuration] = useState(0);
  const [score, setScore] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Session timer
  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isListening]);

  // Calculate score based on breathing consistency
  useEffect(() => {
    if (isBreathing) {
      setScore(prev => prev + Math.floor(breathIntensity * 10));
    }
  }, [isBreathing, breathIntensity]);

  const handleStartListening = () => {
    setSessionStartTime(Date.now());
    startListening();
  };

  const handleStopListening = () => {
    stopListening();
    
    // Track session if it was running for at least 30 seconds
    if (sessionStartTime && sessionDuration >= 30) {
      const duration = Math.round(sessionDuration / 60); // Convert to minutes
      addBreathingSession(Math.max(1, duration), 'Real-Time Detection');
      
      // Dispatch custom event to update progress in real-time
      window.dispatchEvent(new CustomEvent('breathingStatsUpdated'));
      
      toast({
        title: "Real-Time Session Complete! 🎉",
        description: `Amazing! You practiced for ${Math.max(1, duration)} minute${duration !== 1 ? 's' : ''} with a score of ${score}.`,
      });
    }
    
    setSessionStartTime(null);
  };

  const handleCompleteSession = () => {
    if (onSessionComplete) {
      onSessionComplete();
    }
    handleStopListening();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Real-time stats */}
      <Card className="bg-white/90 backdrop-blur-sm border-teal-200">
        <CardHeader>
          <CardTitle className="text-lg text-teal-800 flex items-center gap-2">
            <span className="text-2xl">🫁</span>
            Live Breath Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">{formatTime(sessionDuration)}</div>
              <div className="text-sm text-gray-600">Session Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.floor(breathIntensity * 100)}%</div>
              <div className="text-sm text-gray-600">Breath Intensity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{breathRate}</div>
              <div className="text-sm text-gray-600">Breaths/Min</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>
          
          {/* Breathing status indicator */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              isBreathing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <div className={`w-3 h-3 rounded-full ${isBreathing ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              {isBreathing ? (isInhaling ? 'Inhaling' : 'Exhaling') : 'Waiting for breath...'}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3D Breathing Sphere */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 relative"
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
          
          <LiveBreathingSphere
            breathIntensity={breathIntensity}
            isInhaling={isInhaling}
            isBreathing={isBreathing}
          />
        </Canvas>

        {/* Overlay instructions */}
        <AnimatePresence>
          {!isListening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🎤</div>
                <h3 className="text-2xl font-bold mb-2">Real-Time Breath Detection</h3>
                <p className="text-lg mb-6">Click start to begin live breathing analysis</p>
                <Button 
                  onClick={handleStartListening}
                  size="lg"
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  Start Breathing Session
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Control buttons */}
      <div className="flex justify-center gap-4">
        {isListening ? (
          <Button 
            onClick={handleStopListening}
            variant="destructive"
            size="lg"
          >
            Stop Session
          </Button>
        ) : (
          <Button 
            onClick={handleStartListening}
            size="lg"
            className="bg-teal-500 hover:bg-teal-600"
          >
            Start Real-Time Breathing
          </Button>
        )}
        
        {sessionDuration > 0 && (
          <Button 
            onClick={handleCompleteSession}
            variant="outline"
            size="lg"
          >
            Complete Session
          </Button>
        )}
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• Allow microphone access when prompted</li>
            <li>• Breathe naturally near your device's microphone</li>
            <li>• Watch the balloon expand and contract with your real breathing</li>
            <li>• The color changes: Cyan for inhaling, Pink for exhaling</li>
            <li>• Try to maintain steady, deep breaths for higher scores</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeBreathingSphere;
