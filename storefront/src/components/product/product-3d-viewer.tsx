"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float } from "@react-three/drei";
import { Loader2, Box } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product3DViewerProps {
  className?: string;
  color?: string;
}

function ProductModel({ color = "#333" }: { color?: string }) {
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
      <group>
        {/* Simplified t-shirt-like shape using primitives */}
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 1.6, 0.3]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        {/* Left sleeve */}
        <mesh position={[-0.85, 0.4, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.5, 0.5, 0.25]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        {/* Right sleeve */}
        <mesh position={[0.85, 0.4, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.5, 0.5, 0.25]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        {/* Collar */}
        <mesh position={[0, 0.85, 0.05]}>
          <torusGeometry args={[0.25, 0.06, 8, 24, Math.PI]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

/**
 * 3D product viewer using react-three-fiber.
 * Renders a simplified product model with orbit controls,
 * environment lighting, and contact shadows.
 */
export function Product3DViewer({ className, color }: Product3DViewerProps) {
  return (
    <div className={cn("relative aspect-square rounded-xl bg-gradient-to-b from-muted/50 to-muted", className)}>
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          className="rounded-xl"
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <ProductModel color={color} />
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.4}
            blur={2}
            far={4}
          />
          <Environment preset="studio" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      </Suspense>

      {/* Hint badge */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
        <Box className="h-3 w-3" />
        Drag to rotate
      </div>
    </div>
  );
}
