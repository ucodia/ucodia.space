import { GUI } from "lil-gui";
import autoStretchP5 from "@/utils/auto-stretch-p5";
import { numericalRecipesLcg, randomString } from "@/utils/random";

export const meta = {
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
  emerald: "#00ffa4",
};

const defaultSx = {
  pointCount: 500000,
  xModifier: "noop",
  yModifier: "noop",
  seed: "",
  minSpread: 0.25,
  background: "#000000",
  color: colors.emerald,
  swapColors: false,
  opacity: 0.3,
  particleSize: 1,
  marginRatio: 0.1,
  highRes: true,
  animate: true,
  animateHue: false,
  batchSize: 500,
  continuousMode: true,
};

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
  let batchCurrent = 0;
  let hueCurrent = 159;
  updateAttractorData();

  const gui = new GUI({ title: "Infinite Chaos" });
  gui.close();

  // Attractor folder
  const attractorFolder = gui.addFolder("attractor");
  const pointCountController = attractorFolder.add(
    sx,
    "pointCount",
    10000,
    1000000,
    10000
  );
  const xModifierController = attractorFolder.add(
    sx,
    "xModifier",
    Object.keys(modifiers)
  );
  const yModifierController = attractorFolder.add(
    sx,
    "yModifier",
    Object.keys(modifiers)
  );
  const seedController = attractorFolder.add(sx, "seed");
  attractorFolder.add(sx, "minSpread", 0, 0.5, 0.05);

  // Style folder
  const styleFolder = gui.addFolder("style");
  const bgController = styleFolder.addColor(sx, "background");
  const colorController = styleFolder.addColor(sx, "color");
  const swapColorsController = styleFolder.add(sx, "swapColors");
  const opacityController = styleFolder.add(sx, "opacity", 0, 1, 0.05);
  const particleSizeController = styleFolder.add(sx, "particleSize", 0, 2, 0.1);
  const marginRatioController = styleFolder.add(
    sx,
    "marginRatio",
    0,
    0.5,
    0.05
  );
  const highResController = styleFolder.add(sx, "highRes");

  // Animation folder
  const animationFolder = gui.addFolder("animation");
  const animateController = animationFolder.add(sx, "animate");
  animationFolder.add(sx, "animateHue");
  const batchSizeController = animationFolder.add(
    sx,
    "batchSize",
    100,
    10000,
    100
  );
  const continuousModeController = animationFolder.add(sx, "continuousMode");

  // Actions folder
  const actionsFolder = gui.addFolder("actions");
  const actions = {
    randomize: () => {
      const startTime = performance.now();
      const modNames = Object.keys(modifiers);
      let spread = 0;

      do {
        sx.seed = randomString(8);
        const rand = namedLcg(sx.seed);
        params = createAttractorParams(rand);
        sx.xModifier = modNames[(rand() * modNames.length) | 0];
        sx.yModifier = modNames[(rand() * modNames.length) | 0];

        if (
          isChaotic(params, modifiers[sx.xModifier], modifiers[sx.yModifier])
        ) {
          // new spread filter
          const { x, y, xMin, xMax, yMin, yMax } = generateAttractor(
            params,
            10000,
            modifiers[sx.xModifier],
            modifiers[sx.yModifier]
          );
          spread = computeSpread(x, y, xMin, xMax, yMin, yMax);
        }
      } while (isNaN(spread) || spread < sx.minSpread);

      const elapsedTime = performance.now() - startTime;
      console.log(
        `Found chaotic seed ${sx.seed} with spread ${spread.toFixed(
          2
        )} in ${elapsedTime.toFixed(2)}ms`
      );

      gui.controllersRecursive().forEach((c) => c.updateDisplay());
      batchCurrent = 0;
      updateAttractorData();
      if (sx.animate) {
        sketch.loop();
      } else {
        sketch.draw();
      }
    },
    saveImage: () => {
      const mod =
        sx.xModifier !== defaultSx.xModifier ||
        sx.yModifier !== defaultSx.yModifier
          ? `-${sx.xModifier}-${sx.yModifier}`
          : "";
      sketch.save(`infinite-chaos-${sx.seed}${mod}.png`);
    },
    shareUrl: () => {
      const urlParams = {
        seed: sx.seed,
        xModifier: sx.xModifier,
        yModifier: sx.yModifier,
      };
      Object.keys(defaultSx).forEach((key) => {
        const value = sx[key];
        if (value !== defaultSx[key]) {
          urlParams[key] =
            typeof value === "number" ? truncateFloat(value) : value;
        }
      });
      setURLParams(urlParams);
    },
  };
  Object.keys(actions).forEach((name) => actionsFolder.add(actions, name));

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
    gui.controllersRecursive().forEach((c) => c.updateDisplay());
    updateAttractorData();
    sketch.draw();
  });
  animateController.onFinishChange(() => {
    if (sx.animate) {
      batchCurrent = 0;
      sketch.loop();
    } else {
      sketch.noLoop();
      sketch.draw();
    }
  });
  batchSizeController.onFinishChange(() => {
    if (sx.animate) {
      sketch.draw();
    }
  });
  continuousModeController.onFinishChange(() => {
    if (sx.continuousMode && sx.animate) {
      sketch.loop();
    }
  });

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    autoStretchP5(sketch, layout);
    if (!sx.animate) {
      sketch.noLoop();
    }

    if (!sx.seed) {
      actions.randomize();
    }
  };

  function layout() {
    batchCurrent = 0;
  }

  sketch.doubleClicked = () => {
    if (sketch.fullscreen()) {
      sketch.fullscreen(false);
    } else {
      sketch.fullscreen(true);
    }
  };

  sketch.keyPressed = () => {
    switch (sketch.key) {
      case "s": {
        actions.saveImage();
        break;
      }
      case "n": {
        actions.randomize();
      }
      case "e": {
        if (gui._hidden) {
          gui.show();
        } else {
          gui.hide();
        }
        break;
      }
      default: {
      }
    }
  };

  sketch.draw = (ctx) => {
    if (!ctx) ctx = sketch;

    const baseBg = sx.background;
    let baseColor = sx.color;

    if (sx.animate && sx.animateHue) {
      let inc = 0.1;
      hueCurrent = (hueCurrent + inc) % 360;
      baseColor = hslToHex(Math.round(hueCurrent), 100, 50);
    }

    const fg = sx.swapColors ? baseBg : baseColor;
    const bg = sx.swapColors ? baseColor : baseBg;

    if (batchCurrent === 0) {
      ctx.clear();
      ctx.background(bg);
    }

    const { x, y, xMin, xMax, yMin, yMax } = attractorData;
    const batchEnd = sx.animate
      ? Math.min(batchCurrent + sx.batchSize, x.length)
      : x.length;

    ctx.noStroke();
    ctx.fill(`${fg}${opacityToHex(sx.opacity)}`);

    const margin = ctx.width * sx.marginRatio;
    const attractorWidth = xMax - xMin;
    const attractorHeight = yMax - yMin;
    const scale = Math.min(
      (ctx.width - margin) / attractorWidth,
      (ctx.height - margin) / attractorHeight
    );
    const centerX = (ctx.width - attractorWidth * scale) / 2;
    const centerY = (ctx.height - attractorHeight * scale) / 2;

    for (let i = batchCurrent; i < batchEnd; i++) {
      let ix = centerX + (x[i] - xMin) * scale;
      let iy = centerY + (y[i] - yMin) * scale;

      if (sx.highRes) {
        ctx.ellipse(ix, iy, sx.particleSize, sx.particleSize);
      } else {
        ctx.rect(ix, iy, sx.particleSize, sx.particleSize);
      }
    }

    batchCurrent += sx.batchSize;
    if (batchCurrent >= x.length) {
      batchCurrent = 0;
      if (sx.continuousMode && sx.animate) {
        actions.randomize();
      } else {
        sketch.noLoop();
      }
    }
  };

  sketch.cleanup = () => {
    gui.destroy();
  };

  function updateAttractorData() {
    const rand = namedLcg(sx.seed);
    params = createAttractorParams(rand);

    attractorData = generateAttractor(
      params,
      sx.pointCount,
      modifiers[sx.xModifier],
      modifiers[sx.yModifier]
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
      const [newXe, newYe] = attractor(xe, ye, params.ax, params.ay, xFn, yFn);
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

function computeSpread(x, y, xMin, xMax, yMin, yMax) {
  const cells = {};

  // divide the smallest side in at least 100 cells
  const minSubdivision = 100;
  const minLength = Math.min(Math.abs(xMax - xMin), Math.abs(yMax - yMin));
  const cellSize = floorToFirstDecimal(minLength / minSubdivision);

  // find the number of columns/rows
  const startX = floorToMultiple(xMin, cellSize);
  const endX = floorToMultiple(xMax, cellSize);
  const startY = floorToMultiple(yMin, cellSize);
  const endY = floorToMultiple(yMax, cellSize);
  const gridWidth = Math.abs(endX - startX);
  const gridHeight = Math.abs(endY - startY);
  const cols = Math.round(gridWidth / cellSize);
  const rows = Math.round(gridHeight / cellSize);

  // analyze maximum 1M first points
  // spread does not increase much beyond that
  const n = Math.min(x.length, 1000000);
  let uniqueCellCount = 0;
  for (let i = 0; i < n; i++) {
    const cellX = floorToMultiple(x[i], cellSize);
    const cellY = floorToMultiple(y[i], cellSize);
    const cellKey = `${cellX}_${cellY}`;
    if (!cells[cellKey]) {
      cells[cellKey] = 1;
      uniqueCellCount++;
    }
  }

  const spread = uniqueCellCount / (cols * rows);
  return spread;
}

function floorToFirstDecimal(number) {
  if (number >= 1) {
    return Math.floor(number);
  } else {
    const precision = Math.ceil(-Math.log10(number));
    return Number(number.toString().substr(0, precision + 2));
  }
}

function floorToMultiple(number, increment) {
  const roundedValue = increment * Math.floor(number / increment);
  const precision = Math.ceil(-Math.log10(increment));
  const factor = Math.pow(10, precision);
  return Math.round(roundedValue * factor) / factor;
}

function opacityToHex(opacity) {
  return Math.round(Math.max(0, Math.min(1, opacity)) * 255)
    .toString(16)
    .toUpperCase()
    .padStart(2, "0");
}

function hslToHex(h, s, l) {
  // Convert s and l from percentage to decimal
  s = s / 100;
  l = l / 100;

  // Convert h to RGB
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r, g, b;
  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  // Convert RGB to hex
  const toHex = (n) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
  window.history.replaceState(null, "", url);
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
