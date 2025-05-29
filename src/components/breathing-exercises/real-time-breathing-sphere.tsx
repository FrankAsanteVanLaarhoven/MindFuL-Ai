
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBreathDetection } from '@/hooks/useBreathDetection';

interface RealTimeBreathingSphereProps {
  technique: 'box' | '4-7-8' | 'triangle';
  onSessionComplete?: () => void;
}

const LiveBreathingSphere = ({ breathIntensity, isInhaling, isBreathing }: { 
  breathIntensity: number;
  isInhaling: boolean;
  isBreathing: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Dynamic scale based on breath intensity
  const targetScale = 1 + (breathIntensity * 3); // Scale from 1 to 4x
  
  // Dynamic color based on breathing state
  const getBreathColor = () => {
    if (!isBreathing) return '#4ade80'; // Green when idle
    if (isInhaling) return '#06b6d4'; // Cyan when inhaling
    return '#ec4899'; // Pink when exhaling
  };

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth scale animation based on real breath
      const currentScale = meshRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 3);
      meshRef.current.scale.setScalar(newScale);

      // Gentle rotation
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.2;

      // Breathing-based floating effect
      const breathFloat = isBreathing ? Math.sin(state.clock.elapsedTime * 2) * 0.2 : 0;
      meshRef.current.position.y = breathFloat;

      // Update material color
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.color.setHex(parseInt(getBreathColor().replace('#', '0x')));
      }
    }

    // Animate particles based on breathing
    if (particlesRef.current && isBreathing) {
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      
      // Make particles more active when breathing
      const breathEffect = 1 + breathIntensity;
      particlesRef.current.scale.setScalar(breathEffect);
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color={getBreathColor()}
          transparent
          opacity={0.7 + breathIntensity * 0.3}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      
      {/* Breathing particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(Array.from({ length: 300 }, () => (Math.random() - 0.5) * 10)), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ffffff"
          transparent
          opacity={isBreathing ? 0.8 : 0.3}
          sizeAttenuation
        />
      </points>
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
                  onClick={startListening}
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
            onClick={stopListening}
            variant="destructive"
            size="lg"
          >
            Stop Session
          </Button>
        ) : (
          <Button 
            onClick={startListening}
            size="lg"
            className="bg-teal-500 hover:bg-teal-600"
          >
            Start Real-Time Breathing
          </Button>
        )}
        
        {sessionDuration > 0 && (
          <Button 
            onClick={onSessionComplete}
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
            <li>• Watch the sphere expand and contract with your real breathing</li>
            <li>• The color changes: Cyan for inhaling, Pink for exhaling</li>
            <li>• Try to maintain steady, deep breaths for higher scores</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeBreathingSphere;
