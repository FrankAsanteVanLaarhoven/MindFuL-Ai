
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBreathDetection } from '@/hooks/useBreathDetection';

interface EnhancedBreathingSphereProps {
  technique: 'box' | '4-7-8' | 'triangle';
  onSessionComplete?: () => void;
}

// Breathing trail particles that follow breath rhythm
const BreathingTrails = ({ breathIntensity, isBreathing }: { breathIntensity: number; isBreathing: boolean }) => {
  const trailRef = useRef<THREE.Points>(null);
  const trailCount = 50;
  const velocities = useRef<Float32Array>(new Float32Array(trailCount * 3));

  const positions = React.useMemo(() => {
    const pos = new Float32Array(trailCount * 3);
    for (let i = 0; i < trailCount; i++) {
      // Start particles in a spiral around the sphere
      const angle = (i / trailCount) * Math.PI * 4;
      const radius = 1.5 + Math.random() * 0.5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
      
      // Initialize velocities
      velocities.current[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities.current[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities.current[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (trailRef.current && isBreathing) {
      const positions = trailRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < trailCount; i++) {
        // Move particles based on breath intensity
        const breathForce = breathIntensity * 0.1;
        positions[i * 3] += velocities.current[i * 3] * (1 + breathForce);
        positions[i * 3 + 1] += velocities.current[i * 3 + 1] * (1 + breathForce);
        positions[i * 3 + 2] += velocities.current[i * 3 + 2] * (1 + breathForce);
        
        // Reset particles that go too far
        const distance = Math.sqrt(
          positions[i * 3] ** 2 + 
          positions[i * 3 + 1] ** 2 + 
          positions[i * 3 + 2] ** 2
        );
        
        if (distance > 5) {
          const angle = Math.random() * Math.PI * 2;
          positions[i * 3] = Math.cos(angle) * 1.5;
          positions[i * 3 + 1] = Math.sin(angle) * 1.5;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
        }
      }
      
      trailRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={trailRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={isBreathing ? breathIntensity * 0.8 : 0.2}
        sizeAttenuation
      />
    </points>
  );
};

// Pulsing rings that expand with each breath
const PulsingRings = ({ breathIntensity, isBreathing }: { breathIntensity: number; isBreathing: boolean }) => {
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const ringCount = 3;

  useFrame((state) => {
    ringRefs.current.forEach((ring, index) => {
      if (ring && isBreathing) {
        const offset = index * 0.5;
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + offset) * breathIntensity * 0.5;
        ring.scale.setScalar(scale);
        
        // Fade rings based on scale
        if (ring.material instanceof THREE.MeshBasicMaterial) {
          ring.material.opacity = Math.max(0.1, 0.8 - (scale - 1) * 2);
        }
      }
    });
  });

  return (
    <group>
      {[...Array(ringCount)].map((_, index) => (
        <mesh
          key={index}
          ref={el => { if (el) ringRefs.current[index] = el; }}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[1.2 + index * 0.3, 1.4 + index * 0.3, 32]} />
          <meshBasicMaterial
            color={index === 0 ? '#06b6d4' : index === 1 ? '#8b5cf6' : '#ec4899'}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

// Main breathing sphere with dynamic color gradients
const EnhancedBreathingSphere = ({ 
  breathIntensity, 
  isInhaling, 
  isBreathing 
}: { 
  breathIntensity: number;
  isInhaling: boolean;
  isBreathing: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Dynamic color gradient based on breathing intensity
  const getBreathColor = () => {
    if (!isBreathing) return '#4ade80'; // Calm green when idle
    
    // Gradient from calm blue to energetic orange based on intensity
    const intensity = breathIntensity;
    if (intensity < 0.3) return '#06b6d4'; // Calm cyan
    if (intensity < 0.6) return '#8b5cf6'; // Medium purple
    if (intensity < 0.8) return '#ec4899'; // Active pink
    return '#f97316'; // High energy orange
  };

  const baseScale = 1;
  const targetScale = isBreathing ? baseScale + (breathIntensity * 1.5) : baseScale;

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth scale animation
      const currentScale = meshRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 2);
      meshRef.current.scale.setScalar(newScale);

      // Gentle rotation
      meshRef.current.rotation.x += delta * 0.05;
      meshRef.current.rotation.y += delta * 0.1;

      // Breathing float effect
      if (isBreathing) {
        const breathFloat = Math.sin(state.clock.elapsedTime * 1) * 0.1 * breathIntensity;
        meshRef.current.position.y = breathFloat;
      } else {
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
      
      <BreathingTrails breathIntensity={breathIntensity} isBreathing={isBreathing} />
      <PulsingRings breathIntensity={breathIntensity} isBreathing={isBreathing} />
    </>
  );
};

// Breath visualization waves (audio waveform style)
const BreathWaves = ({ breathIntensity, isBreathing }: { breathIntensity: number; isBreathing: boolean }) => {
  const [waveData, setWaveData] = useState<number[]>(new Array(50).fill(0));

  useEffect(() => {
    if (!isBreathing) return;

    const interval = setInterval(() => {
      setWaveData(prev => {
        const newData = [...prev.slice(1), breathIntensity];
        return newData;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [breathIntensity, isBreathing]);

  return (
    <div className="absolute bottom-4 left-4 right-4 h-20 bg-black/20 rounded-lg backdrop-blur-sm p-2">
      <div className="flex items-end justify-between h-full gap-1">
        {waveData.map((intensity, index) => (
          <div
            key={index}
            className="bg-cyan-400 rounded-sm transition-all duration-100"
            style={{
              height: `${Math.max(2, intensity * 100)}%`,
              width: '100%',
              opacity: 0.3 + intensity * 0.7
            }}
          />
        ))}
      </div>
      <div className="text-white text-xs mt-1 text-center">
        Breath Waveform
      </div>
    </div>
  );
};

const EnhancedRealTimeBreathingSphere: React.FC<EnhancedBreathingSphereProps> = ({
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
            Enhanced Breath Analysis
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
          
          {/* Enhanced breathing status indicator */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              isBreathing 
                ? 'bg-gradient-to-r from-cyan-100 to-purple-100 text-cyan-800 shadow-lg' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                isBreathing 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse shadow-lg' 
                  : 'bg-gray-400'
              }`}></div>
              {isBreathing ? (
                <span className="font-medium">
                  {isInhaling ? '🌬️ Inhaling' : '😌 Exhaling'} - {Math.floor(breathIntensity * 100)}%
                </span>
              ) : (
                'Waiting for breath...'
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced 3D Breathing Sphere */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-cyan-900 relative"
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
          <pointLight position={[0, 10, -10]} intensity={0.3} color="#ec4899" />
          
          <EnhancedBreathingSphere
            breathIntensity={breathIntensity}
            isInhaling={isInhaling}
            isBreathing={isBreathing}
          />
        </Canvas>

        {/* Breath visualization waves overlay */}
        <BreathWaves breathIntensity={breathIntensity} isBreathing={isBreathing} />

        {/* Enhanced overlay instructions */}
        <AnimatePresence>
          {!isListening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <div className="text-center text-white">
                <motion.div 
                  className="text-6xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎤
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Enhanced Breath Experience</h3>
                <p className="text-lg mb-6">Immersive breathing with trails, rings, and color gradients</p>
                <Button 
                  onClick={startListening}
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg"
                >
                  Start Enhanced Session
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced control buttons */}
      <div className="flex justify-center gap-4">
        {isListening ? (
          <Button 
            onClick={stopListening}
            variant="destructive"
            size="lg"
            className="shadow-lg"
          >
            Stop Session
          </Button>
        ) : (
          <Button 
            onClick={startListening}
            size="lg"
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg"
          >
            Start Enhanced Breathing
          </Button>
        )}
        
        {sessionDuration > 0 && (
          <Button 
            onClick={onSessionComplete}
            variant="outline"
            size="lg"
            className="shadow-lg"
          >
            Complete Session
          </Button>
        )}
      </div>

      {/* Enhanced instructions */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-800 mb-2">✨ Enhanced Features:</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• 🌊 <strong>Breathing trails</strong> - Particles flow with your breath rhythm</li>
            <li>• 🎨 <strong>Dynamic colors</strong> - Gradients shift from calm blues to energetic oranges</li>
            <li>• 💫 <strong>Pulsing rings</strong> - Expand outward with each breath cycle</li>
            <li>• 📊 <strong>Live waveform</strong> - Real-time breath pattern visualization</li>
            <li>• 🎯 <strong>Responsive environment</strong> - Everything reacts to your breathing intensity</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedRealTimeBreathingSphere;
