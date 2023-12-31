import { GUI } from "dat.gui";
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
  const palette = [
    [255, 242, 0], // yellow
    [236, 0, 140], // magenta
    [0, 174, 239], // cyan
  ];
  let t = 0;
  let realScale = 1;
  let scaleOffset = 0.1;

  const {
    preset = 0,
    seed = "",
    length,
    offset,
    spacing,
    speed,
    thickness,
    opacity,
  } = getURLParams();

  const sx = {
    length: length || 16,
    offset: offset || 0,
    spacing: spacing || 1,
    speed: speed || 0.25,
    thickness: thickness || 5,
    opacity: opacity || 0.6,
    looping: true,
    preset,
    seed,
    paramSet: [],
  };

  var gui = new GUI();
  gui.close();
  gui.add(sx, "length", 3, 300, 1);
  gui.add(sx, "offset", -1000, 1000, 1);
  gui.add(sx, "spacing", 0.01, 10, 0.1);
  gui.add(sx, "speed", -5, 5, 0.1);
  gui.add(sx, "thickness", 0.5, 20, 0.1);
  gui.add(sx, "opacity", 0, 1, 0.1);
  const seedControl = gui.add(sx, "seed");
  const presetControl = gui.add(sx, "preset", [0, 1, 2]);

  const actions = {
    newSeed: () => seedControl.setValue(getRandomString()),
    save: () => {
      const svg = sketch.createGraphics(
        sketch.windowWidth,
        sketch.windowHeight,
        sketch.SVG
      );
      sketch.draw(svg);
      svg.save(`cmy-dance-${sx.seed}.svg`);
    },
  };
  gui.add(actions, "newSeed");
  gui.add(actions, "save");

  presetControl.onChange(() => {
    seedControl.setValue("");
    updateFromPreset();
    updateUrl();
  });
  seedControl.onChange((val) => {
    if (!val) return;
    updateFromSeed();
    updateUrl();
  });

  if (sx.seed) {
    updateFromSeed();
  } else {
    updateFromPreset();
  }

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    autoStretchP5(sketch, layout);
  };

  function layout() {
    let maxX = 0;
    let maxY = 0;
    // brute force way to find bounds
    for (let i = 1; i < 1000; i++) {
      for (let j = 0; j < sx.paramSet.length; j++) {
        const [x1, y1] = f(...sx.paramSet[j][0], i);
        const [x2, y2] = f(...sx.paramSet[j][1], i);
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
    sx.paramSet = presets[sx.preset];
    layout();
  }

  function updateFromSeed() {
    sx.paramSet = getRandomSet(sx.seed);
    layout();
  }

  function updateUrl() {
    if (sx.seed) {
      setURLParam("seed", sx.seed);
      unsetURLParam("preset");
    } else {
      setURLParam("preset", sx.preset);
      unsetURLParam("seed");
    }
  }

  sketch.draw = (ctx) => {
    if (!ctx) ctx = sketch;

    ctx.clear();
    ctx.background("black");
    ctx.translate(ctx.width / 2, ctx.height / 2);
    ctx.scale(realScale - scaleOffset);
    ctx.strokeWeight(sx.thickness);
    t += sx.speed;

    for (let i = 0; i < sx.length; i++) {
      const tInc = i * sx.spacing + sx.offset;
      for (let j = 0; j < sx.paramSet.length; j++) {
        const [r, g, b] = palette[j % palette.length];
        ctx.stroke(`rgba(${r},${g},${b},${sx.opacity})`);
        ctx.line(
          ...f(...sx.paramSet[j][0], t + tInc),
          ...f(...sx.paramSet[j][1], t + tInc)
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
        actions.save();
        break;
      }
      case "n": {
        actions.newSeed();
      }
      case " ": {
        toggleLooping();
        break;
      }
      default: {
      }
    }
  };

  sketch.cleanup = () => {
    gui.destroy();
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
