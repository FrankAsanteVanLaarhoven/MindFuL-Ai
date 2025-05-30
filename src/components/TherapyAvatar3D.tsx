
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

const RealisticHumanAvatar: React.FC<{
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
  const eyebrowLeftRef = useRef<Mesh>(null);
  const eyebrowRightRef = useRef<Mesh>(null);

  // Animation state
  const emotionStateRef = useRef({ intensity: 0, target: 0 });
  const blinkStateRef = useRef({ timer: 0, isBlinking: false });
  const speakStateRef = useRef({ intensity: 0, phase: 0 });
  const walkStateRef = useRef({ phase: 0, isWalking: true });

  // Realistic human proportions and colors - moved and simplified
  const avatarColors = useMemo(() => {
    const skinTones: Record<string, string> = {
      therapist: '#F4C2A1',
      grandma: '#E8B887',
      grandpa: '#D2B48C',
      aunt: '#CD853F',
      uncle: '#8B7355',
      sibling: '#F5DEB3',
      teacher: '#DEB887',
      friend: '#DDBEA9'
    };
    
    const hairColors: Record<string, string> = {
      therapist: '#8B4513',
      grandma: '#C0C0C0',
      grandpa: '#808080',
      aunt: '#654321',
      uncle: '#2F1B14',
      sibling: '#8B4513',
      teacher: '#654321',
      friend: '#D2691E'
    };
    
    const clothingColors: Record<string, string> = {
      therapist: '#4682B4',
      grandma: '#DDA0DD',
      grandpa: '#708090',
      aunt: '#CD853F',
      uncle: '#2F4F4F',
      sibling: '#FF6347',
      teacher: '#9370DB',
      friend: '#20B2AA'
    };
    
    const eyeColors: Record<string, string> = {
      therapist: '#8B4513',
      grandma: '#4682B4',
      grandpa: '#808080',
      aunt: '#228B22',
      uncle: '#2F4F4F',
      sibling: '#8B4513',
      teacher: '#4B0082',
      friend: '#20B2AA'
    };

    return {
      skin: skinTones[avatar.type] || avatar.skinTone || '#F4C2A1',
      hair: hairColors[avatar.type] || '#8B4513',
      clothing: clothingColors[avatar.type] || '#4682B4',
      eyeColor: eyeColors[avatar.type] || '#8B4513'
    };
  }, [avatar.type, avatar.skinTone]);

  const emotionColors = useMemo(() => {
    const colors = {
      neutral: { mouth: "#CD5C5C", text: "#FFFFFF" },
      happy: { mouth: "#FF69B4", text: "#FFD700" },
      concerned: { mouth: "#4682B4", text: "#87CEEB" },
      encouraging: { mouth: "#32CD32", text: "#98FB98" },
      thoughtful: { mouth: "#9370DB", text: "#DDA0DD" }
    };
    return colors[emotion as keyof typeof colors] || colors.neutral;
  }, [emotion]);

  // Enhanced realistic animation system
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Natural breathing motion - more subtle
    const breathIntensity = Math.sin(time * 0.6) * 0.015;
    groupRef.current.position.y = breathIntensity;
    
    // Realistic chest breathing
    if (bodyRef.current) {
      const breathScale = 1 + Math.sin(time * 0.5) * 0.01;
      bodyRef.current.scale.set(breathScale, 1, breathScale);
    }

    // Natural head movement - very subtle
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.2) * 0.05;
      headRef.current.rotation.x = Math.sin(time * 0.15) * 0.02;
      headRef.current.rotation.z = Math.sin(time * 0.1) * 0.01;
    }

    // Realistic blinking system - natural timing
    blinkStateRef.current.timer += 0.016;
    if (blinkStateRef.current.timer > 2.5 + Math.random() * 4) {
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

    // Enhanced speaking with natural mouth movement
    if (isSpeaking) {
      speakStateRef.current.phase += 0.3;
      speakStateRef.current.intensity = Math.min(1, speakStateRef.current.intensity + 0.1);
    } else {
      speakStateRef.current.intensity = Math.max(0, speakStateRef.current.intensity - 0.05);
    }

    if (mouthRef.current) {
      const speakScale = 1 + Math.sin(speakStateRef.current.phase) * 0.3 * speakStateRef.current.intensity;
      const jawDrop = speakStateRef.current.intensity * 0.03;
      mouthRef.current.scale.set(speakScale, 1 + speakStateRef.current.intensity * 0.2, 1);
      mouthRef.current.position.y = 1.3 - jawDrop;
    }

    // Emotion-based expressions
    emotionStateRef.current.target = getEmotionIntensity(emotion);
    emotionStateRef.current.intensity += (emotionStateRef.current.target - emotionStateRef.current.intensity) * 0.05;

    // Realistic eye movement and pupil tracking
    if (pupilLeftRef.current && pupilRightRef.current) {
      const lookDirection = getRealisticPupilDirection(emotion, time);
      pupilLeftRef.current.position.x = -0.2 + lookDirection.x * 0.02;
      pupilLeftRef.current.position.y = 1.65 + lookDirection.y * 0.02;
      pupilRightRef.current.position.x = 0.2 + lookDirection.x * 0.02;
      pupilRightRef.current.position.y = 1.65 + lookDirection.y * 0.02;
    }

    // Natural arm movement - subtle idle gestures
    walkStateRef.current.phase += 0.015;
    
    if (leftArmRef.current && rightArmRef.current) {
      const armSwing = Math.sin(walkStateRef.current.phase) * 0.08;
      leftArmRef.current.rotation.x = armSwing;
      rightArmRef.current.rotation.x = -armSwing;
      
      // Speaking gestures - more natural
      if (isSpeaking) {
        const gestureIntensity = Math.sin(time * 2.5) * 0.1;
        rightArmRef.current.rotation.z = -0.15 + gestureIntensity;
        leftArmRef.current.rotation.z = 0.05 + gestureIntensity * 0.5;
      }
    }

    // Subtle leg weight shifting
    if (leftLegRef.current && rightLegRef.current) {
      const legShift = Math.sin(walkStateRef.current.phase * 0.3) * 0.02;
      leftLegRef.current.rotation.x = legShift;
      rightLegRef.current.rotation.x = -legShift;
    }

    // Natural hair movement
    if (hairRef.current) {
      hairRef.current.rotation.x = Math.sin(time * 0.3) * 0.015;
      hairRef.current.rotation.z = Math.sin(time * 0.25) * 0.01;
    }

    // Eyebrow movement based on emotion
    if (eyebrowLeftRef.current && eyebrowRightRef.current) {
      const eyebrowRaise = getEmotionEyebrowPosition(emotion, time);
      eyebrowLeftRef.current.position.y = 1.8 + eyebrowRaise;
      eyebrowRightRef.current.position.y = 1.8 + eyebrowRaise;
    }
  });

  return (
    <group ref={groupRef} scale={[0.9, 0.9, 0.9]}>
      
      {/* More realistic head with proper proportions */}
      <mesh ref={headRef} position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhongMaterial 
          color={avatarColors.skin} 
          transparent 
          opacity={0.98}
          shininess={20}
        />
      </mesh>

      {/* Realistic hair with proper volume */}
      <mesh ref={hairRef} position={[0, 1.9, -0.1]}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshPhongMaterial 
          color={avatarColors.hair} 
          transparent 
          opacity={0.95}
        />
      </mesh>

      {/* Properly sized and positioned eyes */}
      <mesh ref={eyeLeftRef} position={[-0.2, 1.65, 0.45]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhongMaterial color="white" />
      </mesh>
      <mesh ref={eyeRightRef} position={[0.2, 1.65, 0.45]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhongMaterial color="white" />
      </mesh>

      {/* Realistic pupils with color variation */}
      <mesh ref={pupilLeftRef} position={[-0.2, 1.65, 0.5]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshPhongMaterial color={avatarColors.eyeColor} />
      </mesh>
      <mesh ref={pupilRightRef} position={[0.2, 1.65, 0.5]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshPhongMaterial color={avatarColors.eyeColor} />
      </mesh>

      {/* Eyebrows for more expression */}
      <mesh ref={eyebrowLeftRef} position={[-0.2, 1.8, 0.4]}>
        <boxGeometry args={[0.15, 0.02, 0.05]} />
        <meshPhongMaterial color={avatarColors.hair} />
      </mesh>
      <mesh ref={eyebrowRightRef} position={[0.2, 1.8, 0.4]}>
        <boxGeometry args={[0.15, 0.02, 0.05]} />
        <meshPhongMaterial color={avatarColors.hair} />
      </mesh>

      {/* More realistic nose */}
      <mesh ref={noseRef} position={[0, 1.5, 0.48]}>
        <boxGeometry args={[0.05, 0.08, 0.06]} />
        <meshPhongMaterial color={avatarColors.skin} />
      </mesh>

      {/* Properly positioned mouth on the face */}
      <mesh ref={mouthRef} position={[0, 1.3, 0.45]}>
        <sphereGeometry args={[0.08, 16, 8]} />
        <meshPhongMaterial 
          color={emotionColors.mouth} 
          transparent 
          opacity={0.9}
        />
      </mesh>

      {/* More realistic torso with proper proportions */}
      <mesh ref={bodyRef} position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 1, 16]} />
        <meshPhongMaterial 
          color={avatarColors.clothing} 
          transparent 
          opacity={0.95}
        />
      </mesh>

      {/* Neck connection */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.2, 8]} />
        <meshPhongMaterial color={avatarColors.skin} transparent opacity={0.95} />
      </mesh>

      {/* More proportional arms */}
      <mesh ref={leftArmRef} position={[-0.6, 0.9, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.08, 0.1, 0.8, 8]} />
        <meshPhongMaterial color={avatarColors.skin} transparent opacity={0.95} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.6, 0.9, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.08, 0.1, 0.8, 8]} />
        <meshPhongMaterial color={avatarColors.skin} transparent opacity={0.95} />
      </mesh>

      {/* Realistic hands */}
      <mesh position={[-0.6, 0.4, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshPhongMaterial color={avatarColors.skin} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0.6, 0.4, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshPhongMaterial color={avatarColors.skin} transparent opacity={0.95} />
      </mesh>

      {/* More realistic legs */}
      <mesh ref={leftLegRef} position={[-0.2, -0.4, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 1, 8]} />
        <meshPhongMaterial color={avatarColors.clothing} transparent opacity={0.9} />
      </mesh>
      <mesh ref={rightLegRef} position={[0.2, -0.4, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 1, 8]} />
        <meshPhongMaterial color={avatarColors.clothing} transparent opacity={0.9} />
      </mesh>

      {/* Realistic feet/shoes */}
      <mesh position={[-0.2, -1, 0.08]}>
        <boxGeometry args={[0.15, 0.08, 0.25]} />
        <meshPhongMaterial color="#2C1810" />
      </mesh>
      <mesh position={[0.2, -1, 0.08]}>
        <boxGeometry args={[0.15, 0.08, 0.25]} />
        <meshPhongMaterial color="#2C1810" />
      </mesh>

      {/* Avatar name */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.2}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {avatar.name}
      </Text>

      {/* Emotion indicator */}
      <Text
        position={[0, 2.6, 0]}
        fontSize={0.15}
        color={emotionColors.text}
        anchorX="center"
        anchorY="middle"
      >
        {getEmotionEmoji(emotion)}
      </Text>
    </group>
  );
};

// Enhanced helper functions for realistic avatars
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
    neutral: { x: Math.sin(time * 0.1) * 0.2, y: Math.cos(time * 0.08) * 0.15 },
    happy: { x: 0, y: 0.05 },
    concerned: { x: Math.sin(time * 0.06) * 0.3, y: -0.02 },
    encouraging: { x: Math.sin(time * 0.09) * 0.15, y: 0.03 },
    thoughtful: { x: Math.sin(time * 0.04) * 0.15, y: 0.1 }
  };
  return directions[emotion as keyof typeof directions] || directions.neutral;
};

const getEmotionEyebrowPosition = (emotion: string, time: number): number => {
  const positions = {
    neutral: 0,
    happy: 0.02,
    concerned: 0.05 + Math.sin(time * 2) * 0.01,
    encouraging: 0.03,
    thoughtful: 0.04
  };
  return positions[emotion as keyof typeof positions] || 0;
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
        camera={{ position: [0, 1, 3.5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[8, 8, 5]} intensity={0.8} />
        <directionalLight position={[-8, -8, -5]} intensity={0.4} />
        <pointLight position={[0, 4, 2]} intensity={0.5} color="#ffffff" />
        <spotLight position={[3, 3, 3]} intensity={0.4} angle={Math.PI / 6} />
        
        <RealisticHumanAvatar
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
