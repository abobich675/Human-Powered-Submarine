'use client';

import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import fragmentShader from './shaders/fragment.glsl';
import filterFragmentShader from './shaders/filter_fragment.glsl';
import vertexShader from './shaders/vertex.glsl';
import * as THREE from 'three';
import { useTweaks } from 'use-tweaks';
import FloatingPageList from '@/components/FloatingPageList';

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
  const { filterEnabled, wavesEnabled } : any = useTweaks({
    filterEnabled: false,
    wavesEnabled: false
  });

  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY;
      console.log("scrollY", scrollY);
    };
    // run once on load
    onScroll();
    // add eventlistener to window
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
        <div className='fixed h-screen w-screen z-15 pointer-events-none'>
          <Canvas orthographic style={{ pointerEvents: 'none' }}>
            <ambientLight intensity={Math.PI / 2} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <ShaderFilter props={{ position: [0, 0, 0] }} />
          </Canvas>
        </div>
      }

      {/* Background Canvas */}
      { wavesEnabled &&
        <div className='fixed h-screen w-screen z-10 pointer-events-none'>
          <Canvas orthographic style={{ pointerEvents: 'none' }}>
            <ambientLight intensity={Math.PI / 2} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <Shader position={[0, 0, 0]} scrollRef={scrollRef} />
          </Canvas>
        </div>
      }

      {/* Floating Pages */}
      {/* <FloatingPageList start={300} verticalSize={700} gap={150} scrollRef={scrollRef} items={[
          <div className='w-full h-full bg-gray-50 text-center text-black'>Page1</div>,
          <div className='w-full h-full bg-gray-50 text-center text-black'>Page2</div>,
          <div className='w-full h-full bg-gray-50 text-center text-black'>Page3</div>,
          <div className='w-full h-full bg-gray-50 text-center text-black'>Page4</div>,
          <div className='w-full h-full bg-gray-50 text-center text-black'>Page5</div>,
          <div className='w-full h-full bg-gray-50 text-center text-black'>Page6</div>,
          <div className='w-full h-full bg-gray-50 text-center text-black'>Page7</div>,
          <div className='w-full h-full bg-gray-50 text-center text-black'>Page8</div>,
          <div className='w-full h-full bg-gray-50 text-center text-black'>Page9</div>,
          <div className='w-full h-full bg-gray-50 text-center text-black'>Page10</div>

      ]} /> */}

      {/* Header */}
      {/* <div className='w-full h-[10000px] mx-auto pt-20 text-gray-500'>
        <div className='w-full text-center'>
          <div className='text-9xl '>HPS</div>
          <div className='text-5xl '>Human Powered Submarine</div>
        </div>
      </div> */}

      {/* Header */}
      <div className='w-full h-[300px] bg-[#9badb7]'>
        <div className='w-full text-center pt-20 text-gray-500'>
          <div className='text-9xl '>HPS</div>
          <div className='text-5xl '>Human Powered Submarine</div>
        </div>
      </div>

      {/* Pool Top */}
      <div className='flex h-[100px]'>
        <div className='flex-none bg-[url(/top_tile.png)] bg-repeat-x bg-[length:100px] [image-rendering:pixelated] w-[125px] scale-x-[-1]' />
        <div className='flex-1 bg-[url(/top_transition.png)] [background-size:100%_100px] [image-rendering:pixelated] w-[100px]' />
        <div className='flex-none min-w-0 bg-[url(/top_tile_main.png)] bg-repeat-x bg-[length:100px] [image-rendering:pixelated] [width:calc(round(down,calc(100%_-_300px),100px)_+_50px)]' />
        <div className='flex-1 bg-[url(/top_transition.png)] [background-size:100%_100px] [image-rendering:pixelated] w-[100px] scale-x-[-1]' />
        <div className='flex-none bg-[url(/top_tile.png)] bg-repeat-x bg-[length:100px] [image-rendering:pixelated] w-[125px]' />
      </div>

      {/* Pool Main */}
      <div className='flex h-[10000px]'>
        <div className='flex-none bg-[url(/tile.png)] bg-repeat bg-[length:100px] [image-rendering:pixelated] w-[125px] h-full scale-x-[-1]' />
        <div className='flex-1 bg-[url(/transition.png)] bg-repeat-y [background-size:100%_100px] [image-rendering:pixelated] w-[100px] h-full' />
        <div className='flex-none min-w-0 bg-[url(/tile.png)] bg-repeat bg-[length:100px] [image-rendering:pixelated] [width:calc(round(down,calc(100%_-_300px),100px)_+_50px)] h-full' >
          {/* Indent */}
          <div className='w-[800px] h-[500px] bg-black ml-[100px]'>
            {/* Indent Top */}
            <div className='flex w-full h-[100px] '>
              <div className='flex-none bg-[url(/indent_tl.png)] bg-no-repeat bg-[length:100px] [image-rendering:pixelated] w-[100px] h-full' />
              <div className='flex-none min-w-0 bg-[url(/indent_t.png)] bg-repeat-x bg-[length:100px] [image-rendering:pixelated] [width:round(down,calc(100%_-_200px),150px)] h-full' />
              <div className='flex-none min-w-[100px] bg-[url(/indent_tr.png)] bg-no-repeat bg-[length:100px] [image-rendering:pixelated] h-full' ></div>
            </div>
            {/* Indent Main */}
            <div className='flex w-full h-[round(down,calc(100%_-_200px),150px)]'>
              <div className='flex-none bg-[url(/indent_l.png)] bg-repeat-y bg-[length:100px] [image-rendering:pixelated] w-[100px] h-[full]' />
              <div className='flex-none min-w-0 [width:round(down,calc(100%_-_200px),150px)] h-full' />
              <div className='flex-none bg-[url(/indent_r.png)] bg-repeat-y bg-[length:100px] [image-rendering:pixelated] w-[100px] h-full' ></div>
            </div>
            {/* Indent Bottom */}
            <div className='flex w-full h-[100px] '>
              <div className='flex-none bg-[url(/indent_bl.png)] bg-no-repeat bg-[length:100px] [image-rendering:pixelated] w-[100px] h-full' />
              <div className='flex-none min-w-0 bg-[url(/indent_b.png)] bg-repeat-x bg-[length:100px] [image-rendering:pixelated] [width:round(down,calc(100%_-_200px),150px)] h-full' />
              <div className='flex-none min-w-[100px] bg-[url(/indent_br.png)] bg-no-repeat bg-[length:100px] [image-rendering:pixelated] h-full' ></div>
            </div>
          </div>

        </div>
        <div className='flex-1 bg-[url(/transition.png)] bg-repeat-y [background-size:100%_100px] [image-rendering:pixelated] w-[100px] h-full scale-x-[-1]' />
        <div className='flex-none bg-[url(/tile.png)] bg-repeat bg-[length:100px] [image-rendering:pixelated] w-[125px] h-full' />
      </div>

      {/* Pool Bottom */}
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