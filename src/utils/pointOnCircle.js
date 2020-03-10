export default (x, y, angle, radius) => {
  return {
    x: radius * Math.cos(angle) + x,
    y: radius * Math.sin(angle) + y
  };
};
