
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Group, MeshPhongMaterial, SphereGeometry, CylinderGeometry, BoxGeometry, Mesh, Vector3 } from 'three';
import { AvatarCharacter } from './AvatarSelector';

interface TherapyAvatar3DProps {
  avatar: AvatarCharacter;
  isActive: boolean;
  isSpeaking: boolean;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
}

const RealisticAvatarMesh: React.FC<{
  avatar: AvatarCharacter;
  isActive: boolean;
  isSpeaking: boolean;
  emotion: string;
}> = ({ avatar, isActive, isSpeaking, emotion }) => {
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Mesh>(null);
  const bodyRef = useRef<Mesh>(null);
  const leftArmRef = useRef<Mesh>(null);
  const rightArmRef = useRef<Mesh>(null);
  const leftLegRef = useRef<Mesh>(null);
  const rightLegRef = useRef<Mesh>(null);
  const eyeLeftRef = useRef<Mesh>(null);
  const eyeRightRef = useRef<Mesh>(null);
  const pupilLeftRef = useRef<Mesh>(null);
  const pupilRightRef = useRef<Mesh>(null);
  const mouthRef = useRef<Mesh>(null);
  const noseRef = useRef<Mesh>(null);
  const hairRef = useRef<Mesh>(null);

  // Animation state
  const emotionStateRef = useRef({ intensity: 0, target: 0 });
  const blinkStateRef = useRef({ timer: 0, isBlinking: false });
  const speakStateRef = useRef({ intensity: 0, phase: 0 });
  const walkStateRef = useRef({ phase: 0, isWalking: true });

  // Enhanced realistic animation system
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Gentle idle breathing motion
    const breathIntensity = Math.sin(time * 0.8) * 0.02;
    groupRef.current.position.y = breathIntensity;
    
    // Realistic body breathing
    if (bodyRef.current) {
      const breathScale = 1 + Math.sin(time * 0.6) * 0.015;
      bodyRef.current.scale.set(breathScale, 1, breathScale);
    }

    // Natural head movement patterns
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.3) * 0.08;
      headRef.current.rotation.x = Math.sin(time * 0.25) * 0.03;
      headRef.current.rotation.z = Math.sin(time * 0.2) * 0.02;
    }

    // Realistic blinking system
    blinkStateRef.current.timer += 0.016;
    if (blinkStateRef.current.timer > 2 + Math.random() * 3) {
      blinkStateRef.current.isBlinking = true;
      blinkStateRef.current.timer = 0;
    }

    if (blinkStateRef.current.isBlinking) {
      const blinkProgress = Math.sin(blinkStateRef.current.timer * 25);
      if (eyeLeftRef.current && eyeRightRef.current) {
        const blinkScale = Math.max(0.05, 1 - Math.abs(blinkProgress) * 0.95);
        eyeLeftRef.current.scale.y = blinkScale;
        eyeRightRef.current.scale.y = blinkScale;
      }
      if (blinkStateRef.current.timer > 0.25) {
        blinkStateRef.current.isBlinking = false;
      }
    } else if (eyeLeftRef.current && eyeRightRef.current) {
      eyeLeftRef.current.scale.y = 1;
      eyeRightRef.current.scale.y = 1;
    }

    // Enhanced speaking animation with jaw movement
    if (isSpeaking) {
      speakStateRef.current.phase += 0.4;
      speakStateRef.current.intensity = Math.min(1, speakStateRef.current.intensity + 0.15);
    } else {
      speakStateRef.current.intensity = Math.max(0, speakStateRef.current.intensity - 0.08);
    }

    if (mouthRef.current) {
      const speakScale = 1 + Math.sin(speakStateRef.current.phase) * 0.4 * speakStateRef.current.intensity;
      const jawDrop = speakStateRef.current.intensity * 0.05;
      mouthRef.current.scale.y = speakScale;
      mouthRef.current.position.y = 1.45 - jawDrop; // Fixed: keep mouth on the face
    }

    // Emotion-based expressions
    emotionStateRef.current.target = getEmotionIntensity(emotion);
    emotionStateRef.current.intensity += (emotionStateRef.current.target - emotionStateRef.current.intensity) * 0.08;

    // Realistic eye tracking and pupil movement
    if (pupilLeftRef.current && pupilRightRef.current) {
      const lookDirection = getRealisticPupilDirection(emotion, time);
      pupilLeftRef.current.position.x = -0.25 + lookDirection.x * 0.03;
      pupilLeftRef.current.position.y = 1.75 + lookDirection.y * 0.03;
      pupilRightRef.current.position.x = 0.25 + lookDirection.x * 0.03;
      pupilRightRef.current.position.y = 1.75 + lookDirection.y * 0.03;
    }

    // Realistic arm and leg movement (subtle idle animation)
    walkStateRef.current.phase += 0.02;
    
    if (leftArmRef.current && rightArmRef.current) {
      const armSwing = Math.sin(walkStateRef.current.phase) * 0.1;
      leftArmRef.current.rotation.x = armSwing;
      rightArmRef.current.rotation.x = -armSwing;
      
      // Speaking gestures
      if (isSpeaking) {
        const gestureIntensity = Math.sin(time * 3) * 0.15;
        rightArmRef.current.rotation.z = -0.2 + gestureIntensity;
      }
    }

    if (leftLegRef.current && rightLegRef.current) {
      const legShift = Math.sin(walkStateRef.current.phase * 0.5) * 0.03;
      leftLegRef.current.rotation.x = legShift;
      rightLegRef.current.rotation.x = -legShift;
    }

    // Hair movement
    if (hairRef.current) {
      hairRef.current.rotation.x = Math.sin(time * 0.4) * 0.02;
    }
  });

  // Realistic skin tone and colors
  const avatarColors = useMemo(() => {
    const baseColors = {
      therapist: avatar.skinTone || '#D2B48C',
      grandma: avatar.skinTone || '#F4C2A1',
      grandpa: avatar.skinTone || '#DEB887',
      aunt: avatar.skinTone || '#CD853F',
      uncle: avatar.skinTone || '#8B4513',
      sibling: avatar.skinTone || '#F5DEB3',
      teacher: avatar.skinTone || '#E6B87D',
      friend: avatar.skinTone || '#DDA0DD'
    };
    return {
      skin: baseColors[avatar.type] || avatar.skinTone || '#D2B48C',
      hair: getHairColor(avatar.type),
      clothing: getClothingColor(avatar.type)
    };
  }, [avatar.type, avatar.skinTone]);

  const emotionColors = useMemo(() => {
    return getEmotionColors(emotion);
  }, [emotion]);

  return (
    <group ref={groupRef} scale={[0.8, 0.8, 0.8]}>
      {/* Realistic Body Structure */}
      
      {/* Head - more proportional and detailed */}
      <mesh ref={headRef} position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshPhongMaterial 
          color={avatarColors.skin} 
          transparent 
          opacity={0.98}
          shininess={30}
        />
      </mesh>

      {/* Hair */}
      <mesh ref={hairRef} position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.65, 16, 16]} />
        <meshPhongMaterial 
          color={avatarColors.hair} 
          transparent 
          opacity={0.9}
        />
      </mesh>

      {/* Eyes - more realistic positioning */}
      <mesh ref={eyeLeftRef} position={[-0.25, 1.75, 0.55]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshPhongMaterial color="white" />
      </mesh>
      <mesh ref={eyeRightRef} position={[0.25, 1.75, 0.55]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshPhongMaterial color="white" />
      </mesh>

      {/* Pupils */}
      <mesh ref={pupilLeftRef} position={[-0.25, 1.75, 0.62]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshPhongMaterial color={emotionColors.pupil} />
      </mesh>
      <mesh ref={pupilRightRef} position={[0.25, 1.75, 0.62]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshPhongMaterial color={emotionColors.pupil} />
      </mesh>

      {/* Nose - more realistic */}
      <mesh ref={noseRef} position={[0, 1.6, 0.58]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshPhongMaterial color={avatarColors.skin} />
      </mesh>

      {/* Mouth - properly positioned on the face */}
      <mesh ref={mouthRef} position={[0, 1.45, 0.55]}>
        <sphereGeometry args={[0.15, 16, 8]} />
        <meshPhongMaterial 
          color={emotionColors.mouth} 
          transparent 
          opacity={0.8}
        />
      </mesh>

      {/* Torso - more realistic proportions */}
      <mesh ref={bodyRef} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 1.2, 16]} />
        <meshPhongMaterial 
          color={avatarColors.clothing} 
          transparent 
          opacity={0.95}
        />
      </mesh>

      {/* Arms - more realistic */}
      <mesh ref={leftArmRef} position={[-0.7, 0.8, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.12, 0.15, 1, 8]} />
        <meshPhongMaterial color={avatarColors.skin} transparent opacity={0.95} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.7, 0.8, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.12, 0.15, 1, 8]} />
        <meshPhongMaterial color={avatarColors.skin} transparent opacity={0.95} />
      </mesh>

      {/* Hands */}
      <mesh position={[-0.7, 0.2, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshPhongMaterial color={avatarColors.skin} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0.7, 0.2, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshPhongMaterial color={avatarColors.skin} transparent opacity={0.95} />
      </mesh>

      {/* Legs - more realistic */}
      <mesh ref={leftLegRef} position={[-0.25, -0.6, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 1.2, 8]} />
        <meshPhongMaterial color={avatarColors.clothing} transparent opacity={0.9} />
      </mesh>
      <mesh ref={rightLegRef} position={[0.25, -0.6, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 1.2, 8]} />
        <meshPhongMaterial color={avatarColors.clothing} transparent opacity={0.9} />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.25, -1.3, 0.1]}>
        <boxGeometry args={[0.2, 0.1, 0.3]} />
        <meshPhongMaterial color="#654321" />
      </mesh>
      <mesh position={[0.25, -1.3, 0.1]}>
        <boxGeometry args={[0.2, 0.1, 0.3]} />
        <meshPhongMaterial color="#654321" />
      </mesh>

      {/* Avatar name */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.25}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {avatar.name}
      </Text>

      {/* Emotion indicator */}
      <Text
        position={[0, 2.8, 0]}
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

// Helper functions for realistic avatars
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

const getRealisticPupilDirection = (emotion: string, time: number) => {
  const directions = {
    neutral: { x: Math.sin(time * 0.15) * 0.3, y: Math.cos(time * 0.1) * 0.2 },
    happy: { x: 0, y: 0.1 },
    concerned: { x: Math.sin(time * 0.08) * 0.4, y: -0.05 },
    encouraging: { x: Math.sin(time * 0.12) * 0.2, y: 0.05 },
    thoughtful: { x: Math.sin(time * 0.05) * 0.2, y: 0.15 }
  };
  return directions[emotion as keyof typeof directions] || directions.neutral;
};

const getHairColor = (type: string): string => {
  const hairColors = {
    therapist: '#8B4513',
    grandma: '#D3D3D3',
    grandpa: '#A9A9A9',
    aunt: '#654321',
    uncle: '#2F1B14',
    sibling: '#8B4513',
    teacher: '#654321',
    friend: '#D2691E'
  };
  return hairColors[type as keyof typeof hairColors] || '#8B4513';
};

const getClothingColor = (type: string): string => {
  const clothingColors = {
    therapist: '#4682B4',
    grandma: '#DDA0DD',
    grandpa: '#708090',
    aunt: '#CD853F',
    uncle: '#2F4F4F',
    sibling: '#FF6347',
    teacher: '#9370DB',
    friend: '#20B2AA'
  };
  return clothingColors[type as keyof typeof clothingColors] || '#4682B4';
};

const getEmotionColors = (emotion: string) => {
  const colors = {
    neutral: { mouth: "#CD5C5C", pupil: "#2F4F4F", text: "#FFFFFF" },
    happy: { mouth: "#FF69B4", pupil: "#228B22", text: "#FFD700" },
    concerned: { mouth: "#4682B4", pupil: "#191970", text: "#87CEEB" },
    encouraging: { mouth: "#32CD32", pupil: "#006400", text: "#98FB98" },
    thoughtful: { mouth: "#9370DB", pupil: "#4B0082", text: "#DDA0DD" }
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
    <div className="w-full h-64 bg-gradient-to-br from-blue-50/20 to-purple-50/20 rounded-lg overflow-hidden backdrop-blur-sm">
      <Canvas
        camera={{ position: [0, 1, 4], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <pointLight position={[0, 5, 2]} intensity={0.4} color="#ffffff" />
        <spotLight position={[5, 5, 5]} intensity={0.3} angle={Math.PI / 4} />
        
        <RealisticAvatarMesh
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
