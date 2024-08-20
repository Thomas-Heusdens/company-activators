import{ useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { MotionValue, useTransform } from 'framer-motion';

type Props = {
  scrollY: MotionValue<number>; // Or any other appropriate type
}
export default function ModelViewer({ scrollY }: Props) {
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

type ModelProps = {
  rotationY: MotionValue<number>;
}
function Model({ rotationY } : ModelProps) {
  const { scene } = useGLTF('/model.glb');
  const mesh = useRef(scene);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y = rotationY.get();
    }
  });

  return <primitive object={scene} ref={mesh} scale={[0.3, 0.3, 0.3]} />;
}
