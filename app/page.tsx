"use client";
import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  Mesh,
  WebGLCubeRenderTarget,
  CubeCamera,
  MeshStandardMaterial,
} from "three";

let direction = true;

function Logo(props: any) {
  const ref = useRef<Mesh>();
  const { scene, gl } = useThree(); // Extract camera from useThree
  const cubeRenderTarget = new WebGLCubeRenderTarget(128);
  const cubeCameraRef = useRef<CubeCamera>(null);
  // const { scene: gltfScene } = useGLTF("/obj/logo.gltf");

  const { onLoaded } = props;
  const { scene: gltfScene } = useGLTF(
    "/obj/logo.gltf",
    undefined,
    undefined,
    () => {
      if (onLoaded) {
        onLoaded(); // Call the callback when the model is loaded
      }
    },
  );

  useFrame(() => {
    if (direction == true) {
      if (ref.current) {
        ref.current.rotation.y += 0.01;
      }
    } else {
      if (ref.current) {
        ref.current.rotation.y -= 0.01;
      }
    }
    if (cubeCameraRef.current) {
      cubeCameraRef.current.update(gl, scene); // Ensure gl is defined here
    }
  });

  useEffect(() => {
    gltfScene.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = new MeshStandardMaterial({
          color: "#506cae",
          // color: '#fafafa',
          // color: 'grey',
          metalness: 1,
          roughness: 0,
          envMap: cubeRenderTarget.texture,
          envMapIntensity: 1,
        });
      }
    });
  }, [gltfScene, cubeRenderTarget.texture]);

  return (
    <>
      <cubeCamera
        ref={cubeCameraRef}
        args={[1, 1000, cubeRenderTarget]}
        position={[0, 0, 0]}
      />
      <primitive object={gltfScene} ref={ref} scale={props.scale} {...props} />
    </>
  );
}

// function Box(props: any) {
//     const ref = useRef<Mesh>();
//     const [hovered, hover] = useState(false)
//     const [clicked, click] = useState(false)
//     useFrame((state, delta) => {
//         if (ref.current) {
//             ref.current.rotation.x += delta;
//         }
//     });
//     return (
//         <mesh
//             {...props}
//             ref={ref}
//             scale={clicked ? 1.5 : 1}
//             onClick={(event) => click(!clicked)}
//             onPointerOver={(event) => hover(true)}
//             onPointerOut={(event) => hover(false)}
//         >
//             <boxGeometry args={[1, 1, 1]} />
//             <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
//         </mesh>
//     )
// }

const handleClick = (event: any) => {
  const { clientX, clientY } = event;
  const canvas = event.target;
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const half = rect.width / 2;
  if (x >= half) {
    console.log("above");
    direction = true;
  } else {
    console.log("below");
    direction = false;
  }
  // console.log('Canvas Coordinates:', { x, y });
  // console.log( {half} );
};

export default function Page() {
  //Dynamic scale
  const [logoScale, setLogoScale] = useState([5, 5, 5]);
  const [isLoaded, setIsLoaded] = useState(false); // New state for tracking loading

  useEffect(() => {
    const handleResize = () => {
      const scale = window.innerWidth < 768 ? [3, 3, 3] : [5, 5, 5];
      setLogoScale(scale);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleModelLoaded = () => {
    setIsLoaded(true);
  };

  const headerHeight = document.querySelector("header")?.clientHeight;
  // Create a style object for the <main> element
  const mainStyle = {
    height: `calc(100vh - ${headerHeight}px)`,
  };

  return (
    <main style={mainStyle}>
      <Canvas
        onClick={handleClick}
        style={{
          opacity: isLoaded ? 1 : 0, // Change opacity based on loading state
          transition: "opacity 1s ease", // CSS transition for smooth fading
        }}
      >
        <color attach="background" args={["rgb(240, 240, 240)"]} />
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Logo
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={logoScale}
          onLoaded={handleModelLoaded} // Pass the callback to Logo
        />
        {/* <Box position={[1.2, 0, 0]} /> */}
      </Canvas>
    </main>
  );
}
