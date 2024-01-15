import { GUI } from "dat.gui";
import autoStretchP5 from "../../utils/autoStretchP5";
import { numericalRecipesLcg as lcg } from "../../utils/lcg";

export const meta = {
  slug: "infinite-chaos",
  name: "Infinite Chaos",
  created: "2023-02-12",
};

/**
 * Computes the next position in a system
 * as defined by a 2D quadratic function
 * @param {*} x Current x position
 * @param {*} y Current y position
 * @param {*} ax a parameters of the system
 * @param {*} ay b parameters of the system
 * @returns The next coordinate [x, y]
 */
function attractor(x, y, ax, ay) {
  return [
    ax[0] +
      ax[1] * x +
      ax[2] * x * x +
      ax[3] * x * y +
      ax[4] * y +
      ax[5] * y * y,
    ay[0] +
      ay[1] * x +
      ay[2] * x * x +
      ay[3] * x * y +
      ay[4] * y +
      ay[5] * y * y,
  ];
}

const colors = {
  black: "#000000",
  darkgrey: "#333333",
  lightgrey: "#cccccc",
  white: "#ffffff",
  cyan: "#00aeef",
  magenta: "#ec008c",
  yellow: "#fff200",
};

const defaultSx = {
  length: 100000,
  background: colors.darkgrey,
  color: colors.white,
  opacity: 0.3,
  marginRatio: 0.3,
  seed: "3vg11h8l6",
  presetSeed: "",
  params: {},
  attractorData: {},
  highRes: true,
};

const seedsOfInterest = [
  "3vg11h8l6",
  "1mr99uuz9",
  "3r3anjk2v",
  "miiigngbt",
  "sp57s52kv",
  "unnxuw7ol",
];

const infiniteChaos = (sketch) => {
  const urlSx = getURLParams();
  const sx = { ...defaultSx, ...urlSx };

  if (!sx.seed) {
    sx.seed = randomString();
  }
  updateAttractorData();

  const gui = new GUI();
  gui.close();
  const lengthController = gui.add(sx, "length", 1000, 1000000, 1000);
  const bgController = gui.addColor(sx, "background");
  const colorController = gui.addColor(sx, "color");
  const opacityController = gui.add(sx, "opacity", 0, 1, 0.01);
  const highResController = gui.add(sx, "highRes");
  const seedController = gui.add(sx, "seed");
  const presetSeedController = gui.add(sx, "presetSeed", seedsOfInterest);

  lengthController.onFinishChange(() => {
    updateAttractorData();
    sketch.draw();
  });
  bgController.onFinishChange(() => {
    sketch.draw();
  });
  colorController.onFinishChange(() => {
    sketch.draw();
  });
  opacityController.onFinishChange(() => {
    sketch.draw();
  });
  highResController.onFinishChange(() => {
    sketch.draw();
  });
  seedController.onFinishChange(() => {
    updateAttractorData();
    sketch.draw();
  });
  presetSeedController.onFinishChange(() => {
    sx.seed = sx.presetSeed;
    updateAttractorData();
    sketch.draw();
  });

  const actions = {
    randomize: () => {
      const startTime = performance.now();

      do {
        sx.seed = randomString();
        const rand = lcg(Math.abs(hashCode(sx.seed)));
        sx.params = createAttractorParams(rand);
      } while (!isChaotic(sx.params));

      const endTime = performance.now();
      const elapsedTime = endTime - startTime;
      console.log(
        `Found chaotic seed ${sx.seed} in ${elapsedTime.toFixed(2)}ms`
      );

      gui.updateDisplay();
      updateAttractorData();
      sketch.draw();
    },
    save: () => {
      sketch.save(`infinite-chaos-${sx.seed}.png`);
    },
    shareUrl: () => {
      const { seed } = sx;
      setURLParams({ seed });
    },
  };
  Object.keys(actions).forEach((name) => gui.add(actions, name));

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    autoStretchP5(sketch, layout);
    sketch.noLoop();
  };

  function layout() {}

  sketch.draw = (ctx) => {
    if (!ctx) ctx = sketch;

    ctx.clear();
    ctx.background(sx.background);
    ctx.noStroke();
    ctx.fill(`${sx.color}${opacityToHex(sx.opacity)}`);

    const { x, y, xMin, xMax, yMin, yMax } = sx.attractorData;

    const margin = ctx.width * sx.marginRatio;
    const attractorWidth = xMax - xMin;
    const attractorHeight = yMax - yMin;
    const scale = Math.min(
      (ctx.width - margin) / attractorWidth,
      (ctx.height - margin) / attractorHeight
    );
    const centerX = (ctx.width - attractorWidth * scale) / 2;
    const centerY = (ctx.height - attractorHeight * scale) / 2;
    for (let i = 0; i < x.length; i++) {
      let ix = centerX + (x[i] - xMin) * scale;
      let iy = centerY + (y[i] - yMin) * scale;

      if (sx.highRes) {
        ctx.ellipse(ix, iy, 1, 1);
      } else {
        ctx.rect(ix, iy, 1, 1);
      }
    }
  };

  sketch.cleanup = () => {
    gui.destroy();
  };

  function updateAttractorData() {
    const rand = lcg(Math.abs(hashCode(sx.seed)));
    sx.params = createAttractorParams(rand);
    sx.attractorData = generateAttractor(sx.params, sx.length);
  }
};

function createAttractorParams(rand) {
  const ax = [];
  const ay = [];
  for (let i = 0; i < 6; i++) {
    ax[i] = truncateFloat(4 * (rand() - 0.5));
    ay[i] = truncateFloat(4 * (rand() - 0.5));
  }
  const x0 = truncateFloat(rand() - 0.5);
  const y0 = truncateFloat(rand() - 0.5);

  return { ax, ay, x0, y0 };
}

const lyapunovStart = 1000;
const lyapunovEnd = 2000;
function isChaotic(params) {
  const { x, y, xMin, xMax, yMin, yMax } = generateAttractor(
    params,
    lyapunovEnd
  );
  let lyapunov = 0;
  let dRand = lcg(Math.abs(hashCode("disturbance")));
  let d0, dd, dx, dy, xe, ye;

  do {
    xe = x[0] + (dRand() - 0.5) / 1000.0;
    ye = y[0] + (dRand() - 0.5) / 1000.0;
    dx = x[0] - xe;
    dy = y[0] - ye;
    d0 = Math.sqrt(dx * dx + dy * dy);
  } while (d0 <= 0);

  if (
    xMin < -1e10 ||
    yMin < -1e10 ||
    xMax > 1e10 ||
    yMax > 1e10 ||
    Number.isNaN(xMin) ||
    Number.isNaN(xMax) ||
    Number.isNaN(yMin) ||
    Number.isNaN(yMax)
  ) {
    // attracted towards infinity
    return false;
  }

  for (let i = 1; i < lyapunovEnd; i++) {
    dx = x[i] - x[i - 1];
    dy = y[i] - y[i - 1];

    if (Math.abs(dx) < 1e-10 && Math.abs(dy) < 1e-10) {
      // attracted towards a single point
      return false;
    }

    if (i > lyapunovStart) {
      const [newXe, newYe] = attractor(xe, ye, params.ax, params.ay);
      dx = x[i] - newXe;
      dy = y[i] - newYe;
      dd = Math.sqrt(dx * dx + dy * dy);
      lyapunov += Math.log(Math.abs(dd / d0));
      xe = x[i] + (d0 * dx) / dd;
      ye = y[i] + (d0 * dy) / dd;
    }
  }

  if (Math.abs(lyapunov) < 10) {
    // neutral stable attractor
    return false;
  } else if (lyapunov < 0) {
    // periodic attractor
    return false;
  }

  return true;
}

function generateAttractor({ ax, ay, x0, y0 }, n) {
  let x = [x0];
  let y = [y0];
  let xMin = Number.MAX_VALUE;
  let xMax = Number.MIN_VALUE;
  let yMin = Number.MAX_VALUE;
  let yMax = Number.MIN_VALUE;

  for (let i = 1; i < n; i++) {
    const [nextX, nextY] = attractor(x[i - 1], y[i - 1], ax, ay);
    x[i] = nextX;
    y[i] = nextY;

    xMin = Math.min(xMin, x[i]);
    yMin = Math.min(yMin, y[i]);
    xMax = Math.max(xMax, x[i]);
    yMax = Math.max(yMax, y[i]);
  }

  return { x, y, xMin, xMax, yMin, yMax };
}

function opacityToHex(opacity) {
  return Math.round(Math.max(0, Math.min(1, opacity)) * 255)
    .toString(16)
    .toUpperCase()
    .padStart(2, "0");
}

function truncateFloat(num, decimalPlaces = 4) {
  return Number.parseFloat(num.toFixed(decimalPlaces));
}

function hashCode(s) {
  for (var i = 0, h = 0; i < s.length; i++)
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

function randomInt(min, max, lcg) {
  return Math.floor(lcg() * (max - min + 1)) + min;
}

function randomString() {
  return Math.random().toString(36).substr(2, 9);
}

function getURLParams() {
  const params = new URLSearchParams(window.location.search);
  const parsedParams = {};
  for (const [key, value] of params) {
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      parsedParams[key] = parseFloat(value);
    } else {
      parsedParams[key] = value;
    }
  }
  return parsedParams;
}

function setURLParams(obj) {
  const url = new URL(window.location.href);
  const params = Array.from(url.searchParams.keys());
  params.forEach((param) => {
    if (!Object.hasOwnProperty.call(obj, param)) {
      url.searchParams.delete(param);
    }
  });
  for (const [key, value] of Object.entries(obj)) {
    url.searchParams.set(key, value);
  }
  window.history.pushState(null, "", url);
}

export default infiniteChaos;
