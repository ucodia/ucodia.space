import { Slider } from "@/components/ui/slider";
import { useInteraction } from "@/hooks/use-interaction";
import { CDN_URL } from "@/utils/cdn";
import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import SunCalc from "suncalc";
import { TextureLoader, Vector3 } from "three";

const MOON_TEXTURE_URL = `${CDN_URL}/img/lunar/lroc_color_poles_1k.jpg`;

// default to vancouver, bc :)
const DEFAULT_LATITUDE = 49.2827;
const DEFAULT_LONGITUDE = -123.1207;

const getMoonData = (selectedDate) => {
  const { phase, fraction } = SunCalc.getMoonIllumination(selectedDate);
  const moonTimes = SunCalc.getMoonTimes(
    selectedDate,
    DEFAULT_LATITUDE,
    DEFAULT_LONGITUDE
  );
  const moonPosition = SunCalc.getMoonPosition(
    selectedDate,
    DEFAULT_LATITUDE,
    DEFAULT_LONGITUDE
  );

  let phaseName = "";
  if (phase < 0.025 || phase >= 0.975) {
    phaseName = "New Moon";
  } else if (phase < 0.25) {
    phaseName = "Waxing Crescent";
  } else if (phase < 0.275) {
    phaseName = "First Quarter";
  } else if (phase < 0.475) {
    phaseName = "Waxing Gibbous";
  } else if (phase < 0.525) {
    phaseName = "Full Moon";
  } else if (phase < 0.725) {
    phaseName = "Waning Gibbous";
  } else if (phase < 0.775) {
    phaseName = "Last Quarter";
  } else {
    phaseName = "Waning Crescent";
  }

  let daysToNextNewMoon = 0;
  let nextNewMoonFound = false;
  while (!nextNewMoonFound && daysToNextNewMoon <= 30) {
    const futureDate = new Date(
      selectedDate.getTime() + daysToNextNewMoon * 24 * 60 * 60 * 1000
    );
    const futurePhase = SunCalc.getMoonIllumination(futureDate).phase;
    if (futurePhase < 0.025 || futurePhase >= 0.975) {
      nextNewMoonFound = true;
    } else {
      daysToNextNewMoon++;
    }
  }

  return {
    phase,
    phaseName,
    illumination: fraction,
    nextNewMoonDays: daysToNextNewMoon,
    moonTimes,
    moonPosition,
  };
};

function Moon({ moonPhase }) {
  const moonRef = useRef();

  const colorMap = useLoader(TextureLoader, MOON_TEXTURE_URL);

  const getLightPosition = () => {
    const angle = moonPhase * 2 * Math.PI - Math.PI / 2;
    const x = 10 * Math.cos(angle);
    const z = 10 * Math.sin(angle);
    return new Vector3(x, 0, z);
  };

  useFrame(() => {
    if (moonRef.current) {
      moonRef.current.rotation.y += 0.00001;
    }
  });

  const lightPosition = getLightPosition();

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight
        position={lightPosition}
        intensity={2}
        color="#f8f9fa"
      />
      <mesh ref={moonRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial map={colorMap} metalness={0.2} roughness={0.8} />
      </mesh>
    </>
  );
}

const Lunar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const moonData = useMemo(() => getMoonData(selectedDate), [selectedDate]);
  const showUI = useInteraction(3000);
  console.log(moonData);

  return (
    <div className={`w-screen h-screen ${!showUI ? "cursor-none" : ""}`}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={["#01040f"]} />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        <Moon moonPhase={moonData.phase} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={20}
          rotateSpeed={0.5}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      <div
        className={`
          absolute inset-0 pointer-events-none
          transition-opacity duration-700 ease-in-out
          ${showUI ? "opacity-50" : "opacity-0"}
        `}
      >
        <div
          className={`
            container mx-auto px-4 h-full flex flex-col justify-end pb-12
            ${showUI ? "pointer-events-auto" : "pointer-events-none"}
          `}
        >
          <div className="pl-12">
            <div className="moon-info-card inline-flex flex-col items-start gap-1 px-4 py-3">
              <h2 className="text-xl font-medium phase-name">
                {moonData.phaseName}
              </h2>
              <p className="text-sm text-slate-300">
                {Math.round(moonData.illumination * 100)}% illuminated
              </p>
              <p className="text-sm text-slate-400">
                Next moon:{" "}
                {moonData.nextNewMoonDays === 1
                  ? "Tomorrow"
                  : `${moonData.nextNewMoonDays} days`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lunar;
