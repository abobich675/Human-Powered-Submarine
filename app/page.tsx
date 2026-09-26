'use client';

import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import fragmentShader from './shaders/fragment.glsl';
import filterFragmentShader from './shaders/filter_fragment.glsl';
import vertexShader from './shaders/vertex.glsl';
import * as THREE from 'three';
import { useTweaks } from 'use-tweaks';
import FloatingPageList from '@/components/FloatingPageList';
import FloatingPage from '@/components/FloatingPage';

function ShaderFilter(props: any) {
  const shaderRef = useRef<THREE.ShaderMaterial | null>(null);
  const { viewport } = useThree();
  return (
    <mesh {...props}>
      <planeGeometry args={[viewport.width, viewport.height, 10]} />
      <shaderMaterial
        ref={shaderRef}
        fragmentShader={filterFragmentShader}
        vertexShader={vertexShader}
        uniforms={{
          uTime: { value: 0.0 },
          uPointer: { value: new THREE.Vector2(0.5, 0.5) },
          uOpacity: { value: 0.0 },
        }}
      />
    </mesh>
  );
}

function Shader({scrollRef, ...meshProps}: {scrollRef: MutableRefObject<number>} & any ) {
  const shaderRef = useRef<THREE.ShaderMaterial | null>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uOpacity: { value: 0.0 },
      scrollY: { value: 0.0 },
    }),
    []
  );

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value += 0.01;
      // shaderRef.current.uniforms.uOpacity.value = opacity;
      shaderRef.current.uniforms.uPointer.value = state.pointer;
      shaderRef.current.uniforms.scrollY.value = scrollRef.current;
      // console.log(opacity);
    }
  });

  return (
    <mesh {...meshProps}>
      <planeGeometry args={[viewport.width, viewport.height, 10]} />
      <shaderMaterial
        ref={shaderRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function Home() {
  const { filterEnabled } : any = useTweaks({
    filterEnabled: true,
  });

  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY;
      console.log("scrollY", scrollY);
    };
    //add eventlistener to window
    window.addEventListener("scroll", onScroll, { passive: true });
    // remove event on unmount to prevent a memory leak with the cleanup
    return () => {
       window.removeEventListener("scroll", onScroll);
    }
  }, []);

  return (
    <main className="h-screen">
      {/* Filter Canvas */}
      { filterEnabled &&
        <div className='fixed h-screen w-screen z-10 pointer-events-none'>
          <Canvas orthographic style={{ pointerEvents: 'none' }}>
            <ambientLight intensity={Math.PI / 2} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <ShaderFilter props={{ position: [0, 0, 0] }} />
          </Canvas>
        </div>
      }

      {/* Background Canvas */}
      <div className='fixed h-screen w-screen -z-10'>
        <Canvas orthographic>
          <ambientLight intensity={Math.PI / 2} />
          <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
          <Shader position={[0, 0, 0]} scrollRef={scrollRef} />
        </Canvas>
      </div>

      {/* Floating Pages */}
      <FloatingPageList scrollRef={scrollRef} items={[
          <div className='w-full h-full bg-gray-50 text-center'>Hello</div>
      ]} />

      {/* Header */}
      <div className='w-full h-[10000px] mx-auto pt-20 text-gray-500'>
        <div className='w-full text-center'>
          <div className='text-9xl '>HPS</div>
          <div className='text-5xl '>Human Powered Submarine</div>
        </div>
      </div>
    </main>
  );
}

/*
Will need:

- Leadership Team
- Photo of the sub
- About
- Meeting Times
- Description of the event
- 3D models of parts
- Replace Screen filter with rays of light
*/