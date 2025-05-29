
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Group, MeshPhongMaterial, SphereGeometry, Mesh } from 'three';
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
  const eyeLeftRef = useRef<Mesh>(null);
  const eyeRightRef = useRef<Mesh>(null);
  const mouthRef = useRef<Mesh>(null);

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
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial 
          color={avatarColor} 
          transparent 
          opacity={emotionIntensity}
        />
      </mesh>

      {/* Eyes */}
      <mesh ref={eyeLeftRef} position={[-0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshPhongMaterial color="white" />
      </mesh>
      <mesh ref={eyeRightRef} position={[0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshPhongMaterial color="white" />
      </mesh>

      {/* Eye pupils */}
      <mesh position={[-0.3, 0.2, 0.9]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhongMaterial color="#2D3748" />
      </mesh>
      <mesh position={[0.3, 0.2, 0.9]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhongMaterial color="#2D3748" />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, -0.3, 0.7]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 8]} />
        <meshPhongMaterial 
          color={isSpeaking ? "#FF6B6B" : "#4A5568"} 
          transparent 
          opacity={0.8}
        />
      </mesh>

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
