import React, { useRef, useState, Suspense } from "react";
import HeroText from "../components/HeroText";
import { Robot } from "../components/Robot";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { useGLTF } from "@react-three/drei";

useGLTF.preload("/robot.glb");

function AnimatedRobot({ targetPosition, scale }) {
  const ref = useRef();
  const inner = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const float = Math.sin(t * 1.5) * 0.1;

    if (ref.current) {
      ref.current.position.set(
        targetPosition[0],
        targetPosition[1] + float,
        targetPosition[2]
      );
    }

    if (inner.current) inner.current.rotation.y += 0.01;
  });

  return (
    <group ref={ref}>
      <group ref={inner}>
        <Robot scale={scale} />
      </group>
    </group>
  );
}

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 }); // ⬅ mobile breakpoint

  const robotScale = 0.5;
  const robotPosition = [1.2, -1.1, 0];

  return (
    <section className="flex flex-col items-center justify-start md:flex-row min-h-screen overflow-hidden c-space">
      
      {/* TEXT */}
      <HeroText className="relative z-10" />

      {/* 3D CANVAS (desktop only) */}
      {!isMobile && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <Canvas
            camera={{ position: [0, 1, 3] }}
            style={{
              position: "absolute",
              inset: 0,
              width: "130%",
              height: "100%",
              zIndex: 0,
            }}
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={2} />
            <pointLight position={[0, 2, 0]} intensity={1.2} />

            <Suspense fallback={null}>
              <AnimatedRobot
                targetPosition={robotPosition}
                scale={robotScale}
              />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* MOBILE SPACING FIX */}
      <div className="w-full mt-20 z-1 md:hidden" />
    </section>
  );
};

export default Hero;
