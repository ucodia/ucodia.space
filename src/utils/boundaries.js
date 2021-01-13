export const getBounds = (points) => {
  const xMin = Math.min(...points.map((p) => p.x));
  const yMin = Math.min(...points.map((p) => p.y));
  const zMin = Math.min(...points.map((p) => p.z));
  const xMax = Math.max(...points.map((p) => p.x));
  const yMax = Math.max(...points.map((p) => p.y));
  const zMax = Math.max(...points.map((p) => p.z));
  return {
    xMin,
    yMin,
    zMin,
    xMax,
    yMax,
    zMax,
    width: Math.abs(xMin) + Math.abs(xMax),
    height: Math.abs(yMin) + Math.abs(yMax),
  };
};

export const getBoundsOfBounds = (bounds) => {
  return {
    xMin: Math.min(...bounds.map((b) => b.xMin)),
    yMin: Math.min(...bounds.map((b) => b.yMin)),
    zMin: Math.min(...bounds.map((b) => b.zMin)),
    xMax: Math.max(...bounds.map((b) => b.xMax)),
    yMax: Math.max(...bounds.map((b) => b.yMax)),
    zMax: Math.max(...bounds.map((b) => b.zMax)),
    width: Math.max(...bounds.map((b) => b.width)),
    height: Math.max(...bounds.map((b) => b.height)),
  };
};
