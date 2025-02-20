import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import GUI from "lil-gui";

export const meta = {
  name: "Bad RNG",
  created: "2025-02-20",
};

const generators = {
  "Bad LCG": (count) => {
    const points = [];
    let x = 1;
    const a = 1597;
    const c = 51749;
    const m = 244944;
    for (let i = 0; i < count; i++) {
      x = (a * x + c) % m;
      const x1 = x / m;
      x = (a * x + c) % m;
      const y1 = x / m;
      x = (a * x + c) % m;
      const z1 = x / m;
      points.push([x1, y1, z1]);
    }
    return points;
  },

  RANDU: (count) => {
    const points = [];
    let x = 1;
    for (let i = 0; i < count; i++) {
      x = (65539 * x) % Math.pow(2, 31);
      const x1 = x / Math.pow(2, 31);
      x = (65539 * x) % Math.pow(2, 31);
      const y1 = x / Math.pow(2, 31);
      x = (65539 * x) % Math.pow(2, 31);
      const z1 = x / Math.pow(2, 31);
      points.push([x1, y1, z1]);
    }
    return points;
  },
};

function Points({ config }) {
  const points = generators[config.generator](config.pointCount);
  const pointsRef = useRef(null);

  const roundShape = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext("2d");

    context.beginPath();
    context.arc(32, 32, 30, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame(() => {
    if (pointsRef.current && config.autoRotate) {
      pointsRef.current.rotation.x += 0.001 * config.rotationSpeedX;
      pointsRef.current.rotation.y += 0.001 * config.rotationSpeedY;
      pointsRef.current.rotation.z += 0.001 * config.rotationSpeedZ;
    }
  });

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(points.length * 3);
  const colors = new Float32Array(points.length * 3);

  points.forEach((point, i) => {
    const x = (point[0] - 0.5) * 2;
    const y = (point[1] - 0.5) * 2;
    const z = (point[2] - 0.5) * 2;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    if (config.colorMode === "rgb") {
      colors[i * 3] = (x + 1) / 2;
      colors[i * 3 + 1] = (y + 1) / 2;
      colors[i * 3 + 2] = (z + 1) / 2;
    } else {
      const color = new THREE.Color(config.color);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
  });

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  return (
    <points ref={pointsRef}>
      <bufferGeometry attach="geometry" {...geometry} />
      <pointsMaterial
        attach="material"
        size={config.pointSize}
        sizeAttenuation={true}
        vertexColors={true}
        transparent
        opacity={config.opacity}
        alphaMap={roundShape}
        alphaTest={0.5}
      />
    </points>
  );
}

const BadRng = () => {
  const [config, setConfig] = useState({
    pointCount: 15000,
    pointSize: 0.02,
    color: "#00ff00",
    backgroundColor: "#000000",
    autoRotate: true,
    rotationSpeedX: 1,
    rotationSpeedY: 1,
    rotationSpeedZ: 1,
    opacity: 1,
    generator: "Bad LCG",
    colorMode: "rgb",
  });

  useEffect(() => {
    const gui = new GUI({ title: "Controls" });
    gui.close();
    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "1rem";
    gui.domElement.style.right = "1rem";

    const generatorFolder = gui.addFolder("Generator");
    generatorFolder
      .add(config, "generator", Object.keys(generators))
      .name("Algorithm")
      .onChange((value) => {
        setConfig((prev) => ({ ...prev, generator: value }));
      });

    generatorFolder
      .add(config, "pointCount", 1000, 30000, 1000)
      .name("Point Count")
      .onChange((value) => {
        setConfig((prev) => ({ ...prev, pointCount: value }));
      });

    const appearanceFolder = gui.addFolder("Appearance");
    appearanceFolder
      .add(config, "pointSize", 0.01, 0.05)
      .name("Point Size")
      .onChange((value) => {
        setConfig((prev) => ({ ...prev, pointSize: value }));
      });

    appearanceFolder
      .add(config, "colorMode", ["single", "rgb"])
      .name("Color Mode")
      .onChange((value) => {
        setConfig((prev) => ({ ...prev, colorMode: value }));
      });

    appearanceFolder
      .addColor(config, "color")
      .name("Point Color")
      .onChange((value) => {
        setConfig((prev) => ({ ...prev, color: value }));
      });

    appearanceFolder
      .addColor(config, "backgroundColor")
      .name("Background")
      .onChange((value) => {
        setConfig((prev) => ({ ...prev, backgroundColor: value }));
      });

    appearanceFolder
      .add(config, "opacity", 0, 1)
      .name("Opacity")
      .onChange((value) => {
        setConfig((prev) => ({ ...prev, opacity: value }));
      });

    const rotationFolder = gui.addFolder("Rotation");

    rotationFolder
      .add(config, "autoRotate")
      .name("Auto Rotate")
      .onChange((value) => {
        setConfig((prev) => ({ ...prev, autoRotate: value }));
      });

    rotationFolder
      .add(config, "rotationSpeedX", -5, 5, 0.1)
      .name("X Speed")
      .onChange((value) => {
        setConfig((prev) => ({ ...prev, rotationSpeedX: value }));
      });

    rotationFolder
      .add(config, "rotationSpeedY", -5, 5, 0.1)
      .name("Y Speed")
      .onChange((value) => {
        setConfig((prev) => ({ ...prev, rotationSpeedY: value }));
      });

    rotationFolder
      .add(config, "rotationSpeedZ", -5, 5, 0.1)
      .name("Z Speed")
      .onChange((value) => {
        setConfig((prev) => ({ ...prev, rotationSpeedZ: value }));
      });

    return () => {
      gui.destroy();
    };
  }, []);

  return (
    <div className="w-screen h-screen">
      <Canvas style={{ background: config.backgroundColor }}>
        <PerspectiveCamera makeDefault position={[0, 0, 2]} />
        <OrbitControls enableDamping dampingFactor={0.05} />
        <Points config={config} />
      </Canvas>
    </div>
  );
};

export default BadRng;
