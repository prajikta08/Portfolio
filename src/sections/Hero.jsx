import React, { useRef, useState } from "react";
import HeroText from "../components/HeroText";
import BackGround from "../components/BackGround";
import { Robot } from "../components/Robot";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";

function AnimatedRobot({ targetPosition = [2.3, -1, 0], scale }) {
  const ref = useRef();
  const inner = useRef();
  const [y, setY] = useState(1);

  useFrame((state) => {
    setY((prev) => prev + (targetPosition[1] - prev) * 0.05);

    const t = state.clock.getElapsedTime();
    const float = Math.sin(t * 1.5) * 0.1;

    if (ref.current) {
      ref.current.position.set(targetPosition[0], y + float, targetPosition[2]);
    }
    if (inner.current) {
      inner.current.rotation.y += 0.01;
    }
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
  const isMobile = useMediaQuery({ maxWidth: 853 });
  const isVerySmall = useMediaQuery({ maxWidth: 450 });

  // ⭐ Robot scaling & position
  const robotScale = isMobile ? 0.45 : 0.5;
  const robotPosition = isMobile ? [-1, -3, 0] : [1.2, -1.1, 0];

  return (
    <>
      <section className="flex flex-col items-center justify-start md:flex-row md:items-start md:justify-start min-h-screen overflow-hidden c-space">

        {/* TEXT */}
        <HeroText className="relative z-10" />


        {/* BACKGROUND */}
        <BackGround />

        {/* 3D CANVAS */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <Canvas
          camera={{ position: [0, 1, 3] }}
          style={{
            position: "absolute",
            inset: 0,
            width: "130%",
            height: isMobile ? "60%" : "100%",
            zIndex: 0,
          }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <pointLight position={[0, 2, 0]} intensity={1.2} />
          {/* < Environment preset="sunset" />*/}

          {/* Hide robot on very tiny screens */}
          {!isVerySmall && (
            <AnimatedRobot
              targetPosition={robotPosition}
              scale={robotScale}
            />
          )}
        </Canvas></div>

        {/* MOBILE SPACING FIX */}
        <div className="w-full mt-20 z-1 md:hidden" />

      </section>
    </>
  );
};

export default Hero;
