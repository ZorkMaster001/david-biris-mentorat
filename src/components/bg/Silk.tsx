"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/*
  Doua unde sinusoidale suprapuse, una taiata de cealalta, dau dungile care se
  indoaie una peste alta ca matasea. `noise` e un zgomot ieftin din frecventa
  pixelului, nu o textura: rupe benzile de culoare care s-ar vedea altfel pe un
  degrade atat de lent.
*/
const FRAGMENT_SHADER = /* glsl */ `
  varying vec2 vUv;

  uniform float uTime;
  uniform vec3 uColor;
  uniform float uSpeed;
  uniform float uScale;
  uniform float uRotation;
  uniform float uNoiseIntensity;

  const float e = 2.71828182845904523536;

  float noise(vec2 texCoord) {
    float G = e;
    vec2 r = (G * sin(G * texCoord));
    return fract(r.x * r.y * (1.0 + texCoord.x));
  }

  vec2 rotateUvs(vec2 uv, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    mat2 rot = mat2(c, -s, s, c);
    return rot * uv;
  }

  void main() {
    float rnd = noise(gl_FragCoord.xy);
    vec2 uv = rotateUvs(vUv * uScale, uRotation);
    vec2 tex = uv * uScale;
    float tOffset = uSpeed * uTime;

    tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

    float pattern = 0.6 +
      0.4 * sin(5.0 * (tex.x + tex.y +
                       cos(3.0 * tex.x + 5.0 * tex.y) +
                       0.02 * tOffset) +
                sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

    vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
    col.a = 1.0;
    gl_FragColor = col;
  }
`;

export interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
}

/** Uniformele scenei, tipate ca sa nu fie nevoie de o verificare la fiecare acces. */
interface SilkUniforms {
  // `ShaderMaterial.uniforms` e indexat pe string; fara semnatura asta tipul nostru,
  // mai strict, nu i se potriveste.
  [uniform: string]: THREE.IUniform;
  uTime: THREE.IUniform<number>;
  uColor: THREE.IUniform<THREE.Color>;
  uSpeed: THREE.IUniform<number>;
  uScale: THREE.IUniform<number>;
  uRotation: THREE.IUniform<number>;
  uNoiseIntensity: THREE.IUniform<number>;
}

type SilkMaterial = THREE.ShaderMaterial & { uniforms: SilkUniforms };

function SilkPlane({ speed, scale, color, noiseIntensity, rotation }: Required<SilkProps>) {
  const material = useRef<SilkMaterial>(null);
  const { viewport } = useThree();

  /*
    Obiectul se construieste o singura data si de aici incolo materialul e cel care
    il detine: mai jos se scrie prin `material.current.uniforms`, nu prin variabila
    asta. Un obiect nou la fiecare randare ar inlocui uniformele si ar readuce
    `uTime` la zero, adica animatia ar sari inapoi la fiecare redimensionare.
  */
  const initialUniforms = useMemo<SilkUniforms>(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uRotation: { value: rotation },
      uNoiseIntensity: { value: noiseIntensity },
    }),
    // Doar valorile de pornire; sincronizarea ulterioara e in efectul de mai jos.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useLayoutEffect(() => {
    if (!material.current) return;
    material.current.uniforms.uColor.value.set(color);
    material.current.uniforms.uSpeed.value = speed;
    material.current.uniforms.uScale.value = scale;
    material.current.uniforms.uRotation.value = rotation;
    material.current.uniforms.uNoiseIntensity.value = noiseIntensity;
  }, [color, speed, scale, rotation, noiseIntensity]);

  useFrame((_, delta) => {
    if (material.current) material.current.uniforms.uTime.value += 0.1 * delta;
  });

  return (
    // Planul acopera exact cadrul camerei, deci nu conteaza raportul ferestrei.
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={material}
        uniforms={initialUniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
      />
    </mesh>
  );
}

export default function Silk({
  speed = 5,
  scale = 1,
  color = "#94b8b7",
  noiseIntensity = 1.5,
  rotation = 0,
}: SilkProps) {
  return (
    <Canvas
      // E un fundal difuz: la dpr 1 arata la fel si costa un sfert pe un ecran retina.
      dpr={1}
      gl={{ antialias: false, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 1] }}
    >
      <SilkPlane
        speed={speed}
        scale={scale}
        color={color}
        noiseIntensity={noiseIntensity}
        rotation={rotation}
      />
    </Canvas>
  );
}
