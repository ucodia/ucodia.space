import autoStretchP5 from "../../utils/autoStretchP5";
import presets from "./cmyDancePresets.json";

export const meta = {
  name: "CMY Dance",
  created: "2023-02-12",
};

function f(xs, ys, t) {
  return [
    xs.reduce((acc, [tx, fx]) => (acc += Math.sin(t * (1 / tx)) * fx), 0),
    ys.reduce((acc, [ty, fy]) => (acc += Math.cos(t * (1 / ty)) * fy), 0),
  ];
}

const cmyDance = (sketch) => {
  const { preset = 0 } = sketch.getURLParams();
  let p = presets[Math.min(preset, presets.length - 1)];
  let t = 0;
  let inc = 1 / 4;
  let n = 16;
  const alpha = 150;
  const palette = [
    [0, 174, 239, alpha],
    [255, 242, 0, alpha],
    [236, 0, 140, alpha],
  ];

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
      for (let j = 0; j < p.length; j++) {
        const [x1, y1] = f(...p[j][0], i);
        const [x2, y2] = f(...p[j][1], i);
        maxX = Math.max(maxX, x1, x2);
        maxY = Math.max(maxY, y1, y2);
      }
    }

    realScale =
      1 / Math.max((maxX * 2) / sketch.width, (maxY * 2) / sketch.height);
  }

  sketch.draw = () => {
    sketch.clear();
    sketch.background(0);
    sketch.translate(sketch.width / 2, sketch.height / 2);
    sketch.scale(realScale - scaleOffset);
    sketch.strokeWeight(5);

    if (sketch.mouseIsPressed) {
      n = sketch.map(sketch.mouseY, 0, sketch.height, 3, 64);
    }

    for (let i = 0; i < n; i++) {
      const tInc = i * 1.5;
      for (let j = 0; j < p.length; j++) {
        sketch.stroke(sketch.color(...palette[j % palette.length]));
        sketch.line(...f(...p[j][0], t + tInc), ...f(...p[j][1], t + tInc));
      }
    }

    if (sketch.mouseIsPressed) {
      inc = sketch.map(sketch.mouseX, 0, sketch.width, -1, 1);
    }
    t += inc;
  };

  sketch.keyPressed = () => {
    switch (sketch.key) {
      case "s": {
        sketch.save(`cmy-dance-${Math.round(t)}.png`);
        break;
      }
      case "g": {
        p = getRandomSet();
        layout();
        break;
      }
      default: {
      }
    }
  };
};

function getRandomSet() {
  const getRandomT = () => 1 / getRandomInt(5, 50);
  const getRandomF = () => getRandomInt(-300, 300);
  const getRandomParams = () => [
    [
      [getRandomT(), getRandomF()],
      [getRandomT(), getRandomF()],
    ],
    [
      [getRandomT(), getRandomF()],
      [getRandomT(), getRandomF()],
    ],
  ];
  return [
    [getRandomParams(), getRandomParams()],
    [getRandomParams(), getRandomParams()],
    [getRandomParams(), getRandomParams()],
  ];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default cmyDance;
