import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import GUI from "lil-gui";

export const meta = {
  name: "Bad RNG",
  created: "2025-02-20",
};

function lcg(seed, a, c, m) {
  let z = seed;
  return () => {
    z = (a * z + c) % m;
    return z / m;
  };
}

const generators = {
  "Bad LCG Cube": (count) => {
    const points = [];
    let rng = lcg(1, 1597, 51749, 244944);
    for (let i = 0; i < count; i++) {
      const v1 = rng();
      const v2 = rng();
      const v3 = rng();
      points.push([v1, v2, v3]);
    }
    return points;
  },

  "RANDU Cube": (count) => {
    const points = [];
    let rng = lcg(1, 65539, 0, 2147483648);
    for (let i = 0; i < count; i++) {
      const v1 = rng();
      const v2 = rng();
      const v3 = rng();
      points.push([v1, v2, v3]);
    }
    return points;
  },

  "RANDU Sphere": (count) => {
    const points = [];
    let rng = lcg(1, 65539, 0, 2147483648);
    for (let i = 0; i < count; i++) {
      const v1 = rng();
      const v2 = rng();
      const v3 = rng();

      const phi = v1 * 2 * Math.PI;
      const theta = Math.acos(2 * v2 - 1);
      const r = Math.cbrt(v3) * Math.sqrt(2);

      const x = (r * Math.sin(theta) * Math.cos(phi) + 1) / 2;
      const y = (r * Math.sin(theta) * Math.sin(phi) + 1) / 2;
      const z = (r * Math.cos(theta) + 1) / 2;
      points.push([x, y, z]);
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
    } else if (config.colorMode === "plasma") {
      // Create a plasma-like effect using sine waves
      const frequency = 5;
      const phase =
        Math.sin(x * frequency) +
        Math.sin(y * frequency) +
        Math.sin(z * frequency);

      // Create three different color waves with phase shifts
      const r = Math.sin(phase) * 0.5 + 0.5;
      const g = Math.sin(phase + 2.094) * 0.5 + 0.5; // 2.094 is 2π/3
      const b = Math.sin(phase + 4.189) * 0.5 + 0.5; // 4.189 is 4π/3

      // Add some distance-based variation
      const distance = Math.sqrt(x * x + y * y + z * z);
      const intensity = Math.sin(distance * 3) * 0.2 + 0.8;

      colors[i * 3] = r * intensity;
      colors[i * 3 + 1] = g * intensity;
      colors[i * 3 + 2] = b * intensity;
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
    pointCount: 100000,
    pointSize: 0.02,
    color: "#00ff00",
    backgroundColor: "#000000",
    autoRotate: true,
    rotationSpeedX: 0.5,
    rotationSpeedY: 0.5,
    rotationSpeedZ: 0.5,
    opacity: 0.9,
    generator: "Bad LCG Cube",
    colorMode: "plasma",
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
      .add(config, "pointCount", 1000, 500000, 1000)
      .name("Point Count")
      .onChange((value) => {
        setConfig((prev) => ({ ...prev, pointCount: value }));
      });

    const appearanceFolder = gui.addFolder("Appearance");
    appearanceFolder
      .add(config, "pointSize", 0.001, 0.05, 0.005)
      .name("Point Size")
      .onChange((value) => {
        setConfig((prev) => ({ ...prev, pointSize: value }));
      });

    appearanceFolder
      .add(config, "colorMode", ["single", "rgb", "plasma"])
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
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls enableDamping dampingFactor={0.05} zoomSpeed={0.5} />
        <Points config={config} />
      </Canvas>
    </div>
  );
};

export default BadRng;
