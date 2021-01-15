export const lorenz = (params) => {
  const { x, y, z, a, b, c, dt, sf = 0.15 } = params;

  return {
    x: x + a * (y - x) * dt * sf,
    y: y + (x * (b - z) - y) * dt * sf,
    z: z + (x * y - c * z) * dt * sf,
  };
};

export const clifford = (params) => {
  const { x, y, a, b, c, d } = params;
  return {
    x: Math.sin(a * y) + c * Math.cos(a * x),
    y: Math.sin(b * x) + d * Math.cos(b * y),
  };
};

export const halvorsen = (params) => {
  const { x, y, z, a } = params;
  return {
    x: x + (-a * x - 4 * y - 4 * z - y * y),
    y: y + (-a * y - 4 * z - 4 * x - z * z),
    z: z + (-a * z - 4 * x - 4 * y - x * x),
  };
};

export const aizawa = (params) => {
  const { x, y, z, a, b, c, d, e } = params;
  return {
    x: x + ((z - b) * x - d * y),
    y: y + (d * x + (z - b) * y),
    z: z + (c + a * z - Math.pow(z, 3) / 3 + e * z * Math.pow(x, 3)),
  };
};
