import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { lorenz } from "../utils/attractors";
import { getBounds, getBoundsOfBounds } from "../utils/boundaries";
import getPathData from "../utils/getPathData";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const Plot = styled.svg`
  width: 100%;
  height: 100%;
`;

const getPoints = (fn, n, params) => {
  const points = [];
  let currentParams = { ...params };

  for (let i = 0; i < n; i++) {
    const result = fn(currentParams);
    points.push(result);
    currentParams = { ...currentParams, ...result };
  }

  return points;
};
const pointsCount = 50000;
const projection = { x: "x", y: "y" };

const Attractors = () => {
  const [pointsSet] = useState([
    getPoints(lorenz, pointsCount, {
      x: 0.1,
      y: 0,
      z: 0,
      a: 10,
      b: 28,
      c: 8.0 / 3.0,
      dt: 0.01,
    }),
  ]);
  const bounds = useMemo(() => {
    return getBoundsOfBounds(pointsSet.map(getBounds));
  }, [pointsSet]);
  const colors = ["black", "blue", "red"];

  return (
    <Container>
      <Plot
        viewBox={`${bounds[`${projection.x}Min`]} ${
          bounds[`${projection.y}Min`]
        } ${bounds.width} ${bounds.height}`}
      >
        {pointsSet.map((points, i) => {
          return (
            <path
              key={i}
              d={getPathData(
                points,
                (p) => p[projection.x],
                (p) => p[projection.y]
              )}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth="0.02px"
            />
          );
        })}
      </Plot>
    </Container>
  );
};

export default Attractors;
