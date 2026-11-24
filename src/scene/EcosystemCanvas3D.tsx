import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Html, Lightformer, Line } from '@react-three/drei';
import * as THREE from 'three';
import {
  Bot,
  KeyRound,
  LayoutGrid,
  Shield,
  Users,
} from 'lucide-react';
import {
  ECOSYSTEM_NODES,
  type EcosystemNodeId,
} from '@/data/identityProcessData';
import { IdentraMark } from '@/components/ui/Primitives';
import { useSceneStore } from '@/store/useSceneStore';
import { cn } from '@/lib/cn';

class StageErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#F8FAFC] text-sm text-slate-500">
          Interactive 3D Identity Ecosystem Preview
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Precision 3D Dotted / Beaded Concentric Rings surrounding the central IDENTRA emblem.
 */
function DottedOrbitalRings({ scale }: { scale: number }) {
  const pulseCounter = useSceneStore((s) => s.pulseCounter);
  const pulseTimeRef = useRef(-10);
  const clockRef = useRef(0);

  const ring1Ref = useRef<THREE.InstancedMesh>(null);
  const ring2Ref = useRef<THREE.InstancedMesh>(null);
  const ring3Ref = useRef<THREE.InstancedMesh>(null);
  const rippleRef = useRef<THREE.Mesh>(null);
  const rippleMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    if (pulseCounter > 0) {
      pulseTimeRef.current = clockRef.current;
    }
  }, [pulseCounter]);

  const RINGS = useMemo(
    () => [
      { count: 48, radius: 1.05, dotSize: 0.023, tiltX: 0.14, tiltY: 0.08, speed: 0.22 },
      { count: 68, radius: 1.38, dotSize: 0.019, tiltX: -0.2, tiltY: 0.16, speed: -0.15 },
      { count: 88, radius: 1.72, dotSize: 0.016, tiltX: 0.11, tiltY: -0.22, speed: 0.1 },
    ],
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    clockRef.current = t;

    const meshes = [ring1Ref.current, ring2Ref.current, ring3Ref.current];
    meshes.forEach((mesh, rIdx) => {
      if (!mesh) return;
      const cfg = RINGS[rIdx];
      mesh.rotation.z = t * cfg.speed;
      mesh.rotation.x = cfg.tiltX + Math.sin(t * 0.4 + rIdx) * 0.04;
      mesh.rotation.y = cfg.tiltY + Math.cos(t * 0.35 + rIdx) * 0.05;

      for (let i = 0; i < cfg.count; i++) {
        const angle = (i / cfg.count) * Math.PI * 2;
        const wave = 0.65 + 0.35 * Math.sin(angle * 3 - t * 2.1 + rIdx);
        dummy.position.set(
          Math.cos(angle) * cfg.radius,
          Math.sin(angle) * cfg.radius,
          Math.sin(angle * 2 + t * 0.8) * 0.035
        );
        dummy.scale.setScalar(cfg.dotSize * (0.85 + wave * 0.45));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);

        colorObj.set(i % 4 === 0 ? '#0EA5E9' : i % 2 === 0 ? '#38BDF8' : '#94A3B8');
        mesh.setColorAt(i, colorObj);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    });

    if (rippleRef.current && rippleMatRef.current) {
      const elapsed = t - pulseTimeRef.current;
      if (elapsed >= 0 && elapsed < 1.15) {
        const p = elapsed / 1.15;
        const eased = 1 - Math.pow(1 - p, 3);
        rippleRef.current.visible = true;
        rippleRef.current.scale.setScalar(0.85 + eased * 2.0);
        rippleMatRef.current.opacity = (1 - p) * 0.48;
      } else {
        rippleRef.current.visible = false;
      }
    }
  });

  return (
    <group scale={scale}>
      <instancedMesh ref={ring1Ref} args={[undefined, undefined, RINGS[0].count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial />
      </instancedMesh>
      <instancedMesh ref={ring2Ref} args={[undefined, undefined, RINGS[1].count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial transparent opacity={0.85} />
      </instancedMesh>
      <instancedMesh ref={ring3Ref} args={[undefined, undefined, RINGS[2].count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial transparent opacity={0.55} />
      </instancedMesh>

      <mesh ref={rippleRef} visible={false}>
        <ringGeometry args={[0.97, 1.0, 64]} />
        <meshBasicMaterial
          ref={rippleMatRef}
          color="#0EA5E9"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/**
 * Subtle flowing background dotted wave ribbon in 3D space.
 */
function DottedWaveRibbon() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const cols = 30;
  const rows = 7;
  const total = cols * rows;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - cols / 2) * 0.28;
        const yBase = (r - rows / 2) * 0.22;
        const wave = Math.sin(x * 0.75 + t * 0.65 + r * 0.35) * 0.25;
        const z = -1.8 + Math.cos(x * 0.5 - t * 0.4 + r * 0.3) * 0.28;
        dummy.position.set(x, yBase + wave, z);
        dummy.scale.setScalar(0.015);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(idx++, dummy.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, total]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#BAE6FD" transparent opacity={0.5} />
    </instancedMesh>
  );
}

function getNodeIcon(id: EcosystemNodeId) {
  switch (id) {
    case 'people':
      return Users;
    case 'service-accounts':
      return Bot;
    case 'entitlements':
      return KeyRound;
    case 'roles':
      return Shield;
    case 'applications':
      return LayoutGrid;
    default:
      return Shield;
  }
}

function EcosystemRig() {
  const rootRef = useRef<THREE.Group>(null);
  const packetRef = useRef<THREE.InstancedMesh>(null);
  const viewport = useThree((s) => s.viewport);

  const activeNode = useSceneStore((s) => s.activeEcosystemNode);
  const setActiveNode = useSceneStore((s) => s.setActiveEcosystemNode);
  const setActivePillarId = useSceneStore((s) => s.setActivePillarId);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Compute guaranteed safe in-frame 3D coordinates responsive to container aspect ratio
  const { nodePositions, hubScale, hubY } = useMemo(() => {
    const safeX = Math.min(Math.max(viewport.width * 0.305, 1.55), 2.55);
    const safeTopY = Math.min(Math.max(viewport.height * 0.215, 0.95), 1.38);
    const safeMidLowY = -Math.min(Math.max(viewport.height * 0.145, 0.62), 0.95);
    const safeBottomY = -Math.min(Math.max(viewport.height * 0.355, 1.55), 2.08);
    const centerY = 0.08;
    const scale = Math.min(1, Math.max(0.76, viewport.width / 7.4));

    const positions: Record<EcosystemNodeId, [number, number, number]> = {
      core: [0, centerY, 0],
      people: [-safeX, safeTopY, 0.2],
      applications: [safeX, safeTopY, 0.2],
      'service-accounts': [-safeX * 0.96, safeMidLowY, 0.28],
      roles: [safeX * 0.96, safeMidLowY, 0.28],
      entitlements: [0, safeBottomY, 0.35],
    };

    return { nodePositions: positions, hubScale: scale, hubY: centerY };
  }, [viewport.height, viewport.width]);

  const curves = useMemo(() => {
    return ECOSYSTEM_NODES.map((node) => {
      const target = nodePositions[node.id];
      const start = new THREE.Vector3(0, hubY, 0.06);
      const end = new THREE.Vector3(...target);
      const mid = start.clone().lerp(end, 0.5);
      mid.y += end.y >= hubY ? 0.24 : -0.16;
      mid.z += 0.25;
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve
        .getPoints(32)
        .map((v) => [v.x, v.y, v.z] as [number, number, number]);
      return { node, target, curve, points };
    });
  }, [hubY, nodePositions]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    // Gentle bounded pointer parallax so pills never swing near edges
    if (rootRef.current) {
      const targetRotY = state.pointer.x * 0.09;
      const targetRotX = -state.pointer.y * 0.06;
      rootRef.current.rotation.y = THREE.MathUtils.damp(
        rootRef.current.rotation.y,
        targetRotY,
        4,
        dt
      );
      rootRef.current.rotation.x = THREE.MathUtils.damp(
        rootRef.current.rotation.x,
        targetRotX,
        4,
        dt
      );
    }

    if (packetRef.current) {
      let idx = 0;
      curves.forEach(({ node, curve }, cIdx) => {
        const isHighlighted = activeNode === 'core' || activeNode === node.id;
        for (let k = 0; k < 2; k++) {
          const u = (t * (isHighlighted ? 0.36 : 0.2) + cIdx * 0.17 + k * 0.5) % 1;
          const pt = curve.getPoint(u);
          dummy.position.copy(pt);
          dummy.scale.setScalar(isHighlighted ? 0.046 : 0.028);
          dummy.updateMatrix();
          packetRef.current!.setMatrixAt(idx++, dummy.matrix);
        }
      });
      packetRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={rootRef}>
      <DottedWaveRibbon />

      {/* Center IDENTRA Circular Medallion & Dotted Orbit Rings */}
      <Float speed={1.4} rotationIntensity={0.05} floatIntensity={0.12}>
        <group position={[0, hubY, 0]}>
          <DottedOrbitalRings scale={hubScale} />

          <group scale={hubScale}>
            {/* Sculpted Ceramic-White 3D Medallion Disc */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.82, 0.82, 0.11, 64]} />
              <meshPhysicalMaterial
                color="#FFFFFF"
                metalness={0.08}
                roughness={0.15}
                clearcoat={1}
                clearcoatRoughness={0.12}
              />
            </mesh>

            {/* Glowing Azure Outer Ring Bezel */}
            <mesh>
              <torusGeometry args={[0.84, 0.024, 20, 72]} />
              <meshStandardMaterial
                color="#0EA5E9"
                emissive="#0EA5E9"
                emissiveIntensity={0.6}
                roughness={0.2}
                metalness={0.35}
              />
            </mesh>
          </group>

          {/* Crisp IDENTRA Emblem Face */}
          <Html center position={[0, 0, 0.09]} transform={false}>
            <button
              type="button"
              onClick={() => setActiveNode('core')}
              className="group flex cursor-pointer flex-col items-center justify-center rounded-full focus:outline-none"
              title="Reset focus to IDENTRA Core"
            >
              <IdentraMark className="h-9 w-9 transition-transform duration-300 group-hover:scale-110" />
              <span className="mt-1 font-display text-[10px] font-extrabold tracking-[0.2em] text-[#0F172A]">
                IDENTRA
              </span>
            </button>
          </Html>
        </group>
      </Float>

      {/* Curved Dotted Connector Lines */}
      {curves.map(({ node, points }) => {
        const isHighlighted = activeNode === 'core' || activeNode === node.id;
        return (
          <Line
            key={node.id}
            points={points}
            color={isHighlighted ? '#0EA5E9' : '#CBD5E1'}
            lineWidth={isHighlighted ? 2.1 : 1.2}
            dashed
            dashSize={0.11}
            gapSize={0.09}
            transparent
            opacity={isHighlighted ? 0.95 : 0.45}
          />
        );
      })}

      {/* Traveling Luminous Signal Dots along the Connector Curves */}
      <instancedMesh ref={packetRef} args={[undefined, undefined, curves.length * 2]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial color="#0EA5E9" />
      </instancedMesh>

      {/* 5 Interactive 3D Ecosystem Satellites (Responsively Framed) */}
      {curves.map(({ node, target }) => {
        const Icon = getNodeIcon(node.id);
        const isSelected = activeNode === node.id;
        const isDimmed = activeNode !== 'core' && !isSelected;

        return (
          <group key={node.id} position={target}>
            <mesh>
              <sphereGeometry args={[0.12, 24, 24]} />
              <meshPhysicalMaterial
                color={isSelected ? '#0EA5E9' : '#E0F2FE'}
                roughness={0.2}
                metalness={0.1}
                clearcoat={0.8}
              />
            </mesh>

            <Html center position={[0, 0, 0.14]} zIndexRange={[10, 0]}>
              <button
                type="button"
                onClick={() => {
                  const next = isSelected ? 'core' : node.id;
                  setActiveNode(next);
                  if (next !== 'core') setActivePillarId(node.pillar);
                }}
                className={cn(
                  'flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-2xl border px-3 py-1.5 text-left transition-all duration-200',
                  isSelected
                    ? 'scale-105 border-[#0EA5E9] bg-white shadow-[0_12px_28px_-8px_rgba(14,165,233,0.35)] ring-2 ring-[#0EA5E9]/20'
                    : isDimmed
                      ? 'border-slate-200/80 bg-white/85 opacity-60 hover:opacity-100'
                      : 'border-slate-200 bg-white/95 shadow-[0_8px_22px_-12px_rgba(15,23,42,0.16)] hover:border-[#0EA5E9]/60 hover:-translate-y-0.5'
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-xl transition-colors',
                    isSelected
                      ? 'bg-[#0EA5E9] text-white'
                      : 'bg-[#F0F9FF] text-[#0284C7]'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="leading-tight">
                  <span className="block font-heading text-[11px] font-semibold text-[#0F172A] sm:text-xs">
                    {node.label}
                  </span>
                  <span className="block font-mono text-[10px] text-[#64748B]">
                    ({node.count})
                  </span>
                </span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export function EcosystemCanvas3D() {
  return (
    <StageErrorBoundary>
      <div className="relative h-[460px] w-full overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-b from-[#FFFFFF] via-[#F8FBFF] to-[#F1F7FE] shadow-[0_24px_60px_-28px_rgba(15,23,42,0.14)] sm:h-[520px]">
        {/* Crisp top bar inside the 3D stage */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2 font-mono text-[11px] font-medium text-slate-600">
            <span className="h-2 w-2 rounded-full bg-[#10B981]" />
            <span>3D IDENTITY ECOSYSTEM · LIVE TOPOLOGY</span>
          </div>
          <span className="hidden rounded-full border border-sky-200/80 bg-white/90 px-2.5 py-0.5 font-mono text-[10px] text-[#0284C7] sm:inline-block">
            Click any node to inspect
          </span>
        </div>

        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.05, 8.6], fov: 38 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.95} />
          <directionalLight position={[4, 6, 6]} intensity={1.1} color="#FFFFFF" />
          <pointLight position={[-4, -2, 4]} intensity={0.6} color="#38BDF8" />

          <Environment resolution={128} frames={1}>
            <Lightformer
              form="rect"
              intensity={1.8}
              color="#FFFFFF"
              scale={[10, 4, 1]}
              position={[0, 6, 4]}
            />
            <Lightformer
              form="ring"
              intensity={1.4}
              color="#BAE6FD"
              scale={6}
              position={[-5, 2, 3]}
            />
          </Environment>

          <Suspense fallback={null}>
            <EcosystemRig />
          </Suspense>
        </Canvas>
      </div>
    </StageErrorBoundary>
  );
}
