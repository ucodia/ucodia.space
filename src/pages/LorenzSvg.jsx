import { useState, useEffect, useMemo, useRef } from "react";
import { GUI } from "lil-gui";
import saveSVG from "@/utils/saveSvg";

export const meta = {
  name: "Lorenz (for plotters)",
  created: "2021-01-13",
};

const attractors = {
  lorenz: {
    fn: ({ x, y, z, a, b, c, dt }) => ({
      x: x + a * (y - x) * dt,
      y: y + (x * (b - z) - y) * dt,
      z: z + (x * y - c * z) * dt,
    }),
    default: { x: 0.1, y: 0, z: -1, a: 10, b: 28, c: 8 / 3, dt: 0.003 },
    ranges: {
      a: { min: 0, max: 30, step: 0.1 },
      b: { min: 0, max: 100, step: 0.1 },
      c: { min: 0, max: 10, step: 0.1 },
    },
    params: ["a", "b", "c"],
  },
  halvorsen: {
    fn: ({ x, y, z, a, dt }) => ({
      x: x + (-a * x - 4 * y - 4 * z - y * y) * dt,
      y: y + (-a * y - 4 * z - 4 * x - z * z) * dt,
      z: z + (-a * z - 4 * x - 4 * y - x * x) * dt,
    }),
    default: { x: 1, y: 0, z: 0, a: 1.4, dt: 0.004 },
    ranges: {
      a: { min: 0, max: 4, step: 0.01 },
    },
    params: ["a"],
  },
  sprott: {
    fn: ({ x, y, z, a, b, dt }) => ({
      x: x + (y + a * x * y + x * z) * dt,
      y: y + (1 - b * (x * x) + y * z) * dt,
      z: z + (x - x * x - y * y) * dt,
    }),
    default: { x: 0.1, y: 0.1, z: 0.1, a: 2.07, b: 1.79, dt: 0.008 },
    ranges: {
      a: { min: 0, max: 4, step: 0.01 },
      b: { min: 0, max: 4, step: 0.01 },
    },
    params: ["a", "b"],
  },
  thomas: {
    fn: ({ x, y, z, b, dt }) => ({
      x: x + (Math.sin(y) - b * x) * dt,
      y: y + (Math.sin(z) - b * y) * dt,
      z: z + (Math.sin(x) - b * z) * dt,
    }),
    default: { x: 1, y: 0, z: 0, b: 0.19, dt: 0.05 },
    ranges: {
      b: { min: 0, max: 1, step: 0.001 },
    },
    params: ["b"],
  },
  chen: {
    fn: ({ x, y, z, a, b, c, dt }) => ({
      x: x + a * (y - x) * dt,
      y: y + ((c - a) * x - x * z + c * y) * dt,
      z: z + (x * y - b * z) * dt,
    }),
    default: { x: 1, y: 1, z: 1, a: 40, b: 3, c: 28, dt: 0.002 },
    ranges: {
      a: { min: 20, max: 60, step: 0.1 },
      b: { min: 1, max: 10, step: 0.1 },
      c: { min: 10, max: 50, step: 0.1 },
    },
    params: ["a", "b", "c"],
  },
  rossler: {
    fn: ({ x, y, z, a, b, c, dt }) => ({
      x: x + (-y - z) * dt,
      y: y + (x + a * y) * dt,
      z: z + (b + z * (x - c)) * dt,
    }),
    default: { x: 1, y: 1, z: 1, a: 0.2, b: 0.2, c: 5.7, dt: 0.01 },
    ranges: {
      a: { min: 0, max: 1, step: 0.01 },
      b: { min: 0, max: 2, step: 0.01 },
      c: { min: 0, max: 20, step: 0.1 },
    },
    params: ["a", "b", "c"],
  },
};

function getPathData(points, projection) {
  const xFn = (p) => p[projection[0]];
  const yFn = (p) => p[projection[1]];
  return `M ${points.map((p) => `${xFn(p)} ${yFn(p)}`).join(" L ")}`;
}

function getBounds(points, projection) {
  const min0 = Math.min(...points.map((p) => p[projection[0]]));
  const min1 = Math.min(...points.map((p) => p[projection[1]]));
  const max0 = Math.max(...points.map((p) => p[projection[0]]));
  const max1 = Math.max(...points.map((p) => p[projection[1]]));

  return {
    min0,
    min1,
    max0,
    max1,
    width: max0 - min0,
    height: max1 - min1,
  };
}

const getPoints = (fn, n, params, offset) => {
  const points = [];
  let currentParams = { ...params };

  for (let i = 0; i < n + offset; i++) {
    const result = fn(currentParams);
    currentParams = { ...currentParams, ...result };
    if (i > offset) points.push(result);
  }

  return points;
};

const getAttractorPoints = (settings) => {
  return getPoints(
    attractors[settings.attractor].fn,
    settings.pointCount,
    {
      x: settings.x,
      y: settings.y,
      z: settings.z,
      a: settings.a,
      b: settings.b,
      c: settings.c,
      dt: settings.dt,
    },
    settings.offset
  );
};

const uiConfig = {
  attractor: {
    default: "lorenz",
    options: Object.keys(attractors),
  },
  pointCount: {
    default: 10000,
    min: 100,
    max: 100000,
    step: 1,
  },
  offset: {
    default: 100,
    min: 0,
    max: 10000,
  },
  dt: {
    default: 0.003,
    min: 0.001,
    max: 0.02,
    step: 0.0001,
  },
  projection: {
    default: "xy",
    options: ["xy", "xz", "yz"],
  },
  x: {
    default: attractors.lorenz.default.x,
    min: -1,
    max: 1,
  },
  y: {
    default: attractors.lorenz.default.y,
    min: -1,
    max: 1,
  },
  z: {
    default: attractors.lorenz.default.z,
    min: -1,
    max: 1,
  },
  a: {
    default: attractors.lorenz.default.a,
    ...attractors.lorenz.ranges.a,
  },
  b: {
    default: attractors.lorenz.default.b,
    ...attractors.lorenz.ranges.b,
  },
  c: {
    default: attractors.lorenz.default.c,
    ...attractors.lorenz.ranges.c,
  },
};

const defaultSettings = Object.fromEntries(
  Object.entries(uiConfig).map(([key, value]) => [key, value.default])
);

const LorenzSvg = () => {
  const guiRef = useRef(null);
  const controllersRef = useRef({}); // Add controllers ref
  const svgRef = useRef(null);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    guiRef.current = new GUI();
    const allParams = ["a", "b", "c"];

    Object.entries(uiConfig).forEach(([key, config]) => {
      const control = config.options
        ? guiRef.current.add(settings, key, config.options)
        : guiRef.current.add(
            settings,
            key,
            config.min,
            config.max,
            config.step
          );

      controllersRef.current[key] = control;

      // Hide parameter controls initially if not used by current attractor
      if (
        allParams.includes(key) &&
        !attractors[settings.attractor].params.includes(key)
      ) {
        control.hide();
      }

      control.onChange((value) => {
        if (key === "attractor") {
          const newAttractor = attractors[value];
          setSettings((prev) => ({
            ...prev,
            ...newAttractor.default,
            attractor: value,
          }));

          // Show/hide and update parameter controls
          allParams.forEach((param) => {
            const ctrl = controllersRef.current[param];
            if (newAttractor.params.includes(param)) {
              ctrl.show();
              if (newAttractor.ranges?.[param]) {
                ctrl.min(newAttractor.ranges[param].min);
                ctrl.max(newAttractor.ranges[param].max);
                ctrl.step(newAttractor.ranges[param].step);
                ctrl.setValue(newAttractor.default[param]);
              }
            } else {
              ctrl.hide();
            }
          });
        } else {
          setSettings((prev) => ({ ...prev, [key]: value }));
        }
      });
    });

    guiRef.current
      .add(
        {
          reset: () => {
            const newValues = attractors[settings.attractor].default;
            setSettings((prev) => ({
              ...prev,
              ...newValues,
            }));
            // Update displayed values after reset
            Object.entries(newValues).forEach(([key, value]) => {
              if (controllersRef.current[key]) {
                controllersRef.current[key].setValue(value);
              }
            });
          },
        },
        "reset"
      )
      .name("Reset Attractor");
    guiRef.current
      .add(
        {
          save: () => {
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const filename = `lorenz-attractor-${timestamp}.svg`;
            saveSVG(svgRef.current, filename);
          },
        },
        "save"
      )
      .name("Save SVG");

    return () => guiRef.current.destroy();
  }, []);

  const points = useMemo(() => getAttractorPoints(settings), [settings]);
  const bounds = useMemo(
    () => getBounds(points, settings.projection),
    [points, settings.projection]
  );
  const strokeWidth = Math.min(bounds.width, bounds.height) * 0.001;

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <svg
        className="w-[90%] h-[90%]"
        ref={svgRef}
        viewBox={`${bounds.min0} ${bounds.min1} ${bounds.width} ${bounds.height}`}
      >
        <g>
          <path
            className="fill-none stroke-[#121212] dark:stroke-white"
            d={getPathData(points, settings.projection)}
            strokeWidth={strokeWidth}
          />
        </g>
      </svg>
    </div>
  );
};

export default LorenzSvg;
