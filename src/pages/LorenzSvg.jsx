import { GUI } from "dat.gui";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

export const meta = {
  name: "Lorenz (for plotters)",
  created: "2021-01-13",
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
`;

const Plot = styled.svg`
  width: 90%;
  height: 90%;

  path {
    fill: none;
  }
`;

export const saveSVG = (svgElement, parameters) => {
  if (svgElement) {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });

    const filename = `lorenz-attractor_${Object.values(parameters).join(
      "_"
    )}.svg`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
};

function lorenz({ x, y, z, a, b, c, dt }) {
  return {
    x: x + a * (y - x) * dt,
    y: y + (x * (b - z) - y) * dt,
    z: z + (x * y - c * z) * dt,
  };
}

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

const getPoints = (fn, n, params, offset = 0) => {
  const points = [];
  let currentParams = { ...params };

  for (let i = 0; i < n + offset; i++) {
    const result = fn(currentParams);
    currentParams = { ...currentParams, ...result };
    if (i > offset) points.push(result);
  }

  return points;
};

const getAttractorPoints = (parameters) => {
  switch (parameters.attractor) {
    case "lorenz": {
      return getPoints(
        lorenz,
        parameters.pointCount,
        {
          x: 0.1,
          y: 0,
          z: 0,
          a: 10,
          b: 28,
          c: 8.0 / 3.0,
          dt: parameters.dt,
        },
        parameters.offset
      );
    }
    default: {
    }
  }
};

const LorenzSvg = () => {
  const svgRef = useRef(null);
  const [parameters, setParameters] = useState({
    pointCount: 10000,
    offset: 500,
    attractor: "lorenz",
    projection: "xy",
    dt: 1 / 400,
  });
  const points = useMemo(() => getAttractorPoints(parameters), [parameters]);
  const bounds = useMemo(
    () => getBounds(points, parameters.projection),
    [points, parameters.projection]
  );
  const strokeWidth = Math.min(bounds.width, bounds.height) * 0.001;

  useEffect(() => {
    const gui = new GUI();
    gui.add(parameters, "attractor", ["lorenz"]).onChange((value) => {
      setParameters((prev) => ({ ...prev, attractor: value }));
    });
    gui.add(parameters, "pointCount", 100, 50000).onChange((value) => {
      setParameters((prev) => ({ ...prev, pointCount: value }));
    });
    gui.add(parameters, "offset", 0, 10000).onChange((value) => {
      setParameters((prev) => ({ ...prev, offset: value }));
    });
    gui
      .add(parameters, "projection", ["xy", "yx", "xz", "zx", "yz", "zy"])
      .onChange((value) => {
        setParameters((prev) => ({ ...prev, projection: value }));
      });
    gui.add(parameters, "dt", 0.001, 0.02, 0.0001).onChange((value) => {
      setParameters((prev) => ({ ...prev, dt: value }));
    });
    gui
      .add({ save: () => saveSVG(svgRef.current, parameters) }, "save")
      .name("Save as SVG");

    return () => {
      gui.destroy();
    };
  }, []);

  return (
    <Container>
      <Plot
        ref={svgRef}
        viewBox={`${bounds.min0} ${bounds.min1}
         ${bounds.width} ${bounds.height}`}
      >
        <g>
          <path
            d={getPathData(points, parameters.projection)}
            stroke="black"
            strokeWidth={strokeWidth}
          />
        </g>
      </Plot>
    </Container>
  );
};

export default LorenzSvg;
