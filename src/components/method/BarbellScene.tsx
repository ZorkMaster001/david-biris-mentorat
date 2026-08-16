"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import type * as THREE from "three";
import type { Pillar } from "@/content/types";

const BAR_LENGTH = 7;
const PLATE_RADIUS = 0.85;
const PLATE_THICKNESS = 0.16;
const LERP = 0.09;
const SETTLED = 0.004;
const DRAG_SENSITIVITY = 0.006;
const SPIN_FRICTION = 0.94;

/** Discurile se monteaza alternand stanga/dreapta, deci bara ramane echilibrata la final. */
function plateTargetX(index: number): number {
  const side = index % 2 === 0 ? 1 : -1;
  const slot = Math.floor(index / 2);
  return side * (0.95 + slot * 0.34);
}

function plateStartX(index: number): number {
  return (index % 2 === 0 ? 1 : -1) * 5.5;
}

interface BarbellProps {
  pillars: Pillar[];
  mountedCount: number;
  spinRef: React.RefObject<number>;
  invalidateRef: React.RefObject<(() => void) | null>;
}

function Barbell({ pillars, mountedCount, spinRef, invalidateRef }: BarbellProps) {
  const group = useRef<THREE.Group>(null);
  const plates = useRef<(THREE.Mesh | null)[]>([]);
  const rotation = useRef(0);
  const { invalidate } = useThree();

  // Expus in sus ca handler-ul de drag, care traieste in afara Canvas-ului, sa poata
  // trezi bucla adormita de frameloop="demand".
  useEffect(() => {
    invalidateRef.current = invalidate;
    return () => {
      invalidateRef.current = null;
    };
  }, [invalidate, invalidateRef]);

  useFrame(() => {
    let moving = false;

    plates.current.forEach((plate, index) => {
      if (!plate) return;
      const mounted = index < mountedCount;
      const target = mounted ? plateTargetX(index) : plateStartX(index);
      plate.position.x += (target - plate.position.x) * LERP;

      const material = plate.material as THREE.MeshStandardMaterial;
      const targetOpacity = mounted ? 1 : 0;
      material.opacity += (targetOpacity - material.opacity) * LERP;
      // Discul intra incins si se raceste: marcheaza montarea fara un efect separat.
      if (mounted) material.emissiveIntensity += (0 - material.emissiveIntensity) * 0.05;

      if (
        Math.abs(target - plate.position.x) > SETTLED ||
        Math.abs(targetOpacity - material.opacity) > SETTLED ||
        (mounted && material.emissiveIntensity > 0.01)
      ) {
        moving = true;
      }
    });

    if (group.current) {
      rotation.current += spinRef.current;
      spinRef.current *= SPIN_FRICTION;
      group.current.rotation.y = rotation.current;
      if (Math.abs(spinRef.current) > 0.0004) moving = true;
    }

    // Cu frameloop="demand" bucla doarme; o tinem treaza doar cat ceva chiar se misca.
    if (moving) invalidate();
  });

  return (
    <group ref={group}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, BAR_LENGTH, 16]} />
        <meshStandardMaterial color="#8a8a8f" metalness={0.85} roughness={0.3} />
      </mesh>

      {pillars.map((pillar, index) => (
        <mesh
          key={pillar.id}
          ref={(element) => {
            plates.current[index] = element;
          }}
          position={[plateStartX(index), 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[PLATE_RADIUS, PLATE_RADIUS, PLATE_THICKNESS, 32]} />
          <meshStandardMaterial
            color="#141416"
            emissive="#ff5c1a"
            emissiveIntensity={1}
            metalness={0.6}
            roughness={0.45}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function BarbellScene({
  pillars,
  mountedCount,
}: {
  pillars: Pillar[];
  mountedCount: number;
}) {
  const spinRef = useRef(0);
  const invalidateRef = useRef<(() => void) | null>(null);
  const dragging = useRef(false);

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    spinRef.current += event.movementX * DRAG_SENSITIVITY;
    invalidateRef.current?.();
  }, []);

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  return (
    <div
      className="h-full w-full touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <Canvas
        dpr={[1, 2]}
        frameloop="demand"
        camera={{ position: [0, 0.7, 7.5], fov: 35 }}
        gl={{ antialias: true, powerPreference: "low-power" }}
        // Scena e ilustrativa; continutul real e textul pilonilor de alaturi.
        aria-hidden="true"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} />
        <Barbell
          pillars={pillars}
          mountedCount={mountedCount}
          spinRef={spinRef}
          invalidateRef={invalidateRef}
        />
      </Canvas>
    </div>
  );
}
