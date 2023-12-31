import autoStretchP5 from "../../utils/autoStretchP5";
import { numericalRecipesLcg } from "../../utils/lcg";
import presets from "./cmyDancePresets.json";

export const meta = {
  slug: "cmy-dance",
  name: "CMY Dance",
  created: "2023-02-12",
};

/***
 * Parametric equation function which returns a 2D position based on time and radial movement equations.
 * Modifiers xms = [[fx, ax], ... ] and yms = [[fy, ay], ... ] manipulates the equation such as
 *
 *   f(x) = sum(sin(t * (1 / fx)) * ax))
 *   f(y) = sum(cos(t * (1 / fy)) * ay))
 *
 * fx controls the wave period fraction (frequency)
 * ax controls the wave height multiplier (amplitude)
 * t represents the time
 */
function f(xms, yms, t) {
  return [
    xms.reduce((acc, [fx, ax]) => (acc += Math.sin(t * (1 / fx)) * ax), 0),
    yms.reduce((acc, [fx, ax]) => (acc += Math.cos(t * (1 / fx)) * ax), 0),
  ];
}

const cmyDance = (sketch) => {
  const { preset = 0, seed } = getURLParams();

  const sx = {
    set: [],
    speedInc: 1 / 4,
    spaceInc: 1,
    thickness: 5,
    n: 16,
    maxN: 150,
    opacity: 0.6,
    looping: true,
    preset,
    seed,
  };

  if (seed) {
    updateFromSeed(seed);
  } else {
    updateFromPreset(preset);
  }

  const palette = [
    [255, 242, 0], // yellow
    [236, 0, 140], // magenta
    [0, 174, 239], // cyan
  ];
  let t = 0;
  let realScale = 1;
  let scaleOffset = 0.1;

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    autoStretchP5(sketch, layout);
  };

  function layout() {
    let maxX = 0;
    let maxY = 0;
    // brute force way to find bounds
    for (let i = 1; i < 1000; i++) {
      for (let j = 0; j < sx.set.length; j++) {
        const [x1, y1] = f(...sx.set[j][0], i);
        const [x2, y2] = f(...sx.set[j][1], i);
        maxX = Math.max(maxX, x1, x2);
        maxY = Math.max(maxY, y1, y2);
      }
    }

    realScale =
      1 / Math.max((maxX * 2) / sketch.width, (maxY * 2) / sketch.height);
  }

  function toggleLooping() {
    sx.looping = !sx.looping;
    if (sx.looping) {
      sketch.loop();
    }
  }

  function updateFromPreset() {
    sx.set = presets[sx.preset];
  }

  function updateFromSeed() {
    sx.set = getRandomSet(sx.seed);
  }

  sketch.draw = (ctx) => {
    if (!ctx) ctx = sketch;

    ctx.clear();
    ctx.background("black");
    ctx.translate(ctx.width / 2, ctx.height / 2);
    ctx.scale(realScale - scaleOffset);
    ctx.strokeWeight(sx.thickness);

    if (ctx.mouseIsPressed) {
      sx.speedInc = ctx.map(ctx.mouseX, 0, ctx.width, -1, 1);
      sx.n = Math.round(ctx.map(ctx.mouseY, 0, ctx.height, 1, sx.maxN));
    }
    t += sx.speedInc;

    for (let i = 0; i < sx.n; i++) {
      const tInc = i * sx.spaceInc;
      for (let j = 0; j < sx.set.length; j++) {
        const [r, g, b] = palette[j % palette.length];
        ctx.stroke(`rgba(${r},${g},${b},${sx.opacity})`);
        ctx.line(
          ...f(...sx.set[j][0], t + tInc),
          ...f(...sx.set[j][1], t + tInc)
        );
      }
    }

    if (!sx.looping) {
      sketch.noLoop();
    }
  };

  sketch.keyPressed = () => {
    switch (sketch.key) {
      case "s": {
        const svg = sketch.createGraphics(
          sketch.windowWidth,
          sketch.windowHeight,
          sketch.SVG
        );
        sketch.draw(svg);
        svg.save(`cmy-dance-${sx.seed()}.svg`);
        break;
      }
      case "n": {
        sx.seed = getRandomString();
        setURLParam("seed", sx.seed);
        unsetURLParam("preset");
        updateFromSeed();
        layout();
        if (!sx.looping) {
          sketch.loop();
        }
        break;
      }
      case "p": {
        sx.preset = (sx.preset + 1) % presets.length;
        setURLParam("preset", sx.preset);
        unsetURLParam("seed");
        updateFromPreset();
        layout();
        if (!sx.looping) {
          sketch.loop();
        }
        break;
      }
      case " ": {
        toggleLooping();
        break;
      }
      default: {
      }
    }
  };

  sketch.mouseWheel = (event) => {
    if (sx.spaceInc <= 0) return;
    sx.spaceInc += event.delta * 0.01;
    if (sx.spaceInc < 0) sx.spaceInc = 0.001;
  };
};

function getRandomSet(seed) {
  const lcg = numericalRecipesLcg(hashCode(seed));
  const fnIndex = getRandomInt(0, 2, lcg);
  return [rand1, rand2, rand3][fnIndex](lcg);
}

function rand1(lcg) {
  const getRandomTF = () => [
    getRandomInt(5, 50, lcg),
    getRandomInt(-300, 300, lcg),
  ];
  const getRandomParams = () => [
    [...Array.from(Array(getRandomInt(1, 6, lcg)).keys()).map(getRandomTF)],
    [...Array.from(Array(getRandomInt(1, 6, lcg)).keys()).map(getRandomTF)],
  ];

  const a = getRandomParams();
  const b = getRandomParams();
  const c = getRandomParams();
  const d = getRandomParams();
  const e = getRandomParams();
  const f = getRandomParams();

  return [
    [a, b],
    [c, d],
    [e, f],
  ];
}

function rand2(lcg) {
  const getRandomTF = () => [
    getRandomInt(5, 50, lcg),
    getRandomInt(-300, 300, lcg),
  ];
  const getRandomParams = () => [
    [...Array.from(Array(getRandomInt(1, 6, lcg)).keys()).map(getRandomTF)],
    [...Array.from(Array(getRandomInt(1, 6, lcg)).keys()).map(getRandomTF)],
  ];
  const a = getRandomParams();
  const b = getRandomParams();
  const c = getRandomParams();
  return [
    [a, b],
    [b, c],
    [c, a],
  ];
}

function rand3(lcg) {
  const getRandomTF = () => [
    getRandomInt(10, 50, lcg),
    getRandomInt(-300, 300, lcg),
  ];

  const getRandomParams = () => [
    [...Array.from(Array(getRandomInt(1, 6, lcg)).keys()).map(getRandomTF)],
    [...Array.from(Array(getRandomInt(1, 6, lcg)).keys()).map(getRandomTF)],
  ];
  const a = getRandomParams();
  const b = getRandomParams();
  const c = getRandomParams();
  const d = getRandomParams();
  return [
    [a, b],
    [c, d],
  ];
}

function hashCode(str) {
  var hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function getRandomInt(min, max, lcg) {
  return Math.floor(lcg() * (max - min + 1)) + min;
}

function getRandomString() {
  return Math.random().toString(36).substr(2, 9);
}

function getURLParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

function setURLParam(name, value) {
  const url = new URL(window.location.href);
  url.searchParams.set(name, value);
  window.history.pushState(null, "", url);
}

function unsetURLParam(name) {
  const url = new URL(window.location.href);
  url.searchParams.delete(name);
  window.history.pushState(null, "", url);
}

export default cmyDance;
