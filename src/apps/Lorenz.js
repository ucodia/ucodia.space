import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { lorenz } from "../utils/attractors";
import { getBounds, getBoundsOfBounds } from "../utils/boundaries";
import getPathData from "../utils/getPathData";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
`;

const Plot = styled.svg`
  width: 90%;
  height: 90%;

  path {
    fill: none;
  }
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
  const strokeWidth = Math.min(bounds.width, bounds.height) * 0.001;

  return (
    <Container>
      <Plot
        viewBox={`${bounds[`${projection.x}Min`]} ${
          bounds[`${projection.y}Min`]
        } ${bounds.width} ${bounds.height}`}
      >
        {pointsSet.map((points, i) => {
          return (
            <>
              <g>
                <path
                  key={i}
                  d={getPathData(points)}
                  stroke="gold"
                  strokeWidth={strokeWidth}
                />
              </g>
              <g transform="scale(-1,1)">
                <path
                  key={i}
                  d={getPathData(points)}
                  stroke="silver"
                  strokeWidth={strokeWidth}
                />
              </g>
            </>
          );
        })}
      </Plot>
    </Container>
  );
};

export default Attractors;
