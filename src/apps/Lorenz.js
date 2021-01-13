import React, { useMemo, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const Plot = styled.svg`
  width: 100%;
  height: 100%;
`;

const lorenz = (params) => {
  const { x, y, z, a, b, c } = params;
  const dt = 0.01;

  return {
    x: x + a * (y - x) * dt,
    y: y + (x * (b - z) - y) * dt,
    z: z + (x * y - c * z) * dt,
  };
};

const getN = (fn, n, params) => {
  const points = [];
  let currentParams = { ...params };

  for (let i = 0; i < n; i++) {
    const result = fn(currentParams);
    points.push(result);
    currentParams = { ...currentParams, ...result };
  }

  return points;
};

const Attractors = () => {
  const [points] = useState(
    getN(lorenz, 100000, {
      x: 0.01,
      y: 0,
      z: 0,
      a: 10,
      b: 28,
      c: 8.0 / 3.0,
    })
  );
  const bounds = useMemo(() => {
    const xMin = Math.min(...points.map((p) => p.x));
    const yMin = Math.min(...points.map((p) => p.y));
    const xMax = Math.max(...points.map((p) => p.x));
    const yMax = Math.max(...points.map((p) => p.y));
    return {
      xMin,
      yMin,
      xMax,
      yMax,
      width: Math.abs(xMin) + Math.abs(xMax),
      height: Math.abs(yMin) + Math.abs(yMax),
    };
  }, [points]);
  const pathData = useMemo(() => {
    return `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`;
  }, [points]);

  return (
    <Container>
      <Plot
        viewBox={`${bounds.xMin} ${bounds.yMin} ${bounds.width} ${bounds.height}`}
      >
        <path d={pathData} fill="none" stroke="black" strokeWidth="0.01px" />
      </Plot>
    </Container>
  );
};

export default Attractors;
