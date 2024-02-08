import { GUI } from "dat.gui";
import autoStretchP5 from "../../utils/autoStretchP5";
import { numericalRecipesLcg, randomString } from "../../utils/random";

export const meta = {
  slug: "infinite-chaos",
  name: "Infinite Chaos",
  created: "2024-01-10",
};

/**
 * Computes the next coordinate in a system
 * as defined by a 2D quadratic function
 * @param {*} x Current x coordinate
 * @param {*} y Current y coordinate
 * @param {*} ax a parameters of the system
 * @param {*} ay b parameters of the system
 * @param {*} xFn function to apply to x coordinate
 * @param {*} yFn function to apply to y coordinate
 * @returns The next coordinate [x, y]
 */
function attractor(x, y, ax, ay, xFn = (v) => v, yFn = (v) => v) {
  return [
    ax[0] +
      ax[1] * xFn(x) +
      ax[2] * xFn(x) * xFn(x) +
      ax[3] * xFn(x) * yFn(y) +
      ax[4] * yFn(y) +
      ax[5] * yFn(y) * yFn(y),
    ay[0] +
      ay[1] * xFn(x) +
      ay[2] * xFn(x) * xFn(x) +
      ay[3] * xFn(x) * yFn(y) +
      ay[4] * yFn(y) +
      ay[5] * yFn(y) * yFn(y),
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
  pointCount: 100000,
  background: colors.darkgrey,
  color: colors.white,
  particleSize: 1,
  opacity: 0.3,
  marginRatio: 0.1,
  xModifier: "noop",
  yModifier: "noop",
  seed: "3vg11h8l6",
  presetSeed: "",
  highRes: true,
  swapColors: false,
};

const seedsOfInterest = [
  "3vg11h8l6",
  "1mr99uuz9",
  "3r3anjk2v",
  "miiigngbt",
  "sp57s52kv",
  "unnxuw7ol",
  "t6yerjusf",
];

const modifiers = {
  noop: (v) => v,
  sin: Math.sin,
  cos: Math.cos,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  log: Math.log,
  asinh: Math.asinh,
  atan: Math.atan,
};

const infiniteChaos = (sketch) => {
  const urlSx = getURLParams();
  const sx = { ...defaultSx, ...urlSx };
  let params = {};
  let attractorData = {};
  updateAttractorData();

  const gui = new GUI();
  gui.close();
  const pointCountController = gui.add(sx, "pointCount", 10000, 1000000, 10000);
  const bgController = gui.addColor(sx, "background");
  const colorController = gui.addColor(sx, "color");
  const swapColorsController = gui.add(sx, "swapColors");
  const particleSizeController = gui.add(sx, "particleSize", 0, 2, 0.1);
  const opacityController = gui.add(sx, "opacity", 0, 1, 0.05);
  const marginRatioController = gui.add(sx, "marginRatio", 0, 0.5, 0.05);
  const advancedFolder = gui.addFolder("advanced");
  const xModifierController = advancedFolder.add(
    sx,
    "xModifier",
    Object.keys(modifiers)
  );
  const yModifierController = advancedFolder.add(
    sx,
    "yModifier",
    Object.keys(modifiers)
  );
  const highResController = gui.add(sx, "highRes");
  const seedController = gui.add(sx, "seed");
  const presetSeedController = gui.add(sx, "presetSeed", seedsOfInterest);

  pointCountController.onFinishChange(() => {
    updateAttractorData();
    sketch.draw();
  });
  bgController.onFinishChange(() => {
    sketch.draw();
  });
  colorController.onFinishChange(() => {
    sketch.draw();
  });
  swapColorsController.onFinishChange(() => {
    sketch.draw();
  });
  opacityController.onFinishChange(() => {
    sketch.draw();
  });
  marginRatioController.onFinishChange(() => {
    sketch.draw();
  });
  xModifierController.onFinishChange(() => {
    updateAttractorData();
    sketch.draw();
  });
  yModifierController.onFinishChange(() => {
    updateAttractorData();
    sketch.draw();
  });
  particleSizeController.onFinishChange(() => {
    sketch.draw();
  });
  highResController.onFinishChange(() => {
    sketch.draw();
  });
  seedController.onFinishChange(() => {
    sx.presetSeed = "";
    gui.updateDisplay();
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
        sx.seed = randomString(8);
        const rand = namedLcg(sx.seed);
        params = createAttractorParams(rand);
      } while (
        !isChaotic(params, modifiers[sx.xModifier], modifiers[sx.yModifier])
      );

      const elapsedTime = performance.now() - startTime;
      console.log(
        `Found chaotic seed ${sx.seed} in ${elapsedTime.toFixed(2)}ms`
      );

      sx.presetSeed = "";
      gui.updateDisplay();
      updateAttractorData();
      sketch.draw();
    },
    save: () => {
      const mod =
        sx.xModifier !== defaultSx.xModifier ||
        sx.yModifier !== defaultSx.yModifier
          ? `-${sx.xModifier}-${sx.yModifier}`
          : "";
      sketch.save(`infinite-chaos-${sx.seed}${mod}.png`);
    },
    shareUrl: () => {
      const filteredParams = ["presetSeed"];
      const allowedParams = Object.keys(defaultSx).filter(
        (v) => !filteredParams.includes(filteredParams)
      );

      const urlParams = { seed: sx.seed };
      allowedParams.forEach((key) => {
        const value = sx[key];
        if (value !== defaultSx[key]) {
          urlParams[key] =
            typeof value === "number" ? truncateFloat(value) : value;
        }
      });
      setURLParams(urlParams);
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

    const fg = sx.swapColors ? sx.background : sx.color;
    const bg = sx.swapColors ? sx.color : sx.background;

    ctx.clear();
    ctx.background(bg);
    ctx.noStroke();
    ctx.fill(`${fg}${opacityToHex(sx.opacity)}`);

    const { x, y, xMin, xMax, yMin, yMax } = attractorData;

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
        ctx.ellipse(ix, iy, sx.particleSize, sx.particleSize);
      } else {
        ctx.rect(ix, iy, sx.particleSize, sx.particleSize);
      }
    }
  };

  sketch.cleanup = () => {
    gui.destroy();
  };

  function updateAttractorData() {
    const rand = namedLcg(sx.seed);
    params = createAttractorParams(rand);

    const startTime = performance.now();

    attractorData = generateAttractor(
      params,
      sx.pointCount,
      modifiers[sx.xModifier],
      modifiers[sx.yModifier]
    );

    const elapsedTime = performance.now() - startTime;
    console.log(
      `Generated attractors with params ${JSON.stringify(
        params
      )} in ${elapsedTime.toFixed(2)}ms`
    );
  }
};

function createAttractorParams(rand) {
  const ax = [];
  const ay = [];
  for (let i = 0; i < 6; i++) {
    ax[i] = 4 * (rand() - 0.5);
    ay[i] = 4 * (rand() - 0.5);
  }
  const x0 = rand() - 0.5;
  const y0 = rand() - 0.5;

  return { ax, ay, x0, y0 };
}

function generateAttractor({ ax, ay, x0, y0 }, n, xFn, yFn) {
  let x = [x0];
  let y = [y0];
  let xMin = Number.MAX_VALUE;
  let xMax = Number.MIN_VALUE;
  let yMin = Number.MAX_VALUE;
  let yMax = Number.MIN_VALUE;

  for (let i = 1; i < n; i++) {
    const [nextX, nextY] = attractor(x[i - 1], y[i - 1], ax, ay, xFn, yFn);
    x[i] = nextX;
    y[i] = nextY;

    xMin = Math.min(xMin, x[i]);
    yMin = Math.min(yMin, y[i]);
    xMax = Math.max(xMax, x[i]);
    yMax = Math.max(yMax, y[i]);
  }

  return { x, y, xMin, xMax, yMin, yMax };
}

const lyapunovStart = 1000;
const lyapunovEnd = 2000;
function isChaotic(params, xFn, yFn) {
  const { x, y, xMin, xMax, yMin, yMax } = generateAttractor(
    params,
    lyapunovEnd,
    xFn,
    yFn
  );
  let lyapunov = 0;
  let dRand = namedLcg("disturbance");
  let d0, xe, ye;

  do {
    xe = x[0] + (dRand() - 0.5) / 1000.0;
    ye = y[0] + (dRand() - 0.5) / 1000.0;
    const dx = x[0] - xe;
    const dy = y[0] - ye;
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
    let dx = x[i] - x[i - 1];
    let dy = y[i] - y[i - 1];

    if (Math.abs(dx) < 1e-10 && Math.abs(dy) < 1e-10) {
      // attracted towards a single point
      return false;
    }

    if (i > lyapunovStart) {
      const [newXe, newYe] = attractor(xe, ye, params.ax, params.ay);
      dx = x[i] - newXe;
      dy = y[i] - newYe;
      const dd = Math.sqrt(dx * dx + dy * dy);
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

function opacityToHex(opacity) {
  return Math.round(Math.max(0, Math.min(1, opacity)) * 255)
    .toString(16)
    .toUpperCase()
    .padStart(2, "0");
}

function truncateFloat(num, decimalPlaces = 4) {
  return Number.parseFloat(num.toFixed(decimalPlaces));
}

function namedLcg(seed) {
  return numericalRecipesLcg(Math.abs(hashCode(seed)));
}

function hashCode(s) {
  for (var i = 0, h = 0; i < s.length; i++)
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

function getURLParams() {
  const params = new URLSearchParams(window.location.search);
  const parsedParams = {};
  for (const [key, value] of params) {
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      parsedParams[key] = parseFloat(value);
    } else if (
      value.toLowerCase() === "true" ||
      value.toLowerCase() === "false"
    ) {
      parsedParams[key] = value.toLowerCase() === "true";
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
  copyToClipboard(url.toString());
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Unable to copy text to clipboard", err);
  }
}

export default infiniteChaos;
