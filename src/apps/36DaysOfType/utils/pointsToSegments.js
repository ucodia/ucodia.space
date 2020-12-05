const dist = (pointA, pointB) =>
  Math.hypot(Math.abs(pointA.x - pointB.x), Math.abs(pointA.y - pointB.y));

/**
 * Groups sequential points into segments.
 * @param {*} points
 * @param {*} distanceThreshold
 */
const pointsToSegments = (points, distanceThreshold = 1) => {
  const segments = [[]];

  points.forEach((point) => {
    const currentSegment = segments[segments.length - 1];
    if (currentSegment.length === 0) {
      currentSegment.push(point);
    } else {
      const prevPoint = currentSegment[currentSegment.length - 1];
      const d = dist(point, prevPoint);
      if (d < distanceThreshold) {
        currentSegment.push(point);
      } else {
        segments.push([]);
      }
    }
  });

  return segments;
};

export default pointsToSegments;
