import mapToRange from "../../utils/mapToRange";
import pointOnCircle from "../../utils/pointOnCircle";

const TWO_PI = Math.PI * 2;

const diamond = (
  x = 0,
  y = 0,
  radius = 1,
  pointCount = 8,
  offset = 0,
  colorCount = 3
) => {
  const baseAngle = mapToRange(offset, 0, 1, 0, TWO_PI);

  const points = [];
  for (let i = 0; i < pointCount; i++) {
    let startAngle = baseAngle + (TWO_PI / pointCount) * i;
    let addedAngle = i % 2 === 0 ? 0 : baseAngle;
    points[i] = pointOnCircle(x, y, startAngle + addedAngle, radius);
  }

  const facets = [];
  for (let i = 0; i < points.length; i++) {
    const c = i % colorCount.length;
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        let p1 = points[i];
        let p2 = points[j];
        facets.push({ color: c, points: [x, y, p1.x, p1.y, p2.x, p2.y] });
      }
    }
  }

  return facets;
};

export default diamond;
