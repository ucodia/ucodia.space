import { useRef, useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { CDN_URL } from "@/utils/cdn";

const ColorAdjustmentShader = {
  uniforms: {
    tDiffuse: { value: null },
    contrast: { value: 1.0 },
    brightness: { value: 0.0 },
    saturation: { value: 1.0 },
    hue: { value: 0.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float contrast;
    uniform float brightness;
    uniform float saturation;
    uniform float hue;
    varying vec2 vUv;

    vec3 rgb2hsv(vec3 c) {
      vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
      vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
      vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
      float d = q.x - min(q.w, q.y);
      float e = 1.0e-10;
      return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      
      // Contrast
      vec3 color = (texel.rgb - 0.5) * contrast + 0.5;
      
      // Brightness
      color += brightness;
      
      // Saturation and Hue
      vec3 hsv = rgb2hsv(color);
      hsv.y *= saturation;
      hsv.x += hue;
      color = hsv2rgb(hsv);
      
      gl_FragColor = vec4(color, texel.a);
    }
  `,
};

const Skybox = () => {
  const { hdrId } = useParams();
  const navigate = useNavigate();
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUIVisible, setIsUIVisible] = useState(false);
  const [exposure, setExposure] = useState(1);
  const [fov, setFov] = useState(110);
  const [contrast, setContrast] = useState(1);
  const [brightness, setBrightness] = useState(0);
  const [saturation, setSaturation] = useState(1);
  const [hue, setHue] = useState(0);
  const [isHueAnimating, setIsHueAnimating] = useState(false);
  const maxId = 2;

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const composerRef = useRef(null);
  const colorPassRef = useRef(null);
  const animationFrameRef = useRef(null);

  const loadHDR = (fileNumber) => {
    setIsLoading(true);
    setError(null);

    const loader = new RGBELoader();
    loader.load(
      `${CDN_URL}/skyboxes/${fileNumber.toString().padStart(3, "0")}.hdr`,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        sceneRef.current.background = texture;
        sceneRef.current.environment = texture;
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error("An error occurred while loading the HDR file:", error);
        setError("Failed to load the HDR file. Please try again later.");
        setIsLoading(false);
      }
    );
  };

  const handlePrevious = () => {
    const currentId = parseInt(hdrId);
    const newFileNumber = currentId > 1 ? currentId - 1 : maxId;
    navigate(`/skybox/${newFileNumber}`);
  };

  const handleNext = () => {
    const currentId = parseInt(hdrId);
    const newFileNumber = currentId < maxId ? currentId + 1 : 1;
    navigate(`/skybox/${newFileNumber}`);
  };

  const handleExposureChange = (value) => {
    setExposure(value);
    if (rendererRef.current) {
      rendererRef.current.toneMappingExposure = value;
    }
  };

  const handleFovChange = (value) => {
    setFov(value);
    if (cameraRef.current) {
      cameraRef.current.fov = value;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const handleContrastChange = (value) => {
    setContrast(value);
    if (colorPassRef.current) {
      colorPassRef.current.uniforms.contrast.value = value;
    }
  };

  const handleBrightnessChange = (value) => {
    setBrightness(value);
    if (colorPassRef.current) {
      colorPassRef.current.uniforms.brightness.value = value;
    }
  };

  const handleSaturationChange = (value) => {
    setSaturation(value);
    if (colorPassRef.current) {
      colorPassRef.current.uniforms.saturation.value = value;
    }
  };

  const handleHueChange = (value) => {
    setHue(value);
    if (colorPassRef.current) {
      colorPassRef.current.uniforms.hue.value = value;
    }
  };

  const toggleHueAnimation = useCallback(() => {
    setIsHueAnimating((prev) => !prev);
  }, []);

  useEffect(() => {
    let lastTime = 0;
    const animateHue = (time) => {
      if (isHueAnimating) {
        const deltaTime = time - lastTime;
        lastTime = time;

        setHue((prevHue) => {
          const newHue = (prevHue + deltaTime * 0.0001) % 1;
          if (colorPassRef.current) {
            colorPassRef.current.uniforms.hue.value = newHue;
          }
          return newHue;
        });

        animationFrameRef.current = requestAnimationFrame(animateHue);
      }
    };

    if (isHueAnimating) {
      animationFrameRef.current = requestAnimationFrame(animateHue);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHueAnimating]);

  const getSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return { width, height };
  };

  useEffect(() => {
    const { width, height } = getSize();

    // Scene setup
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      fov,
      width / height,
      0.1,
      1000
    );
    rendererRef.current = new THREE.WebGLRenderer();
    rendererRef.current.setSize(width, height);
    rendererRef.current.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current.toneMappingExposure = exposure;
    rendererRef.current.outputEncoding = THREE.sRGBEncoding;
    mountRef.current.appendChild(rendererRef.current.domElement);

    // Camera position
    cameraRef.current.position.z = 0.001;

    // OrbitControls setup
    controlsRef.current = new OrbitControls(
      cameraRef.current,
      rendererRef.current.domElement
    );
    controlsRef.current.enablePan = false;
    controlsRef.current.enableDamping = true;
    controlsRef.current.dampingFactor = 0.01;
    controlsRef.current.rotateSpeed = 0.75;

    // Post-processing setup
    composerRef.current = new EffectComposer(rendererRef.current);
    const renderPass = new RenderPass(sceneRef.current, cameraRef.current);
    composerRef.current.addPass(renderPass);

    colorPassRef.current = new ShaderPass(ColorAdjustmentShader);
    composerRef.current.addPass(colorPassRef.current);

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      controlsRef.current.update();
      composerRef.current.render();
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const { width, height } = getSize();
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
      composerRef.current.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    loadHDR(hdrId);
  }, [hdrId]);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 flex items-center z-20">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsUIVisible(!isUIVisible)}
          className="rounded"
        >
          {isUIVisible ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        {isUIVisible && (
          <Card className="absolute top-full left-0 mt-2 w-80">
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <label
                  htmlFor="exposure"
                  className="text-sm font-medium leading-none"
                >
                  Exposure: {exposure.toFixed(2)}
                </label>
                <Slider
                  id="exposure"
                  min={0}
                  max={2}
                  step={0.01}
                  value={[exposure]}
                  onValueChange={([value]) => handleExposureChange(value)}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="fov"
                  className="text-sm font-medium leading-none"
                >
                  FOV: {fov.toFixed(0)}°
                </label>
                <Slider
                  id="fov"
                  min={30}
                  max={150}
                  step={1}
                  value={[fov]}
                  onValueChange={([value]) => handleFovChange(value)}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="contrast"
                  className="text-sm font-medium leading-none"
                >
                  Contrast: {contrast.toFixed(2)}
                </label>
                <Slider
                  id="contrast"
                  min={0}
                  max={2}
                  step={0.01}
                  value={[contrast]}
                  onValueChange={([value]) => handleContrastChange(value)}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="brightness"
                  className="text-sm font-medium leading-none"
                >
                  Brightness: {brightness.toFixed(2)}
                </label>
                <Slider
                  id="brightness"
                  min={-1}
                  max={1}
                  step={0.01}
                  value={[brightness]}
                  onValueChange={([value]) => handleBrightnessChange(value)}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="saturation"
                  className="text-sm font-medium leading-none"
                >
                  Saturation: {saturation.toFixed(2)}
                </label>
                <Slider
                  id="saturation"
                  min={0}
                  max={2}
                  step={0.01}
                  value={[saturation]}
                  onValueChange={([value]) => handleSaturationChange(value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="hue"
                    className="text-sm font-medium leading-none"
                  >
                    Hue: {Math.round(hue * 100)}%
                  </label>
                  <Button
                    size="sm"
                    variant={isHueAnimating ? "secondary" : "outline"}
                    onClick={toggleHueAnimation}
                  >
                    🍄 {isHueAnimating ? "Stop" : "Play"}
                  </Button>
                </div>
                <Slider
                  id="hue"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[hue]}
                  onValueChange={([value]) => handleHueChange(value)}
                  disabled={isHueAnimating}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <Button onClick={handlePrevious} disabled={isLoading}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
        </Button>
        <Button onClick={handleNext} disabled={isLoading}>
          Next <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      <div ref={mountRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Loader2 className="h-16 w-16 animate-spin text-white" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-80 max-w-full">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skybox;
