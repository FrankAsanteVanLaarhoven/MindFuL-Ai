
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Group, MeshPhongMaterial, SphereGeometry, Mesh, Vector3 } from 'three';
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
  const headRef = useRef<Mesh>(null);
  const eyeLeftRef = useRef<Mesh>(null);
  const eyeRightRef = useRef<Mesh>(null);
  const pupilLeftRef = useRef<Mesh>(null);
  const pupilRightRef = useRef<Mesh>(null);
  const mouthRef = useRef<Mesh>(null);
  const eyebrowLeftRef = useRef<Mesh>(null);
  const eyebrowRightRef = useRef<Mesh>(null);
  const bodyRef = useRef<Mesh>(null);
  const leftArmRef = useRef<Mesh>(null);
  const rightArmRef = useRef<Mesh>(null);

  // Animation state
  const emotionStateRef = useRef({ intensity: 0, target: 0 });
  const blinkStateRef = useRef({ timer: 0, isBlinking: false });
  const speakStateRef = useRef({ intensity: 0, phase: 0 });

  // Enhanced animation system
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Gentle floating animation
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    
    // Breathing-like scale animation for body
    if (bodyRef.current) {
      const breathScale = 1 + Math.sin(time * 0.8) * 0.03;
      bodyRef.current.scale.setScalar(breathScale);
    }

    // Head subtle movement
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
      headRef.current.rotation.x = Math.sin(time * 0.4) * 0.05;
    }

    // Enhanced blinking system
    blinkStateRef.current.timer += 0.016;
    if (blinkStateRef.current.timer > 3 + Math.random() * 2) {
      blinkStateRef.current.isBlinking = true;
      blinkStateRef.current.timer = 0;
    }

    if (blinkStateRef.current.isBlinking) {
      const blinkProgress = Math.sin(blinkStateRef.current.timer * 20);
      if (eyeLeftRef.current && eyeRightRef.current) {
        const blinkScale = Math.max(0.1, 1 - Math.abs(blinkProgress) * 0.9);
        eyeLeftRef.current.scale.y = blinkScale;
        eyeRightRef.current.scale.y = blinkScale;
      }
      if (blinkStateRef.current.timer > 0.3) {
        blinkStateRef.current.isBlinking = false;
      }
    } else if (eyeLeftRef.current && eyeRightRef.current) {
      eyeLeftRef.current.scale.y = 1;
      eyeRightRef.current.scale.y = 1;
    }

    // Enhanced speaking animation
    if (isSpeaking) {
      speakStateRef.current.phase += 0.3;
      speakStateRef.current.intensity = Math.min(1, speakStateRef.current.intensity + 0.1);
    } else {
      speakStateRef.current.intensity = Math.max(0, speakStateRef.current.intensity - 0.05);
    }

    if (mouthRef.current) {
      const speakScale = 1 + Math.sin(speakStateRef.current.phase) * 0.3 * speakStateRef.current.intensity;
      const mouthOpenness = 0.8 + speakStateRef.current.intensity * 0.4;
      mouthRef.current.scale.y = speakScale;
      mouthRef.current.scale.x = mouthOpenness;
    }

    // Emotion-based expressions
    emotionStateRef.current.target = getEmotionIntensity(emotion);
    emotionStateRef.current.intensity += (emotionStateRef.current.target - emotionStateRef.current.intensity) * 0.05;

    // Eyebrow animations based on emotion
    if (eyebrowLeftRef.current && eyebrowRightRef.current) {
      const eyebrowPosition = getEyebrowPosition(emotion, emotionStateRef.current.intensity);
      eyebrowLeftRef.current.position.y = 0.6 + eyebrowPosition.y;
      eyebrowRightRef.current.position.y = 0.6 + eyebrowPosition.y;
      eyebrowLeftRef.current.rotation.z = eyebrowPosition.rotation;
      eyebrowRightRef.current.rotation.z = -eyebrowPosition.rotation;
    }

    // Pupil movement (looking around)
    if (pupilLeftRef.current && pupilRightRef.current) {
      const lookDirection = getPupilDirection(emotion, time);
      pupilLeftRef.current.position.x = -0.3 + lookDirection.x * 0.05;
      pupilLeftRef.current.position.y = 0.2 + lookDirection.y * 0.05;
      pupilRightRef.current.position.x = 0.3 + lookDirection.x * 0.05;
      pupilRightRef.current.position.y = 0.2 + lookDirection.y * 0.05;
    }

    // Arm gestures
    if (leftArmRef.current && rightArmRef.current) {
      const armMovement = getArmGestures(emotion, isSpeaking, time);
      leftArmRef.current.rotation.z = armMovement.left;
      rightArmRef.current.rotation.z = armMovement.right;
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

  const emotionColors = useMemo(() => {
    return getEmotionColors(emotion);
  }, [emotion]);

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, -1.5, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshPhongMaterial 
          color={avatarColor} 
          transparent 
          opacity={0.9}
        />
      </mesh>

      {/* Main head */}
      <mesh ref={headRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial 
          color={avatarColor} 
          transparent 
          opacity={0.95}
        />
      </mesh>

      {/* Eyes */}
      <mesh ref={eyeLeftRef} position={[-0.35, 0.15, 0.8]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshPhongMaterial color="white" />
      </mesh>
      <mesh ref={eyeRightRef} position={[0.35, 0.15, 0.8]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshPhongMaterial color="white" />
      </mesh>

      {/* Pupils */}
      <mesh ref={pupilLeftRef} position={[-0.35, 0.15, 0.9]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhongMaterial color={emotionColors.pupil} />
      </mesh>
      <mesh ref={pupilRightRef} position={[0.35, 0.15, 0.9]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhongMaterial color={emotionColors.pupil} />
      </mesh>

      {/* Eyebrows */}
      <mesh ref={eyebrowLeftRef} position={[-0.35, 0.6, 0.8]}>
        <sphereGeometry args={[0.25, 8, 4]} />
        <meshPhongMaterial color="#4A5568" transparent opacity={0.8} />
      </mesh>
      <mesh ref={eyebrowRightRef} position={[0.35, 0.6, 0.8]}>
        <sphereGeometry args={[0.25, 8, 4]} />
        <meshPhongMaterial color="#4A5568" transparent opacity={0.8} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0, 0.9]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshPhongMaterial color={avatarColor} />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, -0.3, 0.8]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.25, 16, 8]} />
        <meshPhongMaterial 
          color={emotionColors.mouth} 
          transparent 
          opacity={0.8}
        />
      </mesh>

      {/* Arms */}
      <mesh ref={leftArmRef} position={[-1.2, -1, 0]} rotation={[0, 0, 0.3]}>
        <sphereGeometry args={[0.3, 8, 16]} />
        <meshPhongMaterial color={avatarColor} transparent opacity={0.9} />
      </mesh>
      <mesh ref={rightArmRef} position={[1.2, -1, 0]} rotation={[0, 0, -0.3]}>
        <sphereGeometry args={[0.3, 8, 16]} />
        <meshPhongMaterial color={avatarColor} transparent opacity={0.9} />
      </mesh>

      {/* Avatar name */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.3}
        color="#4A5568"
        anchorX="center"
        anchorY="middle"
      >
        {avatar.name}
      </Text>

      {/* Personality trait */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.15}
        color="#6B7280"
        anchorX="center"
        anchorY="middle"
        maxWidth={5}
      >
        {avatar.personality}
      </Text>

      {/* Emotion indicator */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.2}
        color={emotionColors.text}
        anchorX="center"
        anchorY="middle"
      >
        {getEmotionEmoji(emotion)}
      </Text>
    </group>
  );
};

// Helper functions for animations
const getEmotionIntensity = (emotion: string): number => {
  const intensities = {
    neutral: 0.5,
    happy: 1.0,
    concerned: 0.7,
    encouraging: 0.9,
    thoughtful: 0.6
  };
  return intensities[emotion as keyof typeof intensities] || 0.5;
};

const getEyebrowPosition = (emotion: string, intensity: number) => {
  const positions = {
    neutral: { y: 0, rotation: 0 },
    happy: { y: 0.1 * intensity, rotation: -0.1 * intensity },
    concerned: { y: -0.05 * intensity, rotation: 0.2 * intensity },
    encouraging: { y: 0.05 * intensity, rotation: -0.05 * intensity },
    thoughtful: { y: -0.02 * intensity, rotation: 0.1 * intensity }
  };
  return positions[emotion as keyof typeof positions] || positions.neutral;
};

const getPupilDirection = (emotion: string, time: number) => {
  const directions = {
    neutral: { x: Math.sin(time * 0.2) * 0.5, y: Math.cos(time * 0.15) * 0.3 },
    happy: { x: 0, y: 0.2 },
    concerned: { x: Math.sin(time * 0.1) * 0.8, y: -0.1 },
    encouraging: { x: 0, y: 0.1 },
    thoughtful: { x: Math.sin(time * 0.1) * 0.3, y: 0.3 }
  };
  return directions[emotion as keyof typeof directions] || directions.neutral;
};

const getArmGestures = (emotion: string, isSpeaking: boolean, time: number) => {
  const baseMovement = {
    neutral: { left: 0.3, right: -0.3 },
    happy: { left: 0.1, right: -0.1 },
    concerned: { left: 0.5, right: -0.5 },
    encouraging: { left: 0.2, right: -0.2 },
    thoughtful: { left: 0.4, right: -0.4 }
  };

  const base = baseMovement[emotion as keyof typeof baseMovement] || baseMovement.neutral;
  
  if (isSpeaking) {
    const gesture = Math.sin(time * 2) * 0.2;
    return {
      left: base.left + gesture,
      right: base.right - gesture
    };
  }
  
  return base;
};

const getEmotionColors = (emotion: string) => {
  const colors = {
    neutral: { mouth: "#4A5568", pupil: "#2D3748", text: "#4A5568" },
    happy: { mouth: "#F56565", pupil: "#2D3748", text: "#F6AD55" },
    concerned: { mouth: "#4A5568", pupil: "#2B6CB0", text: "#4299E1" },
    encouraging: { mouth: "#48BB78", pupil: "#2F855A", text: "#48BB78" },
    thoughtful: { mouth: "#805AD5", pupil: "#553C9A", text: "#805AD5" }
  };
  return colors[emotion as keyof typeof colors] || colors.neutral;
};

const getEmotionEmoji = (emotion: string): string => {
  const emojis = {
    neutral: "😐",
    happy: "😊",
    concerned: "😟",
    encouraging: "🌟",
    thoughtful: "🤔"
  };
  return emojis[emotion as keyof typeof emojis] || emojis.neutral;
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
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.4} />
        <spotLight position={[0, 10, 0]} intensity={0.3} angle={Math.PI / 6} />
        
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
