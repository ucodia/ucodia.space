export const lorenz = (params) => {
  const { x, y, z, a, b, c, dt } = params;

  return {
    x: x + a * (y - x) * dt,
    y: y + (x * (b - z) - y) * dt,
    z: z + (x * y - c * z) * dt,
  };
};
