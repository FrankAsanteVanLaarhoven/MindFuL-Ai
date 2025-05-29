
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import { Group, MathUtils } from 'three';
import { AvatarCharacter } from './AvatarSelector';

interface TherapyAvatar3DProps {
  avatar: AvatarCharacter;
  isActive: boolean;
  isSpeaking: boolean;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
}

const AvatarMesh: React.FC<{
  avatar: AvatarCharacter;
  isActive: boolean;
  isSpeaking: boolean;
  emotion: string;
}> = ({ avatar, isActive, isSpeaking, emotion }) => {
  const groupRef = useRef<Group>(null);
  const eyeLeftRef = useRef<any>(null);
  const eyeRightRef = useRef<any>(null);
  const mouthRef = useRef<any>(null);

  // Animation
  useFrame((state) => {
    if (!groupRef.current) return;

    // Gentle floating animation
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    
    // Breathing-like scale animation
    const breathScale = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
    groupRef.current.scale.setScalar(breathScale);

    // Speaking animation
    if (isSpeaking && mouthRef.current) {
      const speakScale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.1;
      mouthRef.current.scale.y = speakScale;
    }

    // Blinking animation
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blinkTime = Math.sin(state.clock.elapsedTime * 0.3);
      if (blinkTime > 0.98) {
        eyeLeftRef.current.scale.y = 0.1;
        eyeRightRef.current.scale.y = 0.1;
      } else {
        eyeLeftRef.current.scale.y = 1;
        eyeRightRef.current.scale.y = 1;
      }
    }
  });

  // Color based on avatar type and emotion
  const avatarColor = useMemo(() => {
    const baseColors = {
      therapist: avatar.skinTone || '#4F46E5',
      grandma: avatar.skinTone || '#EC4899',
      grandpa: avatar.skinTone || '#F59E0B',
      aunt: avatar.skinTone || '#8B5CF6',
      uncle: avatar.skinTone || '#10B981',
      sibling: avatar.skinTone || '#06B6D4',
      teacher: avatar.skinTone || '#3B82F6',
      friend: avatar.skinTone || '#F59E0B'
    };
    return baseColors[avatar.type] || avatar.skinTone || '#6B7280';
  }, [avatar.type, avatar.skinTone]);

  const emotionIntensity = useMemo(() => {
    const intensities = {
      neutral: 0.7,
      happy: 1.0,
      concerned: 0.5,
      encouraging: 0.9,
      thoughtful: 0.6
    };
    return intensities[emotion as keyof typeof intensities] || 0.7;
  }, [emotion]);

  return (
    <group ref={groupRef}>
      {/* Main head */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshPhongMaterial 
          color={avatarColor} 
          transparent 
          opacity={emotionIntensity}
        />
      </Sphere>

      {/* Eyes */}
      <Sphere ref={eyeLeftRef} args={[0.15, 16, 16]} position={[-0.3, 0.2, 0.8]}>
        <meshPhongMaterial color="white" />
      </Sphere>
      <Sphere ref={eyeRightRef} args={[0.15, 16, 16]} position={[0.3, 0.2, 0.8]}>
        <meshPhongMaterial color="white" />
      </Sphere>

      {/* Eye pupils */}
      <Sphere args={[0.08, 16, 16]} position={[-0.3, 0.2, 0.9]}>
        <meshPhongMaterial color="#2D3748" />
      </Sphere>
      <Sphere args={[0.08, 16, 16]} position={[0.3, 0.2, 0.9]}>
        <meshPhongMaterial color="#2D3748" />
      </Sphere>

      {/* Mouth */}
      <Sphere 
        ref={mouthRef} 
        args={[0.2, 16, 8]} 
        position={[0, -0.3, 0.7]}
        rotation={[0, 0, 0]}
      >
        <meshPhongMaterial 
          color={isSpeaking ? "#FF6B6B" : "#4A5568"} 
          transparent 
          opacity={0.8}
        />
      </Sphere>

      {/* Avatar name */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.3}
        color="#4A5568"
        anchorX="center"
        anchorY="middle"
      >
        {avatar.name}
      </Text>

      {/* Personality trait */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.15}
        color="#6B7280"
        anchorX="center"
        anchorY="middle"
        maxWidth={5}
      >
        {avatar.personality}
      </Text>
    </group>
  );
};

const TherapyAvatar3D: React.FC<TherapyAvatar3DProps> = ({ 
  avatar, 
  isActive, 
  isSpeaking, 
  emotion = 'neutral' 
}) => {
  return (
    <div className="w-full h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.4} />
        
        <AvatarMesh
          avatar={avatar}
          isActive={isActive}
          isSpeaking={isSpeaking}
          emotion={emotion}
        />
      </Canvas>
    </div>
  );
};

export default TherapyAvatar3D;
