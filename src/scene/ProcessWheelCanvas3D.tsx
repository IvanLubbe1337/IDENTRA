import { Component, Suspense, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Html, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { PROCESS_PILLARS } from '@/data/identityProcessData';
import { IdentraMark } from '@/components/ui/Primitives';
import { useSceneStore } from '@/store/useSceneStore';
import { cn } from '@/lib/cn';

class WheelErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#F8FAFC] text-sm text-slate-500">
          Identity Process++ 3D Wheel
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Clean 3D Identity Process++ Circular Wheel on a luminous white studio canvas.
 * Responsively scaled to viewport width so station pills never clip the edges.
 */
function ProcessWheelScene() {
  const wheelRef = useRef<THREE.Group>(null);
  const trackDotsRef = useRef<THREE.InstancedMesh>(null);
  const innerDotsRef = useRef<THREE.InstancedMesh>(null);
  const viewport = useThree((s) => s.viewport);

  const activePillarId = useSceneStore((s) => s.activePillarId);
  const setActivePillarId = useSceneStore((s) => s.setActivePillarId);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  const activeIndex = Math.max(
    0,
    PROCESS_PILLARS.findIndex((p) => p.id === activePillarId)
  );
  const activePillar = PROCESS_PILLARS[activeIndex];

  const outerDotCount = 96;
  const innerDotCount = 42;
  const radius = 1.88;
  const responsiveScale = Math.min(1, Math.max(0.74, viewport.width / 6.0));

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    if (wheelRef.current) {
      const targetAngle = -(activeIndex / PROCESS_PILLARS.length) * Math.PI * 2;
      wheelRef.current.rotation.z = THREE.MathUtils.damp(
        wheelRef.current.rotation.z,
        targetAngle,
        4.5,
        dt
      );
      wheelRef.current.rotation.x = THREE.MathUtils.damp(
        wheelRef.current.rotation.x,
        0.42 + state.pointer.y * 0.06,
        4,
        dt
      );
      wheelRef.current.rotation.y = THREE.MathUtils.damp(
        wheelRef.current.rotation.y,
        state.pointer.x * 0.09,
        4,
        dt
      );
    }

    if (trackDotsRef.current) {
      for (let i = 0; i < outerDotCount; i++) {
        const angle = (i / outerDotCount) * Math.PI * 2;
        const pulse = 0.65 + 0.45 * Math.sin(angle * 2 - t * 2.4);
        dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        dummy.scale.setScalar(0.024 * pulse);
        dummy.updateMatrix();
        trackDotsRef.current.setMatrixAt(i, dummy.matrix);

        colorObj.set(i % 3 === 0 ? activePillar.accent : '#94A3B8');
        trackDotsRef.current.setColorAt(i, colorObj);
      }
      trackDotsRef.current.instanceMatrix.needsUpdate = true;
      if (trackDotsRef.current.instanceColor) {
        trackDotsRef.current.instanceColor.needsUpdate = true;
      }
    }

    if (innerDotsRef.current) {
      innerDotsRef.current.rotation.z = -t * 0.25;
      for (let i = 0; i < innerDotCount; i++) {
        const angle = (i / innerDotCount) * Math.PI * 2;
        dummy.position.set(Math.cos(angle) * 1.04, Math.sin(angle) * 1.04, 0.04);
        dummy.scale.setScalar(0.019);
        dummy.updateMatrix();
        innerDotsRef.current.setMatrixAt(i, dummy.matrix);
      }
      innerDotsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group scale={responsiveScale} position={[0, -0.08, 0]}>
      <group ref={wheelRef} rotation={[0.42, 0, 0]}>
        <instancedMesh ref={trackDotsRef} args={[undefined, undefined, outerDotCount]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial />
        </instancedMesh>

        <instancedMesh ref={innerDotsRef} args={[undefined, undefined, innerDotCount]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#0EA5E9" transparent opacity={0.75} />
        </instancedMesh>

        <mesh>
          <torusGeometry args={[radius, 0.014, 14, 96]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.2} />
        </mesh>

        {PROCESS_PILLARS.map((pillar, idx) => {
          const angle = Math.PI / 2 + (idx / PROCESS_PILLARS.length) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const isSelected = pillar.id === activePillarId;

          return (
            <group key={pillar.id} position={[x, y, isSelected ? 0.22 : 0.04]}>
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePillarId(pillar.id);
                }}
              >
                <cylinderGeometry args={[0.21, 0.21, 0.13, 32]} />
                <meshPhysicalMaterial
                  color={isSelected ? pillar.accent : '#FFFFFF'}
                  roughness={0.18}
                  metalness={0.15}
                  clearcoat={1}
                />
              </mesh>

              <mesh
                position={[-x * 0.25, -y * 0.25, -0.05]}
                rotation={[0, 0, angle]}
              >
                <boxGeometry args={[radius * 0.42, 0.012, 0.012]} />
                <meshBasicMaterial
                  color={isSelected ? pillar.accent : '#CBD5E1'}
                  transparent
                  opacity={isSelected ? 0.9 : 0.45}
                />
              </mesh>

              <Html center position={[0, 0, 0.2]} zIndexRange={[10, 0]}>
                <button
                  type="button"
                  onClick={() => setActivePillarId(pillar.id)}
                  className={cn(
                    'cursor-pointer whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold transition-all',
                    isSelected
                      ? 'scale-105 border-[#0EA5E9] bg-[#0F172A] text-white shadow-lg'
                      : 'border-slate-200 bg-white/95 text-slate-700 shadow-sm hover:border-[#0EA5E9]'
                  )}
                >
                  {pillar.index} · {pillar.shortTitle}
                </button>
              </Html>
            </group>
          );
        })}
      </group>

      {/* Stationary Center IDENTRA Emblem */}
      <group position={[0, 0, 0.12]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.74, 0.74, 0.13, 48]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            roughness={0.14}
            metalness={0.08}
            clearcoat={1}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[0.76, 0.02, 16, 64]} />
          <meshStandardMaterial
            color={activePillar.accent}
            emissive={activePillar.accent}
            emissiveIntensity={0.45}
          />
        </mesh>
        <Html center position={[0, 0, 0.09]}>
          <div className="pointer-events-none flex flex-col items-center">
            <IdentraMark className="h-7 w-7" />
            <span className="mt-0.5 font-mono text-[9px] font-bold tracking-[0.18em] text-slate-800">
              PROCESS++
            </span>
          </div>
        </Html>
      </group>
    </group>
  );
}

export function ProcessWheelCanvas3D() {
  return (
    <WheelErrorBoundary>
      <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-white via-[#F8FBFF] to-[#F1F5F9] shadow-[0_20px_50px_-28px_rgba(15,23,42,0.14)] sm:h-[460px]">
        <div className="pointer-events-none absolute top-4 left-5 z-20 font-mono text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          Interactive 3D Process++ Wheel · Click any station
        </div>
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.05, 7.6], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={1.0} />
          <directionalLight position={[4, 6, 5]} intensity={1.1} color="#FFFFFF" />
          <Environment resolution={128} frames={1}>
            <Lightformer
              form="rect"
              intensity={1.6}
              color="#FFFFFF"
              scale={[8, 4, 1]}
              position={[0, 5, 4]}
            />
          </Environment>
          <Suspense fallback={null}>
            <ProcessWheelScene />
          </Suspense>
        </Canvas>
      </div>
    </WheelErrorBoundary>
  );
}
