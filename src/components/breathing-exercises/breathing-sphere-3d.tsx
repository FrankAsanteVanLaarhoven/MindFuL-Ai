
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Environment, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface BreathingSphere3DProps {
  technique: 'box' | '4-7-8' | 'triangle';
  isActive: boolean;
  currentPhase: 'inhale' | 'hold1' | 'exhale' | 'hold2';
  onSessionComplete?: () => void;
}

const AnimatedSphere = ({ technique, isActive, currentPhase }: { 
  technique: string; 
  isActive: boolean; 
  currentPhase: string; 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [targetScale, setTargetScale] = useState(1);
  const [targetColor, setTargetColor] = useState('#4ade80');

  useEffect(() => {
    if (!isActive) {
      setTargetScale(1);
      setTargetColor('#4ade80');
      return;
    }

    switch (currentPhase) {
      case 'inhale':
        setTargetScale(2);
        setTargetColor('#06b6d4');
        break;
      case 'hold1':
        setTargetScale(2);
        setTargetColor('#8b5cf6');
        break;
      case 'exhale':
        setTargetScale(1);
        setTargetColor('#ec4899');
        break;
      case 'hold2':
        setTargetScale(1);
        setTargetColor('#f59e0b');
        break;
      default:
        setTargetScale(1);
        setTargetColor('#4ade80');
    }
  }, [currentPhase, isActive]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth scale animation
      const currentScale = meshRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 2);
      meshRef.current.scale.setScalar(newScale);

      // Gentle rotation
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.2;

      // Subtle floating effect
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color={targetColor}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  );
};

const ParticleField = ({ isActive }: { isActive: boolean }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 100;

  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current && isActive) {
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={isActive ? 0.6 : 0.2}
        sizeAttenuation
      />
    </points>
  );
};

const BreathingSphere3D: React.FC<BreathingSphere3DProps> = ({
  technique,
  isActive,
  currentPhase,
  onSessionComplete
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        
        <AnimatedSphere
          technique={technique}
          isActive={isActive}
          currentPhase={currentPhase}
        />
        
        <ParticleField isActive={isActive} />
        
        <Environment preset="night" />
      </Canvas>
    </motion.div>
  );
};

export default BreathingSphere3D;
