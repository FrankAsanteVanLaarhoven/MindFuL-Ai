
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from 'three';

interface BreathingCoachProps {
  phase: string;
}

function BreathingCoach({ phase }: BreathingCoachProps) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (mesh.current) {
      const scale =
        phase === "inhale" ? 1.2 : phase === "exhale" ? 0.8 : 1;
      mesh.current.scale.set(scale, scale, scale);
    }
  });
  return (
    <mesh ref={mesh} position={[0, 1, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#7ec8e3" />
    </mesh>
  );
}

interface BreathingSceneProps {
  phase: string;
}

export default function BreathingScene({ phase }: BreathingSceneProps) {
  return (
    <Canvas style={{ width: "100%", height: "100%" }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <BreathingCoach phase={phase} />
    </Canvas>
  );
}
