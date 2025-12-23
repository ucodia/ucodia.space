import { GUI } from "lil-gui";
import p5plotSvg from "p5.plotsvg";
import autoStretchP5 from "@/utils/auto-stretch-p5";
import { numericalRecipesLcg } from "@/utils/random";

export const meta = {
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
 * fx and fy controls the wave period fraction (frequency)
 * ax and ay controls the wave height multiplier (amplitude)
 * t represents the time
 */
function f(xms, yms, t) {
  return [
    xms.reduce((acc, [fx, ax]) => (acc += Math.sin(t * (1 / fx)) * ax), 0),
    yms.reduce((acc, [fx, ax]) => (acc += Math.cos(t * (1 / fx)) * ax), 0),
  ];
}

const defaultSx = {
  background: "#ffffff",
  length: 66,
  offset: 0,
  spacing: 0.6,
  speed: 0.1,
  thickness: 5,
  opacity: 0.5,
  unlink: false,
  animate: true,
  autoRand: true,
  autoRandInterval: 60,
  xmsMin: 1,
  xmsMax: 6,
  ymsMin: 1,
  ymsMax: 6,
  fracMin: 5,
  fracMax: 50,
  ampMin: -300,
  ampMax: 300,
  seed: "",
};

const cmyDance = (sketch) => {
  const palette = [
    [0, 174, 239, "c"], // cyan
    [236, 0, 140, "m"], // magenta
    [255, 242, 0, "y"], // yellow
  ];
  let t = 0;
  let realScale = 1;
  let scaleOffset = 0.1;

  const urlSx = getURLParams();
  const sx = { ...defaultSx, ...urlSx };

  let paramSet = [];
  let lastGen = null;

  var gui = new GUI({ title: "CMY Dance" });
  gui.close();
  // gui.addColor(sx, "background");
  const lengthControl = gui.add(sx, "length", 3, 1000, 1);
  gui.add(sx, "offset", -300, 300, 1);
  gui.add(sx, "spacing", 0.01, 2, 0.01);
  gui.add(sx, "speed", -5, 5, 0.1);
  gui.add(sx, "thickness", 0.5, 20, 0.1);
  gui.add(sx, "opacity", 0, 1, 0.1);
  const unlinkControl = gui.add(sx, "unlink");
  const animateControl = gui.add(sx, "animate");
  gui.add(sx, "autoRand");
  gui.add(sx, "autoRandInterval", 1, 120, 1);
  const seedControl = gui.add(sx, "seed");
  const generatorFolder = gui.addFolder("generator");
  generatorFolder.add(sx, "xmsMin", 1, 10, 1);
  generatorFolder.add(sx, "xmsMax", 1, 10, 1);
  generatorFolder.add(sx, "ymsMin", 1, 10, 1);
  generatorFolder.add(sx, "ymsMax", 1, 10, 1);
  generatorFolder.add(sx, "fracMin", 1, 100, 1);
  generatorFolder.add(sx, "fracMax", 1, 100, 1);
  generatorFolder.add(sx, "ampMin", -500, -1, 1);
  generatorFolder.add(sx, "ampMax", 1, 500, 1);
  generatorFolder.close();

  const actions = {
    randomize: () => seedControl.setValue(getRandomString()),
    savePlotter: () => {
      p5plotSvg.beginRecordSVG(sketch, `cmy-dance-${getTimestamp()}.svg`);
      sketch.draw();
      p5plotSvg.endRecordSVG();
    },
    saveImage: () => {
      sketch.save(`cmy-dance-${getTimestamp()}.png`);
    },
    shareUrl: () => {
      const urlParams = {
        seed: sx.seed,
      };
      Object.keys(defaultSx).forEach((key) => {
        const value = sx[key];
        if (value !== defaultSx[key]) {
          urlParams[key] = value;
        }
      });
      const url = setURLParams(urlParams);
      copyToClipboard(url);
    },
  };
  Object.keys(actions).forEach((name) => gui.add(actions, name));

  seedControl.onChange((val) => {
    if (!val) return;
    updateFromSeed();
  });
  unlinkControl.onChange((val) => {
    updateFromSeed();
  });

  if (!sx.seed) {
    seedControl.setValue(getRandomString());
  }
  updateFromSeed();

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.blendMode(sketch.MULTIPLY);
    autoStretchP5(sketch, layout);
  };

  function layout() {
    let maxX = 0;
    let maxY = 0;
    // brute force way to find bounds
    for (let i = 1; i < 1000; i++) {
      for (let j = 0; j < paramSet.length; j++) {
        const [x1, y1] = f(...paramSet[j][0], i);
        const [x2, y2] = f(...paramSet[j][1], i);
        maxX = Math.max(maxX, x1, x2);
        maxY = Math.max(maxY, y1, y2);
      }
    }

    realScale =
      1 / Math.max((maxX * 2) / sketch.width, (maxY * 2) / sketch.height);
  }

  function toggleAnimation() {
    animateControl.setValue(!sx.animate);
  }

  function updateFromSeed() {
    paramSet = getRandomSet(sx);
    lastGen = new Date();
    layout();
  }

  sketch.draw = () => {
    keyPressedFrame();

    sketch.clear();
    sketch.background(sx.background);
    sketch.translate(sketch.width / 2, sketch.height / 2);
    sketch.scale(realScale - scaleOffset);
    sketch.strokeWeight(sx.thickness);

    if (sx.animate) {
      t += sx.speed;
    }

    for (let i = 0; i < sx.length; i++) {
      const tInc = i * sx.spacing + sx.offset;
      for (let j = 0; j < paramSet.length; j++) {
        const [r, g, b, name] = palette[j % palette.length];
        p5plotSvg.beginSvgGroup(name);
        sketch.stroke(`rgba(${r},${g},${b},${sx.opacity})`);
        sketch.line(
          ...f(...paramSet[j][0], t + tInc),
          ...f(...paramSet[j][1], t + tInc)
        );
        p5plotSvg.endSvgGroup();
      }
    }

    if (sx.autoRand && lastGen) {
      const elapsed = new Date() - lastGen;
      if (elapsed > sx.autoRandInterval * 1000) {
        actions.randomize();
      }
    }
  };

  sketch.keyPressed = () => {
    switch (sketch.key) {
      case "s": {
        actions.saveImage();
        break;
      }
      case "p": {
        actions.savePlotter();
        break;
      }
      case "n": {
        actions.randomize();
        break;
      }
      case "h": {
        if (gui._hidden) {
          gui.show();
        } else {
          gui.hide();
        }
        break;
      }
      case " ": {
        toggleAnimation();
        break;
      }
      default: {
      }
    }

    switch (sketch.keyCode) {
      case sketch.ENTER: {
        if (sketch.fullscreen()) {
          sketch.fullscreen(false);
        } else {
          sketch.fullscreen(true);
        }
        break;
      }
      default: {
      }
    }
  };

  function keyPressedFrame() {
    if (!sketch.keyIsPressed) return;

    switch (sketch.keyCode) {
      case sketch.LEFT_ARROW: {
        t -= sx.speed;
        break;
      }
      case sketch.RIGHT_ARROW: {
        t += sx.speed;
        break;
      }
      case sketch.UP_ARROW: {
        lengthControl.setValue(sx.length + 1);
        break;
      }
      case sketch.DOWN_ARROW: {
        lengthControl.setValue(sx.length - 1);
        break;
      }
      default:
    }
  }

  sketch.cleanup = () => {
    gui.destroy();
  };
};

function getRandomSet(sx) {
  const lcg = numericalRecipesLcg(hashCode(sx.seed));

  const getRandomTF = () => [
    getRandomInt(sx.fracMin, sx.fracMax, lcg),
    getRandomInt(sx.ampMin, sx.ampMax, lcg),
  ];
  const getRandomParams = () => [
    [
      ...Array.from(Array(getRandomInt(sx.xmsMin, sx.xmsMax, lcg)).keys()).map(
        getRandomTF
      ),
    ],
    [
      ...Array.from(Array(getRandomInt(sx.ymsMin, sx.ymsMax, lcg)).keys()).map(
        getRandomTF
      ),
    ],
  ];

  const a = getRandomParams();
  const b = getRandomParams();
  const c = getRandomParams();
  const d = getRandomParams();
  const e = getRandomParams();
  const f = getRandomParams();

  return sx.unlink
    ? [
        [a, b],
        [c, d],
        [e, f],
      ]
    : [
        [a, b],
        [b, c],
        [c, a],
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
    if (key === "offset") {
      continue;
    }
    url.searchParams.set(key, value);
  }
  window.history.replaceState(null, "", url);
  return url.toString();
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Unable to copy text to clipboard", err);
  }
}

function getTimestamp() {
  const now = new Date();
  return new Date()
    .toISOString()
    .split("-")
    .join("")
    .split("T")
    .join("-")
    .split(":")
    .join("")
    .split(".")[0];
}

export default cmyDance;
