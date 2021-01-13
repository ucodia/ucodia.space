const getPathData = (points, xFn = (p) => p.x, yFn = (p) => p.y) =>
  `M ${points.map((p) => `${xFn(p)} ${yFn(p)}`).join(" L ")}`;

export default getPathData;
