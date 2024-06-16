import{ useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useTransform } from 'framer-motion';

export default function ModelGrey({ scrollY }) {
    const rotationY = useTransform(scrollY, [0, window.innerHeight], [0, Math.PI * 2]);
    
  return (
    <div className="main">
      <div className="cube">
        <Canvas>
          <ambientLight intensity={2} />
          <directionalLight position={[2, 1, 1]} />
          <Model rotationY={rotationY} />
        </Canvas>
      </div>
    </div>
  );
}

function Model({ rotationY }) {
  const { scene } = useGLTF('/untitled.glb');
  const mesh = useRef(scene);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y = rotationY.get();
    }
  });

  return <primitive object={scene} ref={mesh} scale={[2.5, 2.5, 2.5]} />;
}
