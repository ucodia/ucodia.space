const BASE36_CHARSET = "0123456789abcdefghijkmnopqrstuvwxyz";

export const randomString = (n) => {
  return Array(n)
    .fill(0)
    .map(() => BASE36_CHARSET[(Math.random() * BASE36_CHARSET.length) | 0])
    .join("");
};

export const lcg = (seed, modulus, multiplier, increment) => {
  const m = modulus;
  const a = multiplier;
  const c = increment;
  let z = seed;

  return () => {
    z = (a * z + c) % m;
    return z / m;
  };
};

// values from the Numerical Recipes book
export const numericalRecipesLcg = (seed) =>
  lcg(seed, 4294967296, 1664525, 1013904223);

// values from MINSTD
export const minstdLcg = (seed) => lcg(seed, 2147483647, 48271, 0);
